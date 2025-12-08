// 👈 没有 "use client" = 服务端组件

/**
 * 博客详情页面的 loading 状态（服务端组件）
 */
export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* 导航栏骨架 */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </nav>

      {/* 文章内容骨架 */}
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* 头部骨架 */}
        <header className="mb-8">
          {/* 标签骨架 */}
          <div className="mb-4 flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* 标题骨架 */}
          <div className="mb-4 space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* 元信息骨架 */}
          <div className="flex gap-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </header>

        {/* 封面图骨架 */}
        <div className="mb-8 aspect-video w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />

        {/* 正文骨架 */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800"
              style={{ width: i % 3 === 0 ? "90%" : "100%" }}
            />
          ))}
        </div>
      </article>
    </div>
  );
}
