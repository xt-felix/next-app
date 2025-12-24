import { NextResponse } from 'next/server';

/**
 * 模拟用户 API
 * 
 * 用于 SWR 示例
 */
export async function GET() {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    name: '李四',
    email: 'lisi@example.com',
    avatar: 'https://via.placeholder.com/100',
  });
}

