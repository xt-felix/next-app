// 👈 没有 "use client" = 服务端组件

import Link from "next/link";

/**
 * 博客文章未找到页面（服务端组件）
 *
 * not-found.tsx 是 Next.js App Router 的特殊文件：
 * - 当调用 notFound() 函数时显示
 * - 提供友好的 404 错误页面
 * - 可以为每个路由段定制不同的 404 页面
 * - 可以是服务端组件（因为不需要交互）
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
      <div className="max-w-md px-4 text-center">
        {/* 404 图标 */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
        </div>

        {/* 标题 */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          文章未找到
        </h2>

        {/* 描述 */}
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          抱歉，您访问的文章不存在或已被删除。
        </p>

        {/* 返回按钮 */}
        <Link
          href="/blog"
          className="inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
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
          返回博客列表
        </Link>
      </div>
    </div>
  );
}
