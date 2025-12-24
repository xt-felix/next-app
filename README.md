# 第十七章：文件上传与云存储服务集成

> 🎯 **学习目标**：掌握企业级文件上传方案，包括基础上传、分块上传、预签名 URL、云存储集成等

> 📚 **教程特点**：理论 + 实战，每个功能都有完整的代码示例

> ⏱️ **学习周期**：建议 2-3 天，循序渐进

---

## 📖 章节概述

文件上传是企业级应用中常见需求，涉及图片、视频、文档、音频等多种类型。本章深入讲解文件上传的原理、挑战和解决方案，包括：

- ✅ 基础文件上传（选择、拖拽、拍照）
- ✅ 分块上传与断点续传
- ✅ 预签名 URL 与云存储直传
- ✅ 多文件批量上传
- ✅ 图片压缩与格式转换
- ✅ CDN 加速与图片懒加载
- ✅ 错误重试与进度反馈

---

## 🚀 快速开始

### 访问项目

打开浏览器访问：http://localhost:3000/17-file-upload

### 功能清单

| 示例 | 难度 | 访问路径 | 核心知识点 |
|------|------|---------|-----------|
| 基础文件上传 | 入门 | `/17-file-upload/basic` | 文件选择、拖拽、拍照、进度反馈 |
| 分块上传与断点续传 | 中级 | `/17-file-upload/chunk` | 大文件分块、断点续传、进度精确 |
| 预签名 URL 直传 | 中级 | `/17-file-upload/presigned` | 预签名 URL、云存储直传、减轻后端压力 |
| 多文件批量上传 | 中级 | `/17-file-upload/multi` | 多文件选择、批量上传、独立进度 |
| 图片压缩 | 中级 | `/17-file-upload/compress` | 前端压缩、质量调整、尺寸调整 |

---

## 📚 核心知识点

### 1. 文件上传的原理与挑战

#### 什么是文件上传？

文件上传是指将本地文件（图片、视频、文档等）传输到服务器的过程。在 Web 应用中，通常使用表单提交或 AJAX 请求实现。

#### 文件上传的挑战

1. **大文件上传**
   - 问题：网络不稳定时，大文件上传容易失败
   - 解决：分块上传、断点续传

2. **进度反馈**
   - 问题：用户不知道上传进度，体验差
   - 解决：使用 XMLHttpRequest 监听上传进度

3. **移动端适配**
   - 问题：移动端需要支持拍照、选择相册
   - 解决：使用 `capture` 属性调用摄像头

4. **性能优化**
   - 问题：大文件上传慢，占用带宽
   - 解决：前端压缩、分块上传、CDN 加速

5. **安全防护**
   - 问题：文件类型、大小、内容需要验证
   - 解决：前后端双重校验、文件类型白名单

---

### 2. 基础文件上传

#### 文件选择

使用 `<input type="file">` 选择文件：

```tsx
// components/file-upload/FileUploader.tsx
<input
  type="file"
  accept="image/*"  // 限制文件类型
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }}
/>
```

**知识点：**
- `accept` 属性：限制可选择的文件类型
- `multiple` 属性：支持多选
- `capture` 属性：调用摄像头（`user` 前置，`environment` 后置）

#### 拖拽上传

监听拖拽事件，支持拖拽文件到指定区域：

```tsx
const handleDrop = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  if (file) {
    handleFile(file);
  }
};

<div
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
>
  拖拽文件到此处
</div>
```

**知识点：**
- `onDragOver`：必须阻止默认行为，才能触发 `onDrop`
- `e.dataTransfer.files`：获取拖拽的文件列表

#### 文件预览

使用 `URL.createObjectURL` 生成预览：

```tsx
const [preview, setPreview] = useState<string | null>(null);

const handleFile = (file: File) => {
  // 生成预览 URL
  const url = URL.createObjectURL(file);
  setPreview(url);
  
  // 使用完毕后记得释放
  // URL.revokeObjectURL(url);
};

{preview && <img src={preview} alt="预览" />}
```

**知识点：**
- `URL.createObjectURL`：创建临时 URL，用于预览
- 使用完毕后应调用 `URL.revokeObjectURL` 释放内存

#### 上传进度

使用 `XMLHttpRequest` 监听上传进度：

