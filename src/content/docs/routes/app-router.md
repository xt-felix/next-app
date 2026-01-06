---
title: App Router
description: Next.js App Router 基于文件系统的路由机制
---

## 什么是 App Router?

App Router 是 Next.js 13+ 引入的新路由系统，使用 `app` 目录来定义路由。它基于 **文件系统路由**，即文件夹结构决定 URL 路径。

## 项目结构

```
app/
├── page.tsx          # 首页 → /
├── layout.tsx        # 根布局
├── about/
│   └── page.tsx      # 关于页 → /about
├── blog/
│   ├── page.tsx      # 博客列表 → /blog
│   └── [slug]/
│       └── page.tsx  # 博客详情 → /blog/xxx
└── dashboard/
    ├── layout.tsx    # dashboard 布局
    ├── page.tsx      # → /dashboard
    └── settings/
        └── page.tsx  # → /dashboard/settings
```

## 特殊文件

App Router 中有几个特殊的文件名：

| 文件名 | 作用 |
|--------|------|
| `page.tsx` | 页面组件，使路由可访问 |
| `layout.tsx` | 布局组件，包裹子页面 |
| `template.tsx` | 模板组件，每次导航都重新挂载 |
| `loading.tsx` | 加载状态 UI |
| `error.tsx` | 错误处理 UI |
| `not-found.tsx` | 404 页面 |
| `route.ts` | API 路由处理 |

## page.tsx

`page.tsx` 是定义页面的核心文件，只有存在这个文件，路由才可访问：

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这是关于页面</p>
    </div>
  );
}
```

## layout.tsx

布局组件用于在多个页面之间共享 UI，子页面切换时布局不会重新渲染：

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header>导航栏</header>
        <main>{children}</main>
        <footer>页脚</footer>
      </body>
    </html>
  );
}
```

### 嵌套布局

布局可以嵌套，子目录的 layout 会嵌套在父目录的 layout 中：

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>侧边栏</aside>
      <section>{children}</section>
    </div>
  );
}
```

## template.tsx

`template.tsx` 和 `layout.tsx` 类似，都用于包裹子页面，但有一个关键区别：

| 特性 | layout.tsx | template.tsx |
|------|------------|--------------|
| 状态保持 | 保持状态，不重新挂载 | 每次导航都重新挂载 |
| useEffect | 不会重新执行 | 每次导航都执行 |
| 适用场景 | 共享 UI（导航栏、侧边栏） | 需要重置状态的场景 |

```tsx
// app/dashboard/template.tsx
'use client';

import { useEffect } from 'react';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 每次进入 dashboard 下的页面都会执行
    console.log('页面切换，记录访问日志');
  }, []);

  return <div>{children}</div>;
}
```

### 何时使用 template？

- 需要在页面切换时执行 `useEffect`
- 需要重置组件状态
- 记录页面访问日志
- 页面切换动画

## loading.tsx

定义加载状态，基于 React Suspense：

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>加载中...</div>;
}
```

## error.tsx

错误边界组件，需要是客户端组件：

```tsx
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>出错了！</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  );
}
```

## not-found.tsx

自定义 404 页面：

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
    </div>
  );
}
```

## 路由分组

使用 `(folder)` 语法创建路由分组，不影响 URL 路径：

```
app/
├── (marketing)/
│   ├── about/page.tsx    # → /about
│   └── contact/page.tsx  # → /contact
└── (shop)/
    ├── products/page.tsx # → /products
    └── cart/page.tsx     # → /cart
```

路由分组的用途：
- 按功能组织代码
- 为不同分组设置不同的布局
- 不影响 URL 结构
