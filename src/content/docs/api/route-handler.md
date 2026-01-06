---
title: Route Handler
description: 使用路由处理程序创建 API 接口
---

## 什么是路由处理程序？

路由（Route）有两种：

| 类型 | 说明 | 示例 |
|------|------|------|
| 前端路由 | 页面路径与组件的对应关系 | `/about` → AboutPage |
| 后端路由 | 请求地址与处理逻辑的对应关系 | `/api/users` → 返回用户数据 |

Route Handler（路由处理程序）就是 Next.js 中的**后端路由**，用于创建 API 接口。

## 基本约定

### 文件命名

使用 `route.ts`（或 `route.js`）文件定义路由处理程序：

```
app/
└── api/
    └── posts/
        └── route.ts    # → /api/posts
```

:::caution[注意]
`route.ts` 和 `page.tsx` **不能放在同一目录**，因为：
- `route.ts` 负责处理 API 请求
- `page.tsx` 负责渲染页面

如果路径相同，Next.js 不知道该使用哪个逻辑处理。
:::

### 推荐目录结构

习惯上将 API 路由统一放在 `api` 目录下：

```
app/
└── api/
    ├── posts/
    │   ├── route.ts           # /api/posts (列表/新增)
    │   └── [id]/
    │       └── route.ts       # /api/posts/[id] (详情/修改/删除)
    └── users/
        └── route.ts           # /api/users
```

## 支持的 HTTP 方法

```ts
// app/api/posts/route.ts
export async function GET(request: Request) {}
export async function POST(request: Request) {}
export async function PUT(request: Request) {}
export async function PATCH(request: Request) {}
export async function DELETE(request: Request) {}
export async function HEAD(request: Request) {}
export async function OPTIONS(request: Request) {}
```

## 基础示例

### GET 请求

```ts
// app/api/posts/route.ts
import { NextResponse } from "next/server";

const posts = [
  { id: 1, title: "第一篇文章", content: "内容..." },
  { id: 2, title: "第二篇文章", content: "内容..." },
];

export async function GET() {
  return NextResponse.json(posts);
}
```

访问 `/api/posts` 返回：

```json
[
  { "id": 1, "title": "第一篇文章", "content": "内容..." },
  { "id": 2, "title": "第二篇文章", "content": "内容..." }
]
```

### POST 请求

```ts
// app/api/posts/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const newPost = {
    id: Date.now(),
    title: body.title,
    content: body.content,
  };

  // 实际项目中这里会保存到数据库
  return NextResponse.json(newPost, { status: 201 });
}
```

## 动态路由参数

### 获取路由参数

```ts
// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;

  // 根据 id 查询数据
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json(post);
}
```

### PUT/DELETE 请求

```ts
// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string }>;
};

// 更新文章
export async function PUT(request: Request, { params }: Props) {
  const { id } = await params;
  const body = await request.json();

  // 实际项目中更新数据库
  const updatedPost = {
    id: Number(id),
    ...body,
  };

  return NextResponse.json(updatedPost);
}

// 删除文章
export async function DELETE(request: Request, { params }: Props) {
  const { id } = await params;

  // 实际项目中从数据库删除

  return NextResponse.json({ message: "删除成功" });
}
```

## 获取请求信息

### Query 参数

```ts
// app/api/posts/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const keyword = searchParams.get("keyword");

  console.log({ page, limit, keyword });
  // 访问 /api/posts?page=2&limit=5&keyword=next
  // 输出: { page: "2", limit: "5", keyword: "next" }

  return NextResponse.json({ page, limit, keyword });
}
```

### 使用 NextRequest

`NextRequest` 是 Next.js 扩展的 Request 对象，提供更便捷的方法：

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 更简便地获取查询参数
  const page = request.nextUrl.searchParams.get("page");

  // 获取 cookies
  const token = request.cookies.get("token");

  // 获取 headers
  const userAgent = request.headers.get("user-agent");

  return NextResponse.json({ page, token, userAgent });
}
```

### Request Body

```ts
// app/api/posts/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // JSON 数据
  const json = await request.json();

  // FormData 数据
  // const formData = await request.formData();

  // 纯文本
  // const text = await request.text();

  return NextResponse.json(json);
}
```

## 响应处理

### NextResponse 方法

```ts
import { NextResponse } from "next/server";

