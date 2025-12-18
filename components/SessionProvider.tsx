/**
 * SessionProvider 包装器
 * 在客户端组件中提供 session 上下文
 */

'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
