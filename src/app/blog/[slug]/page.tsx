// 👈 没有 "use client" 标记 = 服务端组件（Server Component）

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog-data";

/**
 * 动态路由参数类型
 */
interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * generateMetadata - 动态生成 SEO 元数据（服务端函数）
 *
 * ✅ 这是 Next.js App Router 的核心 SEO 功能
 * - 在服务端运行，支持异步数据获取
 * - 自动注入到页面 <head> 中
 * - 支持 Open Graph、Twitter Card 等社交媒体标签
 *
 * 与客户端的区别：
 * - 这不是组件，而是一个特殊的导出函数
 * - 只能在服务端组件文件中导出
 * - 会在页面渲染前执行
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // 如果文章不存在，返回基础 metadata
  if (!post) {
    return {
      title: "文章未找到",
      description: "抱歉，您访问的文章不存在",
    };
  }

  // 格式化发布日期
  const publishedTime = new Date(post.publishedAt).toISOString();
  const modifiedTime = new Date(post.publishedAt).toISOString();

  return {
    // 标题会自动与 layout.tsx 中的 template 拼接
    title: post.title,
    description: post.excerpt,

    // 关键词（基于文章标签）
    keywords: post.tags,

    // 作者信息
    authors: [{ name: post.author.name }],

    // Open Graph 标签（Facebook、LinkedIn 等）
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `https://yourdomain.com/blog/${post.slug}`,
      siteName: "我的技术博客",
      locale: "zh_CN",
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      // 文章特有的 Open Graph 标签
      publishedTime,
      modifiedTime,
      authors: [post.author.name],
      tags: post.tags,
    },

    // Twitter Card 标签
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      creator: "@yourusername",
    },

    // Canonical URL（避免重复内容问题）
    alternates: {
      canonical: `https://yourdomain.com/blog/${post.slug}`,
    },

    // 机器人爬虫控制
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

/**
 * generateStaticParams - 静态生成优化（服务端函数）
 *
 * ✅ 性能优化的关键功能
 * - 在构建时预生成所有博客文章页面（SSG）
 * - 用户访问时直接返回 HTML，无需服务端计算
 * - 大幅提升访问速度和 SEO 表现
 *
 * 工作流程：
 * 1. 构建时：next build 会调用这个函数
 * 2. 获取所有 slug，为每个 slug 生成一个静态页面
 * 3. 生成的 HTML 文件存储在 .next 目录
 * 4. 用户访问时直接返回预生成的 HTML
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * 博客文章详情页面（服务端组件）
 *
 * ✅ 这是一个异步服务端组件
 * - 在服务器上运行，直接获取数据
 * - 不会增加客户端 JavaScript bundle
 * - 支持 SEO（搜索引擎可以直接抓取完整 HTML）
 * - 可以直接访问数据库、API 等后端资源
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // 如果文章不存在，显示 404 页面
  if (!post) {
    notFound();
  }

  // 格式化日期
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* 导航栏 */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回列表
          </Link>
        </div>
      </nav>

      {/* 文章内容 */}
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* 文章头部 */}
        <header className="mb-8">
          {/* 标签 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 标题 - 响应式字号 */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {/* 作者 */}
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{post.author.name}</span>
            </div>

            <span className="hidden sm:inline">•</span>

            {/* 发布日期 */}
            <time dateTime={post.publishedAt}>{publishedDate}</time>

            <span className="hidden sm:inline">•</span>

            {/* 阅读时长 */}
            <span>{post.readingTime} 分钟阅读</span>

            <span className="hidden md:inline">•</span>

            {/* 浏览量 */}
            <span className="hidden md:inline">
              {post.views.toLocaleString()} 次浏览
            </span>
          </div>
        </header>

        {/* 封面图 - 性能优化：priority 属性优先加载 */}
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

        {/* 文章正文 */}
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 dark:prose-a:text-blue-400">
          {/* 在实际项目中，这里会使用 MDX 或其他 Markdown 渲染器 */}
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>

        {/* 文章底部 */}
        <footer className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            查看更多文章
          </Link>
        </footer>
      </article>
    </div>
  );
}
