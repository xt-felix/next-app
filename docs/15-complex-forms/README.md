# 第十五章：复杂表单处理与数据校验

本章深入讲解企业级表单开发，使用 React Hook Form + Zod 实现高性能、类型安全的复杂表单。

## 目录

1. [React Hook Form 核心概念](#react-hook-form-核心概念)
2. [Zod Schema 验证](#zod-schema-验证)
3. [项目结构](#项目结构)
4. [快速开始](#快速开始)
5. [核心功能详解](#核心功能详解)
6. [实战案例](#实战案例)
7. [性能优化](#性能优化)
8. [最佳实践](#最佳实践)
9. [常见问题](#常见问题)

## React Hook Form 核心概念

### 为什么选择 React Hook Form？

与传统的受控组件相比，React Hook Form 具有显著优势：

| 特性 | 传统方式 | React Hook Form |
|------|---------|-----------------|
| 渲染次数 | 每次输入都重新渲染 | 最小化渲染 |
| 性能 | 字段越多越慢 | 性能恒定 |
| 代码量 | 需要大量 useState | 代码精简 |
| 验证 | 手动实现 | 内置验证 |
| 类型安全 | 需要手动定义 | 自动类型推断 |

### 核心 API

#### 1. useForm

```typescript
const {
  register,        // 注册表单字段
  handleSubmit,    // 处理提交
  formState,       // 表单状态
  watch,           // 监听字段变化
  setValue,        // 设置字段值
  reset,           // 重置表单
  control,         // 用于 useFieldArray
} = useForm<FormData>({
  resolver: zodResolver(schema),  // Zod 验证器
  defaultValues: {...},           // 默认值
  mode: 'onChange',               // 验证模式
});
```

**验证模式对比：**
- `onBlur`: 失去焦点时验证（推荐）
- `onChange`: 每次输入都验证（即时反馈）
- `onSubmit`: 仅在提交时验证（默认）
- `onTouched`: 首次触摸后验证

#### 2. register

```typescript
<input {...register('username')} />

// 等价于
<input
  name="username"
  ref={register}
  onChange={handleChange}
  onBlur={handleBlur}
/>
```

**高级用法：**

```typescript
// 数字类型
<input {...register('age', { valueAsNumber: true })} type="number" />

// 日期类型
<input {...register('birthday', { valueAsDate: true })} type="date" />

// 自定义转换
<input {...register('price', {
  setValueAs: v => parseFloat(v)
})} />
```

#### 3. useFieldArray

管理动态数组字段：

```typescript
const { fields, append, remove, move } = useFieldArray({
  control,
  name: 'items',
});

// 添加项
append({ name: '', value: '' });

// 删除项
remove(index);

// 移动项
move(fromIndex, toIndex);
```

## Zod Schema 验证

### 基础类型

```typescript
import { z } from 'zod';

// 字符串
z.string()
  .min(3, '至少3个字符')
  .max(20, '最多20个字符')
  .email('邮箱格式错误')
  .url('URL格式错误')
  .regex(/^[a-z]+$/, '只能包含小写字母')
  .trim()  // 自动去除空格
  .toLowerCase()  // 转小写

// 数字
z.number()
  .int('必须是整数')
  .min(0)
  .max(100)
  .positive('必须为正数')
  .nonnegative('不能为负数')

// 布尔
z.boolean()

// 日期
z.date()
  .min(new Date('2024-01-01'))
  .max(new Date('2024-12-31'))

// 枚举
z.enum(['admin', 'user', 'guest'])

// 可选字段
z.string().optional()  // string | undefined
z.string().nullable()  // string | null
z.string().nullish()   // string | null | undefined
```

### 复杂验证

#### 对象验证

```typescript
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  address: z.object({
    city: z.string(),
    street: z.string(),
  }),
});

type User = z.infer<typeof UserSchema>;
// {
//   name: string;
//   age: number;
//   address: { city: string; street: string };
// }
```

#### 数组验证

```typescript
const ItemsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  })
)
  .min(1, '至少添加一项')
  .max(10, '最多10项');
```

#### 联合验证（跨字段）

```typescript
const PasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],  // 错误显示在哪个字段
  });
```

#### 自定义验证

```typescript
const FileSchema = z.custom<FileList>()
  .refine(files => files.length > 0, '请选择文件')
  .refine(files => {
    const maxSize = 5 * 1024 * 1024;  // 5MB
    return Array.from(files).every(f => f.size <= maxSize);
  }, '文件过大')
  .refine(files => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    return Array.from(files).every(f => allowedTypes.includes(f.type));
  }, '文件类型不支持');
```

### 条件验证

```typescript
const FormSchema = z.object({
  type: z.enum(['personal', 'business']),
  personalInfo: z.object({
    name: z.string(),
  }).optional(),
  businessInfo: z.object({
    companyName: z.string(),
    taxId: z.string(),
  }).optional(),
})
  .refine(data => {
    if (data.type === 'personal') {
      return !!data.personalInfo?.name;
    }
    if (data.type === 'business') {
      return !!data.businessInfo?.companyName && !!data.businessInfo?.taxId;
    }
    return true;
  }, '请填写完整信息');
```

## 项目结构

```
app/15-complex-forms/
├── page.tsx                    # 主导航页
├── basic/
│   └── page.tsx                # 基础表单示例
├── multi-step/
│   └── page.tsx                # 多步骤表单
├── dynamic/
│   └── page.tsx                # 动态字段
├── upload/
│   └── page.tsx                # 文件上传
├── approval/
│   └── page.tsx                # 审批流
├── batch-import/
│   └── page.tsx                # 批量导入
└── auto-save/
    └── page.tsx                # 自动保存

lib/forms/
└── schemas.ts                  # 所有 Zod Schema 定义
```

## 快速开始

### 安装依赖

```bash
npm install react-hook-form @hookform/resolvers zod
```

### 基础使用

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. 定义 Schema
const FormSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
});

type FormData = z.infer<typeof FormSchema>;

// 2. 创建组件
export default function BasicForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('email')} type="email" />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">提交</button>
    </form>
  );
}
```

## 核心功能详解

### 1. 错误处理

```typescript
const {
  formState: {
    errors,       // 所有错误
    isValid,      // 是否通过验证
    isDirty,      // 表单是否被修改
    isSubmitting, // 是否正在提交
    touchedFields, // 哪些字段被触摸过
    dirtyFields,  // 哪些字段被修改过
  },
} = useForm();

// 显示错误
{errors.username?.message}

// 嵌套错误
{errors.address?.city?.message}

// 数组错误
{errors.items?.[0]?.name?.message}
```

### 2. 字段监听

```typescript
// 监听单个字段
const username = watch('username');

// 监听多个字段
const [username, email] = watch(['username', 'email']);

// 监听所有字段
const formData = watch();

// 监听并执行回调
useEffect(() => {
  const subscription = watch((value, { name, type }) => {
    console.log(value, name, type);
  });
  return () => subscription.unsubscribe();
}, [watch]);
```

### 3. 手动设置值

```typescript
// 设置单个值
setValue('username', 'john');

// 设置多个值
setValue('username', 'john', {
  shouldValidate: true,  // 触发验证
  shouldDirty: true,     // 标记为已修改
  shouldTouch: true,     // 标记为已触摸
});

// 批量设置
reset({
  username: 'john',
  email: 'john@example.com',
});
```

### 4. 表单重置

```typescript
// 重置到默认值
reset();

// 重置到新值
reset({
  username: 'new_user',
  email: 'new@example.com',
});

// 部分重置
reset({}, {
  keepValues: true,       // 保留当前值
  keepDefaultValues: true, // 保留默认值
  keepErrors: true,       // 保留错误
  keepDirty: true,        // 保留dirty状态
  keepIsSubmitted: true,  // 保留提交状态
});
```

## 实战案例

### 案例 1：多步骤表单

**场景**：用户注册流程，分三步完成

**关键代码**：

```typescript
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({});

// 步骤 1 表单
const step1Form = useForm({
  resolver: zodResolver(Step1Schema),
  defaultValues: formData,
});

const onStep1Submit = (data) => {
  setFormData(prev => ({ ...prev, ...data }));
  setStep(2);
};

// 步骤 2、3 类似...
```

**关键点**：
- 每个步骤独立验证
- 数据暂存，支持前后切换
- 进度条提示用户当前位置

### 案例 2：动态字段表单

**场景**：工作经历，可添加多份

**关键代码**：

```typescript
const { fields, append, remove } = useFieldArray({
  control,
  name: 'workExperience',
});

// 添加一份工作经历
append({
  company: '',
  position: '',
  startDate: '',
  endDate: '',
});

// 渲染列表
{fields.map((field, index) => (
  <div key={field.id}>
    <input {...register(`workExperience.${index}.company`)} />
    <button onClick={() => remove(index)}>删除</button>
  </div>
))}
```

**关键点**：
- 使用 `field.id` 作为 key，避免渲染问题
- 数组元素单独验证
- 支持拖拽排序（可选）

### 案例 3：文件上传

**场景**：图片上传，大小类型验证

**关键代码**：

```typescript
// Zod 验证
const FileSchema = z.custom<FileList>()
  .refine(files => files.length > 0, '请选择文件')
  .refine(files => {
    return Array.from(files).every(f => f.size <= 5 * 1024 * 1024);
  }, '文件不能超过5MB');

// 文件预览
const handleFileChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    setPreview(e.target.result);
  };
  reader.readAsDataURL(file);
};
```

**关键点**：
- FileReader 生成预览
- 验证文件大小和类型
- 显示上传进度

### 案例 4：自动保存

**场景**：文章编辑器，防止数据丢失

**关键代码**：

```typescript
const formData = watch();

// 自动保存（防抖）
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('draft', JSON.stringify(formData));
    setLastSaved(new Date());
  }, 2000);

  return () => clearTimeout(timer);
}, [formData]);

