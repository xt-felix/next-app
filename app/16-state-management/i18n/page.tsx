'use client';

import { useI18nStore, t } from '@/stores/i18n';
import Link from 'next/link';

/**
 * 国际化示例页面
 * 
 * 功能：
 * 1. 语言切换
 * 2. 状态持久化
 * 3. 翻译函数
 */
export default function I18nPage() {
  const lang = useI18nStore((state) => state.lang);
  const setLang = useI18nStore((state) => state.setLang);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
        ← 返回
      </Link>
      <h1 className="text-3xl font-bold mb-8">国际化示例</h1>
      
      <div className="space-y-4">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">功能说明</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>全局语言状态管理</li>
            <li>语言切换持久化</li>
            <li>翻译函数集成</li>
            <li>与后端协作，切换时刷新数据</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">当前语言：{lang === 'zh' ? '中文' : 'English'}</h3>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLang('zh')}
              className={`px-4 py-2 rounded ${
                lang === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded ${
                lang === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              English
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">翻译示例：</h4>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded space-y-2">
              <p>{t('notification.title', lang)}</p>
              <p>{t('notification.markAllRead', lang)}</p>
              <p>{t('notification.noNotifications', lang)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

