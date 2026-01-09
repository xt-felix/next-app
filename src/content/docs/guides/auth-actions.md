---
title: 完善登录和退出
description: 使用 Server Actions 封装登录退出逻辑
---

## 概述

将登录和退出逻辑封装为 Server Actions，使代码更加整洁和可复用。

## 创建 Server Actions

### 登录 Action

```ts
// src/actions/sign-in.ts
"use server";

import * as auth from "@/auth";

export async function signIn() {
  return auth.signIn("github");
}
```

### 退出 Action

```ts
// src/actions/sign-out.ts
"use server";

import * as auth from "@/auth";

export async function signOut() {
  return auth.signOut();
}
```

### 统一导出

```ts
// src/actions/index.ts
export { signIn } from "./sign-in";
export { signOut } from "./sign-out";
```

## 更新 Header 组件

```tsx
// src/components/header.tsx
import { auth } from "@/auth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Input,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import * as actions from "@/actions";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default async function Header() {
  const session = await auth();

  let authContent: React.ReactNode;

  if (session?.user) {
    // 已登录：显示头像和退出弹窗
    authContent = (
      <Popover placement="bottom">
        <PopoverTrigger>
          <Avatar
            src={
              session.user.image ||
              "https://i.pravatar.cc/150?u=a042581f4e29026024d"
            }
          />
        </PopoverTrigger>
        <PopoverContent>
          <form action={actions.signOut} className="p-4">
            <Button type="submit">Sign Out</Button>
          </form>
        </PopoverContent>
      </Popover>
    );
  } else {
    // 未登录：显示登录/注册按钮
    authContent = (
      <>
        <NavbarItem className="hidden lg:flex">
          <form action={actions.signIn}>
            <Button type="submit" color="secondary" variant="bordered">
              Sign In
            </Button>
          </form>
        </NavbarItem>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="secondary">
              Sign Up
            </Button>
          </form>
        </NavbarItem>
      </>
    );
  }

  return (
    <Navbar className="border-b-1 border-gray-200">
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">DISCUSS</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Input />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">{authContent}</NavbarContent>
    </Navbar>
  );
}
```

## 关键变化

### 1. 导入 actions

```tsx
import * as actions from "@/actions";
```

使用 `* as actions` 导入所有 actions，可以通过 `actions.signIn`、`actions.signOut` 调用。

### 2. 简化 form action

之前的写法：

```tsx
<form
  action={async () => {
    "use server";
    await signIn("github");
  }}
>
```

现在的写法：

```tsx
<form action={actions.signIn}>
```

更加简洁，逻辑也被封装到独立的文件中。

### 3. 使用 Popover 显示退出按钮

```tsx
<Popover placement="bottom">
  <PopoverTrigger>
    <Avatar src={session.user.image} />
  </PopoverTrigger>
  <PopoverContent>
    <form action={actions.signOut} className="p-4">
      <Button type="submit">Sign Out</Button>
    </form>
  </PopoverContent>
</Popover>
```

点击头像显示弹出层，包含退出按钮。

## 项目结构

```
src/
├── actions/
│   ├── index.ts        # 统一导出
│   ├── sign-in.ts      # 登录 action
│   └── sign-out.ts     # 退出 action
├── auth.ts             # Auth.js 配置
└── components/
    └── header.tsx      # 表头组件
```

## 扩展 Actions

可以继续添加更多 actions：

```ts
// src/actions/index.ts
export { signIn } from "./sign-in";
export { signOut } from "./sign-out";
export { createPost } from "./create-post";
export { createComment } from "./create-comment";
```

## 带参数的 Action

如果需要传递参数，可以使用 `bind`：

```ts
// src/actions/sign-in.ts
"use server";

import * as auth from "@/auth";

export async function signIn(provider: string = "github") {
  return auth.signIn(provider);
}
```

使用时：

```tsx
import { signIn } from "@/actions";

// 绑定参数
const signInWithGoogle = signIn.bind(null, "google");

<form action={signInWithGoogle}>
  <Button type="submit">Sign in with Google</Button>
</form>
```

或者使用隐藏字段：

```tsx
<form action={actions.signIn}>
  <input type="hidden" name="provider" value="google" />
  <Button type="submit">Sign in with Google</Button>
</form>
```
