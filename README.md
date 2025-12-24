# 第十七章：文件上传与云存储服务集成

> 🎯 **学习目标**：深入掌握企业级文件上传全流程，包括大文件切片、断点续传、云存储直传及性能优化。

> 📚 **教程特点**：理论与实战深度结合，提供前后端闭环的代码实现参考。

---

## 📖 章节概述

在现代企业级应用中，文件上传不仅是“把文件传上去”，还涉及到海量数据处理、弱网稳定性、存储成本和安全控制。本章将带你攻克以下核心场景：

- **基础上传**：处理图片、视频、文档，监听实时进度。
- **大文件分块**：将 GB 级文件切片并行上传，支持断点续传。
- **云存储直传**：利用预签名 URL（Presigned URL）让前端直连 S3/OSS，解放后端。
- **性能优化**：前端图片压缩（Canvas）、批量上传调度、CDN 缓存策略。
- **安全加固**：文件类型魔数校验、大小限制、权限控制（RBAC）。

---

## 🚀 核心知识点与详细代码示例

### 1. 基础文件上传（XHR 进度监听）

**原理**：使用 `FormData` 包装文件流，并通过 `XMLHttpRequest` 的 `upload.onprogress` 监听字节传输进度。

#### 前端实现：带进度条的上传逻辑
```typescript
/**
 * 核心逻辑：使用 XMLHttpRequest 实现带进度监听的上传
 */
async function uploadWithProgress(file: File, onProgress: (p: number) => void) {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // 监听上传进度
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent); // 回调 UI 更新进度条
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('上传失败'));
      }
    };

    xhr.onerror = () => reject(new Error('网络错误'));
    
    xhr.open('POST', '/api/file-upload/upload');
    xhr.send(formData);
  });
}
```

#### 后端实现：Next.js API Route 处理
```typescript
// app/api/file-upload/upload/route.ts
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // 1. 校验大小 (如限制 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: '文件过大' }, { status: 400 });
  }

  // 2. 转换为 Buffer 并写入文件系统（或转发到云存储）
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const path = join(process.cwd(), 'public/uploads', filename);
  
  await writeFile(path, buffer);
  
  return NextResponse.json({ url: `/uploads/${filename}` });
}
```

---

### 2. 大文件分块上传与断点续传

**挑战**：大文件上传耗时长，一旦网络波动需重头开始。
**方案**：前端切片（Blob.slice），后端分块存储，最后合并。

#### 前端：切片逻辑与并发控制
```typescript
// utils/upload/chunkUpload.ts
export async function chunkUpload(file: File) {
  const CHUNK_SIZE = 2 * 1024 * 1024; // 每块 2MB
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const fileId = generateFileId(file); // 根据文件名+大小生成唯一 ID

  // 1. 断点续传检查：询问后端已上传了哪些分块
  const { uploadedIndexes } = await fetch(`/api/check-chunks?fileId=${fileId}`).then(res => res.json());

  // 2. 循环切片并上传
  for (let i = 0; i < totalChunks; i++) {
    if (uploadedIndexes.includes(i)) continue; // 跳过已存在的分块

    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunkBlob = file.slice(start, end); // 核心：Blob 切片

    const formData = new FormData();
    formData.append('chunk', chunkBlob);
    formData.append('index', i.toString());
    formData.append('fileId', fileId);

    // 发送分块
    await fetch('/api/upload-chunk', { method: 'POST', body: formData });
  }

  // 3. 所有分块上传完成后，通知后端合并
  return fetch('/api/merge-chunks', {
    method: 'POST',
    body: JSON.stringify({ fileId, fileName: file.name })
  }).then(res => res.json());
}
```

#### 后端：分块合并逻辑
```typescript
// app/api/file-upload/merge/route.ts
export async function POST(req: NextRequest) {
  const { fileId, fileName } = await req.json();
  const tempDir = join(process.cwd(), `temp/${fileId}`);
  
  // 1. 读取该目录下的所有分块文件并按索引排序
  const chunks = await readdir(tempDir);
  chunks.sort((a, b) => parseInt(a) - parseInt(b));

  // 2. 创建流式写入，避免一次性读入大量内存
  const writeStream = createWriteStream(join(process.cwd(), `public/uploads/${fileName}`));
  
  for (const chunkFile of chunks) {
    const content = await readFile(join(tempDir, chunkFile));
    writeStream.write(content);
  }
  writeStream.end();

  // 3. 清理临时目录
  await rm(tempDir, { recursive: true });
  
  return NextResponse.json({ success: true });
}
```

---

### 3. 预签名 URL 直传云存储（S3 示例）

**原理**：后端生成一个带有效期的临时 PUT 链接，前端直连云存储节点。

