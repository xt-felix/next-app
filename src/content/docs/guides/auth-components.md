---
title: 登录与退出
description: 服务端组件和客户端组件中的登录退出实现
---

## 登录后重定向

默认情况下登录成功后会跳转到首页。如果期望登录成功后跳转到其他页面，可以使用 `redirectTo` 参数：

```ts
await signIn("github", { redirectTo: "/dashboard" });
```

## 服务端组件中的登录/退出

在服务端组件中，`signIn` 和 `signOut` 函数从 `@/auth` 导入：

### 登录按钮

```tsx
// src/components/sign-button.tsx
import { signIn } from "@/auth";

export default async function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button type="submit">Signin with GitHub</button>
    </form>
  );
}
```

### 退出按钮

```tsx
// src/components/signout-button.tsx
import { signOut } from "@/auth";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
```

## 客户端组件中的登录/退出

在客户端组件中，写法有所不同。`signIn` 和 `signOut` 函数需要从 `next-auth/react` 导入：

### 登录按钮

```tsx
// src/components/client-sign-button.tsx
"use client";

import { signIn } from "next-auth/react";

export default function ClientSignIn() {
  return (
    <button onClick={() => signIn("github")}>
      Signin with GitHub
    </button>
  );
}
```

### 退出按钮

```tsx
// src/components/client-signout-button.tsx
"use client";

import { signOut } from "next-auth/react";

export default function ClientSignOut() {
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
```

### 带重定向的登录/退出

```tsx
"use client";

import { signIn, signOut } from "next-auth/react";

export default function AuthButtons() {
  return (
    <div>
      <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
        登录
      </button>
      <button onClick={() => signOut({ callbackUrl: "/" })}>
        退出
      </button>
    </div>
  );
}
```

## 对比总结

| 场景 | 导入来源 | 调用方式 |
|------|----------|----------|
| 服务端组件 | `@/auth` | Server Action（form action） |
| 客户端组件 | `next-auth/react` | 事件处理函数（onClick） |

### 服务端组件

```tsx
import { signIn, signOut } from "@/auth";

// 使用 form action + "use server"
<form action={async () => {
  "use server";
  await signIn("github");
}}>
```

### 客户端组件

```tsx
"use client";
import { signIn, signOut } from "next-auth/react";

// 使用 onClick
<button onClick={() => signIn("github")}>
```

## 配置 SessionProvider

在客户端组件中使用 `next-auth/react` 的功能，需要在根布局中配置 `SessionProvider`：

```tsx
// app/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

:::tip[提示]
`SessionProvider` 是客户端组件，但可以直接在 Server Component 的 layout 中使用，因为它会自动处理客户端渲染。
:::

## 获取会话信息

### 服务端组件

```tsx
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      {session?.user ? (
        <p>欢迎, {session.user.name}</p>
      ) : (
        <p>未登录</p>
      )}
    </div>
  );
}
```

### 客户端组件

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>加载中...</p>;
  }

  return (
    <div>
      {session?.user ? (
        <p>欢迎, {session.user.name}</p>
      ) : (
        <p>未登录</p>
      )}
    </div>
  );
}
```
