/**
 * JWT 认证工具
 * 知识点：基于 JWT 的用户身份认证
 * 原理：生成带签名的 Token，前端每次请求携带，后端校验
 */

import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { error } from './response';

// JWT 密钥（生产环境应放在环境变量）
const JWT_SECRET = process.env.JWT_SECRET || 'demo_secret_key_change_in_production';

// Token 有效期（7 天）
const JWT_EXPIRES_IN = '7d';

export interface UserPayload {
  id: number;
  username: string;
  role?: string;
}

/**
 * 生成 JWT Token
 * @param payload 用户信息
 */
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证 JWT Token
 * @param token JWT Token
 * @returns 解析后的用户信息
 */
export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * 从请求中提取 Token
 * @param req NextApiRequest
 */
export function extractToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * 认证中间件：保护需要登录的接口
 * @param handler API 路由处理函数
 */
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: UserPayload) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json(error('未登录，请先登录', 401));
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json(error('Token 无效或已过期', 401));
    }

    // 将用户信息注入到请求中
    (req as any).user = user;
    await handler(req, res, user);
  };
}

/**
 * 管理员权限中间件：仅管理员可访问
 * @param handler API 路由处理函数
 */
export function withAdmin(
  handler: (req: NextApiRequest, res: NextApiResponse, user: UserPayload) => Promise<void>
) {
  return withAuth(async (req, res, user) => {
    if (user.role !== 'admin') {
      return res.status(403).json(error('无权限访问', 403));
    }
    await handler(req, res, user);
  });
}
