---
title: 评论功能
description: 实现评论组件、评论列表、嵌套回复和数据缓存
---

## 准备评论组件结构

在帖子详情页添加评论表单：

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
import PostShow from "@/components/posts/post-show";
import PostShowLoading from "@/components/posts/post-show-loading";
import { Suspense } from "react";

interface PostShowPageProps {
  params: {
    name: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { name, postId } = await params;

  return (
    <div className="space-y-3">
      <Suspense fallback={<PostShowLoading />}>
        <PostShow postId={postId} />
      </Suspense>
      <form>
        <div className="space-y-3">
          <Textarea
            name="content"
            label="Reply"
            labelPlacement="inside"
            placeholder="Enter your comment"
          />
          <Button color="secondary" variant="bordered">
            Create Comment
          </Button>
        </div>
      </form>
    </div>
  );
}
```

## 拆分评论表单组件

```tsx
// src/components/comments/comment-create-form.tsx
import { Textarea, Button } from "@nextui-org/react";

export default function CommentCreateForm() {
  return (
    <form>
      <div className="space-y-3">
        <Textarea
          name="content"
          label="Reply"
          labelPlacement="inside"
          placeholder="Enter your comment"
        />
        <Button color="secondary" variant="bordered">
          Create Comment
        </Button>
      </div>
    </form>
  );
}
```

## createComment Server Action

```ts
// src/actions/create-comment.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

const createCommentSchema = z.object({
  content: z.string().min(3),
});

interface CreateCommentFormState {
  errors: {
    content?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function createComment(
  { postId, parentId }: { postId: string; parentId?: string },
  prevState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> {
  const result = createCommentSchema.safeParse({
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
        _form: ["You must sign in to do this."],
      },
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content: result.data.content,
        postId: postId,
        userId: session.user.id!,
        parentId,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
  }

  return {
    errors: {},
    success: true,
  };
}
```

## 使用 Server Action 的表单组件

```tsx
// src/components/comments/comment-create-form.tsx
"use client";
import { Button, Textarea, Chip } from "@nextui-org/react";
import React, { startTransition, useActionState, useEffect, useRef, useState } from "react";
import * as actions from "@/actions";

interface CommentCreateFormProps {
  postId: string;
  isOpen?: boolean;
  parentId?: string;
}

export default function CommentCreateForm({
  postId,
  isOpen,
  parentId,
}: CommentCreateFormProps) {
  const ref = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState(isOpen);
  const [state, formAction, isPending] = useActionState(
    actions.createComment.bind(null, { postId, parentId }),
    { errors: {} }
  );

  // 成功后重置表单
  useEffect(() => {
    if (state.success) {
      ref.current?.reset();
    }
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  }

  return (
    <div className="space-y-3 mt-3">
      <Button
        size="sm"
        variant="shadow"
        color="default"
        onClick={() => setOpen(!open)}
      >
        Reply
      </Button>
      {open && (
        <form
          className="space-y-3"
          onSubmit={handleSubmit}
          noValidate
          ref={ref}
        >
          <Textarea
            name="content"
            label="Reply"
            labelPlacement="inside"
            placeholder="Enter your comment"
            isInvalid={!!state.errors.content}
            errorMessage={state.errors.content?.join(", ")}
          />
          {state.errors._form ? (
            <Chip variant="bordered" radius="sm" className="max-w-full">
              {state.errors._form.join(", ")}
            </Chip>
          ) : null}
          <Button
            isLoading={isPending}
            type="submit"
            color="secondary"
            variant="bordered"
          >
            Create Comment
          </Button>
        </form>
      )}
    </div>
  );
}
```

## 评论列表静态结构

```tsx
// src/components/comments/comment-list.tsx
import Image from "next/image";

export default function CommentList() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">All 5 comments</h1>
      <div className="p-4 border mt-2 rounded">
        <div className="flex gap-3">
          <Image
            src="/avatar.jpg"
            alt="user image"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 space-y-3">
            <p className="text-sm font-medium text-gray-500">Ifer</p>
            <p className="flex justify-between">
              <span className="text-gray-900">Hello</span>
              <span className="text-sm text-gray-400">2030 年 1 月 1 日</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 查询评论数据

```ts
// src/prisma/queries/comments.ts
import type { Comment } from "@prisma/client";
import { prisma } from "..";

export type CommentWithUser = Comment & {
  user: { name: string | null; image: string | null };
};

export function fetchCommentsByPostId(postId: string): Promise<CommentWithUser[]> {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}
```

### 格式化日期

使用 dayjs 格式化日期：

```ts
import dayjs from "dayjs";

dayjs(comment.createdAt).format("YYYY/M/D H:m:s");
```

## 图片 URL 白名单

配置允许的外部图片域名：

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
```

## 解决数据不更新问题

### 问题描述

添加评论后，CommentList 不会获取到最新的内容。

### 原因分析

CommentList 是在初始化时由服务器渲染并静态生成的，后续通过 CommentCreateForm 提交数据并没有触发 CommentList 重新获取数据的机制。

### 解决方案对比

| 方案 | 说明 | 优缺点 |
|------|------|--------|
| 客户端状态 | 父组件定义状态，传递给子组件 | 需要改成客户端组件，代价大 |
| **revalidatePath** | 在 Server Action 中调用 | 保留服务端组件，推荐 |
| SWR | 使用数据获取库 | 需要额外学习 |

### 使用 revalidatePath

```ts
// src/actions/create-comment.ts
import { revalidatePath } from "next/cache";

// 在创建评论成功后
const topic = await prisma.topic.findFirst({
  where: { posts: { some: { id: postId } } },
});

if (!topic) {
  return {
    errors: {
      _form: ["Failed to revalidate topic"],
    },
  };
}

revalidatePath(`/topics/${topic.name}/posts/${postId}`);
```

### Prisma 关联查询条件

```ts
// 检查 Topic 下面关联的 Post 中，是否至少有一个帖子的 id 等于 postId
const topic = await prisma.topic.findFirst({
  where: { posts: { some: { id: postId } } },
});
```

| 条件 | 说明 |
|------|------|
| `some` | 集合中至少有一个元素满足条件 |
| `every` | 集合中的所有元素都必须满足条件 |
| `none` | 集合中的所有元素都不满足条件 |

## 评论成功后重置表单

```tsx
// src/components/comments/comment-create-form.tsx
"use client";

export default function CommentCreateForm({ postId }: CommentCreateFormProps) {
  const ref = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.success) {
      ref.current?.reset();
    }
  }, [state]);

  return (
    <form ref={ref} onSubmit={handleSubmit} noValidate>
      {/* ... */}
    </form>
  );
}
```

Server Action 返回 success 标志：

```ts
// src/actions/create-comment.ts
interface CreateCommentFormState {
  errors: { /* ... */ };
  success?: boolean;
}

// 成功时返回
return {
  errors: {},
  success: true,
};
```

## 展示对评论进行回复的组件

### CommentShow 组件

```tsx
// src/components/comments/comment-show.tsx
export default function CommentShow({ comment }: { comment: CommentWithUser }) {
  return (
    <div className="border mt-2 p-4 rounded">
      <div className="flex gap-3">
        {/* 用户头像和评论内容 */}
        <div className="flex-1">
          {/* ... */}
          <CommentCreateForm postId={comment.postId} parentId={comment.id} />
        </div>
      </div>
    </div>
  );
}
```

### 控制表单默认展开状态

```tsx
interface CommentCreateFormProps {
  postId: string;
  isOpen?: boolean;
  parentId?: string;
}

export default function CommentCreateForm({
  postId,
  isOpen,
  parentId,
}: CommentCreateFormProps) {
  const [open, setOpen] = useState(isOpen);
  // ...
}
```

页面中默认展开：

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
<CommentCreateForm postId={postId} isOpen />
```

## 嵌套回复功能

### 筛选顶级评论

```tsx
// src/components/comments/comment-list.tsx
export default async function CommentList({ postId }: CommentListProps) {
  const comments = await fetchCommentsByPostId(postId);
  // 只显示 parentId 为 null 的顶级评论
  const topLevelComments = comments.filter((comment) => comment.parentId === null);

  return (
    <div className="space-y-3 !mt-10">
      <h1 className="text-lg font-bold">All {comments.length} comments</h1>
      {topLevelComments.map((comment) => (
        <CommentShow key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

### 递归渲染子评论

```tsx
// src/components/comments/comment-show.tsx
export default async function CommentShow({ comment }: { comment: CommentWithUser }) {
  const comments = await fetchCommentsByPostId(comment.postId);
  // 找 parentId 等于当前评论 id 的子评论
  const children = comments.filter((c) => c.parentId === comment.id);

  return (
    <div className={`border mt-2 p-4 rounded ${comment.parentId !== null && "border-dashed"}`}>
      {/* 评论内容 */}
      <div className="pl-12">
        {children.map((child) => (
          <CommentShow key={child.id} comment={child} />
        ))}
      </div>
    </div>
  );
}
```

## 使用 React cache 缓存数据库查询

### 问题

每个 CommentShow 组件都会查询一次数据库，造成重复请求。

### 解决方案

使用 React 的 `cache` 函数包裹查询函数：

```ts
// src/prisma/queries/comments.ts
import type { Comment } from "@prisma/client";
import { prisma } from "..";
import { cache } from "react";

export type CommentWithUser = {
  user: {
    name: string | null;
    image: string | null;
  };
} & Comment;

export const fetchCommentsByPostId = cache(
  async (postId: string): Promise<CommentWithUser[]> => {
    console.log("🤠🤠"); // 只会打印一次
    return prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
);
```

### cache 函数说明

- React 的 `cache` 函数会在同一次渲染中缓存函数的返回值
- 相同参数的调用会复用缓存结果，不会重复执行
- 缓存只在单次请求/渲染周期内有效

## 评论数据流

```
帖子详情页
    │
    ├── CommentCreateForm (isOpen)  # 对帖子的评论
    │
    └── CommentList
            │
            └── topLevelComments (parentId === null)
                    │
                    └── CommentShow
                            │
                            ├── 评论内容
                            ├── CommentCreateForm (parentId)  # 对评论的回复
                            │
                            └── children (parentId === comment.id)
                                    │
                                    └── CommentShow (递归)
```

## 文件结构

```
src/
├── actions/
│   └── create-comment.ts
├── components/
│   └── comments/
│       ├── comment-create-form.tsx
│       ├── comment-list.tsx
│       └── comment-show.tsx
└── prisma/
    └── queries/
        └── comments.ts
```
