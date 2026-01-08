---
title: Snippets Project
description: 使用 Next.js 构建一个完整的代码片段管理应用
---

## 项目概述

这是一个综合性的案例项目，通过实践学习 Next.js 的各种知识点。项目包含完整的增删改查功能。

**线上效果预览**：https://snippets-1tbv24oz5-ifers-projects.vercel.app/

### 功能说明

- **首页**：代码片段列表，点击 New 按钮跳转到新增界面
- **新增页面**：`/snippets/new`，添加新的代码片段
- **详情页面**：`/snippets/[id]`，查看代码片段详情（动态路由）
- **编辑页面**：`/snippets/[id]/edit`，编辑代码片段
- **删除功能**：在详情页面删除代码片段

## 项目搭建

### 1. 创建项目

```bash
npx create-next-app@14
```

:::note[版本说明]
这里使用 Next.js 14 版本进行演示。
:::

### 2. 安装和配置 Prisma

使用 Prisma ORM 操作 SQLite 数据库：

```bash
# 安装 Prisma
npm i prisma

# 初始化 Prisma 并指定数据库类型为 sqlite
npx prisma init --datasource-provider sqlite
```

执行后会生成：
- `.env` 文件：指定数据库存放路径
- `prisma/schema.prisma` 文件：配置文件

### 3. 定义数据模型

编辑 `prisma/schema.prisma`：

```prisma
model Snippet {
  id    Int     @id @default(autoincrement())
  title String
  code  String
}
```

### 4. 创建数据库表和客户端

```bash
# 根据 Prisma 模型创建数据库表
npx prisma db push

# 生成 Prisma 客户端用于操作数据库
npx prisma generate
```

### 5. 创建数据库客户端

```ts
// src/db/index.ts
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();
```

## 添加功能

### 页面结构

创建添加页面：`src/app/snippets/new/page.tsx`

```tsx
import { db } from "@/db";
import { redirect } from "next/navigation";

export default function SnippetCreatePage() {
  async function createSnippet(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const code = formData.get("code") as string;

    await db.snippet.create({
      data: { title, code },
    });

    redirect("/");
  }

  return (
    <form action={createSnippet}>
      <h3 className="font-bold m-3">Create a Snippet</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label htmlFor="title" className="w-12">
            Title
          </label>
          <input name="title" className="border rounded p-2 w-full" id="title" />
        </div>
        <div className="flex gap-4">
          <label htmlFor="code" className="w-12">
            Code
          </label>
          <textarea name="code" className="border rounded p-2 w-full" id="code" />
        </div>
        <button type="submit" className="rounded p-2 bg-blue-200">
          Create
        </button>
      </div>
    </form>
  );
}
```

### 布局调整

```tsx
// src/app/layout.tsx
<div className="container mx-auto px-12">{children}</div>
```

## 展示首页

```tsx
// src/app/page.tsx
import { db } from "@/db";
import Link from "next/link";

export default async function Home() {
  const snippets = await db.snippet.findMany();

  const renderedSnippets = snippets.map((snippet) => {
    return (
      <Link
        href={`/snippets/${snippet.id}`}
        key={snippet.id}
        className="flex justify-between items-center p-2 border rounded"
      >
        <div>{snippet.title}</div>
        <div>View</div>
      </Link>
    );
  });

  return (
    <div>
      <div className="flex m-2 justify-between items-center">
        <h1 className="text-xl font-bold">Snippets</h1>
        <Link href="/snippets/new" className="border p-2 rounded">
          New
        </Link>
      </div>
      <div className="flex flex-col gap-2">{renderedSnippets}</div>
    </div>
  );
}
```

## 展示详情

创建详情页面：`src/app/snippets/[id]/page.tsx`

