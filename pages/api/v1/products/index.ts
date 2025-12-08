/**
 * 商品列表接口（支持分页）
 * 路由：GET /api/v1/products
 * 知识点：
 * 1. RESTful API 设计
 * 2. 分页查询
 * 3. 接口限流
 * 4. 统一响应格式
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/api/database';
import { paginated, error } from '@/lib/api/response';
import { checkRateLimit, getClientIp } from '@/lib/api/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 限流保护：每个 IP 每分钟最多 30 次请求
  const ip = getClientIp(req);
  if (checkRateLimit(ip, 30, 60_000)) {
    return res.status(429).json(error('请求过于频繁，请稍后再试', 429));
  }

  if (req.method === 'GET') {
    try {
      // 解析分页参数
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const keyword = req.query.keyword as string;

      // 校验参数范围
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json(error('分页参数不合法'));
      }

      // 查询数据（支持搜索）
      let result;
      if (keyword) {
        const allItems = db.searchProducts(keyword);
        const start = (page - 1) * limit;
        const end = start + limit;
        result = {
          items: allItems.slice(start, end),
          total: allItems.length,
        };
      } else {
        result = db.getProductsPaginated(page, limit);
      }

      return res.status(200).json(paginated(result.items, result.total, page, limit));
    } catch (e) {
      console.error('[API Error]', e);
      return res.status(500).json(error('服务器内部错误', 500));
    }
  }

  // 不支持的请求方法
  return res.status(405).json(error('不支持的请求方法', 405));
}
