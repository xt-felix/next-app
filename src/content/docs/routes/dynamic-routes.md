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
