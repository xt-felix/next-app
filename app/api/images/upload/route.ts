/**
 * 图片上传 API
 * POST /api/images/upload
 *
 * 知识点：
 * 1. 处理 multipart/form-data
 * 2. Base64 图片上传（简化版）
 * 3. 身份验证（Token 验证）
 * 4. 文件类型和大小验证
 */

import { NextRequest, NextResponse } from 'next/server';
import { addImage } from '@/data/image-mock/images';

/**
 * 验证 Token（简化版）
 */
function verifyToken(token: string): { username: string; role: string } | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token, 'base64').toString('utf-8')
    );

    // 检查是否过期
    if (payload.exp < Date.now()) {
      return null;
    }

    return {
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * 验证图片类型
 */
function isValidImageType(mimeType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(mimeType);
}

/**
 * POST /api/images/upload
 * 上传图片
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 验证身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: '未授权，请先登录',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token 无效或已过期',
        },
        { status: 401 }
      );
    }

    // 2. 解析表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: '请选择要上传的图片',
        },
        { status: 400 }
      );
    }

    // 3. 验证文件类型
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: '不支持的文件类型，仅支持 jpg、png、gif、webp',
        },
        { status: 400 }
      );
    }

    // 4. 验证文件大小（限制 5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: '文件大小不能超过 5MB',
        },
        { status: 400 }
      );
    }

    // 5. 保存图片信息（实际项目中应保存文件到服务器或云存储）
    const filename = `${Date.now()}-${file.name}`;
    const imageData = addImage({
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      uploadTime: new Date().toISOString(),
      url: `/uploads/${filename}`,
      uploader: user.username,
    });

    // 6. 返回成功响应
    return NextResponse.json({
      success: true,
      message: '上传成功',
      data: imageData,
    });
  } catch (error) {
    console.error('[上传失败]', error);
    return NextResponse.json(
      {
        success: false,
        message: '上传失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
