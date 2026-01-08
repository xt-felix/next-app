---
title: Next.js 中的缓存
description: 深入理解 Next.js 中的四种缓存机制
---

## 缓存概述

在 Next.js 中存在**四种类型的缓存**，理解它们对于项目开发非常重要。

| 缓存类型 | 说明 | 存储位置 |
|---------|------|---------|
| 请求记忆（Request Memoization） | 相同 URL 和参数的 fetch 请求会被自动缓存 | 服务端 |
| 数据缓存（Data Cache） | Next.js 对 fetch API 缓存能力的扩展 | 服务端 |
| 完整路由缓存（Full Route Cache） | 构建时自动渲染并缓存路由 | 服务端 |
| 客户端路由缓存（Router Cache） | 导航时在客户端缓存访问过的路由 | 客户端 |

### 1. 请求记忆（Request Memoization）

当多次使用 fetch 函数发请求时，如果请求具有相同的 URL 和请求参数，React 会自动将请求结果进行缓存。

这样在跨路由或跨组件使用相同数据时，不需要在顶层请求数据再通过 Props 传递，只需在需要数据的服务端组件中直接再次发出请求即可。

```ts
async function getItem() {
  const res = await fetch("https://.../item/1");
  return res.json();
}

// 虽然调用了两次，但实际只发起一次请求
const item = await getItem();
const item2 = await getItem(); // 来自请求记忆缓存
```

:::note[说明]
请求记忆的缓存能力是 **React 对 fetch API 的扩展**，与 Next.js 并没有直接关系。
:::

### 2. 数据缓存（Data Cache）

这是 Next.js 对 fetch API 缓存能力的再次扩展。关于数据缓存的表现、如何退出以及如何重新验证，请参考[数据获取和缓存](/api/data-fetching/)章节。

### 3. 完整路由缓存（Full Route Cache）

Next.js 在构建时会自动渲染并缓存路由，当客户端访问路由时直接使用缓存中的路由，加快页面加载速度。

:::tip[重要]
**静态渲染的路由走的是完整路由缓存。**
:::

### 4. 客户端路由缓存（Router Cache）

当用户在路由之间导航时，Next.js 会在客户端缓存访问过的路由。

与前三种缓存的区别：
- 存在于**客户端**，而前三种都存在于服务端
- **页面手动刷新时会清除**客户端路由缓存

## 完整路由缓存演示

### 示例代码

```tsx
// app/a/page.tsx
const fetchImg = async () => {
  const r = await fetch(`https://dog.ceo/api/breeds/image/random`);
  return r.json();
};

export default async function Page() {
  const obj1 = await fetchImg();
  const obj2 = await fetchImg();
  const obj3 = await fetchImg();
  console.log("🤠");
  return (
    <div>
      <img src={obj1.message} width={300} />
      <img src={obj2.message} width={300} />
      <img src={obj3.message} width={300} />
    </div>
  );
}
```

### 打包构建阶段分析

1. **第 1 次 fetch 请求**：
   - MISS 请求记忆
   - MISS 数据缓存
   - 从数据源获取数据
   - SET 到数据缓存
   - SET 到请求记忆缓存

2. **第 2、3 次 fetch 请求**：
   - 请求地址和参数完全一样
   - 命中请求记忆缓存，直接拿到上一次的数据

3. **生成 RSC Payload**：
   - RSC Payload 是服务端组件渲染出的特殊数据格式
   - 结合 RSC Payload 和客户端组件代码在服务端生成 HTML
   - RSC Payload 和 HTML 在服务端进行缓存（完整路由缓存）

:::note[结果]
由于请求记忆缓存，三张图片完全一样，因为真正的数据请求只发了一次。
:::

### 客户端请求阶段分析

执行 `npm start` 运行打包后的代码，请求 `/a` 页面时：

1. MISS 客户端路由缓存
2. 命中完整路由缓存，获取 RSC Payload 和 HTML
3. 将 RSC Payload 缓存到客户端（客户端路由缓存）
4. 客户端逐行解析 RSC Payload 进行渐进式渲染

:::caution[注意]
每次刷新页面时，客户端路由缓存都会被清除。客户端路由缓存只存在于路由导航期间。
:::

由于 `/a` 是静态渲染（打包标志为 ○），走的是完整路由缓存，所以刷新页面时控制台不会输出 🤠，代码不会再次执行。

## 请求记忆演示

### 添加动态函数

```tsx
// app/a/page.tsx
import { headers } from "next/headers";

