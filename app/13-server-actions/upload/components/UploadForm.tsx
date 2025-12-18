'use client';

import { uploadFile } from '../actions';
import { useState, useTransition, useRef } from 'react';

/**
 * 文件上传表单组件
 * 演示：文件上传 + 预览 + 进度反馈
 */
export function UploadForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }

    // 生成预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 提交表单
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await uploadFile(formData);
        setSuccess(true);
        setPreview(null);

        // 重置表单
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // 3秒后清除成功提示
        setTimeout(() => setSuccess(false), 3000);
      } catch (e) {
        setError(e instanceof Error ? e.message : '上传失败');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* 文件选择区域 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isPending}
          required
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {preview ? (
            <div className="mb-4">
              <img
                src={preview}
                alt="预览"
                className="max-w-full max-h-48 rounded-lg"
              />
            </div>
          ) : (
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          )}
          <span className="text-blue-600 font-medium">
            点击选择文件
          </span>
          <span className="text-sm text-gray-500 mt-1">
            支持 JPEG, PNG, GIF, WebP（最大 5MB）
          </span>
        </label>
      </div>

      {/* 上传按钮 */}
      {preview && (
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending ? '上传中...' : '上传文件'}
        </button>
      )}

      {/* 错误提示 */}
      {error && (
        <div
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div
          className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3"
          role="status"
        >
          文件上传成功！
        </div>
      )}
    </form>
  );
}
