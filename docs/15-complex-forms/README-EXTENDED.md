# 第十五章：复杂表单处理与数据校验 - 完整实战指南

> 📚 **基于真实项目的完整教程**：从基础到企业级的表单开发
>
> 🎯 **核心技术**：React Hook Form + Zod + TypeScript
>
> 💻 **项目地址**：`/15-complex-forms`
>
> ⏱️ **学习周期**：3-5 天，包含 7 个完整实战案例

---

## 📖 目录

- [快速开始](#快速开始)
- [案例 1：基础表单](#案例-1基础表单)
- [案例 2：多步骤表单](#案例-2多步骤表单)
- [案例 3：动态字段表单](#案例-3动态字段表单)
- [案例 4：文件上传表单](#案例-4文件上传表单)
- [案例 5：审批流表单](#案例-5审批流表单)
- [案例 6：批量导入](#案例-6批量导入)
- [案例 7：自动保存](#案例-7自动保存)
- [完整 API 参考](#完整-api-参考)
- [最佳实践总结](#最佳实践总结)

---

## 快速开始

### 1. 访问项目

```bash
# 启动开发服务器
npm run dev

# 访问主导航页
http://localhost:3000/15-complex-forms
```

### 2. 项目结构

```
app/15-complex-forms/
├── page.tsx              # 主导航页（所有案例入口）
├── basic/                # 案例 1：基础表单
│   └── page.tsx
├── multi-step/           # 案例 2：多步骤表单
│   └── page.tsx
├── dynamic/              # 案例 3：动态字段
│   └── page.tsx
├── upload/               # 案例 4：文件上传
│   └── page.tsx
├── approval/             # 案例 5：审批流
│   └── page.tsx
├── batch-import/         # 案例 6：批量导入
│   └── page.tsx
└── auto-save/            # 案例 7：自动保存
    └── page.tsx

lib/forms/
└── schemas.ts            # 所有 Zod Schema 定义
```

---

## 案例 1：基础表单

### 📝 案例简介

**访问路径**：`/15-complex-forms/basic`

**难度**：⭐ 入门

**学习时间**：30 分钟

**知识点**：
- React Hook Form 基础用法
- Zod Schema 验证
- 表单错误处理
- 提交状态管理

### 🎯 功能特性

| 特性 | 说明 |
|------|------|
| **字段类型** | 文本、邮箱、密码、数字、单选、复选框 |
| **验证规则** | 必填、长度、格式、自定义正则、跨字段验证 |
| **用户体验** | 实时错误提示、提交中状态、表单重置 |
| **代码量** | 约 315 行 |

### 💻 完整代码解析

#### 1. Schema 定义

**文件位置**：`lib/forms/schemas.ts`

```typescript
export const basicFormSchema = z
  .object({
    // 用户名：3-20 字符，仅字母数字下划线
    username: z
      .string()
      .min(3, '用户名至少 3 个字符')
      .max(20, '用户名最多 20 个字符')
      .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),

    // 邮箱：标准格式验证
    email: z.string().email('请输入有效的邮箱地址'),

    // 密码：复杂度验证
    password: z
      .string()
      .min(8, '密码至少 8 个字符')
      .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
      .regex(/[a-z]/, '密码必须包含至少一个小写字母')
      .regex(/[0-9]/, '密码必须包含至少一个数字'),

    confirmPassword: z.string(),

    // 年龄：18-100 之间的整数
    age: z.number().int().min(18, '必须年满 18 岁').max(100, '年龄不能超过 100'),

    // 性别：枚举类型
    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: '请选择性别' }),
    }),

    // 同意条款：必须为 true
    acceptTerms: z.boolean().refine(val => val === true, {
      message: '必须同意服务条款',
    }),
  })
  // 跨字段验证：两次密码必须一致
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'], // 错误显示在 confirmPassword 字段
  });

// 自动类型推断
export type BasicFormData = z.infer<typeof basicFormSchema>;
```

**关键知识点：**

1. **链式验证**：多个验证规则依次执行
   ```typescript
   z.string()
     .min(3)      // 先验证最小长度
     .max(20)     // 再验证最大长度
     .regex(/.../) // 最后验证格式
   ```

2. **自定义错误消息**：每个验证都可以自定义错误
   ```typescript
   .min(3, '用户名至少 3 个字符') // 自定义错误消息
   ```

3. **refine 跨字段验证**：访问完整表单数据
   ```typescript
   .refine(data => data.password === data.confirmPassword, {
     message: '两次输入的密码不一致',
     path: ['confirmPassword'], // 指定错误字段
   })
   ```

#### 2. 表单组件

**文件位置**：`app/15-complex-forms/basic/page.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicFormSchema, type BasicFormData } from '@/lib/forms/schemas';
import { useState } from 'react';

export default function BasicFormPage() {
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  // 初始化表单
  const {
    register,           // 注册字段
    handleSubmit,       // 提交处理
    formState: {
      errors,           // 验证错误
      isSubmitting,     // 提交状态
    },
    reset,              // 重置表单
  } = useForm<BasicFormData>({
    resolver: zodResolver(basicFormSchema), // 使用 Zod 验证
    defaultValues: {    // 默认值
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      gender: 'male',
      acceptTerms: false,
    },
  });

  // 提交处理
  const onSubmit = async (data: BasicFormData) => {
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('表单数据：', data);
      setSubmitResult('提交成功！');

      // 重置表单
      reset();
    } catch (error) {
      setSubmitResult('提交失败，请重试');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 用户名字段 */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            用户名 *
          </label>
          <input
            {...register('username')}
            type="text"
            id="username"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.username
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {/* 错误提示 */}
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
          {/* 帮助文本 */}
          <p className="mt-1 text-xs text-gray-500">
            3-20 个字符，只能包含字母、数字和下划线
          </p>
        </div>

        {/* 邮箱字段 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            邮箱地址 *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* 密码字段 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            密码 *
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            至少 8 个字符，包含大小写字母和数字
          </p>
        </div>

        {/* 确认密码 */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            确认密码 *
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.confirmPassword
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* 年龄 */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            年龄 *
          </label>
          <input
            {...register('age', { valueAsNumber: true })} // 自动转换为数字
            type="number"
            id="age"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.age
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
        </div>

        {/* 性别单选框 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">性别 *</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                {...register('gender')}
                type="radio"
                id="male"
                value="male"
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="male" className="ml-2 text-sm text-gray-700">
                男
              </label>
            </div>
            <div className="flex items-center">
              <input
                {...register('gender')}
                type="radio"
                id="female"
                value="female"
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="female" className="ml-2 text-sm text-gray-700">
                女
              </label>
            </div>
            <div className="flex items-center">
              <input
                {...register('gender')}
                type="radio"
                id="other"
                value="other"
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="other" className="ml-2 text-sm text-gray-700">
                其他
              </label>
            </div>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* 同意条款复选框 */}
        <div>
          <div className="flex items-center">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              id="acceptTerms"
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
              我已阅读并同意 <span className="text-blue-600">服务条款</span> 和{' '}
              <span className="text-blue-600">隐私政策</span> *
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '提交中...' : '提交'}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            重置
          </button>
        </div>

        {/* 提交结果 */}
        {submitResult && (
          <div
            className={`p-4 rounded-md ${
              submitResult.includes('成功')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {submitResult}
          </div>
        )}
      </form>
    </div>
  );
}
```

### 🔍 关键知识点详解

#### 1. register() 的作用

```typescript
<input {...register('username')} />

// 等价于展开后：
<input
  name="username"
  ref={...}            // 绑定 ref
  onChange={...}       // 处理变化
  onBlur={...}         // 处理失焦
/>
```

**为什么使用 `...register()`？**
- ✅ 自动管理字段值
- ✅ 自动绑定 onChange 事件
- ✅ 最小化渲染（非受控组件）
- ✅ 简化代码

#### 2. valueAsNumber 自动转换

```typescript
// ❌ 不使用 valueAsNumber
<input {...register('age')} type="number" />
// 提交时 age 是字符串 "18"

// ✅ 使用 valueAsNumber
<input {...register('age', { valueAsNumber: true })} type="number" />
// 提交时 age 是数字 18
```

#### 3. 错误显示模式

```typescript
{/* 模式 1：条件渲染（推荐） */}
{errors.username && (
  <p className="text-red-600">{errors.username.message}</p>
)}

{/* 模式 2：可选链 */}
<p className="text-red-600">
  {errors.username?.message || ''}
</p>

{/* 模式 3：三元运算符 */}
<p className="text-red-600">
  {errors.username ? errors.username.message : ''}
</p>
```

#### 4. 动态样式

```typescript
className={`
  mt-1 block w-full rounded-md shadow-sm
  ${errors.username
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }
`}
```

### 🎯 练习任务

完成以下任务以巩固知识：

#### 任务 1：添加手机号字段

```typescript
// 1. 在 Schema 中添加
phone: z
  .string()
  .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码')
  .optional(),

// 2. 在表单中添加字段
<input {...register('phone')} type="tel" />
{errors.phone && <p>{errors.phone.message}</p>}
```

#### 任务 2：添加密码强度提示

```typescript
const password = watch('password'); // 监听密码字段

const getPasswordStrength = (pwd: string) => {
  if (!pwd) return '';
  if (pwd.length < 6) return '弱';
  if (pwd.length < 10) return '中';
  return '强';
};

// 在密码字段下方显示
{password && (
  <p className={`text-sm ${
    getPasswordStrength(password) === '强' ? 'text-green-600' :
    getPasswordStrength(password) === '中' ? 'text-yellow-600' :
    'text-red-600'
  }`}>
    密码强度：{getPasswordStrength(password)}
  </p>
)}
```

#### 任务 3：添加异步用户名验证

```typescript
username: z
  .string()
  .min(3)
  .refine(
    async (username) => {
      const response = await fetch(`/api/check-username?username=${username}`);
      const { exists } = await response.json();
      return !exists;
    },
    { message: '用户名已存在' }
  ),
```

---

## 案例 2：多步骤表单

### 📝 案例简介

**访问路径**：`/15-complex-forms/multi-step`

**难度**：⭐⭐ 中级

**学习时间**：1-2 小时

**知识点**：
- 分步验证
- 数据暂存
- 进度条显示
- 步骤导航

### 🎯 功能特性

| 特性 | 说明 |
|------|------|
| **步骤数量** | 3 步（个人信息 → 地址信息 → 账户信息） |
| **数据暂存** | 支持前后切换，数据不丢失 |
| **分步验证** | 每步独立验证，只验证当前步骤字段 |
| **进度可视化** | 进度条、步骤指示器 |

### 💻 Schema 定义

**文件位置**：`lib/forms/schemas.ts`

```typescript
// 步骤 1：个人信息
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

// 步骤 2：地址信息
export const multiStepFormStep2Schema = z.object({
  country: z.string().min(1, '请选择国家'),
  province: z.string().min(1, '请选择省份'),
  city: z.string().min(1, '请选择城市'),
  address: z.string().min(5, '详细地址至少 5 个字符'),
  zipCode: z.string().regex(/^\d{6}$/, '邮政编码格式错误').optional().or(z.literal('')),
});

// 步骤 3：账户信息
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

// 完整 Schema（用于最终提交）
export const multiStepFormSchema = z.object({
  ...multiStepFormStep1Schema.shape,
  ...multiStepFormStep2Schema.shape,
  ...multiStepFormStep3Schema.shape,
});

export type MultiStepFormData = z.infer<typeof multiStepFormSchema>;
```

**知识点：Schema 合并**

```typescript
// 方式 1：使用 ...spread 合并 shape
const completeSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
});

// 方式 2：使用 merge() 方法
const completeSchema = step1Schema.merge(step2Schema);

// 方式 3：使用 extend()
const completeSchema = step1Schema.extend(step2Schema.shape);
```

### 💻 表单组件实现

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  multiStepFormStep1Schema,
  multiStepFormStep2Schema,
  multiStepFormStep3Schema,
  multiStepFormSchema,
  type MultiStepFormData,
} from '@/lib/forms/schemas';

export default function MultiStepFormPage() {
  // 当前步骤（1, 2, 3）
  const [currentStep, setCurrentStep] = useState(1);

  // 已完成步骤的数据暂存
  const [formData, setFormData] = useState<Partial<MultiStepFormData>>({});

  const totalSteps = 3;

  // 根据当前步骤选择 Schema
  const getSchema = () => {
    switch (currentStep) {
      case 1:
        return multiStepFormStep1Schema;
      case 2:
        return multiStepFormStep2Schema;
      case 3:
        return multiStepFormStep3Schema;
      default:
        return multiStepFormStep1Schema;
    }
  };

  // 初始化表单
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    reset,
  } = useForm<MultiStepFormData>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      // 使用暂存的数据作为默认值
      ...formData,
    },
  });

  // 下一步
  const handleNext = async () => {
    // 获取当前步骤需要验证的字段
    const fieldsToValidate = getFieldsForStep(currentStep);

    // 触发验证
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid) {
      // 保存当前步骤的数据
      const currentValues = getValues();
      setFormData(prev => ({ ...prev, ...currentValues }));

      // 进入下一步
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // 上一步
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // 最终提交
  const onSubmit = async (data: MultiStepFormData) => {
    try {
      // 合并所有步骤的数据
      const completeData = { ...formData, ...data };

      // 使用完整 Schema 验证
      const validatedData = multiStepFormSchema.parse(completeData);

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('完整数据：', validatedData);
      alert('注册成功！');

      // 重置
      setFormData({});
      setCurrentStep(1);
      reset();
    } catch (error) {
      alert('提交失败，请检查信息');
    }
  };

  // 获取每个步骤需要验证的字段
  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['country', 'province', 'city', 'address', 'zipCode'];
      case 3:
        return ['username', 'password', 'confirmPassword'];
      default:
        return [];
    }
  };

  // 进度条组件
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            {/* 步骤圆圈 */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold ${
                step === currentStep
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : step < currentStep
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>

            {/* 连接线 */}
            {index < totalSteps - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 步骤标题 */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>个人信息</span>
        <span>地址信息</span>
        <span>账户信息</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">多步骤注册表单</h1>

      <ProgressBar />

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 步骤 1 */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">步骤 1：个人信息</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓氏 *</label>
                  <input {...register('lastName')} className="w-full border rounded px-3 py-2" />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">名字 *</label>
                  <input {...register('firstName')} className="w-full border rounded px-3 py-2" />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">邮箱 *</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">手机号</label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full border rounded px-3 py-2"
                  placeholder="13800138000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          {/* 步骤 2 */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">步骤 2：地址信息</h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">国家 *</label>
                  <select {...register('country')} className="w-full border rounded px-3 py-2">
                    <option value="">请选择</option>
                    <option value="CN">中国</option>
                    <option value="US">美国</option>
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">省份 *</label>
                  <input {...register('province')} className="w-full border rounded px-3 py-2" />
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">城市 *</label>
                  <input {...register('city')} className="w-full border rounded px-3 py-2" />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">详细地址 *</label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">邮政编码</label>
                <input
                  {...register('zipCode')}
                  placeholder="100000"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          )}

          {/* 步骤 3 */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">步骤 3：账户信息</h2>

              <div>
                <label className="block text-sm font-medium mb-1">用户名 *</label>
                <input {...register('username')} className="w-full border rounded px-3 py-2" />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">密码 *</label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">确认密码 *</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* 数据预览 */}
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">信息确认</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex">
                    <dt className="w-24 text-gray-600">姓名：</dt>
                    <dd>{formData.lastName} {formData.firstName}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 text-gray-600">邮箱：</dt>
                    <dd>{formData.email}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 text-gray-600">地址：</dt>
                    <dd>{formData.country} {formData.province} {formData.city}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* 导航按钮 */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                上一步
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                下一步
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? '提交中...' : '完成注册'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 🔍 关键知识点详解

#### 1. 分步验证

```typescript
// 手动触发验证（只验证指定字段）
const isValid = await trigger(['email', 'phone']);

if (isValid) {
  setCurrentStep(2); // 进入下一步
}
```

#### 2. 数据暂存策略

```typescript
// 方式 1：使用 useState（本案例采用）
const [formData, setFormData] = useState({});

// 方式 2：使用 useFormState
const [formState, setFormState] = useFormState();

// 方式 3：使用 Context
const { saveStepData } = useFormContext();
```

#### 3. 动态 Schema

```typescript
// 根据当前步骤选择不同的 Schema
const getSchema = () => {
  switch (currentStep) {
    case 1: return step1Schema;
    case 2: return step2Schema;
    case 3: return step3Schema;
  }
};

const form = useForm({
  resolver: zodResolver(getSchema()),
});
```

### 🎯 练习任务

#### 任务 1：添加步骤验证进度

```typescript
// 显示每个步骤的验证状态
const [stepStatus, setStepStatus] = useState({
  1: 'pending',  // pending | completed | error
  2: 'pending',
  3: 'pending',
});
```

#### 任务 2：添加步骤跳转

```typescript
// 允许跳转到已完成的步骤
const canJumpToStep = (targetStep: number) => {
  // 只能跳转到当前步骤或已完成步骤
  return targetStep <= currentStep;
};
```

#### 任务 3：添加数据持久化

```typescript
// 保存到 localStorage
useEffect(() => {
  localStorage.setItem('multiStepFormData', JSON.stringify(formData));
}, [formData]);

// 恢复数据
useEffect(() => {
  const saved = localStorage.getItem('multiStepFormData');
  if (saved) {
    setFormData(JSON.parse(saved));
  }
}, []);
```

---

## 案例 3：动态字段表单

### 📝 案例简介

**访问路径**：`/15-complex-forms/dynamic`

**难度**：⭐⭐ 中级

**学习时间**：1-2 小时

**知识点**：
- useFieldArray 使用
- 动态添加/删除字段
- 数组字段验证
- 字段联动

### 🎯 功能特性

| 特性 | 说明 |
|------|------|
| **动态数组** | 添加/删除工作经历、教育经历 |
| **字段联动** | "至今"选项自动隐藏结束日期 |
| **排序功能** | 上移/下移调整顺序 |
| **最小数量** | 至少保留一条记录 |

### 💻 Schema 定义

```typescript
// 单条工作经历
export const workExperienceSchema = z.object({
  company: z.string().min(1, '请输入公司名称'),
  position: z.string().min(1, '请输入职位'),
  startDate: z.string().min(1, '请选择开始日期'),
  endDate: z.string().optional().or(z.literal('')),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

// 完整表单
export const dynamicFormSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.string().email('请输入有效的邮箱地址'),
  workExperience: z.array(workExperienceSchema).min(1, '至少添加一份工作经历'),
});

export type DynamicFormData = z.infer<typeof dynamicFormSchema>;
```

### 💻 表单组件实现

```typescript
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dynamicFormSchema, type DynamicFormData } from '@/lib/forms/schemas';

export default function DynamicFormPage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DynamicFormData>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {
      name: '',
      email: '',
      workExperience: [
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: '',
        },
      ],
    },
  });

  // 管理工作经历数组
  const {
    fields,    // 数组项列表（每项包含唯一 id）
    append,    // 添加项
    remove,    // 删除项
    move,      // 移动项
  } = useFieldArray({
    control,
    name: 'workExperience',
  });

  const onSubmit = (data: DynamicFormData) => {
    console.log('表单数据：', data);
    alert('提交成功！');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">简历编辑器</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 个人信息 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">个人信息</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">姓名 *</label>
                <input {...register('name')} className="w-full border rounded px-3 py-2" />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">邮箱 *</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* 工作经历 */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">工作经历</h2>
              <button
                type="button"
                onClick={() =>
                  append({
                    company: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    isCurrent: false,
                    description: '',
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                + 添加工作经历
              </button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => {
                // 监听 isCurrent 字段
                const isCurrent = watch(`workExperience.${index}.isCurrent`);

                return (
                  <div key={field.id} className="border rounded-lg p-4 relative">
                    {/* 删除按钮（至少保留一条） */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                      >
                        ✕ 删除
                      </button>
                    )}

                    <h3 className="font-medium mb-3">工作经历 #{index + 1}</h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* 公司名称 */}
                      <div>
                        <label className="block text-sm font-medium mb-1">公司名称 *</label>
                        <input
                          {...register(`workExperience.${index}.company`)}
                          className="w-full border rounded px-3 py-2"
                        />
                        {errors.workExperience?.[index]?.company && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.workExperience[index]?.company?.message}
                          </p>
                        )}
                      </div>

                      {/* 职位 */}
                      <div>
                        <label className="block text-sm font-medium mb-1">职位 *</label>
                        <input
                          {...register(`workExperience.${index}.position`)}
                          className="w-full border rounded px-3 py-2"
                        />
                        {errors.workExperience?.[index]?.position && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.workExperience[index]?.position?.message}
                          </p>
                        )}
                      </div>

                      {/* 开始日期 */}
                      <div>
                        <label className="block text-sm font-medium mb-1">开始日期 *</label>
                        <input
                          {...register(`workExperience.${index}.startDate`)}
                          type="date"
                          className="w-full border rounded px-3 py-2"
                        />
                        {errors.workExperience?.[index]?.startDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.workExperience[index]?.startDate?.message}
                          </p>
                        )}
                      </div>

                      {/* 至今复选框 */}
                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            {...register(`workExperience.${index}.isCurrent`)}
                            type="checkbox"
                            className="mr-2"
                          />
                          <span className="text-sm">至今</span>
                        </label>
                      </div>

                      {/* 结束日期（根据 isCurrent 显示/隐藏） */}
                      {!isCurrent && (
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-1">结束日期</label>
                          <input
                            {...register(`workExperience.${index}.endDate`)}
                            type="date"
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      )}

                      {/* 工作描述 */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">工作描述</label>
                        <textarea
                          {...register(`workExperience.${index}.description`)}
                          rows={3}
                          className="w-full border rounded px-3 py-2"
                          placeholder="描述您的工作职责和成就..."
                        />
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="mt-3 flex gap-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => move(index, index - 1)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          ↑ 上移
                        </button>
                      )}
                      {index < fields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => move(index, index + 1)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          ↓ 下移
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 数组级别错误 */}
            {errors.workExperience && (
              <p className="mt-2 text-sm text-red-600">{errors.workExperience.message}</p>
            )}
          </section>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '提交中...' : '提交简历'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 🔍 关键知识点详解

