---
title: NotFound 页面
description: Next.js 中 404 页面的分类、触发规律及实现方案
---

## NotFound 分类

Next.js 中的 `not-found.tsx` 分为两种：

| 类型 | 位置 | 作用范围 |
|------|------|----------|
| 全局 NotFound | `app/not-found.tsx` | 整个应用 |
| 局部 NotFound | `app/xxx/not-found.tsx` | 特定路由段 |

## 触发规律

### 全局 NotFound

位于 `app/not-found.tsx`，当 **路由不匹配** 时自动触发：

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - 页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
    </div>
  );
}
```

访问任何不存在的路由（如 `/abc123`）都会显示这个页面。

### 局部 NotFound

位于 `app` 的子目录下，**只能通过 `notFound()` 函数触发**：

```tsx
// app/blog/not-found.tsx
export default function BlogNotFound() {
  return (
    <div>
      <h2>文章未找到</h2>
      <p>您查找的文章不存在或已被删除</p>
    </div>
  );
}
```

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  // 文章不存在时，触发局部 NotFound
  if (!post) {
    notFound();
  }

  return <article>{post.content}</article>;
}
```

## 触发规律总结

```
┌─────────────────────────────────────────────────────────┐
│                    触发 NotFound 的方式                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  路由不匹配（如 /abc123）                                 │
│       ↓                                                 │
│  自动触发 → 全局 not-found.tsx                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  调用 notFound() 函数                                    │
│       ↓                                                 │
│  查找局部 not-found.tsx                                  │
│       ↓                                                 │
│  找到 → 显示局部 NotFound                                │
│  找不到 → 向上查找，最终显示全局 NotFound                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 初步实现 404

### 问题：全局 NotFound 没有 Layout

直接在 `app/not-found.tsx` 创建 404 页面时，会发现它 **不会应用 `layout.tsx` 的样式**（如 Header、Footer）。

这是因为全局 NotFound 在路由匹配失败时触发，此时还没有进入任何路由的 layout。

### 方案一：使用 pathname 判断（不推荐）

在 layout 中根据 pathname 判断是否显示 Header：

```tsx
// app/layout.tsx
'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 问题：无法准确判断哪些路径是 404
  const isNotFound = !["/", "/about", "/blog"].includes(pathname);

  return (
    <html lang="zh-CN">
      <body>
        {!isNotFound && <Header />}
        {children}
      </body>
    </html>
  );
}
```

:::caution[问题]
这种方案需要手动维护有效路径列表，难以维护且容易出错。
:::

### 方案二：使用路由分组（推荐）

使用路由分组 `(folder)` 可以完美解决这个问题。

## 路由分组

路由分组使用 `(folder)` 语法，**不影响 URL 路径**。

### 路由分组的用途

1. **按功能组织路由** - 不影响 URL 的情况下组织代码
2. **共享 Layout** - 给相关页面添加公共的 layout
3. **多个根布局** - 创建完全不同 UI 的页面区域

### 使用路由分组解决 404 问题

```
app/
├── (main)/                    # 主站路由分组
│   ├── layout.tsx             # 包含 Header、Footer
│   ├── page.tsx               # 首页 → /
│   ├── about/
│   │   └── page.tsx           # → /about
│   └── blog/
│       └── page.tsx           # → /blog
├── not-found.tsx              # 全局 404（无 Header）
└── layout.tsx                 # 根 layout（只有 html/body）
```

#### 根 Layout（精简版）

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

#### 主站 Layout（包含 Header）

```tsx
// app/(main)/layout.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

#### 全局 NotFound（自定义样式）

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">页面未找到</p>
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        返回首页
      </Link>
    </div>
  );
}
```

这样：
- 访问 `/`、`/about`、`/blog` 等页面会有 Header 和 Footer
- 访问不存在的路由会显示自定义 404 页面（无 Header）

### 多个根布局

路由分组甚至可以创建多个根布局，用于完全不同 UI 的场景：

```
app/
├── (marketing)/
│   ├── layout.tsx             # 营销页面布局
│   ├── page.tsx               # 首页
│   └── about/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx             # 后台布局（侧边栏）
│   ├── dashboard/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── layout.tsx                 # 根 layout
```

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-theme">
      <nav>营销站导航</nav>
      {children}
    </div>
  );
}

// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-theme flex">
      <aside>侧边栏菜单</aside>
      <main>{children}</main>
    </div>
  );
}
```

## 使用 notFound() 函数

从 `next/navigation` 导入 `notFound` 函数：

```tsx
import { notFound } from "next/navigation";

// 在服务端组件中使用
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();  // 触发 NotFound 页面
  }

  return <div>{product.name}</div>;
}
```

:::caution[注意]
`notFound()` 函数会抛出异常来中断渲染，所以不要在 try/catch 块中使用它。
:::
