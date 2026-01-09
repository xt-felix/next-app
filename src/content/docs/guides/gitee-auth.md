---
title: Gitee 认证
description: 添加 Gitee OAuth 认证作为 GitHub 的替代方案
---

## 概述

前面的登录功能使用的是 GitHub 进行 OAuth 认证，但可能会遇到网络问题。这里添加 Gitee 认证作为替代方案。

## 问题

Auth.js 官方的 providers 中没有 Gitee 相关的 provider，需要参考 GitHub Provider 进行手动改造。

## 准备 Provider

创建自定义 Gitee Provider：

```ts
// src/providers/gitee.ts
// 完整代码参考：https://github.com/ifer47/gitee-provider
```

> 可以参考 GitHub Provider 的源码进行改造，或直接使用已改造好的版本。

## 配置 Provider

```ts
// src/auth.config.ts
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import Gitee from "./providers/gitee";

export default {
  providers: [GitHub, Gitee],
} satisfies NextAuthConfig;
```

## 获取 Gitee OAuth 凭证

1. 访问 [Gitee OAuth 应用注册页面](https://gitee.com/oauth/applications/new)
2. 填写应用信息并创建
3. 获取 Client ID 和 Client Secret

## 配置环境变量

```bash
# .env.local
AUTH_GITEE_ID="your_gitee_client_id"
AUTH_GITEE_SECRET="your_gitee_client_secret"
```

## 准备登录方法

```ts
// src/actions/sign-in.ts
"use server";
import * as auth from "@/auth";

export async function signIn() {
  return auth.signIn("github");
}

export async function signInGitee() {
  return auth.signIn("gitee");
}
```

### 导出登录方法

```ts
// src/actions/index.ts
export { signIn, signInGitee } from "./sign-in";
// ...
```

## 准备登录按钮

在 Header 组件中添加 Gitee 登录按钮：

```tsx
// src/components/header-auth.tsx
import * as actions from "@/actions";

// GitHub 登录
<form action={actions.signIn}>
  <Button size="sm" type="submit" color="secondary" variant="bordered">
    GitHub
  </Button>
</form>

// Gitee 登录
<form action={actions.signInGitee}>
  <Button size="sm" type="submit" color="secondary" variant="shadow">
    Gitee
  </Button>
</form>
```

## 自定义 Provider 结构

如果需要自己创建 Gitee Provider，参考以下结构：

```ts
// src/providers/gitee.ts
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface GiteeProfile {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

export default function Gitee<P extends GiteeProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "gitee",
    name: "Gitee",
    type: "oauth",
    authorization: {
      url: "https://gitee.com/oauth/authorize",
      params: { scope: "user_info emails" },
    },
    token: "https://gitee.com/oauth/token",
    userinfo: "https://gitee.com/api/v5/user",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    options,
  };
}
```

## 文件结构

```
src/
├── providers/
│   └── gitee.ts              # 自定义 Gitee Provider
├── auth.config.ts            # 添加 Gitee Provider
├── actions/
│   ├── sign-in.ts            # 添加 signInGitee 方法
│   └── index.ts              # 导出 signInGitee
└── components/
    └── header-auth.tsx       # 添加 Gitee 登录按钮
```

## GitHub vs Gitee Provider 对比

| 项目 | GitHub | Gitee |
|------|--------|-------|
| 内置支持 | 是 | 否（需自定义） |
| 授权 URL | github.com/login/oauth/authorize | gitee.com/oauth/authorize |
| Token URL | github.com/login/oauth/access_token | gitee.com/oauth/token |
| 用户信息 URL | api.github.com/user | gitee.com/api/v5/user |

## 注意事项

1. **环境变量命名**：Auth.js 会自动读取 `AUTH_GITEE_ID` 和 `AUTH_GITEE_SECRET`
2. **回调 URL**：在 Gitee 应用设置中配置回调 URL 为 `http://localhost:3000/api/auth/callback/gitee`
3. **网络问题**：Gitee 作为国内平台，访问更稳定
