/**
 * 商品管理接口（需要管理员权限）
 * 路由：POST /api/v1/products/manage - 创建商品
 *      PUT /api/v1/products/manage - 更新商品
 *      DELETE /api/v1/products/manage - 删除商品
 * 知识点：
 * 1. 权限控制（管理员）
 * 2. 数据校验（Zod）
 * 3. 多种 HTTP 方法处理
 * 4. JWT 鉴权中间件
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/api/database';
import { success, error } from '@/lib/api/response';
import { productSchema, validate } from '@/lib/api/validate';
import { withAdmin } from '@/lib/api/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST - 创建商品
  if (req.method === 'POST') {
    try {
      // 校验请求体
      const result = validate(productSchema, req.body);
      if (!result.success) {
        return res.status(400).json(error(result.error.issues[0].message));
      }

      // 创建商品
      const product = db.createProduct(result.data);
      return res.status(201).json(success(product, '商品创建成功'));
    } catch (e) {
      console.error('[API Error]', e);
      return res.status(500).json(error('服务器内部错误', 500));
    }
  }

  // PUT - 更新商品
  if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;

      if (!id || typeof id !== 'number') {
        return res.status(400).json(error('缺少商品 ID'));
      }

      // 校验更新数据
      const result = validate(productSchema.partial(), data);
      if (!result.success) {
        return res.status(400).json(error(result.error.issues[0].message));
      }

      const product = db.updateProduct(id, result.data);
      if (!product) {
        return res.status(404).json(error('商品不存在', 404));
      }

      return res.status(200).json(success(product, '商品更新成功'));
    } catch (e) {
      console.error('[API Error]', e);
      return res.status(500).json(error('服务器内部错误', 500));
    }
  }

  // DELETE - 删除商品
  if (req.method === 'DELETE') {
    try {
      const id = parseInt(req.query.id as string);

      if (isNaN(id) || id < 1) {
        return res.status(400).json(error('商品 ID 不合法'));
      }

      const deleted = db.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json(error('商品不存在', 404));
      }

      return res.status(200).json(success(null, '商品删除成功'));
    } catch (e) {
      console.error('[API Error]', e);
      return res.status(500).json(error('服务器内部错误', 500));
    }
  }

  return res.status(405).json(error('不支持的请求方法', 405));
}

// 导出时包裹管理员权限中间件
export default withAdmin(handler);
