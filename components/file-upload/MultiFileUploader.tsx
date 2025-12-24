/**
 * 多文件批量上传组件
 * 支持：多选、拖拽、独立进度条、错误重试
 */
'use client';

import { useRef, useState, DragEvent } from 'react';
import { retryUpload } from '@/utils/upload/retryUpload';

interface FileUploadItem {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface MultiFileUploaderProps {
  onUpload: (file: File, onProgress: (progress: number) => void) => Promise<void>;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
}

export default function MultiFileUploader({
  onUpload,
  accept = 'image/*',
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 默认 10MB
}: MultiFileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * 添加文件
   */
  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles
      .slice(0, maxFiles - files.length)
      .filter((file) => {
        if (file.size > maxSize) {
          alert(`文件 ${file.name} 超过大小限制`);
          return false;
        }
        return true;
      })
      .map((file) => ({
        file,
        progress: 0,
        status: 'pending' as const,
      }));

    setFiles((prev) => [...prev, ...validFiles]);

    // 自动开始上传
    validFiles.forEach((item) => {
      uploadFile(item.file);
    });
  };

  /**
   * 上传单个文件
   */
  const uploadFile = async (file: File) => {
    const fileId = `${Date.now()}-${file.name}`;

    // 更新状态为上传中
    setFiles((prev) =>
      prev.map((item) =>
        item.file === file ? { ...item, status: 'uploading' } : item
      )
    );

    try {
      await retryUpload(
        async () => {
          await onUpload(file, (progress) => {
            setFiles((prev) =>
              prev.map((item) =>
                item.file === file ? { ...item, progress } : item
              )
            );
          });
        },
        {
          maxRetries: 3,
          onRetry: (attempt) => {
            console.log(`文件 ${file.name} 第 ${attempt} 次重试`);
          },
        }
      );

      // 更新状态为成功
      setFiles((prev) =>
        prev.map((item) =>
          item.file === file
            ? { ...item, status: 'success', progress: 100 }
            : item
        )
      );
    } catch (error) {
      // 更新状态为失败
      setFiles((prev) =>
        prev.map((item) =>
          item.file === file
            ? {
                ...item,
                status: 'error',
                error: error instanceof Error ? error.message : '上传失败',
              }
            : item
        )
      );
    }
  };

  /**
   * 文件输入变化
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
  };

  /**
   * 拖拽处理
   */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  /**
   * 删除文件
   */
  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((item) => item.file !== file));
  };

  /**
   * 重试上传
   */
  const retryFile = (file: File) => {
    uploadFile(file);
  };

  /**
   * 计算总体进度
   */
  const totalProgress =
    files.length > 0
      ? Math.round(
          files.reduce((sum, item) => sum + item.progress, 0) / files.length
        )
      : 0;

  return (
    <div className="w-full space-y-4">
      {/* 上传区域 */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        `}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-lg font-medium">
          {isDragging ? '松开鼠标上传' : '点击或拖拽文件到此处'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          支持多选，最多 {maxFiles} 个文件
        </p>
      </div>

      {/* 总体进度 */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">总体进度</span>
            <span className="text-sm text-gray-500">{totalProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'error' && (
                    <button
                      onClick={() => retryFile(item.file)}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      重试
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(item.file)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>

              {/* 进度条 */}
              <div className="space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      item.status === 'success'
                        ? 'bg-green-500'
                        : item.status === 'error'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {item.status === 'pending'
                      ? '等待上传'
                      : item.status === 'uploading'
                      ? '上传中...'
                      : item.status === 'success'
                      ? '上传成功'
                      : `上传失败: ${item.error}`}
                  </span>
                  <span>{item.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

