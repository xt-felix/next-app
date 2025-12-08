/**
 * 接口限流工具
 * 知识点：防止恶意刷接口，保护服务器资源
 * 实现原理：基于内存的滑动窗口算法
 */

interface RateLimitEntry {
  count: number;
  lastReset: number;
}

// 存储每个 IP 的请求记录
const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * 检查是否触发限流
 * @param identifier 标识符（通常是 IP 地址）
 * @param limit 时间窗口内最大请求次数
 * @param windowMs 时间窗口（毫秒）
 * @returns true 表示触发限流，false 表示正常
 */
export function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // 如果没有记录或窗口已过期，重置计数
  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return false;
  }

  // 如果超过限制，返回 true
  if (entry.count >= limit) {
    return true;
  }

  // 增加计数
  entry.count++;
  return false;
}

/**
 * 清理过期的限流记录（可定期调用）
 * @param windowMs 时间窗口
 */
export function cleanupRateLimit(windowMs = 60_000): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > windowMs * 2) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * 获取客户端 IP 地址
 * @param req NextApiRequest
 */
export function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.socket?.remoteAddress || 'unknown';
  return ip;
}

// 定期清理过期记录（每 5 分钟）
if (typeof window === 'undefined') {
  setInterval(() => cleanupRateLimit(), 5 * 60_000);
}
