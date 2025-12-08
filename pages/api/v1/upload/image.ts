/**
 * 图片上传接口（Base64 方式）
 * 路由：POST /api/v1/upload/image
 * 知识点：
 * 1. Base64 图片上传
 * 2. 文件类型校验
 * 3. 文件大小限制
 * 4. 生成唯一文件名
 * 5. 需要登录权限
 *
 * 说明：实际生产环境建议使用 OSS/CDN（如阿里云 OSS、AWS S3）
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { success, error } from '@/lib/api/response';
import { withAuth } from '@/lib/api/auth';
import fs from 'fs';
import path from 'path';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(error('不支持的请求方法', 405));
  }

  try {
    const { image, filename } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json(error('缺少图片数据'));
    }

    // 解析 Base64 数据
    let base64Data: string;
    let mimeType: string;

    if (image.startsWith('data:')) {
      // 格式：data:image/png;base64,iVBORw0KG...
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json(error('图片格式不正确'));
      }
      mimeType = matches[1];
      base64Data = matches[2];
    } else {
      // 纯 Base64
      base64Data = image;
      mimeType = 'image/jpeg'; // 默认
    }

    // 校验文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json(error('只支持 JPEG、PNG、GIF、WebP 格式'));
    }

    // 转换为 Buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // 校验文件大小（最大 5MB）
    const maxSize = 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return res.status(400).json(error('图片大小不能超过 5MB'));
    }

    // 生成唯一文件名
    const ext = mimeType.split('/')[1];
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, uniqueName);

    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 保存文件
    fs.writeFileSync(filePath, buffer);

    // 返回访问 URL
    const url = `/uploads/${uniqueName}`;
    return res.status(200).json(success({ url, filename: uniqueName }, '上传成功'));
  } catch (e) {
    console.error('[API Error]', e);
    return res.status(500).json(error('服务器内部错误', 500));
  }
}

// 导出时包裹鉴权中间件
export default withAuth(handler);
