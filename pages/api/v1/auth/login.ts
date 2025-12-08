/**
 * 用户登录接口
 * 路由：POST /api/v1/auth/login
 * 知识点：
 * 1. JWT Token 生成
 * 2. 密码验证（实际应使用 bcrypt 加密）
 * 3. 登录凭证返回
 * 4. 接口限流（防暴力破解）
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/api/database';
import { success, error } from '@/lib/api/response';
import { loginSchema, validate } from '@/lib/api/validate';
import { generateToken } from '@/lib/api/auth';
import { checkRateLimit, getClientIp } from '@/lib/api/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(error('不支持的请求方法', 405));
  }

  try {
    // 登录接口限流：每个 IP 每分钟最多 5 次尝试（防暴力破解）
    const ip = getClientIp(req);
    if (checkRateLimit(ip, 5, 60_000)) {
      return res.status(429).json(error('登录尝试过于频繁，请 1 分钟后再试', 429));
    }

    // 校验请求体
    const result = validate(loginSchema, req.body);
    if (!result.success) {
      return res.status(400).json(error(result.error.issues[0].message));
    }

    const { username, password } = result.data;

    // 查询用户
    const user = db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    // 验证密码（实际应使用 bcrypt.compare）
    if (user.password !== password) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    // 生成 JWT Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // 返回用户信息和 Token（不返回密码）
    const { password: _, ...userInfo } = user;
    return res.status(200).json(
      success(
        {
          user: userInfo,
          token,
        },
        '登录成功'
      )
    );
  } catch (e) {
    console.error('[API Error]', e);
    return res.status(500).json(error('服务器内部错误', 500));
  }
}
