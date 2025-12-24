/**
 * 基础文件上传组件
 * 支持：选择文件、拖拽上传、拍照上传
 */
'use client';

import { useRef, useState, DragEvent } from 'react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // 字节
  capture?: 'user' | 'environment'; // 拍照时使用前置/后置摄像头
}

export default function FileUploader({
  onUpload,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 默认 5MB
  capture,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * 处理文件选择
   */
  const handleFile = (file: File) => {
    // 验证文件大小
    if (file.size > maxSize) {
      setError(`文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    // 验证文件类型
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('不支持的文件类型');
      return;
    }

    setError('');
    
    // 生成预览（仅图片）
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }

    // 调用上传回调
    onUpload(file);
  };

  /**
   * 文件输入框变化
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /**
   * 拖拽进入
   */
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * 拖拽离开
   */
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * 拖拽放下
   */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /**
   * 点击上传区域
   */
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* 上传区域 */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          capture={capture}
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="预览"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-500">点击重新选择</p>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-4xl">📷</span>
            <p className="text-lg font-medium">
              {isDragging ? '松开鼠标上传' : '点击或拖拽文件到此处'}
            </p>
            <p className="text-sm text-gray-500">
              {accept === 'image/*' ? '支持 JPG、PNG、GIF、WebP' : `支持 ${accept}`}
              {capture && '（支持拍照）'}
            </p>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}

