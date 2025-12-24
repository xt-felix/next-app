'use client';

import { useThemeStore } from '@/stores/theme';
import { useEffect } from 'react';

/**
 * 主题切换组件
 * 
 * 演示 Zustand 的基本用法：
 * 1. 使用 useThemeStore hook 订阅状态
 * 2. 调用 toggle 方法更新状态
 * 3. 状态变更自动触发组件重渲染
 */
export default function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);

  // 同步主题到 HTML 元素
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <button
      onClick={toggle}
      aria-label="切换主题"
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      当前模式：{mode === 'light' ? '🌞 亮色' : '🌙 暗色'}
    </button>
  );
}

