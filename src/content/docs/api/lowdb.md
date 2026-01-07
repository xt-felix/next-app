---
title: 集成 lowdb
description: 使用 lowdb 实现简单的数据持久化
---

## 什么是 lowdb？

[lowdb](https://github.com/typicode/lowdb) 是一个轻量级的本地 JSON 数据库，适合用于：

- 小型项目和原型开发
- 学习和演示
- 不需要复杂数据库的场景

## 安装

```bash
npm install lowdb
```

## 配置数据库

创建 `src/db.ts` 文件：

```ts
// src/db.ts
import { JSONFilePreset } from "lowdb/node";

interface IData {
  posts: { id: string; title: string; content: string }[];
}

// Read or create db.json
const defaultData = { posts: [] } as IData;

// 注意 db.json 是相对于命令行的目录
const db = await JSONFilePreset("db.json", defaultData);

export default db;
```

:::caution[注意]
`db.json` 文件路径是相对于项目根目录（命令行执行目录），而不是相对于 `db.ts` 文件。
:::

## 新增数据

```ts
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

interface IBody {
  title: string;
  content: string;
}

export async function POST(request: NextRequest) {
  const article: IBody = await request.json();

  await db.update(({ posts }) => {
    posts.unshift({
      id: Math.random().toString(36).slice(-8),
      ...article,
    });
  });

  return NextResponse.json({
    code: 0,
    message: "添加成功",
  });
}
```

### 另一种写法

```ts
// 使用 db.data 直接操作
db.data.posts.unshift({
  id: Math.random().toString(36).slice(-8),
  ...article,
});
await db.write();
```

## 删除数据

```ts
// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

export const DELETE = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  const id = params.id;

  await db.update(({ posts }) =>
    posts.splice(
      posts.findIndex((item) => item.id === id),
      1
    )
  );

  return NextResponse.json({
    code: 0,
    message: "删除成功",
  });
};
```

### 另一种写法

```ts
// 使用 db.data 直接操作
db.data.posts.splice(
  db.data.posts.findIndex((item) => item.id === id),
  1
);
await db.write();
```

## 修改数据

```ts
// src/app/api/posts/[id]/route.ts
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { title, content } = await request.json();

  let idx = 0;
  await db.update(({ posts }) => {
    idx = posts.findIndex((item) => item.id === params.id);
    posts[idx].title = title;
    posts[idx].content = content;
  });

  return NextResponse.json({
    code: 0,
    message: "编辑成功",
    data: db.data.posts[idx],
  });
};
```

### 另一种写法

```ts
// 使用 db.data 直接操作
const data = db.data.posts;
const idx = data.findIndex((item) => item.id === params.id);
data[idx] = {
  ...data[idx],
  title,
  content,
};
await db.write();
```

## 查询单条数据

```ts
// src/app/api/posts/[id]/route.ts
export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  const post = db.data.posts.find((item) => item.id === params.id);
  return NextResponse.json({
    code: 0,
    message: "获取成功",
    data: post,
  });
};
```

## 分页查询

```ts
// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import db from "@/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pagenum = Number(searchParams.get("pagenum")) || 1;
  const pagesize = Number(searchParams.get("pagesize")) || 2;
  const query = searchParams.get("query") || "";
  const { posts: data } = db.data;

  let filteredData = query
    ? data.filter((item) => {
        const { id, ...rest } = item;
        return Object.values(rest).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase())
        );
      })
    : data;

  const total = filteredData.length;

  // 计算开始和结束索引
  const startIndex = (pagenum - 1) * pagesize;
  // 有可能最后一页不满 pagesize 的情况
  const endIndex = Math.min(startIndex + pagesize, total);

  // 检查开始索引是否超出数组范围
  filteredData =
    startIndex >= total ? [] : filteredData.slice(startIndex, endIndex);

  return NextResponse.json({
    code: 0,
    message: "获取成功",
    data: {
      total,
      list: filteredData,
    },
  });
}
```

:::tip[提示]
上面这种方式写接口，能隐藏 Authorization 等认证信息。
:::

## 参数获取

### 请求参数

```ts
export async function GET(request, context) {
  // 访问 /home, pathname 的值为 /home
  const pathname = request.nextUrl.pathname;
  // 访问 /home?name=lee, searchParams 的值为 { 'name': 'lee' }
  const searchParams = request.nextUrl.searchParams;
}
```

### 动态路由参数

```ts
// app/dashboard/[team]/route.js
// 目前 context 只有一个值就是 params，它是一个包含当前动态路由参数的对象
export async function GET(request, { params }) {
  const team = params.team;
}
```

## db.update vs db.write

| 方法 | 说明 |
|------|------|
| `db.update()` | 在回调中修改数据，自动保存 |
| `db.write()` | 手动保存 `db.data` 到文件 |

推荐使用 `db.update()`，代码更简洁且自动处理保存。

## 目录结构

```
project/
├── src/
│   ├── db.ts                          # 数据库配置
│   └── app/
│       └── api/
│           └── posts/
│               ├── route.ts           # GET / POST
│               └── [id]/
│                   └── route.ts       # PUT / DELETE
└── db.json                            # 数据文件（自动生成）
```

## 接口汇总

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts` | 分页查询列表 |
| POST | `/api/posts` | 新增文章 |
| GET | `/api/posts/[id]` | 查询单条 |
| PATCH | `/api/posts/[id]` | 修改文章 |
| DELETE | `/api/posts/[id]` | 删除文章 |
