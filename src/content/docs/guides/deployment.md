---
title: 项目打包部署
description: 打包 Next.js 项目并部署到阿里云 ECS
---

## 项目打包

```bash
npm run build
```

### 常见打包问题处理

#### 1. 未使用的变量

检查并移除定义但未使用的变量：

```ts
// ./src/actions/create-comment.ts
// 移除未使用的导入和变量
```

#### 2. 使用 Next.js Image 组件

将 `img` 标签替换为 Next.js 内置的 `Image` 组件：

```tsx
import Image from "next/image";

<Image
  src={session.user.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
  alt="User Avatar"
/>
```

#### 3. params 类型错误

在 Next.js 15 中，`params` 应该用 `Promise` 包裹：

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
interface PostShowPageProps {
  params: Promise<{
    name: string;
    postId: string;
  }>;
}
```

#### 4. useSearchParams 需要 Suspense 包裹

```tsx
// src/components/header.tsx
import { Suspense } from "react";

<Suspense>
  <SearchInput />
</Suspense>
```

#### 5. 移除调试代码

移除所有的 `console.log` 和 `sleep` 函数调用。

#### 6. 配置 favicon 和 title

在 `app/layout.tsx` 中配置网站元数据。

## 本地测试打包结果

### 启动生产环境

```bash
npm start
```

### 处理认证问题

```bash
# .env
AUTH_TRUST_HOST=true
```

### 解决首页不更新问题

创建话题后首页不更新是因为全路由缓存，需要重新验证：

```ts
// src/actions/create-topic.ts
import { revalidatePath } from "next/cache";

// 创建话题成功后
revalidatePath('/');
```

### 优化主题切换按钮样式

```tsx
// src/components/ThemeSwitcher.tsx
"use client";

export default function ThemeSwitcher() {
  // ...

  return (
    <div
      onClick={() => setTheme(currentTheme)}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-default-100 hover:bg-default-200"
    >
      {/* ... */}
    </div>
  );
}
```

## 部署到阿里云 ECS

### 上传代码

```bash
cd workspace
mkdir discuss
cd discuss

# 上传本地代码，排除以下目录/文件：
# - .git
# - .next
# - node_modules
# - .env.local
```

### 安装依赖

```bash
# 确保服务器已安装 Node.js
nrm ls
npm i --legacy-peer-deps
npx prisma db push && npx prisma generate
```

### 配置生产环境变量

创建 `.env.production` 文件（打包时会优先读取）：

```bash
# .env.production
AUTH_SECRET="your_auth_secret"

AUTH_GITHUB_ID="your_github_id"
AUTH_GITHUB_SECRET="your_github_secret"

AUTH_GITEE_ID="your_gitee_id"
AUTH_GITEE_SECRET="your_gitee_secret"

AUTH_TRUST_HOST="discuss.zhihur.com"
```

> **注意**：Gitee 回调地址需要配置为 `https://discuss.zhihur.com/api/auth/callback/gitee`

### 打包并启动

```bash
npm run build

# 使用 PM2 管理进程
pm2 list
pm2 start npm --name "discuss" -- start
```

此时访问 `http://your-server-ip:3000/` 即可看到项目。

## 配置域名和 HTTPS

### 域名解析

1. 打开阿里云控制台
2. 搜索"域名"
3. 添加二级域名解析记录

### 申请 SSL 证书

1. 在阿里云申请免费 SSL 证书
2. 下载证书文件

### 配置 Nginx

```bash
# 查找 Nginx 位置
whereis nginx
cd /etc/nginx

# 查看主配置文件
cat nginx.conf
# 会发现加载了 vhost 目录下的所有配置文件

cd vhost
# 创建 discuss 域名的配置文件
```

Nginx 配置关键点：

| 配置项 | 说明 |
|--------|------|
| `server_name` | 域名 |
| `ssl_certificate` | SSL 证书路径 |
| `ssl_certificate_key` | SSL 证书密钥路径 |
| `location /` | 代理到 `127.0.0.1:3000` |
| `80 端口` | 重定向到 HTTPS |

### Next.js 配置

添加域名到允许的来源：

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "foruda.gitee.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["discuss.zhihur.com"],
    },
  },
};

export default nextConfig;
```

### 重启项目

配置完成后重启项目：

```bash
pm2 restart discuss
```

## 打包检查清单

| 检查项 | 说明 |
|--------|------|
| 未使用变量 | 移除未使用的导入和变量 |
| Image 组件 | 替换 `img` 为 `next/image` |
| params 类型 | 使用 `Promise` 包裹 |
| useSearchParams | 使用 `Suspense` 包裹 |
| 调试代码 | 移除 console 和 sleep |
| 元数据 | 配置 favicon 和 title |
| 环境变量 | 创建 `.env.production` |

## PM2 常用命令

```bash
pm2 list              # 查看所有进程
pm2 start             # 启动进程
pm2 stop discuss      # 停止进程
pm2 restart discuss   # 重启进程
pm2 delete discuss    # 删除进程
pm2 logs discuss      # 查看日志
```

## 部署流程总结

```
本地开发完成
    │
    ▼
npm run build 检查错误
    │
    ▼
修复打包错误
    │
    ▼
上传代码到服务器
    │
    ▼
安装依赖 & 初始化数据库
    │
    ▼
配置 .env.production
    │
    ▼
npm run build
    │
    ▼
pm2 start
    │
    ▼
配置域名解析 & SSL 证书
    │
    ▼
配置 Nginx 代理
    │
    ▼
访问 https://your-domain.com
```

## 参考链接

- [Next-Auth 配置选项](https://next-auth.js.org/configuration/options)
