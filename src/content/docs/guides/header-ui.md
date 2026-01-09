---
title: 表头界面
description: 使用 NextUI 构建带登录状态的导航栏组件
---

## 概述

使用 NextUI 的 Navbar 组件构建表头，根据用户登录状态显示不同的内容。

## 完整代码

```tsx
// src/components/header.tsx
import { auth } from "@/auth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Avatar, Input, Button } from "@nextui-org/react";
import { ReactNode } from "react";

// Logo 组件
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

  let authContent: ReactNode;

  if (session?.user) {
    // 已登录：显示头像
    authContent = (
      <Avatar
        src={
          session.user.image ||
          "https://avatars.githubusercontent.com/u/172476270?s=40&v=4"
        }
      />
    );
  } else {
    // 未登录：显示登录/注册按钮
    authContent = (
      <>
        <NavbarItem>
          <Button type="submit" color="secondary" variant="bordered">
            Sign In
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button type="submit" color="secondary">
            Sign Up
          </Button>
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

## 组件说明

### Navbar 结构

| 组件 | 说明 |
|------|------|
| `Navbar` | 导航栏容器 |
| `NavbarBrand` | 品牌/Logo 区域 |
| `NavbarContent` | 内容区域，可通过 `justify` 控制位置 |
| `NavbarItem` | 单个导航项 |

### justify 属性

```tsx
<NavbarContent justify="start">  // 左对齐
<NavbarContent justify="center"> // 居中
<NavbarContent justify="end">    // 右对齐
```

## 根据登录状态显示不同内容

```tsx
const session = await auth();

let authContent: ReactNode;

if (session?.user) {
  // 已登录状态
  authContent = <Avatar src={session.user.image} />;
} else {
  // 未登录状态
  authContent = (
    <>
      <Button>Sign In</Button>
      <Button>Sign Up</Button>
    </>
  );
}
```

:::tip[提示]
这是一个服务端组件，使用 `await auth()` 获取会话信息。在服务端渲染时就能确定用户状态，避免客户端闪烁。
:::

## 在布局中使用

```tsx
// src/app/layout.tsx
import Header from "@/components/header";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
```

## 添加登录功能

将按钮与登录功能关联：

```tsx
import { signIn } from "@/auth";

// 在 authContent 中
<NavbarItem>
  <form
    action={async () => {
      "use server";
      await signIn("github");
    }}
  >
    <Button type="submit" color="secondary" variant="bordered">
      Sign In
    </Button>
  </form>
</NavbarItem>
```

## 添加用户下拉菜单

登录后显示带下拉菜单的头像：

```tsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { signOut } from "@/auth";

if (session?.user) {
  authContent = (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          src={session.user.image || ""}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="用户操作">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">{session.user.name}</p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </DropdownItem>
        <DropdownItem key="settings">设置</DropdownItem>
        <DropdownItem key="logout" color="danger">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="w-full text-left">
              退出登录
            </button>
          </form>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
```

## 响应式设计

隐藏小屏幕上的搜索框：

```tsx
<NavbarContent className="hidden sm:flex gap-4" justify="center">
  <NavbarItem>
    <Input placeholder="搜索..." />
  </NavbarItem>
</NavbarContent>
```

- `hidden` - 默认隐藏
- `sm:flex` - 在 sm 断点（640px）及以上显示
