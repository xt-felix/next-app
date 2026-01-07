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

## 查询数据

```ts
// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import db from "@/db";

export async function GET() {
  return NextResponse.json({
    code: 0,
    data: db.data.posts,
  });
}
```

## 更新数据

```ts
// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();

  await db.update(({ posts }) => {
    const index = posts.findIndex((item) => item.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...body };
    }
  });

  return NextResponse.json({
    code: 0,
    message: "更新成功",
  });
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
