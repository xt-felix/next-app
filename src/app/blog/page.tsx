// 👈 没有 "use client" 标记 = 服务端组件（Server Component）

import { Suspense } from "react";
import Link from "next/link";
import { BlogPostCard, BlogPostCardSkeleton } from "./components/BlogPostCard";
import { getAllPosts } from "@/lib/blog-data";

/**
 * 博客列表页面的 SEO 元数据
 */
export const metadata = {
  title: "博客文章列表",
  description: "浏览最新的技术文章，涵盖 Next.js、React、TypeScript 等前端开发技术",
  openGraph: {
    title: "博客文章列表 | 我的技术博客",
    description: "浏览最新的技术文章",
  },
};

/**
 * 博客文章列表组件（异步服务端组件）
 *
 * ✅ 这是一个服务端组件（Server Component）
 * - 在服务器上运行，不会发送到客户端
 * - 可以直接访问数据库、文件系统等后端资源
 * - 不会增加客户端 JavaScript bundle 体积
 * - 支持 async/await 直接获取数据
 *
 * 与客户端组件的区别：
 * ❌ 不能使用 useState、useEffect 等 React Hooks
 * ❌ 不能使用浏览器 API（window、document 等）
 * ❌ 不能添加事件监听器（onClick、onChange 等）
 * ✅ 可以直接访问后端资源
 * ✅ 可以使用 async/await
 * ✅ 更好的性能（减少客户端 JS）
 */
async function BlogList() {
  // 在服务端获取数据，不会增加客户端 bundle 体积
  const posts = await getAllPosts();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

/**
 * 博客列表页面（服务端组件）
 *
 * ✅ 这也是一个服务端组件
 * - 默认情况下，App Router 中的所有组件都是服务端组件
 * - 只有显式添加 "use client" 才会变成客户端组件
 *
 * 性能优化要点：
 * 1. 使用 Suspense 实现流式渲染，优化首屏加载体验
 * 2. BlogList 是异步组件，在服务端获取数据
 * 3. Skeleton 骨架屏提供即时的视觉反馈
 */
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 响应式导航栏 */}
      <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              我的技术博客
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              返回首页
            </Link>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            最新文章
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            探索前端开发的最佳实践和技术分享
          </p>
        </div>

        {/*
          Suspense 边界：实现流式渲染
          - fallback 中的骨架屏会立即显示
          - BlogList 组件在后台获取数据
          - 数据就绪后，内容会流式替换骨架屏
          - 这样用户可以更快看到页面框架，提升感知性能
        */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 显示 6 个骨架屏占位 */}
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogPostCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <BlogList />
        </Suspense>
      </main>
    </div>
  );
}
