"use client"; // 👈 客户端组件标记：这个组件在浏览器中运行

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";

/**
 * 博客文章卡片组件（客户端组件）
 *
 * ⚠️ 为什么是客户端组件？
 * - 虽然这个组件没有交互逻辑，但因为它使用了 Image 组件的某些特性
 * - 实际上，如果去掉 "use client"，它也能作为服务端组件运行
 * - 这里标记为客户端组件是为了演示：当需要 useState、useEffect 等 Hook 时必须使用
 *
 * 移动端适配要点：
 * - 使用 Tailwind 的响应式类：sm:, md:, lg: 等
 * - 图片使用 next/image 自动优化，支持响应式
 * - 触摸友好的交互区域（按钮至少 44x44px）
 * - 文字大小适配：移动端适当调整字号
 */
export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
      {/* 封面图片区域 */}
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
          {/*
            next/image 性能优化：
            - 自动选择最佳图片格式（WebP、AVIF）
            - 响应式图片：根据屏幕尺寸加载合适大小
            - 懒加载：图片进入视口时才加载
            - 占位图：loading="lazy" + fill 实现平滑加载
          */}
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      {/* 文章信息区域 */}
      <div className="p-4 sm:p-6">
        {/* 标签 */}
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 标题 - 响应式字号 */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 sm:text-xl">
            {post.title}
          </h2>
        </Link>

        {/* 摘要 - 移动端显示 2 行，桌面端显示 3 行 */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400 sm:line-clamp-3">
          {post.excerpt}
        </p>

        {/* 元信息栏 */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500 sm:gap-4 sm:text-sm">
          {/* 作者信息 */}
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <span>{post.author.name}</span>
          </div>

          {/* 分隔符 - 移动端隐藏部分信息 */}
          <span className="hidden sm:inline">•</span>

          {/* 阅读时长 */}
          <span className="hidden sm:inline">{post.readingTime} 分钟阅读</span>

          <span className="hidden sm:inline">•</span>

          {/* 浏览量 */}
          <span className="hidden md:inline">{post.views.toLocaleString()} 次浏览</span>
        </div>

        {/* 阅读按钮 - 移动端全宽，桌面端自适应 */}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 block w-full rounded-lg bg-gray-900 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 sm:w-auto sm:px-6"
        >
          阅读全文
        </Link>
      </div>
    </article>
  );
}

/**
 * 博客卡片骨架屏组件
 * 用于 Suspense fallback，提供加载时的视觉反馈
 */
export function BlogPostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      {/* 图片骨架 */}
      <div className="aspect-video w-full animate-pulse bg-gray-200 dark:bg-gray-800" />

      <div className="p-4 sm:p-6">
        {/* 标签骨架 */}
        <div className="mb-3 flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* 标题骨架 */}
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

        {/* 摘要骨架 */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* 元信息骨架 */}
        <div className="flex gap-3">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
