import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

/**
 * Zustand 主题状态管理
 * 
 * 特点：
 * 1. 轻量级，API 简洁
 * 2. 支持持久化（persist middleware）
 * 3. TypeScript 友好
 * 4. 无需 Provider，可直接使用
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-mode', // localStorage 的 key
    }
  )
);

