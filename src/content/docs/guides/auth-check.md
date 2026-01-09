---
title: 提交话题时用户未登录提示
description: 在 Server Action 中检查用户登录状态并返回错误提示
---

## 概述

提交话题时，如果用户未登录，应该给出友好的提示信息。

## 更新 FormState 类型

添加 `_form` 字段用于存储表单级别的错误：

```ts
interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];  // 表单级别的错误
  };
}
```

## 更新 Server Action

```ts
// src/actions/create-topic.ts
"use server";

import { auth } from "@/auth";
import { z } from "zod";

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Name must be at least 3 characters long and contain only letters, numbers, and underscores",
    }),
  description: z.string().min(10).max(4747),
});

export async function createTopic(
  prevState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const name = formData.get("name");
  const description = formData.get("description");

  const result = createTopicSchema.safeParse({
    name,
    description,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 检查用户是否登录
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this."],
      },
    };
  }

  return {
    errors: {},
  };
}
```

## 更新表单组件

使用 `startTransition` 和 `handleSubmit` 处理表单提交：

```tsx
// src/components/topics/topic-create-form.tsx
"use client";

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Textarea,
  Chip,
} from "@nextui-org/react";
import * as actions from "@/actions";
import React, { startTransition, useActionState } from "react";

export default function TopicCreateForm() {
  const [state, formAction] = useActionState(actions.createTopic, {
    errors: {},
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  }

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="secondary" variant="bordered">
          Create a Topic
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Topic</h3>
            <Input
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
              isInvalid={!!state.errors.name}
              errorMessage={state.errors.name?.join(", ")}
            />
            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Describe your topic"
              isInvalid={!!state.errors.description}
              errorMessage={state.errors.description?.join(", ")}
            />
            {/* 显示表单级别的错误 */}
            {state.errors._form ? (
              <Chip variant="bordered" radius="sm" className="max-w-full">
                {state.errors._form.join(", ")}
              </Chip>
            ) : null}
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

## 关键改动说明

### 1. 添加 `_form` 错误字段

```ts
interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];  // 用于表单级别的错误
  };
}
```

`_form` 字段用于存储与具体字段无关的错误，如未登录、权限不足等。

### 2. 明确指定返回值类型

```ts
export async function createTopic(
  prevState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
```

明确指定返回类型可以获得更好的类型检查。

### 3. 检查登录状态

```ts
const session = await auth();
if (!session || !session.user) {
  return {
    errors: {
      _form: ["You must be signed in to do this."],
    },
  };
}
```

### 4. 使用 handleSubmit 和 startTransition

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  startTransition(() => formAction(formData));
}
```

使用 `handleSubmit` 可以更好地控制表单提交行为，`startTransition` 用于将 Action 包装为过渡更新。

### 5. 使用 Chip 组件显示错误

```tsx
{state.errors._form ? (
  <Chip variant="bordered" radius="sm" className="max-w-full">
    {state.errors._form.join(", ")}
  </Chip>
) : null}
```

## 错误类型对比

| 错误类型 | 字段 | 说明 | 显示方式 |
|----------|------|------|----------|
| 字段错误 | `name`、`description` | 具体字段的验证错误 | Input/Textarea 的 errorMessage |
| 表单错误 | `_form` | 表单级别的错误（未登录等） | Chip 组件 |

## 验证流程

```
用户提交表单
    │
    ▼
字段验证（Zod）
    │
    ├── 失败 → 返回 fieldErrors
    │
    ▼
检查登录状态
    │
    ├── 未登录 → 返回 _form 错误
    │
    ▼
继续处理...
```
