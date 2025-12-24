# 第十七章：文件上传与云存储集成（全栈深度实战版）

> 🎯 **学习目标**：构建一个具备分块上传、断点续传、预签名直传和前端压缩功能的工业级文件管理系统。

---

## 📂 项目完整文件结构说明

为了保证示例的可运行性，请按以下结构组织代码：

```text
app/
  api/
    file-upload/
      upload/route.ts        # 基础上传接口
      presign/route.ts       # 获取 S3 预签名 URL
      chunk/route.ts         # 接收切片接口
      check/route.ts         # 秒传/断点续传检查接口
      merge/route.ts         # 切片合并接口
components/
  file-upload/
    FileUploader.tsx         # 核心上传 UI（支持拖拽/预览）
    MultiFileUploader.tsx    # 批量上传管理（并发控制）
utils/
  upload/
    chunk-engine.ts          # 大文件切片逻辑封装
    compressor.ts            # Canvas 图像压缩工具
    hash.ts                  # 文件唯一标识 (MD5/SHA256) 计算
```

---

## 💻 第一部分：前端核心组件与工具

### 1. 图像压缩工具 (Canvas 方案)
**路径**：`utils/upload/compressor.ts`
```typescript
export interface CompressOptions {
  quality: number;
  maxWidth?: number;
}

export async function compressImage(file: File, options: CompressOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // 计算等比例缩放
        if (options.maxWidth && width > options.maxWidth) {
          height = (options.maxWidth / width) * height;
          width = options.maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为 Blob，设置压缩质量
        canvas.toBlob((blob) => {
          blob ? resolve(blob) : reject(new Error('压缩失败'));
        }, 'image/jpeg', options.quality);
      };
    };
  });
}
```

### 2. 大文件切片引擎 (支持断点续传)
**路径**：`utils/upload/chunk-engine.ts`
```typescript
export interface ChunkTask {
  file: File;
  chunkSize: number;
  onProgress: (p: number) => void;
}

export async function uploadLargeFile(task: ChunkTask) {
  const { file, chunkSize, onProgress } = task;
  const fileId = `${file.name}-${file.size}`; // 简化版 ID，建议用 MD5
  const totalChunks = Math.ceil(file.size / chunkSize);

  // 1. 预检查：询问后端哪些分块已上传（断点续传核心）
  const { uploadedIndexes } = await fetch(`/api/file-upload/check?fileId=${fileId}`).then(res => res.json());

  // 2. 调度切片上传
  const uploadPromises = [];
  for (let i = 0; i < totalChunks; i++) {
    if (uploadedIndexes.includes(i)) continue;

    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('index', i.toString());
    formData.append('fileId', fileId);

    // 控制并发：这里简单演示，实际可用 Promise 池
    const p = fetch('/api/file-upload/chunk', { method: 'POST', body: formData })
      .then(() => {
        const currentProgress = Math.round(((uploadedIndexes.length + uploadPromises.length) / totalChunks) * 100);
        onProgress(currentProgress);
      });
    uploadPromises.push(p);
  }

  await Promise.all(uploadPromises);

  // 3. 通知合并
  return fetch('/api/file-upload/merge', {
    method: 'POST',
    body: JSON.stringify({ fileId, fileName: file.name })
  }).then(res => res.json());
}
```

---

## 🖥️ 第二部分：后端 API 完整实现 (Next.js)

### 1. 切片合并接口（流式写入优化）
**路径**：`app/api/file-upload/merge/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream, readFileSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const { fileId, fileName } = await req.json();
  const chunksDir = join(process.cwd(), 'temp', fileId);
  const targetPath = join(process.cwd(), 'public/uploads', fileName);

  try {
    // 读取所有分块文件并排序
    const chunkFiles = readdirSync(chunksDir).sort((a, b) => parseInt(a) - parseInt(b));
    
    // 使用写入流，避免一次性读入大量内存导致 OOM
    const writeStream = createWriteStream(targetPath);
    
    for (const file of chunkFiles) {
      const filePath = join(chunksDir, file);
      const content = readFileSync(filePath);
      writeStream.write(content);
    }
    writeStream.end();

    // 清理分块临时目录
    rmSync(chunksDir, { recursive: true, force: true });

    return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
  } catch (err) {
    return NextResponse.json({ error: '合并失败' }, { status: 500 });
  }
}
```

