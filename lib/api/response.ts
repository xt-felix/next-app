/**
 * 统一 API 响应格式
 * 知识点：规范化响应结构，便于前端统一处理
 */

export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
  timestamp?: number;
}

/**
 * 成功响应
 * @param data 响应数据
 * @param message 成功提示信息
 */
export function success<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
    timestamp: Date.now(),
  };
}

/**
 * 错误响应
 * @param message 错误信息
 * @param code 错误码（0 为成功，非 0 为错误）
 */
export function error(message: string, code = 1): ApiResponse {
  return {
    code,
    message,
    timestamp: Date.now(),
  };
}

/**
 * 分页响应
 * @param items 数据列表
 * @param total 总数
 * @param page 当前页
 * @param limit 每页条数
 */
export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): ApiResponse<{ items: T[]; total: number; page: number; limit: number; hasMore: boolean }> {
  return success({
    items,
    total,
    page,
    limit,
    hasMore: page * limit < total,
  });
}
