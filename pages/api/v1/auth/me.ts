/**
 * 获取当前用户信息接口
 * 路由：GET /api/v1/auth/me
 * 知识点：
 * 1. JWT 鉴权中间件使用
 * 2. 受保护的接口
 * 3. 从 Token 中获取用户信息
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/api/database';
import { success, error } from '@/lib/api/response';
import { withAuth } from '@/lib/api/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json(error('不支持的请求方法', 405));
  }

  try {
    // 从中间件注入的用户信息中获取 ID
    const userId = (req as any).user.id;

    // 查询完整用户信息
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }

    // 返回用户信息（不返回密码）
    const { password: _, ...userInfo } = user;
    return res.status(200).json(success(userInfo));
  } catch (e) {
    console.error('[API Error]', e);
    return res.status(500).json(error('服务器内部错误', 500));
  }
}

// 导出时包裹鉴权中间件
export default withAuth(handler);