#### 1. useFieldArray 完整 API

```typescript
const {
  fields,    // 数组项列表（每项包含 id）
  append,    // 添加到末尾
  prepend,   // 添加到开头
  insert,    // 插入到指定位置
  remove,    // 删除指定项
  swap,      // 交换两项
  move,      // 移动项
  update,    // 更新指定项
  replace,   // 替换整个数组
} = useFieldArray({
  control,
  name: 'workExperience',
  keyName: 'id', // key 名称（默认 'id'）
});

// 使用示例
append({ company: '', position: '' });      // 添加到末尾
prepend({ company: '', position: '' });     // 添加到开头
insert(1, { company: '', position: '' });   // 插入到索引 1
remove(2);                                  // 删除索引 2
swap(0, 1);                                 // 交换索引 0 和 1
move(0, 2);                                 // 移动索引 0 到 2
update(1, { company: 'New', position: 'Dev' }); // 更新索引 1
replace([{ company: '...', position: '...' }]); // 替换整个数组
```

#### 2. 数组字段注册

```typescript
// ✅ 正确：使用 fields.map 并用 field.id 作为 key
{fields.map((field, index) => (
  <div key={field.id}>
    <input {...register(`workExperience.${index}.company`)} />
  </div>
))}

// ❌ 错误：使用 index 作为 key
{fields.map((field, index) => (
  <div key={index}>  {/* 会导致删除时错乱 */}
    <input {...register(`workExperience.${index}.company`)} />
  </div>
))}
```

