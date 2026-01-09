---
title: useActionState
description: 使用 useActionState 处理表单状态和验证错误
---

## 概述

`useActionState` 是 React 19 提供的 Hook，用于处理表单提交状态和服务端返回的错误信息。

## 定义 FormState 类型

```ts
// src/actions/create-topic.ts
"use server";

import { z } from "zod";

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
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
) {
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

  return {
    errors: {},
  };
}
```

## 使用 useActionState

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
} from "@nextui-org/react";
import * as actions from "@/actions";
import { useActionState } from "react";

export default function TopicCreateForm() {
  const [state, formAction] = useActionState(actions.createTopic, {
    errors: {},
  });

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="secondary" variant="bordered">
          Create a Topic
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={formAction}>
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
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

## useActionState 说明

### 基本用法

```tsx
const [state, formAction] = useActionState(action, initialState);
```

| 参数 | 说明 |
|------|------|
| `action` | Server Action 函数 |
| `initialState` | 初始状态 |

| 返回值 | 说明 |
|--------|------|
| `state` | 当前状态（包含错误信息等） |
| `formAction` | 用于 form action 的函数 |

### Action 函数签名变化

使用 `useActionState` 时，Action 函数需要接收 `prevState` 作为第一个参数：

```ts
// 之前
export async function createTopic(formData: FormData) {}

// 使用 useActionState 后
export async function createTopic(
  prevState: CreateTopicFormState,
  formData: FormData
) {}
```

## 显示验证错误

NextUI 的 Input 和 Textarea 组件支持 `isInvalid` 和 `errorMessage` 属性：

```tsx
<Input
  name="name"
  isInvalid={!!state.errors.name}
  errorMessage={state.errors.name?.join(", ")}
/>
```

| 属性 | 说明 |
|------|------|
| `isInvalid` | 是否显示错误状态 |
| `errorMessage` | 错误提示信息 |

## 解决提交数据时表单重置的问题

使用 `useActionState` 时，表单提交后可能会重置输入内容。这是一个已知问题：

- [React Issue #29034](https://github.com/facebook/react/issues/29034#issuecomment-2143595195)
- [Next.js Form Caveats](https://nextjs.org/docs/app/api-reference/components/form#caveats)
- [WAI-ARIA Form Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/form.html)

### 解决方案：使用 key 属性

```tsx
<form action={formAction} key={state.timestamp}>
```

### 解决方案：使用 defaultValue

```tsx
const [state, formAction] = useActionState(actions.createTopic, {
  errors: {},
  name: "",
  description: "",
});

<Input
  name="name"
  defaultValue={state.name}
  isInvalid={!!state.errors.name}
  errorMessage={state.errors.name?.join(", ")}
/>
```

在 Action 中返回输入值：

```ts
export async function createTopic(
  prevState: CreateTopicFormState,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const result = createTopicSchema.safeParse({ name, description });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      name,        // 返回输入值
      description, // 返回输入值
    };
  }

  return { errors: {}, name: "", description: "" };
}
```

## 完整流程

```
用户输入 → 点击提交
    │
    ▼
formAction 调用 Server Action
    │
    ▼
服务端验证数据
    │
    ├── 验证失败 → 返回 { errors: {...} }
    │                    │
    │                    ▼
    │              state 更新，显示错误信息
    │
    └── 验证成功 → 返回 { errors: {} }
                         │
                         ▼
                   继续处理（保存数据等）
```
