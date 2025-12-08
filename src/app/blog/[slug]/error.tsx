"use client";

import Link from "next/link";

/**
 * 博客详情页面的错误边界
 *
 * error.tsx 是 Next.js App Router 的特殊文件：
 * - 自动捕获该路由段的错误
 * - 必须是客户端组件（"use client"）
 * - 提供友好的错误提示和恢复选项
 * - 不影响其他页面的正常运行
 */
export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
      <div className="max-w-md px-4 text-center">
        {/* 错误图标 */}
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="h-10 w-10 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* 错误标题 */}
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          出错了
        </h1>

        {/* 错误描述 */}
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          加载文章时遇到问题。请稍后重试。
        </p>

        {/* 错误详情（开发环境可见） */}
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 rounded-lg bg-gray-100 p-4 text-left text-sm dark:bg-gray-900">
            <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">
              错误详情
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-gray-600 dark:text-gray-400">
              {error.message}
            </pre>
          </details>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            重试
          </button>
          <Link
            href="/blog"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            返回列表
          </Link>
        </div>
      </div>
    </div>
  );
}
