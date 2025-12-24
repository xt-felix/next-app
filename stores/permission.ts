import { create } from 'zustand';

type Role = 'admin' | 'user' | 'guest';

interface PermissionState {
  role: Role;
  permissions: string[];
  setRole: (role: Role) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: Role) => boolean;
}

/**
 * 权限状态管理
 * 
 * 功能：
 * 1. 角色管理
 * 2. 权限检查
 * 3. 与组件/路由协作，控制访问
 */
const rolePermissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete', 'manage'],
  user: ['read', 'write'],
  guest: ['read'],
};

export const usePermissionStore = create<PermissionState>((set, get) => ({
  role: 'guest',
  permissions: rolePermissions.guest,
  setRole: (role) =>
    set({
      role,
      permissions: rolePermissions[role] || [],
    }),
  hasPermission: (permission) => {
    const { permissions } = get();
    return permissions.includes(permission);
  },
  hasRole: (role) => {
    return get().role === role;
  },
}));

