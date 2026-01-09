---
title: 集成 Auth.js
description: 在 Next.js 项目中集成 Auth.js 实现 GitHub 第三方登录
---

## 概述

使用 Auth.js（next-auth）配合 GitHub 实现第三方登录，主要分为三个步骤：

1. **安装 next-auth 并做基础配置**
2. **在 GitHub 注册 OAuth 应用**，获取 `CLIENT_ID` 和 `CLIENT_SECRET`
3. **（可选）配置 Adapter**，将用户信息存储到数据库

## 安装与基础配置

参考 [Auth.js 官方文档](https://authjs.dev/getting-started/installation)

### 安装依赖

```bash
npm install next-auth@beta --legacy-peer-deps
```

### 生成密钥

```bash
npx auth secret
```

这会自动在 `.env.local` 中生成 `AUTH_SECRET`。

### 创建配置文件

```ts
// src/auth.ts
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});
```

### 配置 API 路由

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

### 配置中间件

```ts
// src/middleware.ts
export { auth as middleware } from "@/auth";
```

## 注册 GitHub OAuth 应用

参考 [配置 GitHub OAuth](https://authjs.dev/guides/configuring-github)

### 创建 OAuth App

访问 [github.com/settings/applications/new](https://github.com/settings/applications/new) 创建新应用：

| 字段 | 值 |
|------|-----|
| Application name | Reddit（或你的应用名） |
| Homepage URL | `http://localhost:3000` |
| Application description | （可选） |
| Authorization callback URL | `http://localhost:3000/api/auth/callback/github` |

### 获取凭证

创建完成后：
1. 复制 **Client ID**
2. 点击 **Generate a new client secret** 生成密钥

### 配置环境变量

```bash
# .env.local
AUTH_GITHUB_ID=your_client_id
AUTH_GITHUB_SECRET=your_client_secret
```

### 添加 GitHub Provider

```ts
// src/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
});
```

## 实现登录功能

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

export default function SignOut() {
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

### 页面使用

```tsx
// src/app/page.tsx
import React from "react";
import SignButton from "@/components/sign-button";
import { auth } from "@/auth";
import SignOutButton from "@/components/signout-button";

export default async function Page() {
  const session = await auth();
  return (
    <>
      <div>{session?.user ? JSON.stringify(session.user) : "未登录"}</div>
      <SignButton />
      <SignOutButton />
    </>
  );
}
```

## 常见问题

### TypeError: immutable

如果遇到 `TypeError: immutable` 错误，确保 `route.ts` 文件内容如下：

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
// export const runtime = "edge" // 可选，注释掉或删除这行
```

### 登录失败但配置正确

如果一切配置正确但仍然出错，**极可能是网络问题**。

:::tip[提示]
确保你的网络能够正常访问 GitHub API。如果使用代理，检查代理配置是否正确。
:::

### 回调 URL 不匹配

确保 GitHub OAuth App 中配置的 **Authorization callback URL** 与你的应用地址一致：
- 开发环境：`http://localhost:3000/api/auth/callback/github`
- 生产环境：`https://yourdomain.com/api/auth/callback/github`

## 下一步

完成基础登录后，你可能还需要：

1. **配置数据库适配器** - 将用户信息存储到数据库
2. **自定义登录页面** - 替换默认的登录界面
3. **添加更多 OAuth 提供商** - 如 Google、Twitter 等
4. **配置会话策略** - JWT 或数据库会话

## 附录：OAuth 2.0 授权流程

当用户点击「使用 GitHub 登录」时，会跳转到类似以下的授权 URL：

```
https://github.com/login/oauth/authorize?
  scope=read:user+user:email&
  response_type=code&
  client_id=Ov23liPAFfOLgNfQj7yh&
  redirect_uri=http://localhost:3000/api/auth/callback/github&
  code_challenge=CWpAgDAFHsmmcC-7hqywqb8MqWoCepeE_eUWJw4gcao&
  code_challenge_method=S256
```

### 参数说明

| 参数 | 说明 |
|------|------|
| `scope` | 请求的权限范围，`read:user` 读取用户信息，`user:email` 读取邮箱 |
| `response_type` | 响应类型，`code` 表示授权码模式 |
| `client_id` | 你在 GitHub 注册的应用 ID |
| `redirect_uri` | 授权成功后的回调地址 |
| `code_challenge` | PKCE 验证码，用于增强安全性 |
| `code_challenge_method` | PKCE 方法，`S256` 表示 SHA-256 |

### 授权流程

```
┌──────────┐     1. 点击登录      ┌──────────┐
│   用户   │ ─────────────────▶ │  你的应用  │
└──────────┘                    └──────────┘
     │                               │
     │  2. 重定向到 GitHub 授权页     │
     │◀──────────────────────────────│
     │
     ▼
┌──────────┐
│  GitHub  │  3. 用户授权
└──────────┘
     │
     │  4. 携带 code 重定向回应用
     │─────────────────────────────▶│
                                    │
                              ┌──────────┐
                              │  你的应用  │
                              └──────────┘
                                    │
     │  5. 用 code 换取 access_token │
     │◀─────────────────────────────│
     │
┌──────────┐
│  GitHub  │
└──────────┘
     │  6. 返回 access_token        │
     │─────────────────────────────▶│
                                    │
                                    │  7. 获取用户信息
                                    │─────────────────▶ GitHub API
                                    │
                                    │  8. 创建会话
                                    ▼
                              登录成功！
```
