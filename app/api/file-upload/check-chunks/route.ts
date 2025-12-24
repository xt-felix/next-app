/**
 * 检查已上传的分块（断点续传）
 * POST /api/file-upload/check-chunks
 */
import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { fileId, totalChunks } = await request.json();

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: '参数错误' },
        { status: 400 }
      );
    }

    // 检查临时目录是否存在
    const tempDir = join(process.cwd(), 'public', 'uploads', 'chunks', fileId);
    if (!existsSync(tempDir)) {
      return NextResponse.json({
        success: true,
        uploadedChunks: [],
      });
    }

    // 读取已上传的分块文件
    const files = await readdir(tempDir);
    const uploadedChunks = files
      .filter((file) => file.startsWith('chunk-'))
      .map((file) => parseInt(file.replace('chunk-', '')))
      .sort((a, b) => a - b);

    return NextResponse.json({
      success: true,
      uploadedChunks,
    });
  } catch (error) {
    console.error('[检查分块失败]', error);
    return NextResponse.json(
      { success: false, message: '检查失败' },
      { status: 500 }
    );
  }
}