#### 后端：生成预签名链接
```typescript
// app/api/file-upload/presign/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(req: NextRequest) {
  const { filename, contentType } = await req.json();

  const client = new S3Client({ region: 'us-east-1' });
  const command = new PutObjectCommand({
    Bucket: 'my-app-bucket',
    Key: `uploads/${Date.now()}-${filename}`,
    ContentType: contentType,
  });

  // 生成一个 5 分钟有效的上传链接
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  return NextResponse.json({ signedUrl });
}
```

#### 前端：执行直传
```typescript
async function uploadToS3(file: File) {
  // 1. 向自己的服务器申请预签名地址
  const { signedUrl } = await fetch('/api/file-upload/presign', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type })
  }).then(res => res.json());

  // 2. 直接向 S3 发送 PUT 请求，不需要经过后端服务器
  const response = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type }
  });

  if (response.ok) {
    console.log('文件已直传至云存储！');
  }
}
```

---

### 4. 前端图片压缩（Canvas 方案）

**目的**：在上传前减小文件体积，提升用户体验并节省存储空间。

```typescript
// utils/upload/compressImage.ts
export async function compressImage(file: File, quality = 0.7): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // 设定最大宽度，按比例缩放
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // 核心：使用 toBlob 进行压缩，quality 为 0-1
        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/jpeg',
          quality
        );
      };
    };
  });
}
```

---

## 🎯 企业级实战项目：图片分享应用升级

### 1. 目录结构
```text
components/
  FileUploader.tsx      # 基础上传（含预览、拖拽）
  MultiUploader.tsx     # 批量上传（含并发控制、重试）
utils/
  chunkUpload.ts        # 分块上传引擎
  compressImage.ts      # 图像压缩工具
  retry.ts              # 自动重试高阶函数
api/
  file-upload/
    presign/            # 获取 S3/OSS 签名
    chunk/              # 接收分块
    merge/              # 合并分块
```

### 2. 关键工程化组件：MultiUploader
该组件展示了如何管理多个文件的上传状态、进度以及失败重试。

```tsx
// components/file-upload/MultiFileUploader.tsx
export default function MultiFileUploader() {
  const [tasks, setTasks] = useState<UploadTask[]>([]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newTasks = selectedFiles.map(file => ({
      id: Math.random().toString(36),
      file,
      progress: 0,
      status: 'pending'
    }));
    setTasks(prev => [...prev, ...newTasks]);
    
    // 启动上传队列
    newTasks.forEach(startUploadTask);
  };

  const startUploadTask = async (task: UploadTask) => {
    try {
      // 执行带自动重试的上传逻辑
      await retryUpload(async () => {
        await uploadWithProgress(task.file, (p) => {
          updateTaskStatus(task.id, { progress: p, status: 'uploading' });
        });
      }, { maxRetries: 3 });
      
      updateTaskStatus(task.id, { status: 'success' });
    } catch (err) {
      updateTaskStatus(task.id, { status: 'error' });
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" multiple onChange={onFileSelect} />
      {tasks.map(task => (
        <div key={task.id} className="border p-2 rounded">
          <div className="flex justify-between">
            <span>{task.file.name}</span>
            <span>{task.status}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 mt-1">
            <div className="bg-blue-500 h-2" style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🛡️ 最佳实践与常见问题

### 1. 安全校验：不能只信后缀名
前端虽然可以限制 `accept="image/*"`，但用户可以手动修改后缀名。后端应检查 **文件头魔数 (Magic Number)**：
- JPEG: `FF D8 FF`
- PNG: `89 50 4E 47`

### 2. 性能瓶颈：并发限制
批量上传 100 张图片时，不要同时发起 100 个请求。应使用 **Promise 池** 限制并发数（如每次只跑 5 个请求），否则会导致浏览器卡死或触发后端限流。

### 3. 云存储回调：如何确认上传成功？
在预签名直传场景下，后端并不知道用户是否真的传完了。
- **方案 A**：前端传完后向后端发一个 `confirm` 请求。
- **方案 B**：配置云存储的 **Event Notifications**，让 S3/OSS 直接回调后端 Webhook。

---

## 🎉 总结

学完本章，你已掌握：
1. **基础上传**：处理流、监听进度、UI 交互。
2. **大文件方案**：切片、索引管理、服务端合并。
3. **云直传方案**：签名机制、跨域配置、流程解耦。
4. **性能方案**：本地压缩、重试机制、并发控制。

**下一步建议**：尝试在项目中集成一个真实的云存储 SDK（如 `ali-oss` 或 `@aws-sdk/client-s3`），并模拟弱网环境下分块上传的健壮性。

Happy Uploading! 🚀