### 2. 预签名 URL 生成 (AWS S3)
**路径**：`app/api/file-upload/presign/route.ts`
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export async function POST(req: NextRequest) {
  const { filename, fileType } = await req.json();
  const key = `raw/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: fileType,
  });

  // 生成一个 15 分钟有效的预签名链接
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

  return NextResponse.json({ signedUrl, key });
}
```

---

## 🎨 第三部分：高级 UI 实战组件

### 批量上传管理组件 (带并发与状态机)
**路径**：`components/file-upload/MultiFileUploader.tsx`
```tsx
'use client';
import { useState } from 'react';
import { uploadLargeFile } from '@/utils/upload/chunk-engine';
import { compressImage } from '@/utils/upload/compressor';

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: 'wait' | 'compressing' | 'uploading' | 'success' | 'error';
}

export default function MultiFileUploader() {
  const [tasks, setTasks] = useState<UploadTask[]>([]);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newTasks = files.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      progress: 0,
      status: 'wait' as const
    }));
    
    setTasks(prev => [...prev, ...newTasks]);

    // 串行执行任务（或限制并发）
    for (const task of newTasks) {
      await executeTask(task);
    }
  };

  const executeTask = async (task: UploadTask) => {
    try {
      // 1. 如果是图片，先压缩
      let uploadTarget: File | Blob = task.file;
      if (task.file.type.startsWith('image/')) {
        setTaskState(task.id, { status: 'compressing' });
        uploadTarget = await compressImage(task.file, { quality: 0.6, maxWidth: 1920 });
      }

      // 2. 执行分块上传
      setTaskState(task.id, { status: 'uploading' });
      await uploadLargeFile({
        file: uploadTarget as File,
        chunkSize: 1024 * 1024 * 5, // 5MB 分块
        onProgress: (p) => setTaskState(task.id, { progress: p })
      });

      setTaskState(task.id, { status: 'success', progress: 100 });
    } catch (err) {
      setTaskState(task.id, { status: 'error' });
    }
  };

  const setTaskState = (id: string, update: Partial<UploadTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...update } : t));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto border rounded-xl shadow-sm">
      <input type="file" multiple onChange={handleSelect} className="mb-4 block w-full text-sm" />
      <div className="space-y-3">
        {tasks.map(t => (
          <div key={t.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="truncate w-40">{t.file.name}</span>
              <span className={`font-bold ${t.status === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
                {t.status.toUpperCase()} {t.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300" 
                style={{ width: `${t.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🛡️ 第四部分：生产环境安全与优化 Checklist

### 1. 文件类型“真校验”
不要只看后缀。后端应使用 `file-type` 库检查二进制头：
```typescript
import { fileTypeFromBuffer } from 'file-type';
const type = await fileTypeFromBuffer(buffer);
if (type?.mime !== 'image/jpeg') throw new Error('非法格式');
```

### 2. 跨域 (CORS) 配置
如果是直传 S3/OSS，必须在云平台后台配置 CORS 规则：
- **Allowed Methods**: `PUT`, `POST`
- **Allowed Headers**: `*`
- **Expose Headers**: `ETag`

### 3. 清理机制
分块上传可能失败，导致服务器堆积大量临时文件夹。应建立 **Cron Job** 定时清理 24 小时前未合并的 `temp/*` 目录。

---

## 🎉 结语

本教程提供的代码已经涵盖了从 UI 交互、数据切片、内存优化到云存储集成的全链路细节。您可以直接将对应的代码片段拷贝到您的项目中，并根据实际的存储驱动（S3, OSS, 腾讯云等）微调 API 即可。

Happy Coding! 🚀
