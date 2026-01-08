---
title: Server Action
description: 深入理解 Next.js 中的 Server Action
---

## 什么是 Server Action

Server Action 是指在服务端执行的异步函数，它可以在服务端和客户端组件中被使用。定义一个 Server Action 需要使用 React 的 `"use server"` 指令。

## 定义方式

### 1. 函数级别

将 `"use server"` 放到一个 async 函数的顶部：

```tsx
export default function Page() {
  // Server Action
  async function create() {
    "use server";
    // ...
  }

  return (
    // ...
  );
}
```

### 2. 模块级别

将 `"use server"` 指令放到一个单独的 ts 文件的顶部，该文件导出的所有函数都是 Server Action：

```ts
// app/actions.ts
"use server";

export async function addTodo() {
  // ...
}

export async function delTodo() {
  // ...
}
```

:::caution[注意]
- 在**服务端组件**中使用 Server Action 时，两种级别的语法都可以
- 在**客户端组件**中使用时，只支持模块级别
:::

### 客户端组件中使用的另一种方式

可以将服务端组件中的 Server Action 作为 props 传给客户端组件：

```tsx
// 服务端组件
export default function Page() {
  async function updateItem() {
    "use server";
    // ...
  }
  return <ClientComponent updateItem={updateItem} />;
}
```

```tsx
// 客户端组件
"use client";

export default function ClientComponent({ updateItem }) {
  return <form action={updateItem}>{/* ... */}</form>;
}
```

## 使用举例

### 传统方式（API 接口）

首先看不使用 Server Action 的传统写法，需要创建 API 接口：

```ts
// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";

const data = ["吃饭", "睡觉", "打豆豆"];

export async function GET() {
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const todo = formData.get("todo") as string;
  data.push(todo);
  return NextResponse.json({ data });
}
```

```tsx
// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await (await fetch("/api/todos")).json();
      setTodos(data);
    };
    fetchData();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/todos", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const { data } = await response.json();
    setTodos(data);
  }

  return (
    <div className="p-10">
      <form onSubmit={onSubmit}>
        <input type="text" name="todo" className="border p-2" />
        <button type="submit" className="border ml-2 p-2">
          提交
        </button>
      </form>
      <ul className="leading-8 mt-4">
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Server Action 方式

Server Action 通常与 `<form>` 表单一起使用，可以在前端直接调用，无需编写 API 接口：

```ts
// src/actions/index.ts
"use server";

import { revalidatePath } from "next/cache";

const data = ["吃饭", "睡觉", "打豆豆"];

export async function getTodo() {
  return data;
}

export async function addTodo(formData: FormData) {
  const todo = formData.get("todo") as string;
  data.push(todo);
  revalidatePath("/");
}
```

```tsx
// src/app/page.tsx
import { getTodo, addTodo } from "@/actions";

