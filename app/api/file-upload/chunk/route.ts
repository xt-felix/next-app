/**
 * 分块上传 API
 * POST /api/file-upload/chunk
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 存储分块信息的 Map（实际项目中应使用数据库或 Redis）
const chunkStorage = new Map<string, { chunks: number[]; totalChunks: number }>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const fileId = formData.get('fileId') as string;
    const fileName = formData.get('fileName') as string;

    if (!chunk || chunkIndex === undefined || !fileId) {
      return NextResponse.json(
        { success: false, message: '参数错误' },
        { status: 400 }
      );
    }

    // 创建临时目录存储分块
    const tempDir = join(process.cwd(), 'public', 'uploads', 'chunks', fileId);
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // 保存分块文件
    const bytes = await chunk.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const chunkPath = join(tempDir, `chunk-${chunkIndex}`);
    await writeFile(chunkPath, buffer);

    // 更新分块信息
    if (!chunkStorage.has(fileId)) {
      chunkStorage.set(fileId, { chunks: [], totalChunks });
    }
    const info = chunkStorage.get(fileId)!;
    if (!info.chunks.includes(chunkIndex)) {
      info.chunks.push(chunkIndex);
    }

    return NextResponse.json({
      success: true,
      message: `分块 ${chunkIndex + 1}/${totalChunks} 上传成功`,
      uploadedChunks: info.chunks,
    });
  } catch (error) {
    console.error('[分块上传失败]', error);
    return NextResponse.json(
      { success: false, message: '上传失败' },
      { status: 500 }
    );
  }
}

