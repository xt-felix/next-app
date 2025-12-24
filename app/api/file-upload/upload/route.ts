/**
 * 基础文件上传 API
 * POST /api/file-upload/upload
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择文件' },
        { status: 400 }
      );
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: '文件大小不能超过 10MB' },
        { status: 400 }
      );
    }

    // 保存文件到 public/uploads 目录
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(path, buffer);

    return NextResponse.json({
      success: true,
      message: '上传成功',
      data: {
        filename,
        url: `/uploads/${filename}`,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('[文件上传失败]', error);
    return NextResponse.json(
      { success: false, message: '上传失败' },
      { status: 500 }
    );
  }
}

