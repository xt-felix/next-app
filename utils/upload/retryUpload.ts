/**
 * 上传重试工具函数
 * 支持：自动重试、指数退避、错误处理
 */

export interface RetryOptions {
  maxRetries?: number; // 最大重试次数，默认 3
  retryDelay?: number; // 重试延迟（毫秒），默认 1000
  backoff?: boolean; // 是否使用指数退避，默认 true
  onRetry?: (attempt: number, error: Error) => void; // 重试回调
}

/**
 * 带重试的上传函数
 * 
 * 重试策略：
 * 1. 固定延迟：每次重试等待相同时间
 * 2. 指数退避：每次重试等待时间递增（1s, 2s, 4s...）
 */
export async function retryUpload<T>(
  uploadFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoff = true,
    onRetry,
  } = options;

  let attempt = 0;
  let delay = retryDelay;

  while (attempt < maxRetries) {
    try {
      return await uploadFn();
    } catch (error) {
      attempt++;

      // 达到最大重试次数，抛出错误
      if (attempt >= maxRetries) {
        throw error;
      }

      // 调用重试回调
      if (onRetry && error instanceof Error) {
        onRetry(attempt, error);
      }

      // 等待后重试
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 指数退避：延迟时间翻倍
      if (backoff) {
        delay *= 2;
      }
    }
  }

  throw new Error('重试失败');
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