```tsx
import { db } from "@/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SnippetShowPageProps {
  params: {
    id: string;
  };
}

export default async function Page(props: SnippetShowPageProps) {
  const snippet = await db.snippet.findFirst({
    where: {
      id: parseInt(props.params.id),
    },
  });

  if (!snippet) {
    return notFound();
  }

  return (
    <>
      <div className="flex m-4 justify-between items-center">
        <h1 className="text-xl font-bold">{snippet.title}</h1>
        <div className="flex gap-4">
          <Link href={`/snippets/${snippet.id}/edit`} className="p-2 border rounded border-teal-500">
            Edit
          </Link>
          <button className="p-2 border rounded border-teal-500">Delete</button>
        </div>
      </div>
      <pre className="p-3 border rounded bg-gray-200 border-gray-200">
        <code>{snippet.code}</code>
      </pre>
    </>
  );
}
```

:::note[Next.js 15 版本注意]
在 Next.js 15 中，获取动态路由参数需要使用 `await`：

```tsx
interface SnippetShowPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: SnippetShowPageProps) {
  const { id } = await props.params;
  // ...
}
```
:::

### Not Found 页面

```tsx
// src/app/snippets/[id]/not-found.tsx
export default function SnippetNotFound() {
  return (
    <div>
      <h1 className="text-xl bold">
        Sorry, but we couldn't find that particular snippet.
      </h1>
    </div>
  );
}
```

### Loading 页面

```tsx
// src/app/snippets/[id]/loading.tsx
export default function SnippetLoadingPage() {
  return <div>Loading...</div>;
}
```

## 删除功能

### 方式一：事件绑定

定义 Server Action：

```ts
// src/actions/index.ts
"use server";

import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id },
  });
  revalidatePath("/");
  redirect("/");
}
```

创建删除按钮组件：

```tsx
// src/components/snippet-del-button.tsx
"use client";

import { deleteSnippet } from "@/actions";
import { startTransition } from "react";

export default function SnippetDelButton(props: { id: number }) {
  const handleDelete = () => {
    // 使用 startTransition 确保数据变更完成后再导航
    startTransition(async () => {
      await deleteSnippet(props.id);
    });
  };

  return (
    <button onClick={handleDelete} className="p-2 border rounded border-teal-500">
      Delete
    </button>
  );
}
```

### 方式二：Form 表单配合 Server Action

```tsx
// src/app/snippets/[id]/page.tsx
import * as actions from "@/actions";

export default async function SnippetShowPage(props: SnippetShowPageProps) {
  // ...
  const deleteSnippetAction = actions.deleteSnippet.bind(null, snippet.id);

  return (
    <div>
      <form action={deleteSnippetAction}>
        <button className="p-2 border rounded">Delete</button>
      </form>
    </div>
  );
}
```

:::tip[推荐]
官方更推荐 Form 表单配合 Server Action 的方式，因为它支持渐进增强，即使禁用 JavaScript 也能正常工作。
:::

## 编辑功能

### 编辑页面

```tsx
// src/app/snippets/[id]/edit/page.tsx
import { db } from "@/db";
import { notFound } from "next/navigation";
import SnippetEditForm from "@/components/snippet-edit-form";

interface SnippetEditPageProps {
  params: {
    id: string;
  };
}

export default async function SnippetEditPage(props: SnippetEditPageProps) {
  const id = parseInt(props.params.id);
  const snippet = await db.snippet.findFirst({
    where: { id },
  });

  if (!snippet) {
    return notFound();
  }

  return <SnippetEditForm snippet={snippet} />;
}
```

### 编辑表单组件

安装 Monaco Editor：

```bash
npm install @monaco-editor/react
# Next.js 15 需要添加 --legacy-peer-deps
npm install @monaco-editor/react --legacy-peer-deps
```

```tsx
// src/components/snippet-edit-form.tsx
"use client";

import type { Snippet } from "@prisma/client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import * as actions from "@/actions";

interface SnippetEditFormProps {
  snippet: Snippet;
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code);

  const handleEditorChange = (value: string = "") => {
    setCode(value);
  };

  const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);

  return (
    <div>
      <Editor
        height="40vh"
        theme="vs-dark"
        language="javascript"
        defaultValue={snippet.code}
        options={{
          minimap: { enabled: false },
        }}
        onChange={handleEditorChange}
      />
      <form action={editSnippetAction}>
        <button type="submit" className="p-2 border rounded">
          Save
        </button>
      </form>
    </div>
  );
}
```

### 编辑 Server Action

```ts
// src/actions/index.ts
export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}
```

