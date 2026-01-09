---
title: 优化打包性能
description: 解决 auth() 导致页面变成动态渲染的问题
---

## 问题发现

执行 `npm run build` 后，你会发现首页竟然是**动态渲染**的：

```
Route (app)                              Size     First Load JS
┌ ƒ /                                    ...      ...
├ ƒ /404                                 ...      ...
```

`ƒ` 表示动态渲染，而 `○` 表示静态渲染。

明明首页只有简单的内容，按道理应该是静态渲染才对。

## 问题原因

在 Root Layout 中导入了 Header 组件，而 Header 组件使用了 `auth()` 方法：

```tsx
// src/components/header.tsx
const session = await auth(); // 这里是问题所在
```

`auth()` 方法内部使用了 Cookie 相关的操作。根据 Next.js 的规则，使用 `cookies()`、`headers()` 等动态函数会导致页面变成动态渲染。

由于 Header 组件在 Root Layout 中使用，**每一个页面都会受影响变成动态渲染**。

:::caution[代价太大]
仅仅为了使用身份验证就完全放弃静态渲染，性能代价太大了。
:::

## 解决方案

将获取用户信息的逻辑抽离到**客户端组件**中，使用 `useSession` 代替 `auth()`。

`useSession` 内部是通过向后端发请求获取信息，不涉及 Cookie 操作，不会影响页面的渲染方式。

### 创建客户端认证组件

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

参考文档：[next-auth.js.org/getting-started/client](https://next-auth.js.org/getting-started/client)

### 简化 Header 组件

```tsx
// src/components/header.tsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
} from "@nextui-org/react";
import HeaderAuth from "./header-auth";

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

export default function Header() {
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

      <NavbarContent justify="end">
        <HeaderAuth />
      </NavbarContent>
    </Navbar>
  );
}
```

## 改造前后对比

### 改造前

```
Header (Server Component)
└── auth() ← 使用 Cookie，导致动态渲染
```

### 改造后

```
Header (Server Component) ← 可以静态渲染
└── HeaderAuth (Client Component)
    └── useSession() ← 客户端获取，不影响渲染
```

## 打包结果

再次执行 `npm run build`：

```
Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /404                                 ...      ...
```

现在首页变成了 `○` 静态渲染。

## 打包前的准备

在打包之前，确保修复以下问题：

### 1. 清空首页测试内容

```tsx
// src/app/page.tsx
export default function Page() {
  return <div>Hello World</div>;
}
```

### 2. 处理图片可能为空的问题

```tsx
// 给 Avatar 一个默认图片地址
<Avatar
  src={session.user.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
/>
```

### 3. 删除未使用的导入

确保组件中没有未使用的导入，否则会影响打包。

## 总结

| 方法 | 位置 | 是否影响渲染 |
|------|------|-------------|
| `auth()` | 服务端组件 | 会导致动态渲染 |
| `useSession()` | 客户端组件 | 不影响渲染方式 |

:::tip[最佳实践]
需要在服务端组件中使用认证信息时，考虑是否会影响页面渲染。如果不希望影响，可以将认证相关逻辑抽离到客户端组件中使用 `useSession`。
:::
