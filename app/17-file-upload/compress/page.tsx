/**
 * 图片压缩示例
 * 路由：/17-file-upload/compress
 * 
 * 演示：
 * 1. 图片压缩
 * 2. 质量调整
 * 3. 尺寸调整
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUploader from '@/components/file-upload/FileUploader';
import { compressImage } from '@/utils/upload/compressImage';

export default function CompressUploadPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  /**
   * 处理文件压缩
   */
  const handleUpload = async (file: File) => {
    setOriginalFile(file);
    setCompressing(true);
    setCompressedFile(null);

    try {
      const compressed = await compressImage(file, {
        quality,
        maxWidth,
        outputFormat: 'image/jpeg',
      });

      setCompressedFile(compressed);
    } catch (error) {
      console.error('压缩失败:', error);
      alert('压缩失败');
    } finally {
      setCompressing(false);
    }
  };

  /**
   * 下载压缩后的图片
   */
  const handleDownload = () => {
    if (!compressedFile || !originalFile) return;

    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-${originalFile.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/17-file-upload"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← 返回文件上传首页
      </Link>

      <h1 className="text-3xl font-bold mb-8">图片压缩</h1>

      {/* 知识点说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">💡 知识点</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>前端压缩：</strong>使用 Canvas API 压缩图片，减少上传时间
          </li>
          <li>
            <strong>质量调整：</strong>通过 quality 参数控制压缩质量（0-1）
          </li>
          <li>
            <strong>尺寸调整：</strong>限制最大宽度/高度，自动等比缩放
          </li>
          <li>
            <strong>格式转换：</strong>支持转换为 JPEG、PNG、WebP 格式
          </li>
        </ul>
      </div>

      {/* 压缩设置 */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">压缩设置</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              压缩质量: {quality.toFixed(1)} (0.1 - 1.0)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              最大宽度（像素，留空不限制）
            </label>
            <input
              type="number"
              value={maxWidth || ''}
              onChange={(e) =>
                setMaxWidth(e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="例如: 1920"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 上传组件 */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">选择图片</h2>
        <FileUploader
          onUpload={handleUpload}
          accept="image/*"
          maxSize={50 * 1024 * 1024} // 50MB
        />
      </div>

      {/* 压缩中 */}
      {compressing && (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 mb-6">
          <p className="text-center">正在压缩...</p>
        </div>
      )}

      {/* 对比结果 */}
      {originalFile && compressedFile && (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">压缩对比</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">原始图片</h4>
              <img
                src={URL.createObjectURL(originalFile)}
                alt="原始"
                className="w-full rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">
                大小: {(originalFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">压缩后</h4>
              <img
                src={URL.createObjectURL(compressedFile)}
                alt="压缩后"
                className="w-full rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">
                大小: {(compressedFile.size / 1024).toFixed(2)} KB
                {' '}
                (压缩率:{' '}
                {(
                  ((originalFile.size - compressedFile.size) /
                    originalFile.size) *
                  100
                ).toFixed(1)}
                %)
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            下载压缩后的图片
          </button>
        </div>
      )}
    </div>
  );
}