export default async function Page() {
  const todos = await getTodo();
  return (
    <div className="p-10">
      {/* React 扩展了 HTML <form> 元素以允许使用 action 属性调用 Server Action */}
      <form action={addTodo}>
        <input type="text" name="todo" className="border p-2" />
        <button type="submit" className="border ml-2 p-2">
          Add
        </button>
      </form>
      <ul className="leading-8 mt-4">
        {todos.map((todo: string, i: number) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

:::tip[提示]
点击按钮后如果数据没有变化，是因为客户端缓存导致的，使用 `revalidatePath("/")` 或 `revalidateTag('xxx')` 更新即可。
:::

### Server Action 的好处

1. **代码简洁**：不需要手动创建接口
2. **复用方便**：Server Actions 是函数，可以在应用程序的任意位置复用
3. **渐进式增强**：结合 form 使用时，即使禁用 JavaScript，表单也可以正常提交

### 传递额外参数

#### 方式一：包装函数

在 Server Action 外面再套一层函数：

```tsx
const addTodoWithId = async (id: string, formData: FormData) => {
  "use server";
  // 可以访问 id 和 formData
};

// 使用
<form action={addTodoWithId.bind(null, "123")}>
```

#### 方式二：bind 方式

```tsx
const addTodoWithId = addTodo.bind(null, userId);

<form action={addTodoWithId}>
```

## 配合事件使用

Server Actions 还可以配合事件处理程序、useEffect、第三方库等一起使用。

由于要用到点击事件，需要把组件声明为客户端组件。但不建议直接在页面顶部添加 `"use client"`，因为这会把整个页面的代码都打包到客户端，增加客户端负担。

**最佳实践**：将客户端组件下沉，单独抽离：

```tsx
// src/components/client-button.tsx
"use client";

import { addTodo } from "@/actions";

export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="border p-2 ml-2"
      onClick={async () => {
        const form = new FormData();
        form.append("todo", "🤠");
        await addTodo(form);
      }}
    >
      {children}
    </button>
  );
}
```

在页面中引入这个 Button 组件即可。

## useFormStatus

`useFormStatus` 是 React 官方的 hook，用于返回表单提交的状态信息。

:::caution[注意]
不能和 form 标签直接放在同一个组件中！
:::

错误写法：

```tsx
export default function Page() {
  // pending will never be true
  const { pending } = useFormStatus();
  return (
    <form action={addTodo}>
      <button disabled={pending}>
        {pending ? "Adding" : "Add"}
      </button>
    </form>
  );
}
```

正确写法：将 `useFormStatus` 放到 form 标签下的子组件内部：

```tsx
// src/components/submit-button.tsx
"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="border ml-2 p-2">
      {pending ? "Adding" : "Add"}
    </button>
  );
}
```

:::note[版本说明]
- **React 18 / Next.js 14**：`useFormStatus` 从 `react-dom` 引入（实验性 API）
- **React 19 / Next.js 15**：`useFormStatus` 和 `useFormState` 被替换为 `useActionState`，从 `react` 引入
:::

## useFormState

`useFormState` 可以拿到函数或 Server Action 的返回结果。

### 语法格式

```ts
const [state, formAction] = useFormState(serverAction, initialState);
```

- 接收一个函数（Server Action）和一个初始值
- 返回数组：`[state, formAction]`
- Server Action 会有两个参数：`prevState` 和 `formData`

### 使用示例

将 form 抽离为客户端组件：

```tsx
// src/components/submit-form.tsx
"use client";

import { addTodo } from "@/actions";
import SubmitButton from "@/components/submit-button";
import ClientButton from "@/components/client-button";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

export default function SubmitForm() {
  const [state, formAction] = useFormState(addTodo, initialState);

  return (
    <>
      <form action={formAction}>
        <input type="text" name="todo" className="border p-2" />
        <SubmitButton />
        <ClientButton>牛牛</ClientButton>
      </form>
      <p className="text-teal-500 mt-4 text-sm">{state?.message}</p>
    </>
  );
}
```

修改 Server Action 以支持 `useFormState`：

```ts
// src/actions/index.ts
"use server";

import { revalidatePath } from "next/cache";

const data = ["吃饭", "睡觉", "打豆豆"];

export async function getTodo() {
  return data;
}

export async function addTodo(prevState: { message: string }, formData: FormData) {
  const todo = formData.get("todo") as string;
  data.push(todo);

  revalidatePath("/");

  return {
    ...prevState,
    message: `add ${todo} success!`,
  };
}
```

## 表单验证

### 基本验证

使用 HTML 元素自带的验证属性：

```tsx
<input type="text" name="todo" className="border p-2" required />
<input type="email" name="email" />
```

### 使用 zod 进行高阶验证

安装 zod：

```bash
npm install zod
```

定义 Schema：

```ts
import { z } from "zod";

const todoSchema = z
  .string()
  .min(2, { message: "Must be 2 or more characters long" })
  .max(5, { message: "Must be 5 or fewer characters long" });
```

在 Server Action 中验证：

```ts
export async function addTodo(prevState: { message: string }, formData: FormData) {
  const validatedFields = todoSchema.safeParse(formData.get("todo"));

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().formErrors.toString(),
    };
  }

  // 验证通过，继续处理...
  const todo = validatedFields.data;
  data.push(todo);
  revalidatePath("/");

  return {
    message: `add ${todo} success!`,
  };
}
```

## 错误处理

### 方式一：try-catch 返回错误信息

```ts
export async function addTodo(prevState: { message: string }, formData: FormData) {
  try {
    // 业务逻辑...
    return { message: "success" };
  } catch (error) {
    return { message: "操作失败，请重试" };
  }
}
```

在页面中展示错误信息。

### 方式二：throw Error

```ts
export async function addTodo(formData: FormData) {
  // ...
  throw new Error("This is error in the Server Action");
}
```

错误会由最近的 `error.tsx` 页面进行处理。

:::note[注意]
Error boundaries 必须是客户端组件（Client Components）。
:::

## 完整示例目录结构

```
src/
├── actions/
│   └── index.ts              # Server Actions
├── components/
│   ├── submit-form.tsx       # 表单组件（客户端）
│   ├── submit-button.tsx     # 提交按钮（客户端）
│   └── client-button.tsx     # 客户端按钮
└── app/
    └── page.tsx              # 页面（服务端）
```

## 总结

| 场景 | 推荐方式 |
|------|---------|
| 表单提交 | form action + Server Action |
| 获取提交状态 | useFormStatus |
| 获取返回结果 | useFormState |
| 事件处理中调用 | 抽离客户端组件 |
| 表单验证 | HTML 原生 + zod |
| 错误处理 | try-catch 或 throw Error |
