import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * 缓存刷新 API
 *
 * POST /api/cache-revalidate
 *
 * Body 参数：
 * - path: string (可选) - 要刷新的路径，如 '/cache-dashboard'
 * - tag: string (可选) - 要刷新的标签，如 'report'
 * - secret: string (必需) - 安全密钥，防止未授权刷新
 *
 * 功能：
 * - 手动刷新指定路径的缓存
 * - 手动刷新指定标签的所有缓存
 * - 权限验证（通过 secret）
 *
 * 使用示例：
 * await fetch('/api/cache-revalidate', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     tag: 'report',
 *     secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET
 *   })
 * });
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // 1. 权限验证
    const validSecret = process.env.REVALIDATE_SECRET || 'my-secret-key-123';

    if (!secret || secret !== validSecret) {
      return NextResponse.json(
        {
          success: false,
          message: '无权限：secret 验证失败',
        },
        { status: 401 }
      );
    }

    // 2. 刷新指定路径
    if (path) {
      revalidatePath(path);
      console.log(`[Cache Revalidate] 路径已刷新: ${path}`);
    }

    // 3. 刷新指定标签
    if (tag) {
      revalidateTag(tag);
      console.log(`[Cache Revalidate] 标签已刷新: ${tag}`);
    }

    // 4. 返回成功响应
    return NextResponse.json({
      success: true,
      revalidated: true,
      path: path || null,
      tag: tag || null,
      timestamp: new Date().toISOString(),
      message: '缓存刷新成功',
    });
  } catch (error) {
    console.error('[Cache Revalidate Error]', error);

    return NextResponse.json(
      {
        success: false,
        message: '缓存刷新失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
