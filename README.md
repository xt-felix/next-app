# Next.js 15 完整教学文档

> 通过真实博客系统，深入学习 SEO、移动端适配、性能优化和 Next.js 15 核心特性

## 📚 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [1. SEO 优化详解](#1-seo-优化详解)
- [2. 移动端适配详解](#2-移动端适配详解)
- [3. 性能优化详解](#3-性能优化详解)
- [4. 服务端 vs 客户端组件](#4-服务端-vs-客户端组件)
- [5. Next.js 特殊函数](#5-nextjs-特殊函数)
- [6. 常见问题解答](#6-常见问题解答)
- [7. 学习路径建议](#7-学习路径建议)

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问：
- 🏠 首页：http://localhost:3000
- 📝 博客列表：http://localhost:3000/blog
- 📄 博客详情：http://localhost:3000/blog/nextjs-15-app-router-guide

---

## 项目结构

```
src/
├── app/
│   ├── layout.tsx                 # 全局布局 + SEO 配置
│   ├── page.tsx                   # 首页
│   └── blog/
│       ├── page.tsx              # 博客列表（Suspense 流式渲染）
│       ├── [slug]/
│       │   ├── page.tsx          # 博客详情（动态 SEO + SSG）
│       │   ├── error.tsx         # 错误边界
│       │   └── not-found.tsx     # 404 页面
│       └── components/
│           └── BlogPostCard.tsx  # 响应式博客卡片
├── types/
│   └── blog.ts                   # TypeScript 类型定义
└── lib/
    └── blog-data.ts              # 模拟数据源
```

---

## 1. SEO 优化详解

### 1.1 什么是 SEO？

**SEO = Search Engine Optimization（搜索引擎优化）**

**目标：**让 Google、百度等搜索引擎：
1. 找到你的网站
2. 理解你的内容
3. 在搜索结果中展示

**效果对比：**

| 场景 | 没有 SEO | 有 SEO |
|------|---------|--------|
| Google 搜索 "Next.js 教程" | 找不到你的文章 | 排名靠前，显示标题+描述 |
| 分享到微信 | 纯链接 `https://...` | 精美卡片：标题+图片+描述 |
| 分享到 Twitter | 纯文本 | Twitter Card 大图预览 |

---

### 1.2 全局 SEO 配置

**文件：**[src/app/layout.tsx](src/app/layout.tsx)

**作用：**设置网站默认的 SEO 信息，所有页面都会继承

```typescript
export const metadata: Metadata = {
  // 标题配置
  title: {
    default: "我的技术博客",              // 首页标题
    template: "%s | 我的技术博客",        // 子页面模板
  },
  // 示例：
  // - 首页：        "我的技术博客"
  // - 文章页：      "Next.js 教程 | 我的技术博客"
  // - 关于页：      "关于我们 | 我的技术博客"

  // 描述（搜索结果中显示的第二行）
  description: "分享前端技术实战经验",

  // Open Graph：社交媒体分享卡片
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "我的技术博客",
    images: [{
      url: "/og-image.png",     // 🖼️ 分享时显示的图片
      width: 1200,              // 推荐尺寸 1200x630px
      height: 630,
    }],
  },

  // Twitter Card 配置
  twitter: {
    card: "summary_large_image",
    creator: "@yourusername",
  },

  // 搜索引擎爬虫控制
  robots: {
    index: true,                // 允许被索引
    follow: true,               // 允许跟踪链接
  },

  // Google Search Console 验证
  verification: {
    google: "your-verification-code",  // 👈 需要替换
  },
};
```

**如何获取 Google 验证码？**

1. 访问 https://search.google.com/search-console
2. 添加你的网站
3. 选择"HTML 标签"验证方式
4. 复制 `content="xxx"` 中的 `xxx`
5. 粘贴到 `verification.google`

---

### 1.3 动态 SEO：为每个页面定制

**问题：**每篇博客文章的标题、描述都不一样，怎么办？

**解决：**使用 `generateMetadata` 函数

**文件：**[src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx#L31)

```typescript
// 这是 Next.js 的特殊导出函数，会自动调用
export async function generateMetadata({ params }) {
  // 1. 获取文章数据
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // 2. 返回这篇文章的专属 SEO 配置
  return {
    title: post.title,                  // "Next.js 15 完全指南"
    description: post.excerpt,          // 文章摘要
    keywords: post.tags,                // ["Next.js", "React"]

    openGraph: {
      type: "article",                  // 👈 告诉社交媒体：这是文章
      publishedTime: post.publishedAt,  // 发布时间
      authors: [post.author.name],      // 作者
      tags: post.tags,                  // 标签
      images: [post.coverImage],        // 封面图
    },

    // Canonical URL：防止重复内容
    alternates: {
      canonical: `https://yourdomain.com/blog/${post.slug}`,
    },
  };
}
```

**工作流程：**

```
用户访问 /blog/my-post
        ↓
Next.js 自动调用 generateMetadata()
        ↓
获取文章数据 { title: "...", excerpt: "..." }
        ↓
生成 <meta> 标签
        ↓
注入到页面 <head>
        ↓
搜索引擎/社交媒体爬虫抓取
```

**生成的 HTML：**

```html
<head>
  <title>Next.js 15 完全指南 | 我的技术博客</title>
  <meta name="description" content="深入了解...">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="Next.js 15 完全指南">
  <meta property="og:image" content="/images/cover.jpg">
  <meta property="article:published_time" content="2025-12-01T10:00:00Z">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://yourdomain.com/blog/my-post">
</head>
```

---

### 1.4 为什么需要 Canonical URL？

**场景：**你的文章可能有多个 URL：

```
https://yourdomain.com/blog/my-post
https://yourdomain.com/blog/my-post?ref=twitter
https://yourdomain.com/blog/my-post?utm_source=email
```

**问题：**搜索引擎认为这是 3 篇不同的文章，分散了权重

**解决：**使用 `canonical` 指定官方唯一地址

```typescript
alternates: {
  canonical: "https://yourdomain.com/blog/my-post",
}
```

搜索引擎：哦！原来这些都是同一篇文章，我只索引第一个！

---

## 2. 移动端适配详解

### 2.1 为什么需要移动端适配？

**数据：**
- 📱 超过 60% 的网站访问来自移动设备
- ❌ 没有适配的网站：用户需要放大、左右滑动才能阅读
- ✅ 适配良好的网站：自动调整布局，阅读体验舒适

---

### 2.2 Viewport 配置

**文件：**[src/app/layout.tsx](src/app/layout.tsx#L25)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
```

**每个参数的作用：**

| 参数 | 作用 | 例子 |
|------|------|------|
| `width=device-width` | 视口宽度 = 设备宽度 | iPhone 12: 390px |
| `initial-scale=1` | 初始缩放 1:1 | 不自动缩小 |
| `maximum-scale=5` | 最大放大 5 倍 | 允许用户放大（无障碍访问） |
| `user-scalable=yes` | 允许用户缩放 | 双指放大/缩小 |

**对比：**

```html
<!-- ❌ 没有 viewport -->
<meta name="viewport">
结果：手机上显示桌面版，字特别小，需要放大才能看

<!-- ✅ 有 viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1">
结果：自动适配手机屏幕，字体大小正常
```

---

### 2.3 响应式设计：Tailwind CSS

**核心原理：移动优先（Mobile-First）**

```
无前缀 = 移动端（默认）
有前缀 = 对应屏幕及以上
```

**断点表：**

| 前缀 | 最小宽度 | 设备 |
|------|---------|------|
| （无） | 0px | 移动端（默认） |
| `sm:` | 640px | 大屏手机 |
| `md:` | 768px | 平板 |
| `lg:` | 1024px | 桌面 |
| `xl:` | 1280px | 大桌面 |

---

### 2.4 实际例子

#### 例子 1：文字大小

```tsx
<h2 className="text-lg sm:text-xl lg:text-2xl">
  标题
</h2>
```

**效果：**
- 📱 手机（0-639px）：`text-lg`（18px）
- 📱 大屏手机（640-767px）：`text-xl`（20px）
- 💻 桌面（1024px+）：`text-2xl`（24px）

#### 例子 2：网格布局

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {posts.map(post => <Card />)}
</div>
```

**效果：**
- 📱 手机（0-767px）：1 列（竖着排）
- 📱 平板（768-1023px）：2 列
- 💻 桌面（1024px+）：3 列

**可视化：**

```
手机 (375px)        平板 (768px)       桌面 (1280px)
┌─────────┐        ┌─────┬─────┐      ┌───┬───┬───┐
│ Card 1  │        │Card1│Card2│      │C1 │C2 │C3 │
├─────────┤        ├─────┼─────┤      ├───┼───┼───┤
│ Card 2  │        │Card3│Card4│      │C4 │C5 │C6 │
├─────────┤        └─────┴─────┘      └───┴───┴───┘
│ Card 3  │
└─────────┘
```

#### 例子 3：显示/隐藏

```tsx
<div>
  <span>阅读量：1234</span>
  <span className="hidden md:inline">次</span>
</div>
```

**效果：**
- 📱 手机：显示"阅读量：1234"（隐藏"次"字节省空间）
- 💻 桌面：显示"阅读量：1234 次"（完整显示）

#### 例子 4：按钮宽度

```tsx
<button className="w-full sm:w-auto">
  提交
</button>
```

**效果：**
- 📱 手机：`w-full`（按钮宽度 100%，方便点击）
- 💻 桌面：`w-auto`（按钮宽度自适应内容）

---

### 2.5 移动端最佳实践

| 要点 | 说明 | 例子 |
|------|------|------|
| ✅ 触摸目标至少 44x44px | 手指点击需要足够大的区域 | `py-3 px-6`（高度 48px） |
| ✅ 移动端隐藏次要信息 | 节省屏幕空间 | `hidden md:block` |
| ✅ 移动端优先全宽布局 | 避免横向滚动 | `w-full sm:w-auto` |
| ✅ 字体不要太小 | 至少 16px | `text-base`（16px） |
| ✅ 间距充足 | 避免元素过于拥挤 | `p-4 sm:p-6` |

---

## 3. 性能优化详解

### 3.1 图片优化：next/image

**文件：**[src/app/blog/components/BlogPostCard.tsx](src/app/blog/components/BlogPostCard.tsx#L21)

```tsx
import Image from "next/image";

<Image
  src={post.coverImage}
  alt={post.title}
  fill                    // 填充父容器
  sizes="(max-width: 768px) 100vw, 33vw"
  loading="lazy"          // 懒加载
  className="object-cover"
/>
```

**优化效果：**

| 特性 | 传统 `<img>` | `next/image` |
|------|-------------|--------------|
| 格式 | JPEG/PNG | 自动选择 WebP/AVIF |
| 尺寸 | 固定一个尺寸 | 自动生成多尺寸（640w, 750w, 1080w...） |
| 加载 | 全部立即加载 | 懒加载（进入视口时才加载） |
| 压缩 | 手动压缩 | 自动压缩优化 |
| 布局偏移 | 可能跳动 | 自动预留空间 |

**sizes 属性详解：**

```tsx
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
```

**含义：**
- 📱 手机（≤768px）：图片宽度 = 100% 视口宽度
- 📱 平板（769-1200px）：图片宽度 = 50% 视口宽度
- 💻 桌面（>1200px）：图片宽度 = 33% 视口宽度

**浏览器根据这个信息，自动选择最合适的图片尺寸：**

```
手机访问（375px 宽度）：
  100vw = 375px → 加载 640w 的图片

桌面访问（1920px 宽度）：
  33vw = 634px → 加载 750w 的图片（不会加载 2048w 的大图！）
```

**性能提升：**
- 📱 手机节省 80% 流量（加载 640w 而不是 2048w）
- ⚡ 加载时间从 3 秒降至 0.5 秒

---

### 3.2 字体优化：next/font

**文件：**[src/app/layout.tsx](src/app/layout.tsx#L5)

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

**优化效果：**

| 特性 | Google Fonts CDN | next/font |
|------|------------------|-----------|
| 托管 | Google 服务器 | 你的服务器（自托管） |
| 请求 | 2 次请求（CSS + 字体） | 1 次请求 |
| 加载 | 阻塞渲染 | 预加载，不阻塞 |
| 隐私 | 向 Google 发送用户 IP | 无隐私问题 |
| 布局偏移 | 可能跳动 | `size-adjust` 自动计算，零偏移 |

---

### 3.3 流式渲染：Suspense

**文件：**[src/app/blog/page.tsx](src/app/blog/page.tsx#L104)

```tsx
<Suspense fallback={<BlogPostCardSkeleton />}>
  <BlogList />  {/* 异步服务端组件 */}
</Suspense>
```

**工作原理：**

```
传统渲染（无 Suspense）：
1. 服务器获取数据（3 秒）
2. 服务器渲染 HTML（1 秒）
3. 返回完整 HTML 给用户
4. 用户看到页面
总时间：4 秒 ❌

流式渲染（有 Suspense）：
1. 服务器立即返回骨架屏 HTML（0.1 秒）
2. 用户立即看到页面框架 ✅
3. 服务器后台获取数据（3 秒）
4. 流式传输真实内容替换骨架屏
5. 用户看到完整内容
首屏时间：0.1 秒 ✅
```

**对比：**

```
无 Suspense：
用户等待 4 秒 → 白屏 → 突然出现完整页面

有 Suspense：
立即看到骨架屏 → 内容逐步填充 → 完整页面
```

---

### 3.4 静态生成：generateStaticParams

**文件：**[src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx#L121)

```typescript
// 这是 Next.js 的特殊函数，必须这样命名
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  // 返回：["post-1", "post-2", "post-3"]

  return slugs.map(slug => ({ slug }));
  // 返回：[{ slug: "post-1" }, { slug: "post-2" }, ...]
}
```

**工作流程：**

```
构建时（npm run build）：
1. Next.js 调用 generateStaticParams()
2. 获取所有文章 slug：["post-1", "post-2", "post-3"]
3. 为每个 slug 生成一个 HTML 文件：
   - .next/server/app/blog/post-1.html
   - .next/server/app/blog/post-2.html
   - .next/server/app/blog/post-3.html

用户访问时：
直接返回预生成的 HTML 文件（超快！）
```

**对比：**

| 模式 | 动态渲染（SSR） | 静态生成（SSG） |
|------|----------------|----------------|
| 生成时机 | 每次访问时 | 构建时 |
| 速度 | 慢（需要查数据库+渲染） | 极快（直接返回 HTML） |
| 服务器压力 | 高 | 低 |
| 适用场景 | 个性化内容（用户数据） | 公开内容（博客、文档） |

**性能提升：**
- ⚡ 响应时间：从 500ms 降至 10ms
- 💰 服务器成本：降低 90%
- 📈 可支持并发：从 100 提升至 10,000+

---

## 4. 服务端 vs 客户端组件

### 4.1 核心区别

**服务端组件（Server Component）**
- 在**服务器**上运行
- 不会发送到客户端（不增加 JavaScript bundle）
- 可以直接访问数据库、文件系统

**客户端组件（Client Component）**
- 在**浏览器**上运行
- 会发送到客户端（增加 JavaScript bundle）
- 可以使用 React Hooks（useState、useEffect）

---

### 4.2 如何区分？

```tsx
// ✅ 服务端组件（默认）
// 没有 "use client" 标记
export default async function Page() {
  const data = await fetchData();  // 可以用 async/await
  return <div>{data}</div>;
}

// ✅ 客户端组件
// 必须在文件顶部添加 "use client"
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);  // 可以用 Hook
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

### 4.3 能力对比表

| 能力 | 服务端组件 | 客户端组件 |
|------|-----------|-----------|
| 使用 `async/await` | ✅ | ❌ |
| 使用 `useState`、`useEffect` | ❌ | ✅ |
| 使用 `onClick`、`onChange` | ❌ | ✅ |
| 访问数据库 | ✅ | ❌ |
| 访问文件系统 | ✅ | ❌ |
| 使用 `window`、`document` | ❌ | ✅ |
| 增加客户端 bundle | ❌ | ✅ |

---

### 4.4 选择策略

**使用服务端组件（优先）：**
- ✅ 展示静态内容（博客文章、产品列表）
- ✅ 需要获取数据（从数据库、API）
- ✅ 需要 SEO（搜索引擎可见）
- ✅ 不需要交互

**使用客户端组件（必要时）：**
- ✅ 需要交互（按钮点击、表单输入）
- ✅ 需要使用 React Hooks（useState、useEffect）
- ✅ 需要使用浏览器 API（localStorage、window）
- ✅ 需要监听事件（onClick、onChange）

---

### 4.5 项目中的例子

| 文件 | 类型 | 原因 |
|------|------|------|
| [blog/page.tsx](src/app/blog/page.tsx) | 服务端 | 展示博客列表，不需要交互 |
| [blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) | 服务端 | 展示文章详情，需要 SEO |
| [BlogPostCard.tsx](src/app/blog/components/BlogPostCard.tsx) | 客户端 | 演示用（实际可以是服务端） |
| [error.tsx](src/app/blog/[slug]/error.tsx) | 客户端 | Next.js 要求错误边界必须是客户端 |

---

## 5. Next.js 特殊函数

### 5.1 约定优于配置

Next.js 有一些**特殊函数名**，必须这样命名才能生效：

| 函数名 | 作用 | 必须固定 |
|--------|------|---------|
| `generateMetadata` | 动态生成 SEO 元数据 | ✅ |
| `generateStaticParams` | 静态生成路径参数 | ✅ |
| `layout.tsx` | 布局组件文件名 | ✅ |
| `page.tsx` | 页面组件文件名 | ✅ |
| `loading.tsx` | 加载状态文件名 | ✅ |
| `error.tsx` | 错误边界文件名 | ✅ |
| `not-found.tsx` | 404 页面文件名 | ✅ |

**工作原理：**

```
构建时/运行时：
1. Next.js 扫描所有文件
2. 检查是否有这些特殊函数名
3. 如果有 → 自动调用
4. 如果没有 → 使用默认行为
```

**错误示例：**

```tsx
// ❌ 名字错了，Next.js 不认识
export async function getStaticParams() { ... }

// ✅ 正确
export async function generateStaticParams() { ... }
```

---

### 5.2 generateStaticParams 详解

**作用：**告诉 Next.js 需要预生成哪些动态路由页面

**示例：**

```typescript
// src/app/blog/[slug]/page.tsx

// 1. 这个函数返回所有文章的 slug
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  // 返回：["post-1", "post-2", "post-3"]

  return slugs.map(slug => ({ slug }));
  // 转换成：[{ slug: "post-1" }, { slug: "post-2" }, { slug: "post-3" }]
}

// 2. 这个页面组件会为每个 slug 渲染一次
export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return <article>{post.content}</article>;
}
```

**构建输出：**

```
npm run build

Route (app)
└ ● /blog/[slug]
  ├ /blog/post-1
  ├ /blog/post-2
  └ /blog/post-3

●  (SSG)  prerendered as static HTML (uses generateStaticParams)
```

---

## 6. 常见问题解答

### Q1: 开发模式下看不到 generateStaticParams 被调用？

**A:** 这是正常的！

- **开发模式（`npm run dev`）：**不会调用，页面按需渲染
- **生产构建（`npm run build`）：**会调用，预生成所有页面

**验证方法：**

```bash
# 运行生产构建
npm run build

# 你会看到：
# ● /blog/[slug]
#   ├ /blog/post-1
#   ├ /blog/post-2
#   └ /blog/post-3
```

---

### Q2: 什么时候用服务端组件，什么时候用客户端组件？

**A:** 默认使用服务端，只有需要交互时才用客户端

**决策树：**

```
需要交互吗？（onClick、onChange、useState）
  ├─ 是 → 客户端组件 "use client"
  └─ 否 → 服务端组件（默认）
```

**常见场景：**

- ✅ 博客文章显示 → 服务端
- ✅ 产品列表 → 服务端
- ✅ 评论表单 → 客户端（需要 input 事件）
- ✅ 购物车数量 → 客户端（需要 useState）
- ✅ 模态框（Modal） → 客户端（需要 onClick 关闭）

---

### Q3: 图片路径怎么配置？

**A:** 有两种方式

**1. 放在 `public` 目录（推荐）：**

```
项目结构：
public/
  images/
    blog/
      nextjs-app-router.jpg

代码中使用：
<Image src="/images/blog/nextjs-app-router.jpg" ... />
```

**2. 使用外部 URL：**

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.example.com",
      },
    ],
  },
};