// JSON 响应
NextResponse.json({ message: "success" });

// 带状态码
NextResponse.json({ error: "Not Found" }, { status: 404 });

// 重定向
NextResponse.redirect(new URL("/login", request.url));

// 设置 Headers
NextResponse.json(data, {
  headers: {
    "Cache-Control": "max-age=3600",
  },
});
```

### 设置 Cookies

```ts
// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });

  // 设置 cookie
  response.cookies.set("token", "abc123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 天
    path: "/",
  });

  return response;
}
```

### 删除 Cookies

```ts
// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete("token");

  return response;
}
```

## CORS 配置

```ts
// app/api/posts/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const data = { message: "Hello" };

  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// 处理预检请求
export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

## 实战：文章 CRUD

### 目录结构

```
app/
└── api/
    └── posts/
        ├── route.ts           # GET(列表) / POST(新增)
        └── [id]/
            └── route.ts       # GET(详情) / PUT(修改) / DELETE(删除)
```

### 模拟数据

```ts
// app/api/posts/data.ts
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// 模拟数据库（实际项目中使用真实数据库）
export const posts: Post[] = [
  {
    id: 1,
    title: "Next.js 入门",
    content: "Next.js 是一个 React 框架...",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Route Handler 详解",
    content: "Route Handler 用于创建 API...",
    createdAt: "2024-01-02",
  },
];
```

### 列表和新增接口

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { posts, Post } from "./data";

// 获取文章列表
export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword");

  let result = posts;

  // 关键词搜索
  if (keyword) {
    result = posts.filter(
      (post) =>
        post.title.includes(keyword) || post.content.includes(keyword)
    );
  }

  return NextResponse.json(result);
}

// 新增文章
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "标题和内容不能为空" },
      { status: 400 }
    );
  }

  const newPost: Post = {
    id: Date.now(),
    title: body.title,
    content: body.content,
    createdAt: new Date().toISOString().split("T")[0],
  };

  posts.push(newPost);

  return NextResponse.json(newPost, { status: 201 });
}
```

### 详情、修改、删除接口

```ts
// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { posts } from "../data";

type Props = {
  params: Promise<{ id: string }>;
};

// 获取文章详情
export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// 修改文章
export async function PUT(request: Request, { params }: Props) {
  const { id } = await params;
  const body = await request.json();

  const index = posts.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  posts[index] = {
    ...posts[index],
    ...body,
  };

  return NextResponse.json(posts[index]);
}

// 删除文章
export async function DELETE(request: Request, { params }: Props) {
  const { id } = await params;

  const index = posts.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  posts.splice(index, 1);

  return NextResponse.json({ message: "删除成功" });
}
```

### 接口测试

```bash
# 获取列表
curl http://localhost:3000/api/posts

# 搜索
curl http://localhost:3000/api/posts?keyword=Next

# 获取详情
curl http://localhost:3000/api/posts/1

# 新增
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"新文章","content":"内容..."}'

# 修改
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"修改后的标题"}'

# 删除
curl -X DELETE http://localhost:3000/api/posts/1
```

## 路由段配置

```ts
// app/api/posts/route.ts

// 动态渲染（默认）
export const dynamic = "force-dynamic";

// 静态渲染
export const dynamic = "force-static";

// 重新验证时间（秒）
export const revalidate = 60;

// 运行时环境
export const runtime = "edge"; // 或 "nodejs"
```

## 前端调用示例

```tsx
"use client";

import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  // 获取列表
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  // 新增文章
  const addPost = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "新文章",
        content: "内容...",
      }),
    });
    const newPost = await res.json();
    setPosts([...posts, newPost]);
  };

  // 删除文章
  const deletePost = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div>
      <button onClick={addPost}>新增文章</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => deletePost(post.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