```tsx
const xhr = new XMLHttpRequest();

xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percentComplete = Math.round((e.loaded / e.total) * 100);
    setProgress(percentComplete);
  }
});

xhr.open('POST', '/api/upload');
xhr.send(formData);
```

**访问路径：** `/17-file-upload/basic`

---

### 3. 分块上传与断点续传

#### 什么是分块上传？

将大文件切分成多个小块，逐块上传到服务器，最后在服务器端合并。

**优势：**
- ✅ 支持大文件上传
- ✅ 网络不稳定时自动重试单个分块
- ✅ 进度精确（每个分块独立进度）
- ✅ 支持断点续传

#### 实现原理

```typescript
// utils/upload/chunkUpload.ts

// 1. 计算分块数量
const chunkSize = 2 * 1024 * 1024; // 2MB 每块
const totalChunks = Math.ceil(file.size / chunkSize);

// 2. 切分文件并上传
for (let i = 0; i < totalChunks; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const chunk = file.slice(start, end); // 使用 File.slice() 切分
  
  // 上传分块
  await uploadChunk(chunk, i, totalChunks);
}

// 3. 通知服务器合并
await mergeChunks();
```

**知识点：**
- `File.slice(start, end)`：切分文件，返回 Blob 对象
- 每个分块独立上传，互不影响
- 服务器端需要保存分块，最后合并

#### 断点续传

上传中断后，记录已上传的分块，继续上传剩余部分：

```typescript
// 1. 检查已上传的分块
const uploadedChunks = await checkUploadedChunks(fileId, totalChunks);

// 2. 跳过已上传的分块
for (let i = 0; i < totalChunks; i++) {
  if (uploadedChunks.includes(i)) {
    continue; // 跳过已上传的分块
  }
  // 上传剩余分块
  await uploadChunk(chunk, i, totalChunks);
}
```

**访问路径：** `/17-file-upload/chunk`

---

### 4. 预签名 URL 与云存储直传

#### 什么是预签名 URL？

预签名 URL（Presigned URL）是云存储服务（如 AWS S3、阿里云 OSS）提供的临时上传链接，前端可以直接使用该链接上传文件到云存储，无需经过后端服务器。

**优势：**
- ✅ 减轻后端压力（文件不经过后端）
- ✅ 支持大文件上传
- ✅ 提升上传速度（直连云存储）
- ✅ 权限可控（URL 有时效性）

#### 实现流程

```
1. 前端请求后端获取预签名 URL
   ↓
2. 后端调用云存储 SDK 生成预签名 URL
   ↓
3. 前端使用预签名 URL 直接 PUT/POST 文件到云存储
   ↓
4. 上传完成后通知后端（可选）
```

#### 代码示例

**后端生成预签名 URL：**

```typescript
// app/api/file-upload/presign/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request: NextRequest) {
  const { fileName, fileType } = await request.json();
  
  // 创建 S3 客户端
  const s3Client = new S3Client({
    region: 'ap-northeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  
  // 生成预签名 URL
  const command = new PutObjectCommand({
    Bucket: 'your-bucket',
    Key: fileName,
    ContentType: fileType,
  });
  
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 分钟有效期
  });
  
  return NextResponse.json({ url });
}
```

**前端使用预签名 URL 上传：**

```typescript
// utils/upload/presignedUpload.ts

// 1. 获取预签名 URL
const { url } = await fetch('/api/file-upload/presign', {
  method: 'POST',
  body: JSON.stringify({ fileName: file.name, fileType: file.type }),
}).then(res => res.json());

// 2. 直接上传到云存储
const xhr = new XMLHttpRequest();
xhr.open('PUT', url);
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);
```

**访问路径：** `/17-file-upload/presigned`

---

### 5. 多文件批量上传

#### 实现要点

1. **多文件选择**
   ```tsx
   <input type="file" multiple onChange={handleFiles} />
   ```

2. **独立进度条**
   - 每个文件显示独立的进度条
   - 总体进度 = 所有文件进度的平均值

3. **错误处理**
   - 单个文件失败不影响其他文件
   - 失败的文件可以单独重试

#### 代码示例