// 代码中使用：
<Image src="https://cdn.example.com/image.jpg" ... />
```

---

### Q4: 如何测试 SEO 效果？

**在线工具：**

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - 检查 Open Graph 标签

2. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - 查看分享卡片预览

3. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - 验证 Twitter Card

**本地验证：**

```bash
# 1. 启动生产服务器
npm run build
npm start

# 2. 查看生成的 HTML
curl http://localhost:3000/blog/my-post | grep "<meta"

# 输出：
# <meta property="og:title" content="...">
# <meta property="og:image" content="...">
# <meta name="twitter:card" content="...">
```

---

### Q5: Tailwind 的 `sm:` `md:` `lg:` 是什么意思？

**A:** 这是响应式断点，表示"在多大屏幕以上生效"

**记忆口诀：**
- **无前缀 = 移动端（默认）**
- **有前缀 = 该尺寸及以上**

**示例：**

```tsx
<div className="text-sm md:text-base lg:text-lg">
  文字
</div>
```

**效果：**
- 📱 0-767px（移动端）：`text-sm`（14px）
- 📱 768-1023px（平板）：`text-base`（16px）
- 💻 1024px+（桌面）：`text-lg`（18px）

**覆盖规则：**后面的断点会覆盖前面的

---

### Q6: 如何部署到生产环境？

**方式 1：Vercel（推荐，零配置）**

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 自动配置好所有优化！
```

