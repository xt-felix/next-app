// 👈 没有 "use client" = 服务端组件

/**
 * 博客列表页面的 loading 状态（服务端组件）
 *
 * loading.tsx 是 Next.js App Router 的特殊文件：
 * - 自动作为 Suspense fallback
 * - 在页面数据加载时显示
 * - 提供即时的视觉反馈，提升用户体验
 * - 虽然是服务端组件，但会序列化为 HTML 发送到客户端
 */
export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏骨架 */}
      <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 标题骨架 */}
        <div className="mb-8">
          <div className="mb-2 h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* 文章卡片骨架网格 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
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
          ))}
        </div>
      </main>
    </div>
  );
}
