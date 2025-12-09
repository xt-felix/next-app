import { NextResponse } from 'next/server';
import { generateReportData, delay } from '@/data/cache-mock/report';

/**
 * 模拟报表数据 API
 *
 * GET /api/mock-report
 *
 * 功能：
 * - 模拟延迟（500ms）
 * - 返回随机生成的报表数据
 * - 用于演示 Data Cache 效果
 *
 * 使用方式：
 * const res = await fetch('/api/mock-report', {
 *   next: { revalidate: 60, tags: ['report'] }
 * });
 */
export async function GET() {
  // 模拟数据库查询延迟
  await delay(500);

  const data = generateReportData();

  return NextResponse.json({
    success: true,
    data,
    message: '报表数据获取成功',
  });
}