// 恢复草稿
useEffect(() => {
  const draft = localStorage.getItem('draft');
  if (draft) {
    const data = JSON.parse(draft);
    reset(data);
  }
}, []);
```

**关键点**：
- 2秒防抖，避免频繁写入
- LocalStorage 持久化
- 页面刷新后自动恢复

## 性能优化

### 1. 使用 Controller 避免重复渲染

```typescript
import { Controller } from 'react-hook-form';

<Controller
  name="customField"
  control={control}
  render={({ field }) => (
    <CustomComponent {...field} />
  )}
/>
```

### 2. 懒加载验证

```typescript
// 仅在提交时验证
const { register } = useForm({
  mode: 'onSubmit',
});

// 或使用 shouldUnregister 避免保留未使用字段的值
const { register } = useForm({
  shouldUnregister: true,
});
```

### 3. 防抖/节流

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSave = useDebouncedCallback((data) => {
  localStorage.setItem('draft', JSON.stringify(data));
}, 1000);

useEffect(() => {
  debouncedSave(formData);
}, [formData]);
```

### 4. 虚拟化长列表

对于超过 100 项的动态字段，使用虚拟滚动：

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={fields.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      <input {...register(`items.${index}.name`)} />
    </div>
  )}
</FixedSizeList>
```

## 最佳实践

### 1. Schema 复用

```typescript
// lib/forms/schemas.ts
export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(8);

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const RegisterSchema = LoginSchema.extend({
  confirmPassword: PasswordSchema,
}).refine(data => data.password === data.confirmPassword, {
  message: '密码不一致',
  path: ['confirmPassword'],
});
```

### 2. 错误消息国际化

```typescript
const t = (key: string) => {
  const messages = {
    'email.required': '邮箱不能为空',
    'email.invalid': '邮箱格式错误',
    'password.min': '密码至少8个字符',
  };
  return messages[key] || key;
};

