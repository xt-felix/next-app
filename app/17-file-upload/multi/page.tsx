/**
 * 多文件批量上传示例
 * 路由：/17-file-upload/multi
 * 
 * 演示：
 * 1. 多文件选择
 * 2. 批量上传
 * 3. 独立进度条
 * 4. 错误重试
 */
'use client';

import Link from 'next/link';
import MultiFileUploader from '@/components/file-upload/MultiFileUploader';

export default function MultiUploadPage() {
  /**
   * 处理单个文件上传
   */
  const handleUpload = async (
    file: File,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    // 使用 XMLHttpRequest 监听上传进度
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });

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
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/17-file-upload"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← 返回文件上传首页
      </Link>

      <h1 className="text-3xl font-bold mb-8">多文件批量上传</h1>

      {/* 知识点说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">💡 知识点</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>多文件选择：</strong>使用 input[multiple] 属性支持多选
          </li>
          <li>
            <strong>批量上传：</strong>每个文件独立上传，互不影响
          </li>
          <li>
            <strong>独立进度：</strong>每个文件显示独立的进度条和状态
          </li>
          <li>
            <strong>错误重试：</strong>上传失败的文件可以单独重试
          </li>
          <li>
            <strong>总体进度：</strong>聚合所有文件的上传进度
          </li>
        </ul>
      </div>

      {/* 上传组件 */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">批量上传文件</h2>
        <MultiFileUploader
          onUpload={handleUpload}
          accept="*/*"
          maxFiles={10}
          maxSize={10 * 1024 * 1024} // 10MB
        />
      </div>
    </div>
  );
}

