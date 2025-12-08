/**
 * 幂等性工具
 * 知识点：防止重复提交，保证接口幂等性
 * 应用场景：订单创建、支付、退款等关键操作
 */

interface IdempotencyEntry {
  timestamp: number;
}

// 存储幂等性键
const idempotencyMap = new Map<string, IdempotencyEntry>();

/**
 * 检查是否为重复请求
 * @param key 幂等性键（通常由前端生成唯一 ID）
 * @param windowMs 时间窗口（毫秒），超过此时间自动过期
 * @returns true 表示重复请求，false 表示正常
 */
export function isDuplicateRequest(key: string, windowMs = 60_000): boolean {
  const entry = idempotencyMap.get(key);
  const now = Date.now();

  if (!entry) {
    // 首次请求，记录幂等性键
    idempotencyMap.set(key, { timestamp: now });
    // 自动清理过期记录
    setTimeout(() => idempotencyMap.delete(key), windowMs);
    return false;
  }

  // 检查是否在时间窗口内
  if (now - entry.timestamp <= windowMs) {
    return true; // 重复请求
  }

  // 过期，更新时间戳
  idempotencyMap.set(key, { timestamp: now });
  setTimeout(() => idempotencyMap.delete(key), windowMs);
  return false;
}

/**
 * 从请求头提取幂等性键
 * @param req NextApiRequest
 */
export function extractIdempotencyKey(req: any): string | null {
  return req.headers['x-idempotency-key'] as string || null;
}

/**
 * 清理所有幂等性记录（可用于测试）
 */
export function clearIdempotencyCache(): void {
  idempotencyMap.clear();
}