const fetchImg = async () => {
  const r = await fetch(`https://dog.ceo/api/breeds/image/random`);
  return r.json();
};

export default async function Page() {
  const obj1 = await fetchImg();
  const obj2 = await fetchImg();
  const obj3 = await fetchImg();
  await headers(); // 动态函数
  console.log("🤠");
  return (
    <div>
      <img src={obj1.message} width={300} />
      <img src={obj2.message} width={300} />
      <img src={obj3.message} width={300} />
    </div>
  );
}
```

动态函数的引入会让路由变成**动态渲染**，每次请求页面时服务端组件代码都会执行，失去了完整路由缓存。

- 三张图片还是一样（请求记忆缓存）
- 再次刷新图片整体不变（fetch 默认数据缓存）
- 但内部命中的缓存与静态渲染不同

### 动态函数在 fetch 之前

```tsx
import { headers } from "next/headers";

const fetchImg = async () => {
  const r = await fetch(`https://dog.ceo/api/breeds/image/random`);
  return r.json();
};

export default async function Page() {
  await headers(); // 在 fetch 之前调用
  const obj1 = await fetchImg();
  const obj2 = await fetchImg();
  const obj3 = await fetchImg();
  console.log("🤠");
  return (
    <div>
      <img src={obj1.message} width={300} />
      <img src={obj2.message} width={300} />
      <img src={obj3.message} width={300} />
    </div>
  );
}
```

在动态函数下面调用 fetch 会导致 fetch 默认缓存的退出（相当于设置 `cache: "no-cache"`）：

- 每次刷新页面会请求到新的图片地址
- 但三张图片效果还是完全一样（请求记忆缓存）

### 退出请求记忆

```tsx
const fetchImg = async () => {
  const { signal } = new AbortController();
  const r = await fetch(`https://dog.ceo/api/breeds/image/random`, {
    signal,
    cache: "no-cache",
  });
  return r.json();
};

export default async function Page() {
  const obj1 = await fetchImg();
  const obj2 = await fetchImg();
  const obj3 = await fetchImg();
  console.log("🤠");
  return (
    <div>
      <img src={obj1.message} width={300} />
      <img src={obj2.message} width={300} />
      <img src={obj3.message} width={300} />
    </div>
  );
}
```

使用 `AbortController` 的 `signal` 可以退出请求记忆：

- fetch 没有缓存，每次都会产生新图片
- 没有请求记忆，每次都会调用 fetch
- 结果：三张图片不一样，每次刷新又会得到新的三张不一样的图片

## 客户端路由缓存

当用户在路由之间导航时，Next.js 会在客户端缓存访问过的路由。

### 工作流程

1. **访问 /a 页面**：
   - MISS 客户端路由缓存
   - 命中服务端完整路由缓存或进行动态渲染
   - 将 /a 对应的 Layout 和页面设置到客户端路由缓存

2. **访问 /b 页面**：
   - /b 和 /a 共享同一个 layout，直接使用客户端路由缓存中的 layout
   - /b 页面命中服务端缓存或动态渲染
   - /b 页面也添加到客户端缓存

3. **再次通过导航访问 /a**：
   - 直接使用客户端路由缓存中的 layout 和 /a 页面

此外，Next.js 还会对视口内的 Link 组件对应的路由页面进行**预加载**。

### 示例代码

```ts
// utils/index.ts
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

