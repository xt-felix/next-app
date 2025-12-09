/**
 * 图片列表 API
 * GET /api/images/list
 *
 * 知识点：
 * 1. 处理 GET 请求
 * 2. URL 参数解析（分页）
 * 3. 数据筛选和排序
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllImages } from '@/data/image-mock/images';

/**
 * GET /api/images/list
 * 获取图片列表
 *
 * 查询参数：
 * - page: 页码（默认 1）
 * - pageSize: 每页数量（默认 10）
 */
export async function GET(request: NextRequest) {
  try {
    // 1. 解析查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 2. 参数验证
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        {
          success: false,
          message: '参数错误',
        },
        { status: 400 }
      );
    }

    // 3. 获取所有图片
    const allImages = getAllImages();

    // 4. 分页计算
    const total = allImages.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const images = allImages.slice(startIndex, endIndex);

    // 5. 返回响应
    return NextResponse.json({
      success: true,
      message: '获取成功',
      data: {
        images,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('[获取图片列表失败]', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