## 表单验证

### 使用 useFormState

```tsx
// src/app/snippets/new/page.tsx
"use client";

import { useFormState } from "react-dom";
import { createSnippet } from "@/actions";

const initState = { message: "" };

export default function Page() {
  const [state, formAction] = useFormState(createSnippet, initState);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label htmlFor="title" className="w-12">Title</label>
          <input name="title" className="border rounded p-2 w-full" id="title" />
        </div>
        <div className="flex gap-4">
          <label htmlFor="code" className="w-12">Code</label>
          <textarea name="code" className="border rounded p-2 w-full" id="code" />
        </div>
        {state.message && (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {state.message}
          </div>
        )}
        <button className="rounded p-2 bg-blue-200" type="submit">
          Create
        </button>
      </div>
    </form>
  );
}
```

:::note[Next.js 15 版本注意]
在 Next.js 15 / React 19 中，`useFormState` 改为 `useActionState`，从 `react` 中引入：

```tsx
import { useActionState } from "react";

const [formState, action] = useActionState(actions.createSnippet, { message: "" });
```
:::

### Server Action 验证

```ts
// src/actions/index.ts
export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;

    if (typeof title !== "string" || title.length < 3) {
      return { message: "Title must be longer" };
    }
    if (typeof code !== "string" || code.length < 3) {
      return { message: "Code must be longer" };
    }

    await db.snippet.create({
      data: { title, code },
    });

    revalidatePath("/");
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message };
    }
    return { message: "Something went wrong..." };
  }

  redirect("/");
}
```

:::caution[注意]
不要把 `redirect` 放在 `try` 块中，否则 catch 捕获的会是 redirect 的错误。
:::

### 错误边界

```tsx
// src/app/snippets/new/error.tsx
"use client";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return <div>{error.message}</div>;
}
```

## 关于构建和缓存

### 问题：添加的数据刷新后不见了

首页 `/` 是静态渲染，走的是完整路由缓存。

### 解决方案

#### 方案一：基于时间的重新验证

```tsx
export const revalidate = 3;

export default async function Page() {
  const snippets = await db.snippet.findMany();
  return <div>{/* ... */}</div>;
}
```

#### 方案二：按需重新验证

在 Server Action 中调用：

```ts
import { revalidatePath } from "next/cache";

// 在 deleteSnippet、createSnippet 等操作后
revalidatePath("/");
```

#### 方案三：强制动态渲染

```tsx
export const revalidate = 0;
// 或
export const dynamic = "force-dynamic";
```

## 静态生成（SSG）

动态路由不一定是动态渲染。可以使用 `generateStaticParams` 在构建时预生成页面：

```tsx
// src/app/snippets/[id]/page.tsx
export async function generateStaticParams() {
  const snippets = await db.snippet.findMany();

  return snippets.map((snippet) => ({
    id: snippet.id.toString(),
  }));
}
```

构建时会自动调用此函数，为每个代码片段生成静态页面。

### 注意：编辑后需要重新验证

```ts
// src/actions/index.ts
export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });
  // 重新验证详情页面的缓存
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}
```

## 项目目录结构

```
src/
├── actions/
│   └── index.ts              # Server Actions
├── components/
│   ├── snippet-del-button.tsx
│   └── snippet-edit-form.tsx
├── db/
│   └── index.ts              # Prisma 客户端
└── app/
    ├── page.tsx              # 首页（列表）
    └── snippets/
        ├── new/
        │   └── page.tsx      # 新增页面
        └── [id]/
            ├── page.tsx      # 详情页面
            ├── not-found.tsx
            ├── loading.tsx
            ├── error.tsx
            └── edit/
                └── page.tsx  # 编辑页面
prisma/
└── schema.prisma             # 数据模型
```

## 总结

| 功能 | 实现方式 |
|------|---------|
| 数据存储 | Prisma + SQLite |
| 数据获取 | 服务端组件直接查询 |
| 数据变更 | Server Action |
| 表单提交 | form action + Server Action |
| 表单验证 | useFormState + Server Action 验证 |
| 缓存更新 | revalidatePath |
| 静态生成 | generateStaticParams |
