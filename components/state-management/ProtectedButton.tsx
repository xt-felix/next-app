'use client';

import { usePermissionStore } from '@/stores/permission';
import { ReactNode } from 'react';

interface ProtectedButtonProps {
  permission?: string;
  role?: 'admin' | 'user' | 'guest';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * 权限保护按钮组件
 * 
 * 功能：
 * 1. 根据权限或角色控制按钮显示
 * 2. 无权限时不渲染
 * 3. 支持权限和角色双重检查
 */
export default function ProtectedButton({
  permission,
  role,
  children,
  className,
  onClick,
}: ProtectedButtonProps) {
  const hasPermission = usePermissionStore((state) => state.hasPermission);
  const hasRole = usePermissionStore((state) => state.hasRole);

  // 权限检查
  if (permission && !hasPermission(permission)) {
    return null;
  }

  // 角色检查
  if (role && !hasRole(role)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