**为什么必须使用 `field.id`？**

```typescript
// 假设有 3 条记录：[A, B, C]
// 删除中间的 B 后：[A, C]

// 使用 index 作为 key：
[<div key={0}>A</div>, <div key={1}>C</div>]
// React 认为 key=1 的内容从 B 变成了 C，会保留 B 的输入值

// 使用 field.id 作为 key：
[<div key="id-A">A</div>, <div key="id-C">C</div>]
// React 知道 key="id-B" 被删除了，正确渲染
```

#### 3. 数组错误处理

```typescript
{/* 显示数组级别的错误 */}
{errors.workExperience && (
  <p>{errors.workExperience.message}</p>
)}

{/* 显示特定项的错误 */}
{errors.workExperience?.[index]?.company && (
  <p>{errors.workExperience[index]?.company?.message}</p>
)}

{/* 显示所有错误 */}
{errors.workExperience && Array.isArray(errors.workExperience) && (
  <div>
    {errors.workExperience.map((error, index) => (
      <div key={index}>
        {Object.entries(error || {}).map(([field, err]) => (
          <p key={field}>{err.message}</p>
        ))}
      </div>
    ))}
  </div>
)}
```

#### 4. 字段联动

```typescript
// 监听"至今"复选框
const isCurrent = watch(`workExperience.${index}.isCurrent`);

// 根据状态显示/隐藏结束日期
{!isCurrent && (
  <input {...register(`workExperience.${index}.endDate`)} type="date" />
)}
```

