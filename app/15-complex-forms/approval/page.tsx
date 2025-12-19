/**
 * 审批流表单示例
 * 知识点：企业级审批流程表单实现
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { approvalFormSchema, type ApprovalFormData } from '@/lib/forms/schemas';
import { useState } from 'react';

export default function ApprovalFormPage() {
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalFormSchema),
  });

  const onSubmit = async (data: ApprovalFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('审批申请数据：', data);
      setSubmitResult('审批申请已提交，等待审批');
    } catch (error) {
      setSubmitResult('提交失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">请假申请表单</h1>
          <p className="mt-2 text-sm text-gray-600">企业级审批流程示例</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">请假类型 *</label>
              <select {...register('type')} className="mt-1 block w-full rounded-md shadow-sm border-gray-300">
                <option value="">请选择</option>
                <option value="annual">年假</option>
                <option value="sick">病假</option>
                <option value="personal">事假</option>
                <option value="other">其他</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">开始日期 *</label>
                <input {...register('startDate')} type="date" className="mt-1 block w-full rounded-md shadow-sm border-gray-300" />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">结束日期 *</label>
                <input {...register('endDate')} type="date" className="mt-1 block w-full rounded-md shadow-sm border-gray-300" />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">请假理由 *</label>
              <textarea {...register('reason')} rows={4} className="mt-1 block w-full rounded-md shadow-sm border-gray-300" placeholder="请详细说明请假原因..." />
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">紧急程度 *</label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input {...register('urgency')} type="radio" value="low" className="form-radio" />
                  <span className="ml-2">低</span>
                </label>
                <label className="inline-flex items-center">
                  <input {...register('urgency')} type="radio" value="medium" className="form-radio" />
                  <span className="ml-2">中</span>
                </label>
                <label className="inline-flex items-center">
                  <input {...register('urgency')} type="radio" value="high" className="form-radio" />
                  <span className="ml-2">高</span>
                </label>
              </div>
              {errors.urgency && <p className="mt-1 text-sm text-red-600">{errors.urgency.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">附件</label>
              <input {...register('attachments')} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png" className="mt-1 block w-full" />
              {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments.message as string}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? '提交中...' : '提交审批'}
            </button>

            {submitResult && (
              <div className={`p-4 rounded-md ${submitResult.includes('已提交') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitResult}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
