/**
 * 文件上传表单示例
 * 知识点：
 * 1. 文件输入处理
 * 2. 文件大小和类型验证
 * 3. 文件预览
 * 4. 多文件上传
 * 5. 进度显示
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fileUploadSchema, type FileUploadFormData } from '@/lib/forms/schemas';
import { useState } from 'react';
import Image from 'next/image';

export default function FileUploadPage() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
  });

  const files = watch('files');

  // 处理文件选择并生成预览
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const fileArray = Array.from(selectedFiles);
    const previewUrls: string[] = [];

    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target?.result) {
            previewUrls.push(e.target.result as string);
            if (previewUrls.length === fileArray.filter(f => f.type.startsWith('image/')).length) {
              setPreviews(previewUrls);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const onSubmit = async (data: FileUploadFormData) => {
    try {
      // 模拟文件上传进度
      setUploadProgress(0);
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      console.log('表单数据：', {
        ...data,
        files: Array.from(data.files).map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      });

      alert('上传成功！');
      reset();
      setPreviews([]);
      setUploadProgress(0);
    } catch (error) {
      alert('上传失败，请重试');
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">文件上传表单</h1>
          <p className="mt-2 text-sm text-gray-600">
            文件大小、类型验证，图片预览，上传进度显示
          </p>
        </div>

        {/* 表单容器 */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">标题 *</label>
              <input
                {...register('title')}
                type="text"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="给您的文件起个名字"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">描述</label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                placeholder="描述一下您上传的文件..."
              />
            </div>

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">分类 *</label>
              <select
                {...register('category')}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">请选择</option>
                <option value="image">图片</option>
                <option value="document">文档</option>
                <option value="video">视频</option>
                <option value="other">其他</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* 文件选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">文件 *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                <input
                  {...register('files', {
                    onChange: handleFileChange,
                  })}
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    点击选择文件或拖拽到这里
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    支持图片、PDF、Word文档，单文件最大 10MB，最多 5 个文件
                  </p>
                </label>
              </div>
              {errors.files && (
                <p className="mt-2 text-sm text-red-600">{errors.files.message as string}</p>
              )}
            </div>

            {/* 已选文件列表 */}
            {files && files.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  已选择 {files.length} 个文件
                </h4>
                <div className="space-y-2">
                  {Array.from(files).map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {file.type.startsWith('image/') ? (
                            <svg
                              className="h-6 w-6 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-6 w-6 text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 图片预览 */}
            {previews.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">图片预览</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 上传进度 */}
            {isSubmitting && (
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">上传进度</span>
                  <span className="text-sm font-medium text-blue-900">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? '上传中...' : '上传文件'}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setPreviews([]);
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                重置
              </button>
            </div>
          </form>
        </div>

        {/* 知识点说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">知识点说明</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>文件验证：</strong>Zod custom validator 验证文件大小和数量
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>图片预览：</strong>使用 FileReader 读取图片并生成预览
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>进度显示：</strong>模拟上传进度，提升用户体验
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>多文件支持：</strong>multiple 属性允许选择多个文件
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
