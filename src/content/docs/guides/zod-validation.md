---
title: 验证接收到的数据
description: 使用 Zod 验证表单数据
---

## 概述

使用 Zod 库对 Server Action 接收到的表单数据进行验证。

## 安装 Zod

```bash
npm install zod
```

## 定义验证 Schema

```ts
// src/actions/create-topic.ts
"use server";

import { z } from "zod";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});

export async function createTopic(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  const result = createTopicSchema.safeParse({
    name,
    description,
  });

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
  }
}
```

## Zod 验证方法

### safeParse vs parse

| 方法 | 说明 |
|------|------|
| `parse()` | 验证失败时抛出异常 |
| `safeParse()` | 验证失败时返回错误对象，不抛异常 |

```ts
// parse - 失败会抛异常
try {
  const data = schema.parse(input);
} catch (error) {
  // 处理错误
}

// safeParse - 更安全的方式
const result = schema.safeParse(input);
if (result.success) {
  // result.data 包含验证后的数据
} else {
  // result.error 包含错误信息
}
```

## 常用验证规则

### 字符串验证

```ts
z.string()
  .min(3)                    // 最小长度 3
  .max(100)                  // 最大长度 100
  .email()                   // 邮箱格式
  .url()                     // URL 格式
  .regex(/^[a-z-]+$/)        // 正则匹配
```

### 自定义错误消息

```ts
z.string()
  .min(3, { message: "至少 3 个字符" })
  .regex(/^[a-z-]+$/, {
    message: "Must be lowercase letters or dashes without spaces",
  })
```

### 数字验证

```ts
z.number()
  .min(0)
  .max(100)
  .positive()
  .int()
```

## 错误信息处理

### flatten() 方法

将嵌套的错误信息扁平化：

```ts
const result = schema.safeParse(input);

if (!result.success) {
  const errors = result.error.flatten();

  // errors.fieldErrors 包含每个字段的错误
  // {
  //   name: ["String must contain at least 3 character(s)"],
  //   description: ["String must contain at least 10 character(s)"]
  // }

  console.log(errors.fieldErrors);
}
```

### 错误信息结构

```ts
result.error.flatten()
// 返回:
{
  formErrors: [],           // 表单级别的错误
  fieldErrors: {            // 字段级别的错误
    name: ["错误信息1", "错误信息2"],
    description: ["错误信息"]
  }
}
```

## 完整验证流程

```ts
"use server";

import { z } from "zod";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3, { message: "名称至少 3 个字符" })
    .regex(/^[a-z-]+$/, {
      message: "只能包含小写字母和连字符",
    }),
  description: z
    .string()
    .min(10, { message: "描述至少 10 个字符" }),
});

export async function createTopic(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  // 验证数据
  const result = createTopicSchema.safeParse({
    name,
    description,
  });

  // 验证失败
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 验证成功，result.data 包含类型安全的数据
  const { name: validName, description: validDesc } = result.data;

  // TODO: 保存到数据库
}
```

## 为什么使用 Zod

1. **类型安全** - Zod 自动推断 TypeScript 类型
2. **运行时验证** - 在服务端验证客户端提交的数据
3. **清晰的错误信息** - 方便返回给前端展示
4. **链式 API** - 易于组合多个验证规则

```ts
// Zod 自动推断类型
type TopicInput = z.infer<typeof createTopicSchema>;
// {
//   name: string;
//   description: string;
// }
```
