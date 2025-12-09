import { IncomingMessage } from 'http';
import { User } from '../types';

/**
 * 从 Cookie 中解析 token
 * 这是一个简化版本，实际项目中应使用 jsonwebtoken 等库
 */
export function getTokenFromCookie(req: IncomingMessage): string | null {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const tokenMatch = cookies.match(/token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

/**
 * 检查用户是否已登录
 */
export function checkLogin(req: IncomingMessage): boolean {
  const token = getTokenFromCookie(req);
  return Boolean(token);
}

/**
 * 从 token 获取用户信息
 * 实际项目中应验证 JWT token
 */
export function getUserFromToken(token: string): User | null {
  try {
    // 这里简化处理，实际应该解析 JWT
    // 模拟从 token 解析出用户信息
    const userMap: Record<string, User> = {
      'admin-token': {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        avatar: '/avatars/admin.jpg',
      },
      'user-token': {
        id: 2,
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        role: 'user',
        avatar: '/avatars/user.jpg',
      },
      'guest-token': {
        id: 3,
        username: 'guest',
        email: 'guest@example.com',
        role: 'guest',
      },
    };

    return userMap[token] || null;
  } catch (error) {
    return null;
  }
}

/**
 * 从请求中获取当前用户
 */
export function getCurrentUser(req: IncomingMessage): User | null {
  const token = getTokenFromCookie(req);
  if (!token) return null;
  return getUserFromToken(token);
}

/**
 * 检查用户是否有指定角色
 */
export function hasRole(user: User | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
