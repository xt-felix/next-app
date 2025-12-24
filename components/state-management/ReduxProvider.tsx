'use client';

import { Provider } from 'react-redux';
import { store } from '@/stores/reduxStore';
import { ReactNode } from 'react';

/**
 * Redux Provider 组件
 * 
 * 在 Next.js App Router 中使用 Redux 需要 Provider
 * 注意：只在需要 Redux 的页面使用，避免全局污染
 */
export default function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

