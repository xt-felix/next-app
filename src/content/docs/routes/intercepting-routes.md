---
title: 拦截路由
description: 使用拦截路由实现软导航时的路由拦截效果
---

## 什么是拦截路由？

拦截路由（Intercepting Routes）允许在**软导航**（如点击链接）时拦截路由，展示自定义的内容，而**硬导航**（如直接访问 URL 或刷新页面）时则显示原始页面。

## 使用场景

### 问题背景

假设有一个图片列表，点击查看大图：

**方式一：跳转详情页**
- 点击图片 → 跳转到单独的详情页
- 缺点：打断用户继续浏览的体验

**方式二：弹框展示**
- 点击图片 → 当前页面弹框展示
- 缺点：URL 不变，无法分享具体图片

### 期望效果

- 点击图片 → 当前页面弹框展示（URL 变化）
- 分享链接 → 打开完整详情页
- 既不打断浏览体验，又能精准分享

### 真实案例

- [Unsplash](https://unsplash.com) - 图片预览
- [Dribbble](https://dribbble.com) - 作品预览

## 拦截路由语法

使用特殊的文件夹命名约定：

| 约定 | 匹配规则 |
|------|----------|
| `(.)` | 匹配**同级**路由段 |
| `(..)` | 匹配**上一级**路由段 |
| `(..)(..)` | 匹配**上两级**路由段 |
| `(...)` | 匹配**根目录** `app` 下的路由段 |

:::note[注意]
这里的层级是基于**路由段**而非文件系统目录。
:::

## 实战：图片预览模态框

### 目录结构

```
📦 src/app
┣ 📂 @modal
┃ ┣ 📂 (.)photos
┃ ┃ ┗ 📂 [id]
┃ ┃   ┗ 📜 page.tsx      # 拦截后的模态框
┃ ┗ 📜 default.tsx       # 默认不显示
┣ 📂 photos
┃ ┗ 📂 [id]
┃   ┗ 📜 page.tsx        # 完整详情页
┣ 📜 data.ts
┣ 📜 default.tsx
┣ 📜 layout.tsx
┗ 📜 page.tsx            # 图片列表
```

### 数据文件

```tsx
// src/app/data.ts
export const photos = [
  {
    id: "1",
    src: "https://test.zhihur.com/img/1.png",
    alt: "Earthen Bottle",
    price: 4,
  },
  {
    id: "2",
    src: "https://test.zhihur.com/img/2.png",
    alt: "Nomad Tumbler",
    price: 7,
  },
  {
    id: "3",
    src: "https://test.zhihur.com/img/3.png",
    alt: "Focus Paper Refill",
    price: 35,
  },
  {
    id: "4",
    src: "https://test.zhihur.com/img/4.png",
    alt: "Machined Mechanical Pencil",
    price: 16,
  },
  {
    id: "5",
    src: "https://test.zhihur.com/img/5.png",
    alt: "Leslie Alexander",
    price: 19,
  },
  {
    id: "6",
    src: "https://test.zhihur.com/img/6.png",
    alt: "Michael Foster",
    price: 69,
  },
  {
    id: "7",
    src: "https://test.zhihur.com/img/7.png",
    alt: "Dries Vincent",
    price: 22,
  },
  {
    id: "8",
    src: "https://test.zhihur.com/img/8.png",
    alt: "Lindsay Walton",
    price: 87,
  },
];
```

### Next.js 配置

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "test.zhihur.com",
      },
    ],
  },
};

export default nextConfig;
```

### 布局文件

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

### 图片列表页

```tsx
// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { photos } from "./data";

