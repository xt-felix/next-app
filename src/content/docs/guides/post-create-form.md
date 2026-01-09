---
title: 创建帖子表单
description: 实现 PostCreateForm 组件和 createPost Server Action
---

## PostCreateForm 组件

创建帖子表单组件，与话题创建表单类似：

```tsx
// src/components/posts/post-create-form.tsx
"use client";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Textarea,
} from "@nextui-org/react";

export default function PostCreateForm() {
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="secondary" variant="bordered" className="block ml-auto">
          Create a Post
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Post</h3>
            <Input
              name="title"
              label="Title"
              labelPlacement="outside"
              placeholder="Title"
            />
            <Textarea
              name="content"
              label="Content"
              labelPlacement="outside"
              placeholder="Content"
            />
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

## createPost Server Action

创建帖子的 Server Action，需要接收话题名称作为参数：

```ts
// src/actions/create-post.ts
"use server";

import type { Post } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  name: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
    };
  }

  const topic = await prisma.topic.findFirst({
    where: { name },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Cannot find topic"],
      },
    };
  }

  let post: Post;
  try {
    post = await prisma.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id!,
        topicId: topic.id,
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
          _form: ["Failed to create post"],
        },
      };
    }
  }
  redirect(`/topics/${name}/posts/${post.id}`);
}
```

### 函数签名说明

```ts
export async function createPost(
  name: string,                    // 额外参数：话题名称
  formState: CreatePostFormState,  // 上一次的表单状态
  formData: FormData               // 表单数据
): Promise<CreatePostFormState>
```

与 `createTopic` 不同，`createPost` 需要知道帖子属于哪个话题，所以第一个参数是话题名称 `name`。

## 应用 Server Action

使用 `bind` 方法预填充话题名称参数：

```tsx
// src/components/posts/post-create-form.tsx
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

interface PostCreateFormProps {
  name: string;
}

export default function PostCreateForm({ name }: PostCreateFormProps) {
  // 使用 bind 预填充 name 参数
  const [formState, action, isPending] = useActionState(
    actions.createPost.bind(null, name),
    { errors: {} }
  );

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="secondary" variant="bordered" className="block ml-auto">
          Create a Post
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Post</h3>
            <Input
              isInvalid={!!formState.errors.title}
              errorMessage={formState.errors.title?.join(", ")}
              name="title"
              label="Title"
              labelPlacement="outside"
              placeholder="Title"
            />
            <Textarea
              isInvalid={!!formState.errors.content}
              errorMessage={formState.errors.content?.join(", ")}
              name="content"
              label="Content"
              labelPlacement="outside"
              placeholder="Content"
            />
            {formState.errors._form ? (
              <div className="rounded p-2 bg-red-200 border border-red-400">
                {formState.errors._form.join(", ")}
              </div>
            ) : null}
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

## 关键点解析

### 1. 使用 bind 传递额外参数

```tsx
const [formState, action, isPending] = useActionState(
  actions.createPost.bind(null, name),
  { errors: {} }
);
```

`bind(null, name)` 将 `name` 作为第一个参数绑定到 `createPost` 函数，这样 `useActionState` 调用时只需要传递 `formState` 和 `formData`。

### 2. 表单验证状态

```tsx
<Input
  isInvalid={!!formState.errors.title}
  errorMessage={formState.errors.title?.join(", ")}
  // ...
/>
```

### 3. 表单级别错误显示

```tsx
{formState.errors._form ? (
  <div className="rounded p-2 bg-red-200 border border-red-400">
    {formState.errors._form.join(", ")}
  </div>
) : null}
```

### 4. Loading 状态

```tsx
<Button isLoading={isPending} type="submit">
  Submit
</Button>
```

## 验证流程

```
用户提交表单
    │
    ▼
isPending = true
    │
    ▼
验证标题和内容（Zod）
    │
    ├── 失败 → 返回字段错误
    │
    ▼
检查登录状态
    │
    ├── 未登录 → 返回 _form 错误
    │
    ▼
查找话题
    │
    ├── 不存在 → 返回 _form 错误
    │
    ▼
创建帖子
    │
    ├── 失败 → 返回 _form 错误
    │
    ▼
redirect 到帖子详情页
```

## bind 方法原理

```ts
// 原始函数签名
createPost(name, formState, formData)

// 使用 bind 后
createPost.bind(null, "javascript")
// 等价于
(formState, formData) => createPost("javascript", formState, formData)
```

这样 `useActionState` 就可以正常使用，因为它期望的函数签名是 `(state, formData) => newState`。

## 在话题详情页使用

```tsx
// src/app/topics/[name]/page.tsx
import PostCreateForm from "@/components/posts/post-create-form";

export default async function TopicShowPage({ params }: TopicShowPageProps) {
  const name = (await params).name;

  return (
    <div>
      {/* 传递话题名称 */}
      <PostCreateForm name={name} />
    </div>
  );
}
```
