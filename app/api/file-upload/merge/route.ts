/**
 * 合并分块 API
 * POST /api/file-upload/merge
 */
import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, readdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { fileId, fileName, fileType } = await request.json();

    if (!fileId || !fileName) {
      return NextResponse.json(
        { success: false, message: '参数错误' },
        { status: 400 }
      );
    }

    // 读取所有分块
    const tempDir = join(process.cwd(), 'public', 'uploads', 'chunks', fileId);
    if (!existsSync(tempDir)) {
      return NextResponse.json(
        { success: false, message: '分块文件不存在' },
        { status: 404 }
      );
    }

    const files = await readdir(tempDir);
    const chunkFiles = files
      .filter((file) => file.startsWith('chunk-'))
      .sort((a, b) => {
        const indexA = parseInt(a.replace('chunk-', ''));
        const indexB = parseInt(b.replace('chunk-', ''));
        return indexA - indexB;
      });

    // 合并分块
    const chunks = await Promise.all(
      chunkFiles.map((file) => readFile(join(tempDir, file)))
    );
    const mergedBuffer = Buffer.concat(chunks);

    // 保存合并后的文件
    const filename = `${Date.now()}-${fileName}`;
    const outputPath = join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(outputPath, mergedBuffer);

    // 清理临时分块文件
    await rm(tempDir, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: '合并成功',
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('[合并分块失败]', error);
    return NextResponse.json(
      { success: false, message: '合并失败' },
      { status: 500 }
    );
  }
}

