'use server';

import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * 文件记录类型
 */
interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadTime: string;
  userId: string;
  path: string;
}

// 模拟数据库存储
let files: FileRecord[] = [];

// 模拟获取用户 session
async function getSession() {
  return {
    user: { id: 'demo-user', name: 'Demo User' },
  };
}

/**
 * 获取文件列表
 */
export async function getFiles() {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  return files
    .filter(f => f.userId === session.user.id)
    .sort((a, b) => b.uploadTime.localeCompare(a.uploadTime));
}

/**
 * 上传文件
 * 演示：文件上传 + FormData 处理 + 文件校验
 */
export async function uploadFile(formData: FormData) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录，无法上传文件');
  }

  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('请选择要上传的文件');
  }

  // 文件大小校验（限制 5MB）
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('文件大小不能超过 5MB');
  }

  // 文件类型校验（仅允许图片）
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('仅支持上传图片文件（JPEG, PNG, GIF, WebP）');
  }

  try {
    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${ext}`;

    // 保存文件到 public/uploads 目录
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsDir, fileName);

    // 创建目录（如果不存在）
    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      // 如果目录不存在，先创建目录
      const { mkdir } = await import('fs/promises');
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(filePath, buffer);
    }

    // 创建文件记录
    const fileRecord: FileRecord = {
      id: timestamp.toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadTime: new Date().toISOString(),
      userId: session.user.id,
      path: `/uploads/${fileName}`,
    };

    files.push(fileRecord);

    // 刷新页面
    revalidatePath('/13-server-actions/upload');

    return { success: true, file: fileRecord };
  } catch (error) {
    console.error('文件上传失败:', error);
    throw new Error('文件上传失败，请重试');
  }
}

/**
 * 删除文件
 * 演示：文件删除 + 权限校验
 */
export async function deleteFile(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  const fileIndex = files.findIndex(
    f => f.id === id && f.userId === session.user.id
  );

  if (fileIndex === -1) {
    throw new Error('文件不存在或无权删除');
  }

  // 删除文件记录
  const file = files[fileIndex];
  files.splice(fileIndex, 1);

  // 注意：实际项目中应该同时删除服务器上的物理文件
  // 这里为了演示简化，只删除记录

  revalidatePath('/13-server-actions/upload');

  return { success: true };
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
