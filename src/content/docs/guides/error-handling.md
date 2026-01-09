---
title: 错误处理和路由跳转
description: 处理创建话题时的错误并实现路由跳转和 loading 效果
---

## 错误处理

创建话题时可能会出错，需要使用 try-catch 进行错误处理：

```ts
// src/actions/create-topic.ts
try {
  await prisma.topic.create({
    data: {
      name: result.data.name,
      description: result.data.description,
      userId: session.user.id!,
    },
  });
} catch (err: unknown) {
  if (err instanceof Error) {
    return {
      errors: {
        _form: [err.message],
      },
    };
  } else {
    return {
      errors: {
        _form: ["Something went wrong."],
      },
    };
  }
}
```

### 测试错误处理

```ts
try {
  throw new Error('Failed to create topic');
}
```

## 路由跳转

添加成功后跳转到话题详情页：

```ts
import { redirect } from "next/navigation";

// 创建成功后跳转
const topic = await prisma.topic.create({
  data: {
    name: result.data.name,
    description: result.data.description,
    userId: session.user.id!,
  },
});

redirect(`/topics/${topic.name}`);
```

### 创建话题详情页

```tsx
// src/app/topics/[name]/page.tsx
import React from "react";

interface TopicShowPageProps {
  params: Promise<{ name: string }>;
}

export default async function TopicShowPage({ params }: TopicShowPageProps) {
  const name = (await params).name;
  return <div>针对 {name} 话题的列表页</div>;
}
```

## 完整的 createTopic Action

```ts
// src/actions/create-topic.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
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

  // 验证数据
  const result = createTopicSchema.safeParse({
    name,
    description,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 检查登录状态
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this."],
      },
    };
  }

  let topic;

  // 创建话题
  try {
    topic = await prisma.topic.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        userId: session.user.id!,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong."],
        },
      };
    }
  }

  // 跳转到话题详情页
  redirect(`/topics/${topic.name}`);
}
```

## 添加 Loading 效果

### Next.js 15 的新方式

在 Next.js 15 中，可以直接从 `useActionState` 返回的数组中解构第三个参数 `isPending`：

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
  // 解构第三个参数 isPending
  const [state, formAction, isPending] = useActionState(actions.createTopic, {
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
            {state.errors._form ? (
              <Chip variant="bordered" radius="sm" className="max-w-full">
                {state.errors._form.join(", ")}
              </Chip>
            ) : null}
            {/* 使用 isPending 控制 loading 状态 */}
            <Button isLoading={isPending} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

### Next.js 14 的方式（使用 useFormStatus）

在 Next.js 14 中，需要单独抽离一个按钮组件：

```tsx
// src/components/common/form-button.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

interface FormButtonProps {
  children: React.ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}
```

## 测试 Loading 效果

添加睡眠函数方便观察 loading 效果：

```ts
// src/actions/create-topic.ts
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createTopic(
  prevState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  // 模拟延迟
  await sleep(3000);

  // ... 其他代码
}
```

## useActionState 返回值对比

| 版本 | 返回值 |
|------|--------|
| Next.js 14 | `[state, formAction]` |
| Next.js 15 | `[state, formAction, isPending]` |

## 流程总结

```
用户提交表单
    │
    ▼
isPending = true（显示 loading）
    │
    ▼
验证数据
    │
    ├── 失败 → 返回错误，isPending = false
    │
    ▼
检查登录状态
    │
    ├── 未登录 → 返回错误，isPending = false
    │
    ▼
创建话题
    │
    ├── 失败 → 返回错误，isPending = false
    │
    ▼
redirect 到话题详情页
```
