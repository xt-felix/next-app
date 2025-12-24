'use client';

import { RecoilRoot } from 'recoil';
import { ReactNode } from 'react';

/**
 * Recoil Provider 组件
 * 
 * Recoil 需要在应用根部提供 RecoilRoot
 */
export default function RecoilProvider({ children }: { children: ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