```tsx
// components/file-upload/MultiFileUploader.tsx

const [files, setFiles] = useState<FileUploadItem[]>([]);

const handleFiles = (selectedFiles: File[]) => {
  // 添加文件到列表
  const newFiles = selectedFiles.map(file => ({
    file,
    progress: 0,
    status: 'pending' as const,
  }));
  
  setFiles(prev => [...prev, ...newFiles]);
  
  // 自动开始上传
  newFiles.forEach(item => uploadFile(item.file));
};

// 上传单个文件
const uploadFile = async (file: File) => {
  // 更新状态为上传中
  setFiles(prev => prev.map(item =>
    item.file === file ? { ...item, status: 'uploading' } : item
  ));
  
  // 上传并更新进度
  await upload(file, (progress) => {
    setFiles(prev => prev.map(item =>
      item.file === file ? { ...item, progress } : item
    ));
  });
};
```

**访问路径：** `/17-file-upload/multi`

---

### 6. 图片压缩

#### 为什么需要压缩？

- ✅ 减少上传时间（文件更小）
- ✅ 节省存储空间
- ✅ 提升用户体验（加载更快）

#### 实现原理

使用 Canvas API 压缩图片：

```typescript
// utils/upload/compressImage.ts

export async function compressImage(file: File, options: CompressOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // 1. 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // 2. 创建 Canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        // 3. 转换为 Blob（压缩）
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('压缩失败'));
          },
          'image/jpeg', // 输出格式
          options.quality || 0.7 // 压缩质量 0-1
        );
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
}
```

**知识点：**
- `canvas.toBlob()`：将 Canvas 转换为 Blob，支持质量参数
- 质量参数仅对 JPEG 有效（0-1，默认 0.92）
- PNG 格式不支持质量参数，但可以通过调整尺寸压缩

**访问路径：** `/17-file-upload/compress`

---

### 7. CDN 加速与图片懒加载

#### CDN 加速

CDN（Content Delivery Network）通过在全球部署节点，将文件缓存到离用户最近的节点，提升访问速度。

**使用方式：**
```tsx
// 使用 CDN URL
<img src="https://cdn.example.com/images/photo.jpg" alt="图片" />
```

#### 图片懒加载

使用 IntersectionObserver API 实现图片懒加载：

```tsx
// components/file-upload/LazyImage.tsx

const [shouldLoad, setShouldLoad] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    });
  }, {
    rootMargin: '50px', // 提前 50px 开始加载
  });
  
  observer.observe(imgRef.current!);
  
  return () => observer.disconnect();
}, []);

{shouldLoad && <img src={src} alt={alt} />}
```

**知识点：**
- `IntersectionObserver`：监听元素是否进入视口
- `rootMargin`：提前加载距离
- 使用 `loading="lazy"` 属性（浏览器原生支持）

---

### 8. 错误重试

#### 重试策略

1. **固定延迟重试**：每次重试等待相同时间
2. **指数退避**：每次重试等待时间递增（1s, 2s, 4s...）

#### 代码示例

```typescript
// utils/upload/retryUpload.ts

export async function retryUpload<T>(
  uploadFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, backoff = true } = options;
  
  let attempt = 0;
  let delay = retryDelay;
  
  while (attempt < maxRetries) {
    try {
      return await uploadFn();
    } catch (error) {
      attempt++;
      
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // 指数退避
      if (backoff) {
        delay *= 2;
      }
    }
  }
  
  throw new Error('重试失败');
}
```

**使用方式：**
```typescript
await retryUpload(
  () => uploadFile(file),
  { maxRetries: 3, backoff: true }
);
```

---

## 💻 完整代码示例

### 1. 基础文件上传组件

**文件：** `components/file-upload/FileUploader.tsx`

