---
title: Vercel 自动部署
description: 将 Next.js 项目部署到 Vercel 并配置自动部署
---

## 为什么选择 Vercel？

Vercel 是 Next.js 的官方托管平台，提供：

- **零配置部署** - 自动识别 Next.js 项目并优化构建
- **自动部署** - 推送代码自动触发部署
- **预览部署** - 每个 PR 生成独立预览链接
- **边缘网络** - 全球 CDN 加速
- **免费额度** - 个人项目免费使用

## 部署步骤

### 1. 准备 Git 仓库

首先确保项目已推送到 GitHub、GitLab 或 Bitbucket：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库.git

# 推送到远程
git push -u origin main
```

### 2. 导入项目到 Vercel

1. 访问 [vercel.com](https://vercel.com) 并登录（可使用 GitHub 账号）
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **"Import Git Repository"**
4. 找到并选择你的项目仓库
5. 点击 **"Import"**

### 3. 配置项目

Vercel 会自动检测 Next.js 项目，通常无需修改配置：

| 配置项 | 默认值 |
|--------|--------|
| Framework Preset | Next.js |
| Build Command | `next build` 或 `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

如需自定义，可以在此页面修改。

### 4. 部署

点击 **"Deploy"** 按钮，等待部署完成。

部署成功后，你会获得一个 `.vercel.app` 域名，如：
```
https://your-project.vercel.app
```

## 自动部署

### Git 集成

连接 Git 仓库后，Vercel 会自动：

```
┌─────────────────────────────────────────────────────────┐
│                    自动部署流程                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  推送到 main 分支                                        │
│       ↓                                                 │
│  触发生产环境部署 (Production)                           │
│       ↓                                                 │
│  更新线上网站                                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  创建 Pull Request                                      │
│       ↓                                                 │
│  触发预览部署 (Preview)                                  │
│       ↓                                                 │
│  生成独立预览链接                                        │
│       ↓                                                 │
│  PR 中显示预览链接评论                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 部署类型

| 类型 | 触发条件 | 用途 |
|------|----------|------|
| Production | 推送到主分支 | 正式上线 |
| Preview | Pull Request / 其他分支 | 预览测试 |

## 环境变量

### 添加环境变量

1. 进入项目 **Settings** → **Environment Variables**
2. 添加变量名和值
3. 选择生效环境（Production / Preview / Development）

```
┌──────────────────────────────────────────┐
│  Environment Variables                   │
├──────────────────────────────────────────┤
│  Name: DATABASE_URL                      │
│  Value: postgres://...                   │
│  Environment: ☑ Production ☑ Preview     │
└──────────────────────────────────────────┘
```

### 在代码中使用

```tsx
// 服务端组件中直接使用
const dbUrl = process.env.DATABASE_URL;

// 客户端需要 NEXT_PUBLIC_ 前缀
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

:::caution[注意]
添加或修改环境变量后，需要重新部署才能生效。
:::

## 自定义域名

### 添加域名

1. 进入项目 **Settings** → **Domains**
2. 输入你的域名，点击 **Add**
3. 按提示配置 DNS 记录

### DNS 配置示例

**A 记录（根域名）：**
```
类型: A
名称: @
值: 76.76.21.21
```

**CNAME 记录（子域名）：**
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

## vercel.json 配置

在项目根目录创建 `vercel.json` 进行高级配置：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

### 常用配置

| 字段 | 说明 |
|------|------|
| `regions` | 部署区域，如 `["hkg1"]`（香港） |
| `headers` | 自定义响应头 |
| `redirects` | URL 重定向规则 |
| `rewrites` | URL 重写规则 |
| `cleanUrls` | 移除 URL 中的 `.html` 后缀 |

## 部署钩子（Deploy Hooks）

### 创建部署钩子

1. 进入 **Settings** → **Git** → **Deploy Hooks**
2. 输入名称，选择分支
3. 点击 **Create Hook**
4. 复制生成的 URL

### 使用部署钩子

```bash
# 通过 curl 触发部署
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx
```

适用场景：
- CMS 内容更新后触发重新部署
- 定时任务触发部署
- 其他系统集成

## Vercel CLI

### 安装

```bash
npm i -g vercel
```

### 常用命令

```bash
# 登录
vercel login

# 部署（预览环境）
vercel

# 部署到生产环境
vercel --prod

# 查看部署列表
vercel ls

# 查看环境变量
vercel env ls

# 添加环境变量
vercel env add DATABASE_URL

# 拉取环境变量到本地
vercel env pull .env.local
```

## 查看部署日志

### 构建日志

在 Vercel Dashboard 中：
1. 点击具体的部署记录
2. 查看 **Building** 阶段的日志

### 运行时日志

1. 进入项目 → **Logs**
2. 可以筛选 Functions（API 路由）的日志

```
┌─────────────────────────────────────────────────────────┐
│  Runtime Logs                                           │
├─────────────────────────────────────────────────────────┤
│  [Function] /api/users                                  │
│  Status: 200                                            │
│  Duration: 45ms                                         │
│  Memory: 128MB                                          │
└─────────────────────────────────────────────────────────┘
```

## 常见问题

### 构建失败

检查以下几点：
1. 本地 `npm run build` 是否成功
2. 环境变量是否配置完整
3. Node.js 版本是否匹配

### 环境变量不生效

- 确认变量名正确（区分大小写）
- 客户端变量需要 `NEXT_PUBLIC_` 前缀
- 添加变量后需要重新部署

### 部署后 404

- 检查是否正确导出了页面组件
- 动态路由文件名是否正确（如 `[id]`）
- 查看 Vercel 的 Functions 日志

:::tip[提示]
Vercel 提供了详细的部署日志和错误信息，遇到问题时先查看日志通常能快速定位原因。
:::
