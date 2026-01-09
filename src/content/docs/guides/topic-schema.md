---
title: 创建话题 Schema
description: 使用 Prisma 定义 Topic、Post、Comment 模型及其关系
---

## 概述

Schema 是与数据库表的映射关系。有了 Schema 之后，可以根据 Schema 创建数据库表，也可以根据 Schema 创建操作数据库的客户端。

## Topic 模型

```prisma
// prisma/schema.prisma
model Topic {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 字段说明

每个字段由三部分组成：**字段名称**、**字段类型**、**字段属性**。

| 字段 | 类型 | 属性说明 |
|------|------|----------|
| `id` | String | `@id` 主键，`@default(cuid())` 使用 cuid 生成唯一标识 |
| `name` | String | `@unique` 唯一约束 |
| `description` | String | 话题描述 |
| `createdAt` | DateTime | `@default(now())` 默认当前时间 |
| `updatedAt` | DateTime | `@updatedAt` 自动更新时间 |

## Post 模型

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Comment 模型

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Schema 之间的关系

### 一对多关系

User 和 Topic、Post、Comment 之间都是一对多的关系：
- 一个用户可以创建多个话题
- 一个用户可以发表多个帖子
- 一个用户可以发表多条评论

### User 模型添加关联

```prisma
model User {
  // ... 其他字段
  topics   Topic[]
  posts    Post[]
  comments Comment[]
}
```

### 关联语法

```
字段名称  字段类型  @relation(fields: [当前模型的外键], references: [目标模型的主键])
```

### Topic 模型添加 User 关联

```prisma
model Topic {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  posts Post[]
}
```

### Post 模型添加关联

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  topic   Topic  @relation(fields: [topicId], references: [id], onDelete: Cascade)
  topicId String

  comments Comment[]
}
```

### Comment 模型添加关联

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String
}
```

### onDelete: Cascade

当目标模型中的某条记录被删除时，所有关联该记录的记录也会被自动删除。

## 自关联（评论的父子关系）

自关联指的是自身模型中的一个字段关联到自身模型，形成树形结构的层级关系。

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String

  // 自关联
  parent   Comment?  @relation("Comments", fields: [parentId], references: [id], onDelete: Cascade)
  parentId String?
  children Comment[] @relation("Comments")
}
```

### 自关联说明

| 字段 | 说明 |
|------|------|
| `parent` | 父评论，可选（`?` 表示可能没有父评论） |
| `parentId` | 父评论 ID，可选 |
| `children` | 子评论数组，默认为空数组 |

当一个模型中存在多个字段指向同一个目标模型时，需要给 `@relation` 指定关系名称（如 `"Comments"`）来区分。

## 同步数据库

```bash
npx prisma db push && npx prisma generate
```

## 查看数据库

```bash
npx prisma studio
```

## 添加话题功能

### 获取 session.user.id

默认情况下 `session.user.id` 是 `undefined`，需要手动扩展 session。

参考文档：
- [Extending the Session](https://authjs.dev/guides/extending-the-session#with-jwt)
- [TypeScript](https://authjs.dev/getting-started/typescript)

### 配置 callbacks

```ts
// src/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
```

### 创建话题

```ts
// src/actions/create-topic.ts
await prisma.topic.create({
  data: {
    name: result.data.name,
    description: result.data.description,
    userId: session.user.id!,
  },
});
```

## 完整 Schema

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
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  topics        Topic[]
  posts         Post[]
  comments      Comment[]
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

model Topic {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  posts Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  topic   Topic  @relation(fields: [topicId], references: [id], onDelete: Cascade)
  topicId String

  comments Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String

  parent   Comment?  @relation("Comments", fields: [parentId], references: [id], onDelete: Cascade)
  parentId String?
  children Comment[] @relation("Comments")
}
```

## 模型关系图

```
User
 ├── Topic[] (一对多)
 │    └── Post[] (一对多)
 │         └── Comment[] (一对多)
 ├── Post[] (一对多)
 └── Comment[] (一对多)
          ├── parent? (自关联)
          └── children[] (自关联)
```
