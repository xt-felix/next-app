/**
 * 多步骤表单示例
 * 知识点：
 * 1. 多步骤表单状态管理
 * 2. 分步验证
 * 3. 进度条显示
 * 4. 数据暂存与回填
 * 5. 步骤间数据传递
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  multiStepFormStep1Schema,
  multiStepFormStep2Schema,
  multiStepFormStep3Schema,
  type MultiStepFormData,
} from '@/lib/forms/schemas';

export default function MultiStepFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<MultiStepFormData>>({});

  const totalSteps = 3;

  // 步骤 1 表单
  const step1Form = useForm({
    resolver: zodResolver(multiStepFormStep1Schema),
    defaultValues: {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
    },
  });

  // 步骤 2 表单
  const step2Form = useForm({
    resolver: zodResolver(multiStepFormStep2Schema),
    defaultValues: {
      country: formData.country || '',
      province: formData.province || '',
      city: formData.city || '',
      address: formData.address || '',
      zipCode: formData.zipCode || '',
    },
  });

  // 步骤 3 表单
  const step3Form = useForm({
    resolver: zodResolver(multiStepFormStep3Schema),
    defaultValues: {
      username: formData.username || '',
      password: '',
      confirmPassword: '',
    },
  });

  const onStep1Submit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const onStep2Submit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const onStep3Submit = async (data: any) => {
    const completeData = { ...formData, ...data };

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('完整表单数据：', completeData);
      alert('注册成功！');

      // 重置所有数据
      setFormData({});
      setCurrentStep(1);
      step1Form.reset();
      step2Form.reset();
      step3Form.reset();
    } catch (error) {
      alert('提交失败，请重试');
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">多步骤表单</h1>
          <p className="mt-2 text-sm text-gray-600">分步完成用户注册，数据自动保存</p>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step <= currentStep
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>个人信息</span>
            <span>地址信息</span>
            <span>账户信息</span>
          </div>
        </div>

        {/* 表单容器 */}
        <div className="bg-white shadow rounded-lg p-6">
          {/* 步骤 1：个人信息 */}
          {currentStep === 1 && (
            <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">个人信息</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓氏 *</label>
                  <input
                    {...step1Form.register('lastName')}
                    type="text"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      step1Form.formState.errors.lastName
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                  />
                  {step1Form.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {step1Form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">名字 *</label>
                  <input
                    {...step1Form.register('firstName')}
                    type="text"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      step1Form.formState.errors.firstName
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                  />
                  {step1Form.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {step1Form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">邮箱地址 *</label>
                <input
                  {...step1Form.register('email')}
                  type="email"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    step1Form.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step1Form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {step1Form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">手机号</label>
                <input
                  {...step1Form.register('phone')}
                  type="tel"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    step1Form.formState.errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="13800138000"
                />
                {step1Form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {step1Form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  下一步
                </button>
              </div>
            </form>
          )}

          {/* 步骤 2：地址信息 */}
          {currentStep === 2 && (
            <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">地址信息</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">国家 *</label>
                  <select
                    {...step2Form.register('country')}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      step2Form.formState.errors.country ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">请选择</option>
                    <option value="CN">中国</option>
                    <option value="US">美国</option>
                    <option value="UK">英国</option>
                  </select>
                  {step2Form.formState.errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {step2Form.formState.errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">省份 *</label>
                  <input
                    {...step2Form.register('province')}
                    type="text"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      step2Form.formState.errors.province ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {step2Form.formState.errors.province && (
                    <p className="mt-1 text-sm text-red-600">
                      {step2Form.formState.errors.province.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">城市 *</label>
                  <input
                    {...step2Form.register('city')}
                    type="text"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      step2Form.formState.errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {step2Form.formState.errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {step2Form.formState.errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">详细地址 *</label>
                <textarea
                  {...step2Form.register('address')}
                  rows={3}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    step2Form.formState.errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step2Form.formState.errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {step2Form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">邮政编码</label>
                <input
                  {...step2Form.register('zipCode')}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    step2Form.formState.errors.zipCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="100000"
                />
                {step2Form.formState.errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {step2Form.formState.errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  上一步
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  下一步
                </button>
              </div>
            </form>
          )}

          {/* 步骤 3：账户信息 */}
          {currentStep === 3 && (
            <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">账户信息</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">用户名 *</label>
                <input
                  {...step3Form.register('username')}
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    step3Form.formState.errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step3Form.formState.errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {step3Form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">密码 *</label>
                <input
                  {...step3Form.register('password')}
                  type="password"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    step3Form.formState.errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step3Form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {step3Form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">确认密码 *</label>
                <input
                  {...step3Form.register('confirmPassword')}
                  type="password"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    step3Form.formState.errors.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
                {step3Form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {step3Form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  上一步
                </button>
                <button
                  type="submit"
                  disabled={step3Form.formState.isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {step3Form.formState.isSubmitting ? '提交中...' : '完成注册'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 知识点说明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">知识点说明</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>状态管理：</strong>使用 useState 管理当前步骤和表单数据
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>分步验证：</strong>每个步骤使用独立的 Zod Schema
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>数据暂存：</strong>步骤间数据自动保存，支持前后切换
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>进度显示：</strong>可视化进度条，提升用户体验
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
