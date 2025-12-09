/**
 * 登录 API
 * POST /api/auth/login
 *
 * 知识点：
 * 1. API Routes 处理 POST 请求
 * 2. 请求体解析
 * 3. JWT Token 生成（简化版）
 * 4. 错误处理
 */

import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据库
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' },
];

/**
 * 简化版 JWT Token 生成
 * 实际项目应使用 jsonwebtoken 库
 */
function generateToken(username: string, role: string): string {
  const payload = {
    username,
    role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24小时过期
  };
  // 注意：这里为了演示简化了，实际项目应使用 jsonwebtoken
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * POST /api/auth/login
 * 用户登录
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body = await request.json();
    const { username, password } = body;

    // 2. 参数验证
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: '用户名和密码不能为空',
        },
        { status: 400 }
      );
    }

    // 3. 查找用户
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: '用户名或密码错误',
        },
        { status: 401 }
      );
    }

    // 4. 生成 Token
    const token = generateToken(user.username, user.role);

    // 5. 返回成功响应
    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        username: user.username,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('[登录失败]', error);
    return NextResponse.json(
      {
        success: false,
        message: '登录失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
