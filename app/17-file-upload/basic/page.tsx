/**
 * 基础文件上传示例
 * 路由：/17-file-upload/basic
 * 
 * 演示：
 * 1. 文件选择、拖拽、拍照上传
 * 2. 文件预览
 * 3. 进度反馈
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUploader from '@/components/file-upload/FileUploader';

export default function BasicUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  /**
   * 处理文件上传
   */
  const handleUpload = async (file: File) => {
    setUploadedFile(file);
    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 使用 XMLHttpRequest 监听上传进度
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`上传失败: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('上传失败：网络错误'));
        });

        xhr.open('POST', '/api/file-upload/upload');
        xhr.send(formData);
      });

      setResult({ success: true, message: '上传成功！' });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : '上传失败',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/17-file-upload"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← 返回文件上传首页
      </Link>

      <h1 className="text-3xl font-bold mb-8">基础文件上传</h1>

      {/* 知识点说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">💡 知识点</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>文件选择：</strong>使用 input[type="file"] 选择文件
          </li>
          <li>
            <strong>拖拽上传：</strong>监听 drag 事件，支持拖拽文件到指定区域
          </li>
          <li>
            <strong>拍照上传：</strong>使用 capture 属性调用摄像头
          </li>
          <li>
            <strong>文件预览：</strong>使用 FileReader 或 URL.createObjectURL 生成预览
          </li>
          <li>
            <strong>进度反馈：</strong>使用 XMLHttpRequest.upload 监听上传进度
          </li>
        </ul>
      </div>

      {/* 上传组件 */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">上传文件</h2>
        <FileUploader
          onUpload={handleUpload}
          accept="image/*"
          maxSize={10 * 1024 * 1024} // 10MB
          capture="environment" // 使用后置摄像头
        />
      </div>

      {/* 上传进度 */}
      {uploading && (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">上传进度</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 上传结果 */}
      {result && (
        <div
          className={`border rounded-lg p-4 ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <p className={result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
            {result.message}
          </p>
        </div>
      )}

      {/* 文件信息 */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">文件信息</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>文件名：</strong>
              {uploadedFile.name}
            </p>
            <p>
              <strong>文件大小：</strong>
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p>
              <strong>文件类型：</strong>
              {uploadedFile.type}
            </p>
            <p>
              <strong>最后修改：</strong>
              {new Date(uploadedFile.lastModified).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

