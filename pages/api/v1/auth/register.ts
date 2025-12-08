/**
 * 用户注册接口
 * 路由：POST /api/v1/auth/register
 * 知识点：
 * 1. 用户注册流程
 * 2. 数据校验
 * 3. 防止重复注册
 * 4. 密码加密（实际应使用 bcrypt）
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/api/database';
import { success, error } from '@/lib/api/response';
import { registerSchema, validate } from '@/lib/api/validate';
import { generateToken } from '@/lib/api/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(error('不支持的请求方法', 405));
  }

  try {
    // 校验请求体
    const result = validate(registerSchema, req.body);
    if (!result.success) {
      return res.status(400).json(error(result.error.issues[0].message));
    }

    const { username, password, email } = result.data;

    // 检查用户名是否已存在
    const existingUser = db.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json(error('用户名已存在', 409));
    }

    // 创建用户（实际应使用 bcrypt.hash 加密密码）
    const user = db.createUser({
      username,
      password, // 实际应加密
      email,
      role: 'user', // 默认为普通用户
    });

    // 生成 JWT Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // 返回用户信息和 Token（不返回密码）
    const { password: _, ...userInfo } = user;
    return res.status(201).json(
      success(
        {
          user: userInfo,
          token,
        },
        '注册成功'
      )
    );
  } catch (e) {
    console.error('[API Error]', e);
    return res.status(500).json(error('服务器内部错误', 500));
  }
}
