/**
 * 管理员专用 API Route
 * GET /api/admin/users - 获取所有用户（仅管理员）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/auth/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // 未登录
  if (!session) {
    return NextResponse.json(
      { error: '未认证，请先登录' },
      { status: 401 }
    );
  }

  // 非管理员
  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { error: '无权限，仅管理员可访问' },
      { status: 403 }
    );
  }

  // 获取所有用户
  const users = await db.user.findAll();

  // 移除敏感信息
  const safeUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    mfaEnabled: user.mfaEnabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return NextResponse.json({ users: safeUsers });
}
