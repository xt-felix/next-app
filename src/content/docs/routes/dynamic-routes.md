---
title: 动态路由
description: Next.js 动态路由参数的使用
---

## 动态路由段

使用方括号 `[param]` 定义动态路由：

```
app/
├── blog/
│   └── [slug]/
│       └── page.tsx    # 匹配 /blog/hello, /blog/world 等
└── users/
    └── [id]/
        └── page.tsx    # 匹配 /users/1, /users/123 等
```

### 获取参数

通过 `params` prop 获取动态参数：

```tsx
// app/blog/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  return <h1>文章: {slug}</h1>;
}
```

:::note[Next.js 15 变更]
在 Next.js 15 中，`params` 变成了 Promise，需要使用 `await` 获取。
:::

## 多个动态段

可以有多个动态参数：

```
app/
└── shop/
    └── [category]/
        └── [product]/
            └── page.tsx  # 匹配 /shop/electronics/iphone
```

```tsx
// app/shop/[category]/[product]/page.tsx
type Props = {
  params: Promise<{
    category: string;
    product: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { category, product } = await params;

  return (
    <div>
      <p>分类: {category}</p>
      <p>产品: {product}</p>
    </div>
  );
}
```

## Catch-all 路由

使用 `[...param]` 捕获所有后续路径段：

```
app/
└── docs/
    └── [...slug]/
        └── page.tsx
```

| 路由 | URL | params |
|------|-----|--------|
| `[...slug]` | `/docs/a` | `{ slug: ['a'] }` |
| `[...slug]` | `/docs/a/b` | `{ slug: ['a', 'b'] }` |
| `[...slug]` | `/docs/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

```tsx
// app/docs/[...slug]/page.tsx
type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div>
      <p>路径: {slug.join(' / ')}</p>
    </div>
  );
}
```

## Optional Catch-all 路由

使用 `[[...param]]` 创建可选的 catch-all 路由，也能匹配不带参数的路径：

```
app/
└── shop/
    └── [[...slug]]/
        └── page.tsx
```

| 路由 | URL | params |
|------|-----|--------|
| `[[...slug]]` | `/shop` | `{ slug: undefined }` |
| `[[...slug]]` | `/shop/a` | `{ slug: ['a'] }` |
| `[[...slug]]` | `/shop/a/b` | `{ slug: ['a', 'b'] }` |

```tsx
// app/shop/[[...slug]]/page.tsx
type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function ShopPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    return <h1>商店首页</h1>;
  }

  return <h1>分类: {slug.join(' > ')}</h1>;
}
```

## 生成静态参数

使用 `generateStaticParams` 在构建时预生成动态路由：

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  return <article>{post.content}</article>;
}
```

### 多层动态路由

```tsx
// app/products/[category]/[product]/page.tsx
export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    category: product.category,
    product: product.slug,
  }));
}
```

## 在 Layout 中获取参数

Layout 组件也可以接收 `params`：

```tsx
// app/blog/[slug]/layout.tsx
type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function BlogLayout({ children, params }: Props) {
  const { slug } = await params;

  return (
    <div>
      <nav>当前文章: {slug}</nav>
      {children}
    </div>
  );
}
```

## 动态路由 + 查询参数

结合 `searchParams` 处理查询参数：

```tsx
// app/search/[category]/page.tsx
type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { q, page } = await searchParams;

  return (
    <div>
      <p>分类: {category}</p>
      <p>搜索词: {q}</p>
      <p>页码: {page || 1}</p>
    </div>
  );
}
```

## 实战：列表详情页

一个常见的场景是实现列表页和详情页的联动。

### 数据准备

```tsx
// src/data/posts.ts
export const data = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
];
```

### 列表页

```tsx
// app/posts/page.tsx
import Link from "next/link";
import { data } from "@/data/posts";

export default function PostsPage() {
  return (
    <div>
      <h1>文章列表</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 详情页

```tsx
// app/posts/[id]/page.tsx
import { notFound } from "next/navigation";
import { data } from "@/data/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = data.find((p) => p.id === Number(id));

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

### 目录结构

```
app/
└── posts/
    ├── page.tsx           # 列表页 → /posts
    └── [id]/
        └── page.tsx       # 详情页 → /posts/1, /posts/2, ...
```

### 运行效果

```
┌─────────────────────────────────────────────────────────┐
│  /posts (列表页)                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  文章列表                                                │
│                                                         │
│  • sunt aut facere repellat...  ← 点击跳转到 /posts/1   │
│  • qui est esse                 ← 点击跳转到 /posts/2   │
│  • ea molestias quasi...        ← 点击跳转到 /posts/3   │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  /posts/1 (详情页)                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  sunt aut facere repellat provident...                  │
│                                                         │
│  quia et suscipit suscipit recusandae                   │
│  consequuntur expedita et cum...                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 配合 generateStaticParams

如果想在构建时预生成所有详情页：

```tsx
// app/posts/[id]/page.tsx
import { notFound } from "next/navigation";
import { data } from "@/data/posts";

// 构建时生成所有文章页面
export async function generateStaticParams() {
  return data.map((post) => ({
    id: String(post.id),
  }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = data.find((p) => p.id === Number(id));

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

:::tip[提示]
`generateStaticParams` 返回的 `id` 必须是字符串类型，因为 URL 参数都是字符串。在页面组件中使用时需要转换为数字进行比较。
:::