const FormSchema = z.object({
  email: z.string().email(t('email.invalid')),
  password: z.string().min(8, t('password.min')),
});
```

### 3. 表单组件封装

```typescript
// components/FormField.tsx
export function FormField({
  label,
  error,
  children,
  required = false,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

// 使用
<FormField label="用户名" error={errors.username?.message} required>
  <input {...register('username')} />
</FormField>
```

### 4. 提交状态管理

```typescript
const [submitStatus, setSubmitStatus] = useState<
  'idle' | 'submitting' | 'success' | 'error'
>('idle');

const onSubmit = async (data) => {
  setSubmitStatus('submitting');
  try {
    await api.submit(data);
    setSubmitStatus('success');
  } catch (error) {
    setSubmitStatus('error');
  }
};

// UI
{submitStatus === 'submitting' && <Spinner />}
{submitStatus === 'success' && <SuccessMessage />}
{submitStatus === 'error' && <ErrorMessage />}
```

## 常见问题

### Q1: 为什么表单重新渲染很多次？

**原因**：使用了受控组件 + useState

**解决**：
```typescript
// ❌ 不推荐
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />

// ✅ 推荐
<input {...register('field')} />
```

### Q2: 如何处理异步验证（如检查用户名是否存在）？

```typescript
const FormSchema = z.object({
  username: z.string()
    .min(3)
    .refine(async (username) => {
      const exists = await checkUsernameExists(username);
      return !exists;
    }, '用户名已存在'),
});
```

### Q3: 如何在提交前手动触发验证？

```typescript
const { trigger } = useForm();

// 验证所有字段
const isValid = await trigger();

// 验证特定字段
const isUsernameValid = await trigger('username');

// 验证多个字段
const areValid = await trigger(['username', 'email']);
```

### Q4: 如何重置表单但保留某些字段？

```typescript
reset({
  ...getValues(),  // 保留当前所有值
  password: '',    // 只重置密码
});
```

### Q5: 如何实现"记住我"功能？

```typescript
useEffect(() => {
  const remember = localStorage.getItem('rememberMe');
  if (remember === 'true') {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setValue('email', savedEmail);
    }
  }
}, []);

const onSubmit = (data) => {
  if (data.rememberMe) {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('email', data.email);
  } else {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('email');
  }
};
```

### Q6: 如何处理文件上传进度？

```typescript
const onSubmit = async (data) => {
  const formData = new FormData();
  formData.append('file', data.file[0]);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', (e) => {
    const progress = (e.loaded / e.total) * 100;
    setUploadProgress(progress);
  });

  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      alert('上传成功');
    }
  });

  xhr.open('POST', '/api/upload');
  xhr.send(formData);
};
```

## 总结

通过本章学习，你应该掌握：

1. **React Hook Form 核心用法**：register、handleSubmit、formState、useFieldArray
2. **Zod Schema 验证**：基础类型、复杂验证、跨字段验证、自定义验证
3. **多场景实战**：多步骤表单、动态字段、文件上传、自动保存
4. **性能优化**：防抖、虚拟滚动、懒加载
5. **最佳实践**：Schema 复用、组件封装、错误处理

**下一步**：
1. 完成所有实战案例
2. 尝试集成到真实项目
3. 探索更多 React Hook Form 高级特性
4. 学习表单测试（React Testing Library）

## 参考资源

- [React Hook Form 官方文档](https://react-hook-form.com/)
- [Zod 官方文档](https://zod.dev/)
- [表单验证最佳实践](https://web.dev/sign-in-form-best-practices/)
