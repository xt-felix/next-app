/**
 * 自动保存与草稿恢复示例
 * 知识点：LocalStorage 自动保存、数据恢复、防抖优化
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { autoSaveFormSchema, type AutoSaveFormData } from '@/lib/forms/schemas';
import { useEffect, useState } from 'react';

const DRAFT_KEY = 'article_draft';

export default function AutoSavePage() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<AutoSaveFormData>({
    resolver: zodResolver(autoSaveFormSchema),
  });

  // 监听表单变化
  const formData = watch();

  // 检查是否有草稿
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      setHasDraft(true);
    }
  }, []);

  // 自动保存（防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        setLastSaved(new Date());
      }
    }, 2000); // 2秒防抖

    return () => clearTimeout(timer);
  }, [formData]);

  // 恢复草稿
  const restoreDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const data = JSON.parse(draft);
      Object.keys(data).forEach(key => {
        setValue(key as keyof AutoSaveFormData, data[key]);
      });
      setHasDraft(false);
      alert('草稿已恢复');
    }
  };

  // 删除草稿
  const deleteDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setLastSaved(null);
    alert('草稿已删除');
  };

  const onSubmit = async (data: AutoSaveFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('发布文章：', data);
    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null);
    alert('文章发布成功！');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">文章编辑器</h1>
            <p className="mt-2 text-sm text-gray-600">自动保存草稿，防止数据丢失</p>
          </div>
          {lastSaved && (
            <div className="text-sm text-gray-500">
              最后保存：{lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        {hasDraft && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">发现未完成的草稿</p>
              <p className="text-xs text-yellow-600 mt-1">是否恢复草稿内容？</p>
            </div>
            <div className="flex gap-2">
              <button onClick={restoreDraft} className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                恢复
              </button>
              <button onClick={deleteDraft} className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                删除
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">标题 *</label>
              <input {...register('title')} type="text" className="mt-1 block w-full rounded-md shadow-sm border-gray-300" placeholder="文章标题..." />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">内容 *</label>
              <textarea {...register('content')} rows={12} className="mt-1 block w-full rounded-md shadow-sm border-gray-300" placeholder="开始写作..." />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">分类 *</label>
              <select {...register('category')} className="mt-1 block w-full rounded-md shadow-sm border-gray-300">
                <option value="">请选择</option>
                <option value="tech">技术</option>
                <option value="life">生活</option>
                <option value="other">其他</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

            <div className="flex items-center">
              <input {...register('isPublished')} type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <label className="ml-2 text-sm text-gray-700">立即发布</label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              {watch('isPublished') ? '发布文章' : '保存草稿'}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-900 mb-2">知识点说明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ 使用 LocalStorage 存储草稿数据</li>
            <li>✓ 防抖优化：2秒无操作后自动保存</li>
            <li>✓ 页面刷新后自动检测并恢复草稿</li>
            <li>✓ 显示最后保存时间，提升用户信心</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
