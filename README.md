# Next.js SEO、移动端适配与性能优化实战案例

本项目展示了如何在 Next.js 15 App Router 中实现 SEO 优化、移动端适配和性能优化的最佳实践。

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
- 首页：http://localhost:3000
- 博客列表：http://localhost:3000/blog
- 博客详情：http://localhost:3000/blog/nextjs-15-app-router-guide

## 项目结构

```
src/
├── app/
│   ├── layout.tsx                 # 全局布局 + SEO 配置
│   ├── blog/
│   │   ├── page.tsx              # 博客列表页面（Suspense 示例）
│   │   ├── loading.tsx           # 列表加载状态
│   │   ├── [slug]/
│   │   │   ├── page.tsx          # 博客详情页（动态 SEO）
│   │   │   ├── loading.tsx       # 详情加载状态
│   │   │   ├── error.tsx         # 错误边界
│   │   │   └── not-found.tsx     # 404 页面
│   │   └── components/
│   │       └── BlogPostCard.tsx  # 响应式博客卡片组件
├── types/
│   └── blog.ts                   # TypeScript 类型定义
└── lib/
    └── blog-data.ts              # 模拟数据源
```

## 核心功能

### 1️⃣ SEO 优化

#### 全局 SEO 配置
在 [src/app/layout.tsx](src/app/layout.tsx) 中配置全局默认的 SEO 元数据：

```typescript
export const metadata: Metadata = {
  title: {
    default: "我的技术博客",
    template: "%s | 我的技术博客",  // 子页面标题自动拼接
  },
  description: "分享前端技术实战经验",
  openGraph: { ... },  // Facebook、LinkedIn 分享卡片
  twitter: { ... },    // Twitter 分享卡片
  robots: { ... },     // 搜索引擎爬虫控制
  verification: { ... }, // Google Search Console 验证
};
```

**核心要点：**
- ✅ `title.template`：子页面标题会自动拼接
- ✅ `openGraph`：社交媒体分享卡片（1200x630px）
- ✅ `twitter`：Twitter Card 配置
- ✅ `robots`：控制搜索引擎爬虫行为
- ✅ `verification`：搜索引擎站长验证

#### 动态 SEO - generateMetadata
在 [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) 中为每篇文章动态生成 SEO 标签：

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",  // 文章类型
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `https://yourdomain.com/blog/${post.slug}`,
    },
  };
}
```

**核心要点：**
- ✅ 异步函数，支持数据获取
- ✅ `type: "article"`：告诉社交媒体这是文章
- ✅ `canonical`：防止重复内容影响 SEO
- ✅ 自动注入到页面 `<head>` 中

### 2️⃣ 移动端适配

#### Viewport 配置
在 [src/app/layout.tsx](src/app/layout.tsx) 中配置移动端视口：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
```

**核心要点：**
- ✅ `width=device-width`：视口宽度等于设备宽度
- ✅ `initial-scale=1`：初始缩放比例为 1
- ✅ `maximum-scale=5`：允许放大（无障碍访问）
- ✅ `theme-color`：浏览器地址栏颜色

#### 响应式设计
使用 Tailwind CSS 响应式断点：

```tsx
// 文字大小：移动端 lg，桌面端 xl
<h2 className="text-lg sm:text-xl">标题</h2>

// 网格布局：移动端 1 列，平板 2 列，桌面 3 列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {posts.map(...)}
</div>

// 显示/隐藏：移动端隐藏，桌面显示
<span className="hidden md:inline">浏览量</span>

// 按钮：移动端全宽，桌面端自适应
<button className="w-full sm:w-auto">按钮</button>
```

**Tailwind 断点：**
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

### 3️⃣ 性能优化

#### 图片优化 - next/image
```tsx
<Image
  src={post.coverImage}
  alt={post.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  priority={false}
/>
```

**优化效果：**
- ✅ 自动选择最佳格式（WebP、AVIF）
- ✅ 响应式图片（根据 sizes 加载合适尺寸）
- ✅ 懒加载（进入视口时才加载）
- ✅ 自动压缩优化

#### 字体优化 - next/font
```typescript
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

**优化效果：**
- ✅ 字体文件自托管（无需请求 Google Fonts）
- ✅ 自动子集化（减小文件体积）
- ✅ 零布局偏移（size-adjust 自动计算）

#### 流式渲染 - Suspense
```tsx
<Suspense fallback={<BlogPostCardSkeleton />}>
  <BlogList />  {/* 异步服务端组件 */}
