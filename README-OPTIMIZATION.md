# Next.js SEO、移动端适配与性能优化实战案例

本项目展示了如何在 Next.js 15 App Router 中实现 SEO 优化、移动端适配和性能优化的最佳实践。

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

## 一、SEO 优化详解

### 1.1 全局 SEO 配置 ([layout.tsx:19-87](src/app/layout.tsx#L19-L87))

在根布局中配置全局默认的 SEO 元数据：

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
  verification: { ... }, // 搜索引擎验证
};
```

**核心要点：**
- `title.template`：子页面标题会自动使用此模板，例如 "文章标题 | 我的技术博客"
- `openGraph`：社交媒体分享时的预览卡片（1200x630px 图片）
- `twitter`：Twitter 特有的卡片格式
- `robots`：控制搜索引擎如何索引页面
- `verification`：Google Search Console 验证码

### 1.2 动态 SEO - generateMetadata ([src/app/blog/[slug]/page.tsx:24-83](src/app/blog/[slug]/page.tsx#L24-L83))

为每篇博客文章动态生成专属的 SEO 标签：

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post.title,  // 自动拼接 template
    description: post.excerpt,
    openGraph: {
      type: "article",  // 标记为文章类型
      publishedTime: post.publishedAt,  // 发布时间
      authors: [post.author.name],
      tags: post.tags,  // 标签
      images: [post.coverImage],  // 封面图
    },
    alternates: {
      canonical: `https://yourdomain.com/blog/${post.slug}`,  // 规范链接
    },
  };
}
```

**核心要点：**
- 异步函数，可以在服务端获取数据
- `type: "article"`：告诉社交媒体这是文章，而非网站
- `canonical`：防止重复内容影响 SEO 排名
- `publishedTime`：搜索引擎可以显示发布日期

### 1.3 结构化数据（未实现，但建议添加）

在实际项目中，可以添加 JSON-LD 结构化数据：

```typescript
// 在 page.tsx 中添加
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      image: post.coverImage,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    }),
  }}
/>
```

## 二、移动端适配详解

### 2.1 Viewport 配置 ([layout.tsx:104](src/app/layout.tsx#L104))

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
/>
```

**参数说明：**
- `width=device-width`：视口宽度 = 设备宽度（必须）
- `initial-scale=1`：初始缩放比例为 1（必须）
- `maximum-scale=5`：最大缩放 5 倍（无障碍访问）
- `user-scalable=yes`：允许用户缩放（默认可省略）

### 2.2 主题颜色 ([layout.tsx:107-108](src/app/layout.tsx#L107-L108))

```html
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
```

**作用：**
- 浏览器地址栏颜色（移动端）
- PWA 状态栏颜色
- 根据系统主题自动切换

### 2.3 响应式设计 - Tailwind CSS ([BlogPostCard.tsx](src/app/blog/components/BlogPostCard.tsx))

使用 Tailwind 的响应式断点实现布局适配：

```tsx
// 文字大小：移动端 lg，桌面端 xl
<h2 className="text-lg sm:text-xl">
  {post.title}
</h2>

// 行数限制：移动端 2 行，桌面端 3 行
<p className="line-clamp-2 sm:line-clamp-3">
  {post.excerpt}
</p>

// 网格布局：移动端 1 列，平板 2 列，桌面 3 列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {posts.map(...)}
</div>

// 显示/隐藏：移动端隐藏，桌面显示
<span className="hidden md:inline">{post.views} 次浏览</span>
```

**Tailwind 断点：**
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

### 2.4 触摸友好设计

```tsx
// 按钮至少 44x44px（iOS 推荐）
<button className="h-12 px-6">阅读全文</button>

// 卡片悬停效果（仅在支持 hover 的设备上）
<article className="hover:shadow-md">...</article>

// 移动端按钮全宽，桌面端自适应
<button className="w-full sm:w-auto">...</button>
```

## 三、性能优化详解

### 3.1 图片优化 - next/image ([BlogPostCard.tsx:37-45](src/app/blog/components/BlogPostCard.tsx#L37-L45))

```tsx
<Image
  src={post.coverImage}
  alt={post.title}
  fill  // 填充父容器
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"  // 懒加载
  className="object-cover"
/>
```

**优化效果：**
- ✅ 自动选择最佳格式（WebP、AVIF）
- ✅ 响应式图片（根据 sizes 加载合适尺寸）
- ✅ 懒加载（图片进入视口时才加载）
- ✅ 内置占位图（避免布局偏移）
- ✅ 自动压缩优化

**sizes 属性说明：**
- 移动端（≤768px）：图片宽度 = 100vw（视口宽度）
- 平板（≤1200px）：图片宽度 = 50vw（半屏）
- 桌面端（>1200px）：图片宽度 = 33vw（三分之一）

