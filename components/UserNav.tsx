/**
 * 用户导航栏组件
 * 显示用户信息和登出按钮
 */

'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UserNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          登录
        </Link>
        <Link
          href="/auth/register"
          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          注册
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || ''}
            className="h-8 w-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {session.user.name}
          </span>
          <span className="text-xs text-gray-500">{session.user.role}</span>
        </div>
      </div>

      {session.user.role === 'admin' && (
        <Link
          href="/admin"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          管理后台
        </Link>
      )}

      <button
        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        退出登录
      </button>
    </div>
  );
}