</Suspense>
```

**工作原理：**
1. 服务器立即返回骨架屏 HTML
2. 用户看到页面框架
3. 后台继续获取数据
4. 数据就绪后，流式传输替换骨架屏

**优化效果：**
- ✅ 首屏加载更快（TTFB 降低）
- ✅ 提升感知性能
- ✅ 并行数据获取

#### 静态生成 - generateStaticParams
```typescript
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}
```

**优化效果：**
- ✅ 构建时预生成所有页面（SSG）
- ✅ 用户访问时直接返回 HTML
- ✅ CDN 边缘缓存
- ✅ SEO 友好

## 客户端组件 vs 服务端组件

详细说明请查看 [CLIENT-VS-SERVER-COMPONENTS.md](CLIENT-VS-SERVER-COMPONENTS.md)

### 服务端组件（默认）
```tsx
// 没有 "use client" = 服务端组件
export default async function Page() {
  const data = await fetchData();  // ✅ 直接获取数据
  return <div>{data}</div>;
}
```

**特点：**
- ✅ 在服务器上运行，不发送到客户端
- ✅ 可以直接访问数据库、文件系统
- ✅ 不增加客户端 JavaScript bundle
- ✅ 支持 async/await
- ❌ 不能使用 React Hooks（useState、useEffect）
- ❌ 不能使用浏览器 API（window、document）

### 客户端组件
```tsx
"use client";  // 👈 必须在顶部

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);  // ✅ 使用 Hook
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**特点：**
- ✅ 可以使用 React Hooks
- ✅ 可以使用浏览器 API
- ✅ 可以添加事件监听器
- ❌ 增加客户端 JavaScript bundle
- ❌ 不能直接访问服务端资源

### 项目中的组件分类

| 组件 | 类型 | 原因 |
|------|------|------|
| [src/app/blog/page.tsx](src/app/blog/page.tsx) | 服务端 | 需要获取数据，不需要交互 |
| [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) | 服务端 | 需要动态 SEO，不需要交互 |
| [src/app/blog/components/BlogPostCard.tsx](src/app/blog/components/BlogPostCard.tsx) | 客户端 | 演示用（实际可以是服务端） |
| [src/app/blog/[slug]/error.tsx](src/app/blog/[slug]/error.tsx) | 客户端 | 必须（Next.js 要求） |
| [src/app/blog/loading.tsx](src/app/blog/loading.tsx) | 服务端 | 静态骨架屏，不需要交互 |

## 测试与验证

### 移动端适配测试
```bash
# Chrome DevTools
1. 打开开发者工具（F12）
2. 切换到设备模拟器（Ctrl+Shift+M）
3. 选择不同设备测试
```

### SEO 测试
```bash
# 查看生成的 meta 标签
curl http://localhost:3000/blog/nextjs-15-app-router-guide | grep "<meta"
```

**在线工具：**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 性能测试
```bash
# Lighthouse 审计
1. Chrome DevTools → Lighthouse
2. 选择"性能"、"SEO"、"最佳实践"
3. 生成报告

# 构建分析
npm run build
```

## 核心学习要点

### SEO 最佳实践
1. ✅ 使用 `generateMetadata` 为每个页面定制 SEO
2. ✅ 配置 Open Graph 和 Twitter Card
3. ✅ 设置 canonical URL 避免重复内容
4. ✅ 使用 `type: "article"` 标记文章类型
5. ✅ 添加结构化数据（JSON-LD）

### 移动端适配最佳实践
1. ✅ 必须设置 viewport meta 标签
2. ✅ 使用 Tailwind 响应式类（sm:、md:、lg:）
3. ✅ 图片使用 next/image 自动优化
4. ✅ 按钮至少 44x44px（触摸友好）
5. ✅ 移动端隐藏次要信息（hidden md:inline）

### 性能优化最佳实践
1. ✅ 优先使用服务端组件（减少客户端 JS）
2. ✅ 使用 Suspense 实现流式渲染
3. ✅ 使用 next/image 优化图片
4. ✅ 使用 next/font 优化字体
5. ✅ 使用 generateStaticParams 预生成页面
6. ✅ 使用 loading.tsx 提供即时反馈
7. ✅ 使用 error.tsx 优雅处理错误

## 扩展阅读

- [Next.js Metadata 文档](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [next/image 优化指南](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Suspense 和流式渲染](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [静态生成最佳实践](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#static-data-fetching)

## 注意事项

1. **图片路径**：示例中的图片路径需要替换为实际的图片文件
2. **域名替换**：将所有 `https://yourdomain.com` 替换为你的实际域名
3. **验证码**：`verification.google` 需要从 Google Search Console 获取
4. **实际数据源**：当前使用模拟数据，实际项目需连接 CMS 或数据库

## 部署

### Vercel（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台
```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

## License

MIT

---

**通过本项目，你将学会 Next.js 15 中 SEO、移动端适配和性能优化的核心技术！** 🚀
