/**
 * 基础表单示例
 * 知识点：
 * 1. React Hook Form 基础用法
 * 2. Zod Schema 验证
 * 3. 表单错误处理
 * 4. 自定义表单组件
 * 5. 提交状态管理
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicFormSchema, type BasicFormData } from '@/lib/forms/schemas';
import { useState } from 'react';

export default function BasicFormPage() {
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BasicFormData>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      gender: 'male',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: BasicFormData) => {
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('表单数据：', data);
      setSubmitResult('提交成功！');

      // 重置表单
      reset();
    } catch (error) {
      setSubmitResult('提交失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">基础表单示例</h1>
          <p className="mt-2 text-sm text-gray-600">
            使用 React Hook Form + Zod 实现完整的表单验证
          </p>
        </div>

        {/* 表单容器 */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 用户名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名 *
              </label>
              <input
                {...register('username')}
                type="text"
                id="username"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.username
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                3-20 个字符，只能包含字母、数字和下划线
              </p>
            </div>

            {/* 邮箱 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址 *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码 *
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                至少 8 个字符，包含大小写字母和数字
              </p>
            </div>

            {/* 确认密码 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                确认密码 *
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* 年龄 */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                年龄 *
              </label>
              <input
                {...register('age', { valueAsNumber: true })}
                type="number"
                id="age"
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.age
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">性别 *</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    {...register('gender')}
                    type="radio"
                    id="male"
                    value="male"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="male" className="ml-2 text-sm text-gray-700">
                    男
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    {...register('gender')}
                    type="radio"
                    id="female"
                    value="female"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="female" className="ml-2 text-sm text-gray-700">
                    女
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    {...register('gender')}
                    type="radio"
                    id="other"
                    value="other"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="other" className="ml-2 text-sm text-gray-700">
                    其他
                  </label>
                </div>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            {/* 同意条款 */}
            <div>
              <div className="flex items-center">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  id="acceptTerms"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                  我已阅读并同意 <span className="text-blue-600">服务条款</span> 和{' '}
                  <span className="text-blue-600">隐私政策</span> *
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? '提交中...' : '提交'}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                重置
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
                <strong>useForm Hook：</strong>管理表单状态、验证和提交
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>zodResolver：</strong>将 Zod Schema 集成到 React Hook Form
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>register：</strong>注册表单字段，自动处理 value 和 onChange
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>errors：</strong>获取验证错误信息，实时显示给用户
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>isSubmitting：</strong>跟踪提交状态，禁用按钮防止重复提交
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>reset：</strong>重置表单到初始状态
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