```tsx
'use client';

import { useRef, useState, DragEvent } from 'react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  capture?: 'user' | 'environment';
}

export default function FileUploader({
  onUpload,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  capture,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    // 验证文件大小
    if (file.size > maxSize) {
      alert(`文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    // 生成预览
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }

    onUpload(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={capture}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {preview ? (
        <img src={preview} alt="预览" className="max-w-full max-h-64 mx-auto rounded-lg" />
      ) : (
        <div>
          <p className="text-lg font-medium">
            {isDragging ? '松开鼠标上传' : '点击或拖拽文件到此处'}
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### 2. 分块上传工具函数

**文件：** `utils/upload/chunkUpload.ts`

```typescript
export async function chunkUpload(options: ChunkUploadOptions): Promise<ChunkUploadResult> {
  const { file, chunkSize = 2 * 1024 * 1024, onProgress } = options;
  
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileId = `${Date.now()}-${file.name}`;
  
  // 检查已上传的分块（断点续传）
  const uploadedChunks = await checkUploadedChunks(fileId, totalChunks);
  
  // 逐块上传
  for (let i = 0; i < totalChunks; i++) {
    // 跳过已上传的分块
    if (uploadedChunks.includes(i)) {
      onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
      continue;
    }
    
    // 切分文件块
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    // 上传分块
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', i.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileId', fileId);
    
    await fetch('/api/file-upload/chunk', {
      method: 'POST',
      body: formData,
    });
    
    // 更新进度
    onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
  }
  
  // 通知服务器合并
  const result = await mergeChunks(fileId, file.name, file.type);
  
  return { success: true, url: result.url };
}
```

---

### 3. 预签名 URL 上传

**文件：** `utils/upload/presignedUpload.ts`

```typescript
export async function uploadToPresignedURL(options: PresignedUploadOptions): Promise<PresignedUploadResult> {
  const { file, onProgress } = options;
  
  // 1. 获取预签名 URL
  const { url } = await fetch('/api/file-upload/presign', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  }).then(res => res.json());
  
  // 2. 使用预签名 URL 直接上传到云存储
  const xhr = new XMLHttpRequest();
  
  return new Promise((resolve, reject) => {
    // 监听上传进度
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress?.(progress);
      }
    });
    
    // 上传完成
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ success: true, url });
      } else {
        reject(new Error(`上传失败: ${xhr.statusText}`));
      }
    });
    
    // 开始上传
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
```

---

## 🎯 最佳实践

### 1. 安全防护

- ✅ **文件类型验证**：前后端双重校验，使用白名单
- ✅ **文件大小限制**：前后端都要限制
- ✅ **文件内容校验**：检查文件头（Magic Number）
- ✅ **权限控制**：上传接口需要鉴权

### 2. 性能优化

- ✅ **前端压缩**：图片上传前先压缩
- ✅ **分块上传**：大文件使用分块上传
- ✅ **CDN 加速**：静态文件使用 CDN
- ✅ **懒加载**：图片列表使用懒加载

### 3. 用户体验

- ✅ **进度反馈**：显示上传进度
- ✅ **错误提示**：友好的错误信息
- ✅ **重试机制**：失败后可以重试
- ✅ **预览功能**：上传前预览文件

---

## ❓ 常见问题

### Q1: 如何实现断点续传？

**A:** 
1. 上传前检查已上传的分块
2. 跳过已上传的分块
3. 只上传剩余的分块
4. 最后合并所有分块

### Q2: 预签名 URL 和普通上传有什么区别？

**A:**
- **普通上传**：文件经过后端服务器，后端压力大
- **预签名 URL**：文件直接上传到云存储，减轻后端压力

### Q3: 如何压缩图片？

**A:** 使用 Canvas API：
1. 读取文件为 Image 对象
2. 绘制到 Canvas
3. 使用 `canvas.toBlob()` 压缩

### Q4: 如何实现多文件批量上传？

**A:**
1. 使用 `input[multiple]` 选择多个文件
2. 每个文件独立上传
3. 每个文件显示独立进度条
4. 失败的文件可以单独重试

---

## 📚 扩展阅读

- [File API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [XMLHttpRequest - MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

## 🎉 总结

通过本章学习，你已经掌握：

- ✅ 基础文件上传（选择、拖拽、拍照）
- ✅ 分块上传与断点续传
- ✅ 预签名 URL 与云存储直传
- ✅ 多文件批量上传
- ✅ 图片压缩与格式转换
- ✅ CDN 加速与图片懒加载
- ✅ 错误重试与进度反馈

**下一步：**
1. 完成所有实战案例
2. 尝试集成真实的云存储服务（AWS S3、阿里云 OSS）
3. 优化上传性能和用户体验

**记住：** 文件上传不仅要考虑功能实现，更要关注安全性、性能和用户体验！

Happy Coding! 🚀