### 🎯 练习任务

#### 任务 1：添加教育经历

```typescript
// 1. 添加 Schema
const educationSchema = z.object({
  school: z.string().min(1, '学校名称必填'),
  major: z.string().min(1, '专业必填'),
  degree: z.enum(['bachelor', 'master', 'doctor']),
  startDate: z.string(),
  endDate: z.string(),
});

// 2. 添加到表单
const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
  control,
  name: 'education',
});
```

#### 任务 2：添加拖拽排序

```bash
# 安装 react-beautiful-dnd
npm install react-beautiful-dnd @types/react-beautiful-dnd

# 实现拖拽排序
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const onDragEnd = (result) => {
  if (!result.destination) return;
  move(result.source.index, result.destination.index);
};
```

#### 任务 3：添加数据导入

```typescript
// 从 JSON 导入数据
const handleImport = (jsonData: any[]) => {
  replace(jsonData); // 替换整个数组
};

// 导出数据
const handleExport = () => {
  const data = getValues('workExperience');
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  // 下载文件...
};
```

---

*（文档继续，包含案例 4-7 的详细说明...）*

## 总结

通过本章的 7 个实战案例，你已经掌握：

1. ✅ **基础表单**：useForm、register、Zod 验证
2. ✅ **多步骤表单**：分步验证、数据暂存、进度条
3. ✅ **动态字段**：useFieldArray、数组验证、字段联动
4. ✅ **文件上传**：文件验证、预览、FormData
5. ✅ **审批流**：复杂业务逻辑、状态管理
6. ✅ **批量导入**：CSV/Excel 解析、批量验证
7. ✅ **自动保存**：防抖、LocalStorage、草稿恢复

## 参考资源

- [React Hook Form 官方文档](https://react-hook-form.com/)
- [Zod 官方文档](https://zod.dev/)
- [项目源码](/app/15-complex-forms)
- [Schema 定义](/lib/forms/schemas.ts)
