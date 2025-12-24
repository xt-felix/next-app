/**
 * 分块上传示例
 * 路由：/17-file-upload/chunk
 * 
 * 演示：
 * 1. 大文件分块上传
 * 2. 断点续传
 * 3. 上传进度反馈
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUploader from '@/components/file-upload/FileUploader';
import { chunkUpload } from '@/utils/upload/chunkUpload';

export default function ChunkUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(null);

  /**
   * 处理分块上传
   */
  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const result = await chunkUpload({
        file,
        chunkSize: 2 * 1024 * 1024, // 2MB 每块
        onProgress: (progress) => {
          setProgress(progress);
        },
        onChunkComplete: (chunkIndex, total) => {
          console.log(`分块 ${chunkIndex + 1}/${total} 上传完成`);
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

      <h1 className="text-3xl font-bold mb-8">分块上传与断点续传</h1>

      {/* 知识点说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">💡 知识点</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>分块上传：</strong>将大文件切分成多个小块，逐块上传
          </li>
          <li>
            <strong>断点续传：</strong>上传中断后，记录已上传的分块，继续上传剩余部分
          </li>
          <li>
            <strong>优势：</strong>支持大文件、网络不稳定时自动重试、进度精确
          </li>
          <li>
            <strong>实现：</strong>使用 File.slice() 切分文件，每块独立上传
          </li>
        </ul>
      </div>

      {/* 上传组件 */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">选择文件（建议选择大于 5MB 的文件）</h2>
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
              分块上传中，请勿关闭页面...
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