### 3.2 字体优化 - next/font ([layout.tsx:5-13](src/app/layout.tsx#L5-L13))

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],  // 仅加载拉丁字符
});
```

**优化效果：**
- ✅ 字体文件自托管（无需请求 Google Fonts）
- ✅ 自动子集化（减小文件体积）
- ✅ 零布局偏移（size-adjust 自动计算）
- ✅ CSS 变量方式使用（灵活性高）

### 3.3 流式渲染 - Suspense ([blog/page.tsx:56-68](src/app/blog/page.tsx#L56-L68))

```tsx
<Suspense fallback={<BlogPostCardSkeleton />}>
  <BlogList />  {/* 异步服务端组件 */}
</Suspense>
```

**工作原理：**
1. 服务器立即返回骨架屏 HTML
2. 用户看到页面框架（感知速度快）
3. 后台继续获取数据
4. 数据就绪后，流式传输替换骨架屏

**优化效果：**
- ✅ 首屏加载更快（TTFB 降低）
- ✅ 提升感知性能（用户更早看到内容）
- ✅ 并行数据获取（多个 Suspense 可同时运行）

### 3.4 静态生成 - generateStaticParams ([src/app/blog/[slug]/page.tsx:86-94](src/app/blog/[slug]/page.tsx#L86-L94))

```typescript
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map(slug => ({ slug }));
}
```

**优化效果：**
- ✅ 构建时预生成所有页面（SSG）
- ✅ 用户访问时直接返回 HTML（无服务端计算）
- ✅ CDN 边缘缓存（全球访问速度一致）
- ✅ SEO 友好（爬虫直接获取完整 HTML）

### 3.5 服务端组件 - 减少客户端 Bundle

```tsx
// ✅ 服务端组件（默认）
async function BlogList() {
  const posts = await getAllPosts();  // 在服务端获取数据
  return <div>{posts.map(...)}</div>;
}

// ❌ 如果是客户端组件，需要额外的代码：
"use client";
import { useState, useEffect } from "react";

function BlogList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("/api/posts").then(...);  // 增加客户端 JS 体积
  }, []);
  // ...
}
```

**服务端组件优势：**
- ✅ 不增加客户端 JS 体积
- ✅ 直接访问后端资源（数据库、文件系统）
- ✅ 敏感信息安全（API Key 不暴露）
- ✅ 服务端缓存（提升性能）

### 3.6 loading.tsx - 自动 Suspense ([blog/loading.tsx](src/app/blog/loading.tsx))

```tsx
// Next.js 自动将 loading.tsx 包裹为 Suspense fallback
export default function BlogLoading() {
  return <Skeleton />;
}
```

**等价于：**
```tsx
<Suspense fallback={<BlogLoading />}>
  <BlogPage />
</Suspense>
```

## 四、运行与测试

### 4.1 启动开发服务器

```bash
npm run dev
```

访问：
- 博客列表：http://localhost:3000/blog
- 博客详情：http://localhost:3000/blog/nextjs-15-app-router-guide

### 4.2 测试移动端适配

**Chrome DevTools：**
1. 打开开发者工具（F12）
2. 切换到设备模拟器（Ctrl+Shift+M）
3. 选择不同设备（iPhone、iPad、Android）
4. 测试响应式布局

### 4.3 测试 SEO

**查看生成的 meta 标签：**
```bash
curl http://localhost:3000/blog/nextjs-15-app-router-guide | grep "<meta"
```

**使用工具：**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 4.4 性能测试

**Lighthouse 审计：**
1. Chrome DevTools → Lighthouse
2. 选择"性能"、"SEO"、"最佳实践"
3. 生成报告

**构建分析：**
```bash
npm run build
```

查看构建输出：
- ● 表示静态生成（SSG）
- ○ 表示服务端渲染（SSR）
- λ 表示动态路由

## 五、核心学习要点总结

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

## 六、扩展阅读

- [Next.js Metadata 文档](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [next/image 优化指南](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Suspense 和流式渲染](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [静态生成最佳实践](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#static-data-fetching)

## 七、注意事项

1. **图片路径**：示例中的图片路径（`/images/blog/...`）需要替换为实际的图片文件
2. **域名替换**：将所有 `https://yourdomain.com` 替换为你的实际域名
3. **验证码**：`verification.google` 需要从 Google Search Console 获取
4. **实际数据源**：当前使用模拟数据，实际项目需连接 CMS 或数据库

---

通过本案例，你已经学会了 Next.js 15 中 SEO、移动端适配和性能优化的核心技术。建议实际运行项目，修改代码，观察效果，加深理解！
