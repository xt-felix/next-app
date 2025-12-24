'use client';

import { useState } from 'react';
import { usePermissionStore } from '@/stores/permission';
import ProtectedButton from '@/components/state-management/ProtectedButton';
import Link from 'next/link';

/**
 * 权限控制示例页面
 * 
 * 功能：
 * 1. 角色管理
 * 2. 权限检查
 * 3. 组件按权限渲染
 */
export default function PermissionPage() {
  const role = usePermissionStore((state) => state.role);
  const setRole = usePermissionStore((state) => state.setRole);
  const hasPermission = usePermissionStore((state) => state.hasPermission);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
        ← 返回
      </Link>
      <h1 className="text-3xl font-bold mb-8">权限控制示例</h1>
      
      <div className="space-y-4">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">功能说明</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>基于角色的权限管理（RBAC）</li>
            <li>组件按权限/角色条件渲染</li>
            <li>权限状态全局管理</li>
            <li>与后端权限系统协作</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">当前角色：{role}</h3>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setRole('guest')}
              className={`px-4 py-2 rounded ${
                role === 'guest' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              访客
            </button>
            <button
              onClick={() => setRole('user')}
              className={`px-4 py-2 rounded ${
                role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              用户
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-4 py-2 rounded ${
                role === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              管理员
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">权限按钮示例：</h4>
            <div className="flex flex-wrap gap-2">
              <ProtectedButton
                permission="read"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                读取权限（所有角色）
              </ProtectedButton>
              <ProtectedButton
                permission="write"
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                写入权限（用户+管理员）
              </ProtectedButton>
              <ProtectedButton
                permission="delete"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除权限（仅管理员）
              </ProtectedButton>
              <ProtectedButton
                role="admin"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                管理员专属按钮
              </ProtectedButton>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h4 className="font-semibold mb-2">当前权限：</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>read: {hasPermission('read') ? '✅' : '❌'}</li>
              <li>write: {hasPermission('write') ? '✅' : '❌'}</li>
              <li>delete: {hasPermission('delete') ? '✅' : '❌'}</li>
              <li>manage: {hasPermission('manage') ? '✅' : '❌'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

