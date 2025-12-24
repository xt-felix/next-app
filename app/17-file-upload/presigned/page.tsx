/**
 * 预签名 URL 上传示例
 * 路由：/17-file-upload/presigned
 * 
 * 演示：
 * 1. 获取预签名 URL
 * 2. 直传云存储
 * 3. 减轻后端压力
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUploader from '@/components/file-upload/FileUploader';
import { uploadToPresignedURL } from '@/utils/upload/presignedUpload';

export default function PresignedUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(null);

  /**
   * 处理预签名 URL 上传
   */
  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const result = await uploadToPresignedURL({
        file,
        onProgress: (progress) => {
          setProgress(progress);
        },
      });

      setResult(result);
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

      <h1 className="text-3xl font-bold mb-8">预签名 URL 直传云存储</h1>

      {/* 知识点说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">💡 知识点</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>预签名 URL：</strong>后端生成带权限的临时上传链接
          </li>
          <li>
            <strong>直传云存储：</strong>前端直接 PUT/POST 文件到云存储（如 S3、OSS）
          </li>
          <li>
            <strong>优势：</strong>减轻后端压力、支持大文件、提升上传速度、权限可控
          </li>
          <li>
            <strong>流程：</strong>前端请求预签名 URL → 直传云存储 → 通知后端（可选）
          </li>
        </ul>
      </div>

      {/* 上传组件 */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">选择文件</h2>
        <FileUploader
          onUpload={handleUpload}
          accept="*/*"
          maxSize={100 * 1024 * 1024} // 100MB
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
            <p className="text-xs text-gray-500">
              正在直传到云存储...
            </p>
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
          {result.success && result.url && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              文件 URL: {result.url}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

