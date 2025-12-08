/**
 * 数据校验工具
 * 知识点：使用 Zod 进行类型安全的参数校验
 * 优势：类型推导 + 运行时校验 = 更安全的 API
 */

import { z } from 'zod';

/**
 * 商品创建/更新校验规则
 */
export const productSchema = z.object({
  name: z.string().min(2, '商品名至少 2 个字符').max(50, '商品名最多 50 个字符'),
  price: z.number().positive('价格必须大于 0').max(999999, '价格超出范围'),
  description: z.string().max(500, '描述最多 500 个字符').optional(),
  image: z.string().url('图片必须是有效的 URL').optional(),
  stock: z.number().int('库存必须是整数').min(0, '库存不能为负').optional(),
});

/**
 * 用户登录校验规则
 */
export const loginSchema = z.object({
  username: z.string().min(3, '用户名至少 3 个字符').max(20, '用户名最多 20 个字符'),
  password: z.string().min(6, '密码至少 6 个字符').max(50, '密码最多 50 个字符'),
});

/**
 * 用户注册校验规则
 */
export const registerSchema = z.object({
  username: z.string().min(3, '用户名至少 3 个字符').max(20, '用户名最多 20 个字符'),
  password: z.string().min(6, '密码至少 6 个字符').max(50, '密码最多 50 个字符'),
  email: z.string().email('邮箱格式不正确').optional(),
});

/**
 * 分页参数校验
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

/**
 * ID 参数校验
 */
export const idSchema = z.object({
  id: z.number().int().positive('ID 必须是正整数'),
});

/**
 * 通用校验函数
 * @param schema Zod 校验规则
 * @param data 待校验数据
 * @returns 校验结果
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}
