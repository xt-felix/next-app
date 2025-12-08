/**
 * 商品详情接口
 * 路由：GET /api/v1/products/[id]
 * 知识点：
 * 1. 动态路由参数
 * 2. 错误处理（404）
 * 3. 数据查询
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/api/database';
import { success, error } from '@/lib/api/response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const id = parseInt(req.query.id as string);

      if (isNaN(id) || id < 1) {
        return res.status(400).json(error('商品 ID 不合法'));
      }

      const product = db.getProductById(id);

      if (!product) {
        return res.status(404).json(error('商品不存在', 404));
      }

      return res.status(200).json(success(product));
    } catch (e) {
      console.error('[API Error]', e);
      return res.status(500).json(error('服务器内部错误', 500));
    }
  }

  return res.status(405).json(error('不支持的请求方法', 405));
}