**方式 2：其他平台（Docker、VPS）**

```bash
# 1. 构建
npm run build

# 2. 启动生产服务器
npm start

# 监听在 http://localhost:3000
```

**使用 Docker：**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 7. 学习路径建议

### 第 1 周：基础概念
- [ ] 理解服务端组件 vs 客户端组件
- [ ] 学习 Next.js App Router 文件路由
- [ ] 了解 `layout.tsx`、`page.tsx` 的作用

### 第 2 周：SEO 优化
- [ ] 配置全局 metadata
- [ ] 实现 generateMetadata
- [ ] 测试 Open Graph 效果

### 第 3 周：移动端适配
- [ ] 学习 Tailwind 响应式断点
- [ ] 实践移动优先设计
- [ ] 测试不同设备效果

### 第 4 周：性能优化
- [ ] 使用 next/image 优化图片
- [ ] 实现 Suspense 流式渲染
- [ ] 使用 generateStaticParams 静态生成

---

## 8. 扩展资源

**官方文档：**
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [next/image](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

**本项目其他文档：**
- [CLIENT-VS-SERVER-COMPONENTS.md](CLIENT-VS-SERVER-COMPONENTS.md) - 组件类型详解
- [README-OPTIMIZATION.md](README-OPTIMIZATION.md) - 性能优化指南

---

## 9. 注意事项

### 需要替换的配置

在实际项目中，请替换以下占位符：

```typescript
// ❌ 示例占位符
verification: {
  google: "your-google-verification-code",  // 需要替换
}
canonical: "https://yourdomain.com/...",    // 需要替换
twitter: {
  creator: "@yourusername",                 // 需要替换
}

// ✅ 实际配置
verification: {
  google: "abc123xyz789",                   // 从 Google 获取
}
canonical: "https://myblog.com/...",        // 你的域名
twitter: {
  creator: "@myblog",                       // 你的 Twitter
}
```

### 图片资源

示例中的图片路径（`/images/blog/...`）需要：
1. 在 `public/images/blog/` 创建目录
2. 放入实际的图片文件
3. 或使用图片占位服务（如 Unsplash）

---

**通过本文档，你已经掌握了 Next.js 15 的核心技术！** 🎉

有问题？欢迎提 Issue 或 PR！

---

## License

MIT