export default function Home() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-3xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {photos.map(({ id, src, alt }) => (
            <Link href={`/photos/${id}`} className="group" key={id}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <Image
                  src={src}
                  alt={alt}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                  width={200}
                  height={200}
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                Machined Mechanical Pencil
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$35</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 完整详情页（硬导航时显示）

```tsx
// src/app/photos/[id]/page.tsx
import Image from "next/image";
import { photos } from "../../data";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = photos.find((p) => p.id === id)!;

  return (
    <div className="container mx-auto">
      <Image
        className="block w-1/4 mx-auto mt-10 rounded-lg"
        src={photo.src}
        alt={photo.alt}
        width={300}
        height={300}
      />
      <div className="leading-loose border-2 border-dashed p-5 mt-5 rounded-lg border-gray-500">
        <p>
          <strong className="font-bold">Title:</strong> {photo.alt}
        </p>
        <p>
          <strong className="font-bold">Price:</strong> ${photo.price}
        </p>
        <p>
          <strong className="font-bold">Desc:</strong> Ut non occaecat
          incididunt laboris. Aliquip laboris anim dolore in officia id commodo
          nostrud non adipisicing...
        </p>
      </div>
    </div>
  );
}
```

### 模态框页面（软导航时显示）

```tsx
// src/app/@modal/(.)photos/[id]/page.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { photos } from "../../../data";

export default function PhotoModal({
  params,
}: {
  params: { id: string };
}) {
  const photo = photos.find((p) => p.id === params.id)!;
  const router = useRouter();

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-slate-300/[.8]"
      onClick={router.back}
    >
      <Image
        className="rounded-lg shadow-lg"
        src={photo.src}
        alt={photo.alt}
        width={400}
        height={400}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
```

### Default 文件

```tsx
// src/app/@modal/default.tsx
export default function Default() {
  return null;
}
```

```tsx
// src/app/default.tsx
export default function Default() {
  return null;
}
```

## 运行效果

```
┌─────────────────────────────────────────────────────────┐
│  软导航（点击列表中的图片）                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [图片列表页面保持在背景]                         │   │
│  │                                                 │   │
│  │      ┌─────────────────────┐                   │   │
│  │      │                     │                   │   │
│  │      │   [模态框大图]       │ ← @modal 插槽     │   │
│  │      │                     │                   │   │
│  │      └─────────────────────┘                   │   │
│  │                                                 │   │
│  │  URL: /photos/1 (可分享)                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  硬导航（直接访问 URL 或刷新页面）                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [完整图片详情页]                                │   │
│  │                                                 │   │
│  │        ┌───────────┐                           │   │
│  │        │   大图     │                           │   │
│  │        └───────────┘                           │   │
│  │                                                 │   │
│  │  Title: Earthen Bottle                         │   │
│  │  Price: $4                                     │   │
│  │  Desc: ...                                     │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 工作原理

```
┌─────────────────────────────────────────────────────────┐
│                    路由拦截原理                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  用户在列表页点击图片                                     │
│       ↓                                                 │
│  软导航 (Link 组件)                                      │
│       ↓                                                 │
│  Next.js 检查是否有拦截路由                              │
│       ↓                                                 │
│  找到 @modal/(.)photos/[id]                             │
│       ↓                                                 │
│  显示模态框 + URL 变为 /photos/1                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  用户直接访问 /photos/1 或刷新页面                       │
│       ↓                                                 │
│  硬导航                                                  │
│       ↓                                                 │
│  不经过拦截路由                                          │
│       ↓                                                 │
│  显示 photos/[id]/page.tsx 完整页面                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 常见问题

### 报错：Application error: a client-side exception has occurred

尝试以下步骤：
1. 删除 `.next` 文件夹
2. 重新启动项目

```bash
rm -rf .next
npm run dev
```

### 为什么需要 default.tsx？

当使用平行路由配合拦截路由时，`default.tsx` 提供了在路由不匹配时的回退内容。没有它可能导致 404 错误。

## 参考资源

- [Next.js 官方文档 - Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
- [Vercel Nextgram 示例](https://github.com/vercel/nextgram)
- [在线演示](https://intercepting-routes-ochre.vercel.app/)
