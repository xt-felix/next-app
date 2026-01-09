---
title: 客户端获取用户信息
description: 在客户端组件中获取和显示用户会话信息
---

## 配置 SessionProvider

要在客户端组件中使用 `useSession`，需要先配置 `SessionProvider`。

创建一个统一的 Providers 组件：

```tsx
// src/app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}
```

在根布局中使用：

```tsx
// src/app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 使用 useSession 获取用户信息

```tsx
// src/components/client/user-info.tsx
"use client";

import { useSession } from "next-auth/react";

export default function UserInfoClient() {
  const session = useSession();

  if (!session.data?.user) return null;

  return (
    <div>
      <p>{JSON.stringify(session.data)}</p>
      <img src={session.data.user.image} alt="User Avatar" />
    </div>
  );
}
```

## useSession 返回值

`useSession` 返回一个包含以下属性的对象：

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | `Session \| null` | 会话数据，包含用户信息 |
| `status` | `string` | 加载状态：`loading`、`authenticated`、`unauthenticated` |
| `update` | `function` | 更新会话的方法 |

## 处理加载状态

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>加载中...</div>;
  }

  if (status === "unauthenticated") {
    return <div>请先登录</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <img
        src={session?.user?.image || ""}
        alt="头像"
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p className="font-medium">{session?.user?.name}</p>
        <p className="text-sm text-gray-500">{session?.user?.email}</p>
      </div>
    </div>
  );
}
```

## 完整示例：用户头像下拉菜单

```tsx
// src/components/client/user-menu.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          src={session.user.image || ""}
          name={session.user.name || ""}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="用户菜单">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">{session.user.name}</p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </DropdownItem>
        <DropdownItem key="settings">设置</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={() => signOut()}
        >
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
```

## 对比：服务端 vs 客户端获取用户信息

| 场景 | 方法 | 导入来源 |
|------|------|----------|
| 服务端组件 | `await auth()` | `@/auth` |
| 客户端组件 | `useSession()` | `next-auth/react` |

### 服务端组件

```tsx
import { auth } from "@/auth";

export default async function ServerComponent() {
  const session = await auth();
  return <div>{session?.user?.name}</div>;
}
```

### 客户端组件

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session } = useSession();
  return <div>{session?.user?.name}</div>;
}
```
