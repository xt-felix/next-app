/**
 * 受保护的 API Route 示例
 * GET /api/protected - 需要登录
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // 未登录
  if (!session) {
    return NextResponse.json(
      { error: '未认证，请先登录' },
      { status: 401 }
    );
  }

  // 返回受保护的数据
  return NextResponse.json({
    message: '这是受保护的数据',
    user: session.user,
    timestamp: new Date().toISOString(),
  });
}
