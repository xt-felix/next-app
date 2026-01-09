---
title: 初始化 Prisma 和数据库
description: 使用 Prisma 和 SQLite 持久化第三方登录用户信息
---

## 概述

使用官方的 Adapter 把第三方用户的登录信息持久化到项目数据库中。

## 安装依赖

参考文档：
- [Prisma 快速开始](https://www.prisma.io/docs/getting-started/quickstart-sqlite)
- [Auth.js Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma)

```bash
npm i prisma --save-dev --legacy-peer-deps
npm install @prisma/client @auth/prisma-adapter --legacy-peer-deps
```

## 初始化 Prisma

```bash
npx prisma init --datasource-provider sqlite
```

这会创建：
- `prisma/schema.prisma` - Prisma 模型定义文件
- `.env` - 环境变量文件（包含数据库连接字符串）

## 创建 Prisma 客户端实例

```ts
// src/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

:::tip[提示]
这种写法可以避免开发环境下热重载导致的多个 Prisma 实例问题。
:::

## 配置 Auth.js Adapter

```ts
// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
});
```

:::caution[注意]
不要忘了 `providers` 配置，否则登录功能将无法正常工作。
:::

## 定义 Schema

参考 [Auth.js Prisma Schema](https://authjs.dev/getting-started/adapters/prisma#schema) 定义用户相关的数据模型。

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String          @id @default(cuid())
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## 生成数据库和客户端

```bash
# 根据 Prisma 模型创建数据库表
npx prisma db push

# 根据 Prisma 模型生成对应的 Prisma 客户端
npx prisma generate
```

:::note[关于迁移文件]
每个迁移文件都包含对数据库结构的具体更改（如添加表、修改列、删除字段等）的 SQL 语句。通过这些文件，可以回溯历史，了解每次变更的具体内容和时间。使用迁移文件并不是必须的。
:::

## Edge Runtime 兼容性问题

完成上述配置后，你可能会发现控制台出现报错。这是因为在 **Edge Runtime** 中使用了 Prisma 相关的操作。

### 什么是 Edge Runtime？

Next.js 提供了两种运行时：

| 运行时 | 说明 |
|--------|------|
| **Node.js Runtime** | 默认运行时，可以使用 Node.js API 和生态相关的包 |
| **Edge Runtime** | 轻量高效的运行环境，但支持的 API 有限 |

详细支持的 API 列表：[Edge Runtime API](https://nextjs.org/docs/app/api-reference/edge)

### 问题原因

Next.js 中的 **Middleware 只能运行在 Edge Runtime**（[官方说明](https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime)）。

当 Middleware 中涉及到 Prisma 操作时，Edge Runtime 无法处理，就会出现报错。因为 `auth` 对象是通过调用 `NextAuth` 方法生成的，而这个方法内部使用了 PrismaAdapter。

### 解决方案

将 Edge Runtime 兼容的配置与不兼容的分开处理，中间件仅导入或使用 Edge 兼容的部分。

**方案思路**：在 Middleware 中直接调用 `NextAuth` 方法生成 `auth` 对象，但这次调用时不使用 Adapter 和 Prisma。

#### 1. 分离配置

```ts
// src/auth.config.ts
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

// Edge 兼容的配置（不包含 Prisma）
export default {
  providers: [GitHub],
} satisfies NextAuthConfig;
```

#### 2. 完整配置（包含 Prisma）

```ts
// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
```

#### 3. 修改 Middleware

```ts
// src/middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// 使用不包含 Prisma 的配置
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // 你的中间件逻辑
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

这样，Middleware 中使用的是 Edge 兼容的配置，而其他地方（如 API 路由、Server Components）可以使用完整的配置（包含 Prisma）。

## 验证数据库

登录成功后，可以使用 Prisma Studio 查看数据：

```bash
npx prisma studio
```

这会打开一个 Web 界面，你可以在其中查看 User、Account、Session 等表的数据。
