import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'zh' | 'en';

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
}

/**
 * 国际化状态管理
 * 
 * 功能：
 * 1. 语言切换
 * 2. 状态持久化
 * 3. 与后端协作，切换时刷新数据
 */
export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: 'zh',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'i18n-lang',
    }
  )
);

// 翻译函数（简化版）
export const t = (key: string, lang: Language = useI18nStore.getState().lang): string => {
  const translations: Record<string, Record<Language, string>> = {
    'notification.title': {
      zh: '通知中心',
      en: 'Notification Center',
    },
    'notification.markAllRead': {
      zh: '全部标记为已读',
      en: 'Mark all as read',
    },
    'notification.noNotifications': {
      zh: '暂无通知',
      en: 'No notifications',
    },
  };

  return translations[key]?.[lang] || key;
};

