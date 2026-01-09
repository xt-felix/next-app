---
title: 搜索功能
description: 实现帖子搜索功能，支持按标题和内容搜索
---

## 功能概述

实现根据帖子标题和内容进行搜索的功能：

1. 用户在搜索框输入内容，敲回车
2. 跳转到搜索页面，URL 带上搜索参数
3. 搜索页面根据参数查询数据库
4. 渲染匹配的帖子列表

## 抽离搜索组件

使用 NextUI Input 组件创建搜索框：

```tsx
// src/components/search-input.tsx
import { Input } from "@nextui-org/react";

export default function SearchInput() {
  return (
    <div className="w-[190px] rounded-2xl flex justify-center items-center bg-gradient-to-tr from-purple-200 to-white text-white">
      <Input
        name="pnameorcon"
        isClearable
        classNames={{
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "!bg-default-200/50",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "!cursor-text",
          ],
        }}
        placeholder="Type to search..."
        radius="lg"
      />
    </div>
  );
}
```

### Input classNames 说明

| 属性 | 说明 |
|------|------|
| `input` | 输入框本身的样式 |
| `innerWrapper` | 内部包装器样式 |
| `inputWrapper` | 外部包装器样式 |

## 搜索 Server Action

敲回车时调用 Server Action，跳转到搜索页面并带上参数：

```ts
// src/actions/search.ts
"use server";

import { redirect } from "next/navigation";

export async function search(formData: FormData) {
  const pnameorcon = formData.get("pnameorcon");

  if (typeof pnameorcon !== "string" || !pnameorcon) {
    redirect("/");
  }

  redirect(`/search?pnameorcon=${pnameorcon}`);
}
```

### 调用 Server Action

```tsx
// src/components/search-input.tsx
import { Input } from "@nextui-org/react";
import * as actions from "@/actions";

export default function SearchInput() {
  return (
    <div className="w-[190px] rounded-2xl flex justify-center items-center bg-gradient-to-tr from-purple-200 to-white text-white">
      <form action={actions.search}>
        <Input
          name="pnameorcon"
          // ...
        />
      </form>
    </div>
  );
}
```

## 搜索页面

创建搜索结果页面，接收 URL 参数：

```tsx
// src/app/search/page.tsx
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    pnameorcon: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { pnameorcon } = await searchParams;

  if (!pnameorcon) {
    redirect("/");
  }

  return <div>{pnameorcon}</div>;
}
```

### searchParams 说明

在 Next.js 15 中，`searchParams` 是一个 Promise，需要 `await` 获取：

```ts
const { pnameorcon } = await searchParams;
```

## 数据库查询方法

使用 Prisma 的 `OR` 和 `contains` 进行模糊搜索：

```ts
// src/prisma/queries/posts.ts
export function fetchPostsByPnameorcon(pnameorcon: string): Promise<PostWithData[]> {
  return prisma.post.findMany({
    include: {
      topic: { select: { name: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
    where: {
      OR: [
        { title: { contains: pnameorcon } },
        { content: { contains: pnameorcon } },
      ],
    },
  });
}
```

### Prisma 查询条件说明

| 条件 | 说明 |
|------|------|
| `OR` | 满足任一条件即可 |
| `AND` | 必须满足所有条件 |
| `contains` | 包含指定字符串（模糊匹配） |
| `startsWith` | 以指定字符串开头 |
| `endsWith` | 以指定字符串结尾 |

## 完整搜索页面

```tsx
// src/app/search/page.tsx
import PostList from "@/components/posts/post-list";
import { fetchPostsByPnameorcon } from "@/prisma/queries/posts";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    pnameorcon: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { pnameorcon } = await searchParams;

  if (!pnameorcon) {
    redirect("/");
  }

  const posts = await fetchPostsByPnameorcon(pnameorcon);

  return <PostList posts={posts} />;
}
```

## 回显搜索内容

将搜索组件改为客户端组件，同步 URL 参数到输入框：

```tsx
// src/components/search-input.tsx
"use client";
import { Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import * as actions from "@/actions";
import { useSearchParams } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const [searchCon, setSearchCon] = useState(
    searchParams.get("pnameorcon") || ""
  );

  // 监听 URL 参数变化，同步到输入框
  useEffect(() => {
    setSearchCon(searchParams.get("pnameorcon") || "");
  }, [searchParams]);

  return (
    <div className="w-[190px] rounded-2xl flex justify-center items-center bg-gradient-to-tr from-purple-200 to-white text-white">
      <form action={actions.search}>
        <Input
          value={searchCon}
          onChange={(e) => {
            setSearchCon(e.target.value);
          }}
          isClearable
          name="pnameorcon"
          classNames={{
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "!bg-default-200/50",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "!cursor-text",
            ],
          }}
          placeholder="Type to search..."
          radius="lg"
        />
      </form>
    </div>
  );
}
```

### useSearchParams Hook

```ts
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const value = searchParams.get("pnameorcon"); // 获取 URL 参数
```

## 搜索流程

```
用户输入搜索内容
    │
    ▼
敲回车提交表单
    │
    ▼
调用 search Server Action
    │
    ▼
redirect 到 /search?pnameorcon=xxx
    │
    ▼
搜索页面获取 searchParams
    │
    ▼
调用 fetchPostsByPnameorcon 查询数据库
    │
    ▼
渲染 PostList 组件
```

## 文件结构

```
src/
├── actions/
│   └── search.ts                    # 搜索 Server Action
├── app/
│   └── search/
│       └── page.tsx                 # 搜索结果页面
├── components/
│   └── search-input.tsx             # 搜索输入组件
└── prisma/
    └── queries/
        └── posts.ts                 # 添加 fetchPostsByPnameorcon
```

## 关键点总结

| 功能 | 实现方式 |
|------|----------|
| 表单提交 | form + Server Action |
| URL 参数传递 | redirect 带查询参数 |
| 获取 URL 参数 | searchParams (服务端) / useSearchParams (客户端) |
| 模糊搜索 | Prisma `OR` + `contains` |
| 输入框回显 | useState + useEffect 监听 URL 变化 |
