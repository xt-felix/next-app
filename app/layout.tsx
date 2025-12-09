import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '全栈商品管理系统',
  description: 'Next.js API Routes 全栈开发案例',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
