---
title: 添加头像加载状态
description: 在客户端组件中处理 useSession 的加载状态
---

## 概述

使用 `useSession` 获取用户信息时，需要处理加载状态，避免页面闪烁或显示错误内容。

参考文档：[next-auth.js.org/getting-started/client](https://next-auth.js.org/getting-started/client)

## useSession 的 status

`useSession` 返回的 `status` 有三种状态：

| status | 说明 |
|--------|------|
| `loading` | 正在获取会话信息 |
| `authenticated` | 已登录 |
| `unauthenticated` | 未登录 |

## 添加加载状态处理

```tsx
// src/components/header-auth.tsx
"use client";

import * as actions from "@/actions";
import {
  NavbarItem,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function HeaderAuth() {
  const { data: session, status } = useSession();

  let authContent: React.ReactNode;

  // 加载状态
  if (status === "loading") {
    authContent = null;
  } else if (session?.user) {
    // 已登录
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
          <form className="p-4" action={actions.signOut}>
            <Button type="submit">退出</Button>
          </form>
        </PopoverContent>
      </Popover>
    );
  } else {
    // 未登录
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

  return authContent;
}
```

## 加载状态的其他处理方式

### 显示骨架屏

```tsx
if (status === "loading") {
  return (
    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
  );
}
```

### 使用 NextUI Skeleton

```tsx
import { Skeleton } from "@nextui-org/react";

if (status === "loading") {
  return (
    <Skeleton className="rounded-full">
      <div className="w-10 h-10 rounded-full bg-default-300" />
    </Skeleton>
  );
}
```

### 使用 NextUI Spinner

```tsx
import { Spinner } from "@nextui-org/react";

if (status === "loading") {
  return <Spinner size="sm" />;
}
```

## 为什么需要处理加载状态

```
页面加载
    │
    ▼
useSession() 发起请求
    │
    ├── status: "loading" ← 此时 session 为 undefined
    │
    ▼
收到响应
    │
    ├── status: "authenticated" ← session 有数据
    │   或
    └── status: "unauthenticated" ← session 为 null
```

如果不处理 `loading` 状态，在请求完成前会错误地显示「未登录」的 UI，然后突然切换到「已登录」的 UI，造成闪烁。

## 完整状态判断

```tsx
const { data: session, status } = useSession();

if (status === "loading") {
  // 加载中
  return <Skeleton />;
}

if (status === "authenticated") {
  // 已登录，session.user 一定存在
  return <Avatar src={session.user.image} />;
}

// status === "unauthenticated"
// 未登录
return <Button>Sign In</Button>;
```

:::tip[提示]
使用 `status` 判断比直接判断 `session?.user` 更准确，因为它能区分「正在加载」和「未登录」两种状态。
:::
