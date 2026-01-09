---
title: 帖子详情和列表
description: 实现帖子详情页、话题帖子列表和首页热门帖子
---

## 帖子详情页

创建帖子详情页的动态路由：

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
import React from "react";

interface PostShowPageProps {
  params: {
    name: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { name, postId } = await params;
  return (
    <div>
      <p>{name}</p>
      <p>{postId}</p>
    </div>
  );
}
```

## 查询帖子列表

创建查询函数获取特定话题下的帖子：

```ts
// src/prisma/queries/posts.ts
import type { Post } from "@prisma/client";
import { prisma } from "..";

export type PostWithData = Post & {
  topic: { name: string };
  user: { name: string | null };
  _count: { comments: number };
};

export function fetchPostsByTopicName(name: string): Promise<PostWithData[]> {
  return prisma.post.findMany({
    where: { topic: { name } },
    include: {
      topic: { select: { name: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}
```

### PostWithData 类型说明

```ts
export type PostWithData = Post & {
  topic: { name: string };        // 关联的话题名称
  user: { name: string | null };  // 发帖用户名称
  _count: { comments: number };   // 评论数量
};
```

使用 `&` 交叉类型将 Prisma 的 `Post` 类型与额外的关联数据合并。

## 话题详情页使用帖子列表

```tsx
// src/app/topics/[name]/page.tsx
import PostCreateForm from "@/components/posts/post-create-form";
import PostList from "@/components/posts/posts-list";
import { fetchPostsByTopicName } from "@/prisma/queries/posts";

interface TopicShowPageProps {
  params: Promise<{ name: string }>;
}

export default async function TopicShowPage({ params }: TopicShowPageProps) {
  const name = (await params).name;
  const posts = await fetchPostsByTopicName(name);

  return (
    <div className="flex justify-between">
      <div className="w-3/5">
        <h1 className="text-xl mt-2 pl-2">{name}</h1>
        <PostList posts={posts} />
      </div>
      <div>
        <PostCreateForm name={name} />
      </div>
    </div>
  );
}
```

## PostList 组件

使用客户端组件实现可点击的帖子列表：

```tsx
// src/components/posts/posts-list.tsx
"use client";
import { PostWithData } from "@/prisma/queries/posts";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function PostList({ posts }: { posts: PostWithData[] }) {
  const router = useRouter();

  const renderedPosts = posts.map((post) => {
    const topicName = post.topic.name;

    if (!topicName) {
      throw new Error("Need a slug to link to a post");
    }

    return (
      <ListboxItem
        key={post.id}
        description={<p className="mt-3 text-small">{post.content}</p>}
        endContent={
          <span className="text-small text-gray-400 whitespace-nowrap self-end">
            {post._count.comments} comments
          </span>
        }
        onPress={() => {
          router.push(`/topics/${topicName}/posts/${post.id}`);
        }}
      >
        {post.title}
      </ListboxItem>
    );
  });

  return (
    <Listbox
      aria-label="Posts List"
      itemClasses={{
        base: "border-small border-default-200 mt-4",
      }}
    >
      {renderedPosts}
    </Listbox>
  );
}
```

### 为什么是客户端组件？

- 使用了 `useRouter` hook 进行编程式导航
- `ListboxItem` 的 `onPress` 事件需要客户端交互

## 首页热门帖子

获取评论数最多的帖子作为热门帖子：

```ts
// src/prisma/queries/posts.ts
export function fetchTopPosts(): Promise<PostWithData[]> {
  return prisma.post.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    include: {
      topic: { select: { name: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
    take: 5,
  });
}
```

### orderBy 说明

```ts
orderBy: [
  {
    comments: {
      _count: "desc",  // 按评论数量降序排列
    },
  },
],
```

### take 参数

`take: 5` 限制返回前 5 条记录。

## 添加 Logo 链接

给 Header 中的 Logo 添加首页链接：

```tsx
// src/components/header.tsx
import Link from "next/link";

<NavbarBrand>
  <Link href="/" className="flex items-center">
    <AcmeLogo />
    <p className="font-bold text-inherit">DISCUSS</p>
  </Link>
</NavbarBrand>
```

## 帖子详情页完整实现

### 静态页面结构

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
import { Button, Textarea } from "@nextui-org/react";

interface PostShowPageProps {
  params: {
    name: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold my-2">Title</h1>
      <p className="p-4 border rounded">Content</p>
    </div>
  );
}
```

### 获取帖子详情

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
import { prisma } from "@/prisma";
import { notFound } from "next/navigation";

interface PostShowPageProps {
  params: {
    name: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const post = await prisma.post.findFirst({
    where: { id: params.postId },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold my-2">{post.title}</h1>
      <p className="p-4 border rounded">{post.content}</p>
    </div>
  );
}
```

### notFound 函数

```ts
import { notFound } from "next/navigation";

if (!post) {
  notFound();  // 显示 404 页面
}
```

当帖子不存在时，调用 `notFound()` 会渲染 `not-found.tsx` 页面。

## 路由结构

```
src/app/
├── page.tsx                           # 首页（热门帖子）
└── topics/
    └── [name]/
        ├── page.tsx                   # 话题详情页（帖子列表）
        └── posts/
            └── [postId]/
                └── page.tsx           # 帖子详情页
```

## 数据流向

```
首页
├── fetchTopPosts() → 热门帖子列表
└── TopicList → 话题列表

话题详情页 /topics/[name]
├── fetchPostsByTopicName(name) → 该话题的帖子列表
└── PostCreateForm → 创建新帖子

帖子详情页 /topics/[name]/posts/[postId]
└── prisma.post.findFirst() → 帖子详情
```

## Prisma 查询对比

| 查询 | 用途 | 关键参数 |
|------|------|----------|
| `findMany` | 获取多条记录 | `where`, `include`, `orderBy`, `take` |
| `findFirst` | 获取单条记录 | `where` |
| `_count` | 统计关联数量 | `select: { comments: true }` |

## 页面效果

### 话题详情页

```
┌─────────────────────────────────────────┐
│  javascript          [Create a Post]    │
│  ┌──────────────────────────────────┐   │
│  │ How to learn JS                  │   │
│  │ Start with basics...   5 comments│   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ Best practices                   │   │
│  │ Use ESLint...          3 comments│   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 帖子详情页

```
┌─────────────────────────────────────────┐
│  How to learn JavaScript                │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  │  Start with the basics and      │   │
│  │  practice every day...          │   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```
