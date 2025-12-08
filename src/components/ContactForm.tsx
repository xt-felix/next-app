// components/ContactForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import AnimatedButton from './AnimatedButton';

const contactSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码')
    .optional()
    .or(z.literal('')),
  subject: z.string().min(2, '主题至少需要2个字符').max(100, '主题不能超过100个字符'),
  message: z.string().min(10, '留言至少需要10个字符').max(500, '留言不能超过500个字符')
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('提交失败');

      setSubmitStatus('success');
      reset();

      // 3秒后重置状态
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('表单提交错误:', error);
      setSubmitStatus('error');

      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 姓名 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="input"
            placeholder="请输入您的姓名"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* 邮箱 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="input"
            placeholder="your@email.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 手机号（可选） */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            手机号（可选）
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="input"
            placeholder="13800138000"
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* 主题 */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            主题 <span className="text-red-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            {...register('subject')}
            className="input"
            placeholder="请输入咨询主题"
            aria-invalid={errors.subject ? 'true' : 'false'}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* 留言 */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            留言 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={6}
            className="input resize-none"
            placeholder="请详细描述您的问题或建议..."
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-500" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <AnimatedButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? '提交中...' : '提交'}
          </AnimatedButton>

          {submitStatus === 'success' && (
            <p className="text-green-600 dark:text-green-400 font-medium" role="status">
              ✓ 提交成功！我们会尽快回复您。
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="text-red-600 dark:text-red-400 font-medium" role="alert">
              ✗ 提交失败，请稍后重试。
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
