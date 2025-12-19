/**
 * Zod 验证 Schema 集合
 * 定义各种表单的数据验证规则
 */

import { z } from 'zod';

// ========== 基础表单 Schema ==========

/**
 * 用户注册表单
 * 知识点：
 * - 字符串验证（email、min、max）
 * - 自定义错误消息
 * - 密码确认（refine）
 */
export const basicFormSchema = z
  .object({
    username: z
      .string()
      .min(3, '用户名至少 3 个字符')
      .max(20, '用户名最多 20 个字符')
      .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z
      .string()
      .min(8, '密码至少 8 个字符')
      .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
      .regex(/[a-z]/, '密码必须包含至少一个小写字母')
      .regex(/[0-9]/, '密码必须包含至少一个数字'),
    confirmPassword: z.string(),
    age: z.number().int().min(18, '必须年满 18 岁').max(100, '年龄不能超过 100'),
    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: '请选择性别' }),
    }),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: '必须同意服务条款',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export type BasicFormData = z.infer<typeof basicFormSchema>;

// ========== 多步骤表单 Schema ==========

/**
 * 多步骤表单 - 第一步：个人信息
 */
export const multiStepFormStep1Schema = z.object({
  firstName: z.string().min(1, '请输入名字'),
  lastName: z.string().min(1, '请输入姓氏'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号')
    .optional()
    .or(z.literal('')),
});

/**
 * 多步骤表单 - 第二步：地址信息
 */
export const multiStepFormStep2Schema = z.object({
  country: z.string().min(1, '请选择国家'),
  province: z.string().min(1, '请选择省份'),
  city: z.string().min(1, '请选择城市'),
  address: z.string().min(5, '详细地址至少 5 个字符'),
  zipCode: z.string().regex(/^\d{6}$/, '邮政编码格式错误').optional().or(z.literal('')),
});

/**
 * 多步骤表单 - 第三步：账户信息
 */
export const multiStepFormStep3Schema = z
  .object({
    username: z
      .string()
      .min(3, '用户名至少 3 个字符')
      .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
    password: z.string().min(8, '密码至少 8 个字符'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

/**
 * 完整的多步骤表单 Schema
 */
export const multiStepFormSchema = z.object({
  ...multiStepFormStep1Schema.shape,
  ...multiStepFormStep2Schema.shape,
  ...multiStepFormStep3Schema.shape,
});

export type MultiStepFormData = z.infer<typeof multiStepFormSchema>;

// ========== 动态字段表单 Schema ==========

/**
 * 动态字段表单 - 工作经历
 */
export const workExperienceSchema = z.object({
  company: z.string().min(1, '请输入公司名称'),
  position: z.string().min(1, '请输入职位'),
  startDate: z.string().min(1, '请选择开始日期'),
  endDate: z.string().optional().or(z.literal('')),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

export const dynamicFormSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.string().email('请输入有效的邮箱地址'),
  workExperience: z.array(workExperienceSchema).min(1, '至少添加一份工作经历'),
});

export type DynamicFormData = z.infer<typeof dynamicFormSchema>;

// ========== 文件上传表单 Schema ==========

/**
 * 文件上传表单
 * 知识点：自定义文件验证
 */
export const fileUploadSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  description: z.string().optional(),
  category: z.enum(['image', 'document', 'video', 'other'], {
    errorMap: () => ({ message: '请选择分类' }),
  }),
  files: z
    .custom<FileList>()
    .refine(files => files.length > 0, '请至少选择一个文件')
    .refine(files => files.length <= 5, '最多上传 5 个文件')
    .refine(
      files => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        return Array.from(files).every(file => file.size <= maxSize);
      },
      '单个文件大小不能超过 10MB'
    ),
});

export type FileUploadFormData = z.infer<typeof fileUploadSchema>;

// ========== 审批流表单 Schema ==========

/**
 * 审批流表单 - 请假申请
 */
export const approvalFormSchema = z.object({
  type: z.enum(['annual', 'sick', 'personal', 'other'], {
    errorMap: () => ({ message: '请选择请假类型' }),
  }),
  startDate: z.string().min(1, '请选择开始日期'),
  endDate: z.string().min(1, '请选择结束日期'),
  reason: z.string().min(10, '请假理由至少 10 个字符').max(500, '请假理由最多 500 个字符'),
  urgency: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: '请选择紧急程度' }),
  }),
  attachments: z
    .custom<FileList>()
    .optional()
    .refine(
      files => {
        if (!files || files.length === 0) return true;
        return files.length <= 3;
      },
      '最多上传 3 个附件'
    ),
});

export type ApprovalFormData = z.infer<typeof approvalFormSchema>;

// ========== 批量导入 Schema ==========

/**
 * 批量导入 - 单条用户数据
 */
export const batchImportUserSchema = z.object({
  username: z.string().min(3, '用户名至少 3 个字符'),
  email: z.string().email('邮箱格式错误'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '手机号格式错误').optional().or(z.literal('')),
  department: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
});

/**
 * 批量导入 - 完整数据
 */
export const batchImportSchema = z.object({
  users: z.array(batchImportUserSchema).min(1, '至少导入一条数据').max(100, '单次最多导入 100 条数据'),
});

export type BatchImportData = z.infer<typeof batchImportSchema>;

// ========== 自动保存表单 Schema ==========

/**
 * 自动保存表单 - 文章草稿
 */
export const autoSaveFormSchema = z.object({
  title: z.string().min(1, '请输入标题').max(100, '标题最多 100 个字符'),
  content: z.string().min(10, '内容至少 10 个字符').max(10000, '内容最多 10000 个字符'),
  tags: z.array(z.string()).max(5, '最多添加 5 个标签').optional(),
  category: z.string().min(1, '请选择分类'),
  isPublished: z.boolean().default(false),
});

export type AutoSaveFormData = z.infer<typeof autoSaveFormSchema>;

// ========== 通用工具函数 ==========

/**
 * 获取 Zod 错误消息
 */
export function getZodErrorMessage(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach(err => {
    if (err.path.length > 0) {
      errors[err.path.join('.')] = err.message;
    }
  });
  return errors;
}

/**
 * 验证数据并返回结果
 */
export function validateData<T>(schema: z.Schema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: getZodErrorMessage(result.error) };
  }
}
