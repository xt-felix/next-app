/**
 * 发送邮箱验证码 API
 * POST /api/auth/send-code
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmailVerificationCode } from '@/lib/auth/email';
import { db } from '@/lib/auth/db';

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'email-login' } = await request.json();

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 发送验证码
    const result = await sendEmailVerificationCode(email, type);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    // 记录日志
    const user = await db.user.findByEmail(email);
    if (user) {
      await db.auditLog.create({
        userId: user.id,
        action: 'send_verification_code',
        details: `发送${type}验证码到 ${email}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: '验证码已发送，请查收邮件',
    });
  } catch (error) {
    console.error('发送验证码失败：', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
