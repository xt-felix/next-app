---
title: GET 缓存
description: 了解 Next.js Route Handler 中 GET 请求的缓存机制
---

## 默认缓存行为

在生产环境下，GET 请求返回的数据可能会被缓存（开发环境不会）。

```ts
// app/api/time/route.ts
export function GET() {
  console.log("GET /api/time");
  return Response.json({ data: new Date().toLocaleTimeString() });
}
```

:::caution[注意]
开发环境不会有缓存，需要打包后测试：

```bash
pnpm build && pnpm start
```
:::

根据构建输出，你会发现 `/api/time` 是静态的，即被预渲染为静态内容。这意味着返回结果在**构建时**就已确定，而不是在请求时才确定，后续的每次请求都不会执行这个处理函数。

## 缓存退出条件

产生缓存的条件非常"严苛"，以下情况都会导致退出缓存：

### 1. 使用 Request 对象

当从 `request` 中获取前端传递的参数时，由于参数是动态的，会触发缓存退出：

```ts
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  return Response.json({
    data: new Date().toLocaleTimeString(),
    params: searchParams.toString(),
  });
}
```

此时会变成 Dynamic API Route。

### 2. 添加其他 HTTP 方法

比如添加 POST 方法，因为 POST 请求往往用于改变数据，此时再使用 GET 缓存就不合适了：

```ts
export async function GET() {
  console.log("GET /api/time");
  return Response.json({ data: new Date().toLocaleTimeString() });
}

export async function POST() {}
```

### 3. 使用动态函数

使用 `cookies`、`headers` 这样的动态函数时，因为这些数据只有请求时才知道具体值：

```ts
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  request.cookies.get("token");
  return Response.json({ data: new Date().toLocaleTimeString() });
}
```

或者使用 `headers`：

```ts
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const headersList = headers();
  const referer = headersList.get("referer");
  console.log("GET /api/time");
  return Response.json({ data: new Date().toLocaleTimeString(), referer });
}
```

### 4. 手动声明动态模式

通过路由段配置项声明为动态模式：

```ts
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ data: new Date().toLocaleTimeString() });
}
```

### 5. 设置重新验证

除了退出缓存，也可以通过 `revalidate` 设置缓存时效，适用于重要性低、时效性低的页面：

```ts
// 10s 内访问返回的都是缓存的结果
// 10s 后访问会触发缓存更新，再次访问返回新的内容
export const revalidate = 10;

export async function GET() {
  return Response.json({ data: new Date().toLocaleTimeString() });
}
```

## lowdb 配置注意事项

如果在项目中使用 lowdb，可能需要调整配置以确保打包成功：

```ts
// src/db.ts
// 如果打包还是不成功，可以删除 .next 文件夹，重新打包
import { JSONFilePreset } from "lowdb/node";

// 如果您的文件中使用了 ES6 模块的 import 或 export 语句，
// 那么该文件会被视为一个模块。在模块的顶层使用 await 是合法的
export {};

// Read or create db.json
const defaultData: { posts: { id: string; title: string; content: string }[] } =
  { posts: [] };
const db = await JSONFilePreset("db.json", defaultData);

export default db;
```

同时需要在 `tsconfig.json` 中设置：

```json
{
  "compilerOptions": {
    "target": "ES2019"
  }
}
```

## 缓存退出条件汇总

| 条件 | 说明 |
|------|------|
| 使用 Request 对象 | 获取动态参数如 `searchParams` |
| 添加其他 HTTP 方法 | 如 POST、PUT、DELETE 等 |
| 使用动态函数 | `cookies`、`headers` 等 |
| 声明动态模式 | `export const dynamic = "force-dynamic"` |
| 设置重新验证 | `export const revalidate = 10` |

:::tip[参考]
更多详情请查看 [Next.js 官方文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#caching)
:::
