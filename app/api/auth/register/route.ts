/**
 * 用户注册 API
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/auth/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要 6 个字符' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    const existingUser = await db.user.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await db.user.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      emailVerified: false,
      mfaEnabled: false,
    });

    // 记录日志
    await db.auditLog.create({
      userId: user.id,
      action: 'register',
      details: `用户注册：${email}`,
    });

    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('注册失败：', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
