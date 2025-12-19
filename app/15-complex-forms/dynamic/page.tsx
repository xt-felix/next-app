/**
 * 动态字段表单示例
 * 知识点：
 * 1. useFieldArray 动态添加/删除字段
 * 2. 数组字段验证
 * 3. 复杂嵌套数据结构
 * 4. 字段联动（当前工作切换）
 * 5. 列表项拖拽排序（可选）
 */

'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dynamicFormSchema, type DynamicFormData } from '@/lib/forms/schemas';
import { useState } from 'react';

export default function DynamicFormPage() {
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<DynamicFormData>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {
      name: '',
      email: '',
      workExperience: [
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workExperience',
  });

  const onSubmit = async (data: DynamicFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('表单数据：', data);
      setSubmitResult('提交成功！');
    } catch (error) {
      setSubmitResult('提交失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">动态字段表单</h1>
          <p className="mt-2 text-sm text-gray-600">
            使用 useFieldArray 动态添加/删除工作经历
          </p>
        </div>

        {/* 表单容器 */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 基本信息 */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名 *</label>
                  <input
                    {...register('name')}
                    type="text"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">邮箱 *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 工作经历 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">工作经历</h2>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      company: '',
                      position: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      description: '',
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  + 添加工作经历
                </button>
              </div>

              {errors.workExperience && !Array.isArray(errors.workExperience) && (
                <p className="mb-4 text-sm text-red-600">{errors.workExperience.message}</p>
              )}

              <div className="space-y-6">
                {fields.map((field, index) => {
                  const isCurrent = watch(`workExperience.${index}.isCurrent`);

                  return (
                    <div
                      key={field.id}
                      className="border border-gray-200 rounded-lg p-4 relative"
                    >
                      {/* 删除按钮 */}
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              公司名称 *
                            </label>
                            <input
                              {...register(`workExperience.${index}.company`)}
                              type="text"
                              className={`mt-1 block w-full rounded-md shadow-sm ${
                                errors.workExperience?.[index]?.company
                                  ? 'border-red-300'
                                  : 'border-gray-300'
                              }`}
                            />
                            {errors.workExperience?.[index]?.company && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.workExperience[index]?.company?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              职位 *
                            </label>
                            <input
                              {...register(`workExperience.${index}.position`)}
                              type="text"
                              className={`mt-1 block w-full rounded-md shadow-sm ${
                                errors.workExperience?.[index]?.position
                                  ? 'border-red-300'
                                  : 'border-gray-300'
                              }`}
                            />
                            {errors.workExperience?.[index]?.position && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.workExperience[index]?.position?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              开始日期 *
                            </label>
                            <input
                              {...register(`workExperience.${index}.startDate`)}
                              type="date"
                              className={`mt-1 block w-full rounded-md shadow-sm ${
                                errors.workExperience?.[index]?.startDate
                                  ? 'border-red-300'
                                  : 'border-gray-300'
                              }`}
                            />
                            {errors.workExperience?.[index]?.startDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.workExperience[index]?.startDate?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              结束日期
                            </label>
                            <input
                              {...register(`workExperience.${index}.endDate`)}
                              type="date"
                              disabled={isCurrent}
                              className={`mt-1 block w-full rounded-md shadow-sm ${
                                isCurrent
                                  ? 'bg-gray-100 cursor-not-allowed'
                                  : errors.workExperience?.[index]?.endDate
                                    ? 'border-red-300'
                                    : 'border-gray-300'
                              }`}
                            />
                            {errors.workExperience?.[index]?.endDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.workExperience[index]?.endDate?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center">
                            <input
                              {...register(`workExperience.${index}.isCurrent`)}
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">目前在职</label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            工作描述
                          </label>
                          <textarea
                            {...register(`workExperience.${index}.description`)}
                            rows={3}
                            className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                            placeholder="描述您在该公司的主要职责和成就..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? '提交中...' : '提交'}
              </button>
            </div>

            {/* 提交结果 */}
            {submitResult && (
              <div
                className={`p-4 rounded-md ${
                  submitResult.includes('成功')
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {submitResult}
              </div>
            )}
          </form>
        </div>

        {/* 知识点说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">知识点说明</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>useFieldArray：</strong>管理动态数组字段，支持 append/remove
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>字段验证：</strong>数组中每个元素都使用 Zod Schema 验证
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>字段联动：</strong>"目前在职"切换时禁用结束日期输入
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>唯一 key：</strong>使用 field.id 作为列表项 key，避免渲染问题
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