```tsx
// src/app/(cache)/layout.tsx
import Link from "next/link";

export default function CacheLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <nav>
        <Link href="/news">新闻</Link>
        <Link href="/sports">体育</Link>
      </nav>
      {children}
    </section>
  );
}
```

```tsx
// src/app/(cache)/loading.tsx
export default function Loading() {
  return <div>loading ...</div>;
}
```

```tsx
// src/app/(cache)/news/page.tsx
import { sleep } from "@/utils";

export default async function News() {
  await sleep(3000);
  return <div>News {new Date().toLocaleString()}</div>;
}
```

```tsx
// src/app/(cache)/sports/page.tsx
import { sleep } from "@/utils";

export default async function Sports() {
  await sleep(3000);
  return <div>Sports {new Date().toLocaleString()}</div>;
}
```

### 问题分析

执行 `npm run build && npm start`：

- 没有 loading 效果
- 不管怎么刷新，时间没有变化

原因：页面是**静态渲染**的，代码在打包构建时就已经执行完毕，刷新时使用的是完整路由缓存的内容。

### 启用动态渲染

在 layout 中添加：

```tsx
export const dynamic = "force-dynamic";
```

重新打包后，两个页面变为动态渲染（标志为 ƒ），刷新页面时间会是当前时间。

### 客户端路由缓存的问题

第一次点击体育页面，出现 loading，正常显示时间。

但再次点击新闻、再点击体育时：
- 没有 loading 效果
- 时间没有变化

这就是客户端路由缓存的结果。

### 解决方案

#### 方案一：等待缓存失效

客户端路由缓存有效期：
- **静态渲染**：5 分钟后失效
- **动态渲染**：30 秒后失效

#### 方案二：使用原生 `<a>` 标签

```tsx
<a href="/news">新闻</a>
```

缺点：会导致页面刷新，很少使用。

#### 方案三：调用 router.refresh()

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CacheLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleClick = (href: string) => {
    router.push(href);
    router.refresh();
  };

  return (
    <section>
      <nav>
        <button onClick={() => handleClick("/news")}>新闻</button>
        <button onClick={() => handleClick("/sports")}>体育</button>
      </nav>
      {children}
    </section>
  );
}
```

:::note[注意]
由于用到了 router，需要把 Layout 组件声明为客户端组件，并将 `export const dynamic = "force-dynamic"` 移到各个页面中。
:::

#### 方案四：监听路由变化自动刷新

```tsx
// app/(cache)/navigation-events.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [pathname, searchParams]);

  return null;
}
```

```tsx
// app/(cache)/layout.tsx
import Link from "next/link";
import { Suspense } from "react";
import { NavigationEvents } from "./navigation-events";

export const dynamic = "force-dynamic";

export default function CacheLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="p-5">
      <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
        <Link href="/news">新闻</Link>
        <Link href="/sports">体育</Link>
      </nav>
      {children}
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>
    </section>
  );
}
```

## 缓存行为总结

缓存行为会根据以下因素发生变化：

| 因素 | 影响 |
|------|------|
| 路由是静态渲染还是动态渲染 | 静态渲染走完整路由缓存 |
| 有没有产生请求记忆 | 相同请求会被合并 |
| 数据是缓存还是未缓存 | 影响数据更新时机 |
| 请求是初始刷新还是路由导航 | 影响客户端路由缓存 |

## 缓存流程图

```
┌─────────────────────────────────────────────────────────────┐
│                        服务端                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  fetch() ──► 请求记忆缓存 ──► 数据缓存 ──► 数据源           │
│                                                              │
│  服务端组件 ──► RSC Payload + HTML ──► 完整路由缓存         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        客户端                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  路由导航 ──► 客户端路由缓存 ──► 服务端请求                 │
│                                                              │
│  预加载 ──► RSC Payload 缓存                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
