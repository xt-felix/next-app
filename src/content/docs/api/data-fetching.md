---
title: 数据获取和缓存
description: 深入理解 Next.js 中的数据获取和缓存机制
---

## 基本使用

在 Next.js 中，获取数据比较推荐使用 `fetch` 方法，因为它内部进行了扩展，例如添加了缓存和更新缓存的能力。

```ts
fetch("https://...", { cache: "force-cache" });
```

第二个参数是一个配置对象，其中 `cache` 用来控制缓存，默认值是 `force-cache`，表示强制缓存。

:::caution[注意]
只有在**服务端组件**或**只有 GET 方法的路由处理程序**中使用 fetch 函数，才是默认缓存的。

例如在 Server Action 中使用 fetch 时，不会走默认缓存，第二个参数的默认值变成了 `no-store`，表示不缓存。
:::

使用 fetch 函数并不一定都具有默认缓存，代码中的一些有意甚至无意的写法都可能会导致它退出缓存。具体哪些写法可能导致 fetch 缓存退出，可以查阅官方文档，碰到问题再针对性解决。

### 开启 fetch 请求日志

为了方便观察缓存效果，可以开启 fetch 请求的日志：

```js
// next.config.mjs
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
```

## 服务端组件中使用 fetch

以获取随机狗狗图片为例，接口 `https://dog.ceo/api/breeds/image/random` 每次请求都会返回随机的一张图片。

```tsx
const fetchData = async () => {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default async function Page() {
  const r = await fetchData();
  console.log("🤠");
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={r.message} width="300" alt="Dog" />;
}
```

### 观察结果

1. 请求路由时，控制台会显示 fetch 请求用时以及是否走了缓存
2. 连续刷新几次页面，图片不会变化，控制台显示走的都是缓存
3. **开发环境下强制刷新（Ctrl+Shift+R）会清除缓存**，图片会变化，控制台显示退出了缓存
4. 普通刷新又会命中缓存

## 路由处理程序 GET 请求中使用 fetch

新建 `app/api/cache/route.ts`：

```ts
export async function GET() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await res.json();
  return Response.json({ data });
}
```

### 开发环境

运行 `npm run dev`：
- 强制刷新跳过缓存
- 普通刷新会命中缓存

第一次硬刷新时，请求接口时间可能为 900ms+，后面普通刷新因为使用缓存数据，返回时间只需 1ms 左右。

### 生产环境

运行 `npm run build && npm run start`：
- 无论是否强制刷新，fetch 都会被缓存
- 接口数据保持不变

:::tip[提示]
开发环境和生产环境的缓存表现不同。生产环境下无论是否强制刷新，都会进行缓存，数据保持不变。
:::

## 数据验证（Revalidation）

所谓数据验证，就是**清除数据缓存并重新获取最新数据**的过程。

Next.js 提供了两种数据验证方式：

| 方式 | 说明 | 适用场景 |
|------|------|---------|
| 基于时间的重新验证 | 经过一定时间并有新请求产生后重新验证 | 数据不需要马上更新，实时性要求不高 |
| 按需重新验证 | 需要时直接调用方法验证 | 需要马上展示最新数据 |

按需重新验证又分为：
- **基于路径的**（revalidatePath）
- **基于标签的**（revalidateTag）

## 基于时间的重新验证

### 方式一：fetch 配置 next.revalidate

```ts
fetch("https://...", { next: { revalidate: 10 } });
```

单位是秒，例如 `revalidate: 3600` 表示到达 1 小时并有新的请求产生就会进行数据验证，再次请求会得到新的内容。

### 方式二：路由段配置项

```ts
export const revalidate = 10;
```

使用这种方法，会重新验证该路由中**所有的 fetch 请求**。这个代码可以写到 `layout.tsx`、`page.tsx` 或 `route.ts` 文件中。

## 按需重新验证

### revalidatePath（基于路径）

使用 `revalidatePath` 函数可以重新验证指定路径的缓存。

例如需要重新验证 `/` 页面或 `/api/cache` 路由处理程序的缓存：

```ts
// app/api/revalidatePath/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, time: Date.now() });
  }

  return Response.json({
    revalidated: false,
    time: Date.now(),
  });
}
```

使用方式：
- 请求 `/api/revalidatePath?path=/` 更新 `/` 路径的缓存
- 请求 `/api/revalidatePath?path=/api/cache` 更新 `/api/cache` 路径的缓存

:::note[说明]
`revalidatePath` 函数可以写到 Server Action 或路由处理程序中。
:::

### revalidateTag（基于标签）

使用 fetch 函数时，可以指定一个或多个标签来标记请求：

```ts
fetch("https://...", { next: { tags: ["collection"] } });
```

然后调用 `revalidateTag` 方法传递对应的标签名即可验证对应的请求：

```ts
// app/api/revalidateTag/route.ts
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, now: Date.now() });
  }
  return Response.json({ revalidated: false, now: Date.now() });
}
```

使用方式：请求 `/api/revalidateTag?tag=collection` 更新带有 `collection` 标签的缓存。

## 数据库查询的缓存

不是所有时候都能使用 fetch 请求。如果使用了不支持或未暴露 fetch 方法的第三方库（如数据库、CMS 或 ORM 客户端），但又想实现数据缓存机制，可以使用 **React 的 `cache` 函数**和路由段配置项来实现请求的缓存和重新验证。

### 示例

数据库客户端配置：

```ts
// src/db/index.ts
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient({
  log: ["query"],
});
```

使用 React cache 函数包装数据库查询：

```ts
// src/utils/index.ts
import { db } from "@/db";
import { cache } from "react";

export const getItem = cache(async (id: number) => {
  const item = await db.snippet.findUnique({
    where: { id },
  });
  return item;
});
```

在这个例子中，尽管 `getItem` 被调用两次，但只会产生一次数据库查询。

:::tip[技巧]
当遇到频繁重复的数据库操作时，使用 React 的 `cache` 函数可以避免重复查询，提升性能。
:::

## 总结

| 场景 | 推荐方式 |
|------|---------|
| 服务端组件获取数据 | 直接使用 fetch（默认缓存） |
| 路由处理程序 GET 请求 | 直接使用 fetch（默认缓存） |
| 定时更新缓存 | 基于时间的重新验证（revalidate） |
| 立即更新指定路径缓存 | revalidatePath |
| 立即更新指定标签缓存 | revalidateTag |
| 数据库查询缓存 | React cache 函数 |
