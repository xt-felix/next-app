---
title: 服务端组件
description: 深入理解 Next.js 服务端组件的概念、优势和使用方式
---

## 基本说明

Next.js 组件有两种大的类型划分，一种是客户端组件，在使用的时候需要手动的在顶部加一个 `"use client"`，一旦这样加完之后，这就和我们传统的编写 React 组件差异不大，或者说我们可以像编写传统 React 组件那样来编写这个代码。比较特殊的是服务端组件，它只会在服务端进行执行，把执行完毕的结果再交给客户端进行渲染。**默认情况下创建的组件其实就是服务端组件**。

## 为什么要有服务端组件？

使用服务端组件有很多好处：

### 1. 数据获取更高效

服务端组件可以直接在服务器端获取数据，减少客户端的请求次数和数据传输量。

### 2. 安全性更好

敏感数据和逻辑可以保留在服务器端，不会暴露给客户端。

### 3. 性能更好

相比较早期的 SSR，早期的 SSR 也有一些问题，例如它需要整个页面都在服务器端进行渲染，客户端需要接收和执行大量的 JavaScript 用于水合整个应用程序，以激活前端交互功能。

而服务端组件则是**组件级别的渲染**，意味着可以将部分组件标记为服务端组件，这些组件不必在客户端水合，因为我们在编写服务端组件的时候会刻意的不让它涉及到客户端相关的能力。这样就减少了发送到客户端的 JS 量，降低了客户端的负担。

总之使用服务端组件，可以更细粒度的进行渲染控制，有一些不需要交互的组件就可以在服务端处理，而需要交互的部分（例如表单或按钮）则使用客户端组件渲染。

它还支持**流式渲染（Streaming Rendering）**，可以逐步将 HTML 发送到客户端，从而提升页面的感知性能（页面更快可见）。

## 服务端组件示例

在 Next.js 中，组件默认就是服务端组件，例如创建一个页面 `src/app/todo/page.tsx`：

```tsx
// src/app/todo/page.tsx
function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export default async function Page() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
  const data = (await res.json()).slice(0, getRandomInt(1, 10));
  console.log(data);
  return (
    <ul>
      {data.map(({ title, id }: { title: string; id: number }) => {
        return <li key={id}>{title}</li>;
      })}
    </ul>
  );
}
```

代码的具体含义就是通过发请求拿到数据，截取一部分数据，最后进行渲染。这个代码**只会在服务端执行**，然后服务端把渲染完毕后的结果再响应给客户端。由于请求是在服务端执行，那这个打印其实也只会出现在服务端的命令行中，浏览器控制台中是看不到的。

## 使用服务端组件的限制

虽然服务端组件有很多好处，但在使用的时候也会有一些限制。

### 不能使用的操作

以下操作在服务端组件中是**不允许**的：

- `useState`、`useEffect` 等 React Hooks
- 事件处理（如 `onClick`、`onChange`）
- 浏览器相关的 API（如 `window`、`document`、`location`）

### 示例：改造为客户端组件

如果需要使用上述功能，必须将组件声明为客户端组件：

```tsx
"use client";
import { useEffect, useState } from "react";

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export default function Page() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = (await res.json()).slice(0, getRandomInt(1, 10));
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ul>
        {data.map(({ title, id }: { title: string; id: number }) => {
          return <li key={id}>{title}</li>;
        })}
      </ul>
      <button
        onClick={() => {
          location.reload();
        }}
      >
        刷新页面
      </button>
    </>
  );
}
```

只需要在最顶部添加一个 `"use client"` 指令即可。

### 如何选择？

| 功能需求 | 推荐使用 |
|---------|---------|
| 获取数据 | 服务端组件 |
| 访问后端资源（直接） | 服务端组件 |
| 保存敏感信息在服务器 | 服务端组件 |
| 减少客户端 JavaScript | 服务端组件 |
| 添加交互和事件监听 | 客户端组件 |
| 使用 useState、useEffect 等 | 客户端组件 |
| 使用浏览器 API | 客户端组件 |
| 使用依赖状态或浏览器 API 的自定义 Hook | 客户端组件 |

## 客户端组件只在客户端执行吗？

服务端组件只会在服务端执行，但客户端组件**并不是只在客户端执行**。每次刷新页面的时候客户端组件也会在服务端执行，服务端执行这一次的目的是为了生成初始的内容给到客户端，为了 SSR。

### 验证示例

```tsx
"use client";
import { useEffect, useState } from "react";

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export default function Page() {
  // #1 设置初始内容
  const [data, setData] = useState([
    {
      userId: 9999,
      id: 9999,
      title: "Eiusmod fugiat reprehenderit ad nulla.",
      completed: false,
    },
  ]);

  const fetchData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = (await res.json()).slice(0, getRandomInt(1, 10));
    setData(data);
  };

  // #2 打印数据
  console.log(data, "🤠");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ul>
        {data.map(({ title, id }: { title: string; id: number }) => {
          return <li key={id}>{title}</li>;
        })}
      </ul>
      <button
        onClick={() => {
          location.reload();
        }}
      >
        刷新页面
      </button>
    </>
  );
}
```

#### 验证结果

1. **服务端打印**：刷新页面时，服务端命令行会打印 🤠，说明客户端组件确实也在服务端执行了
2. **SSR 验证**：查看 localhost 请求，初始返回的 HTML 中就有 `"Eiusmod fugiat reprehenderit ad nulla."` 这段话，这就是 `useState` 的初始内容
3. **客户端打印**：浏览器控制台也会打印，说明客户端组件也在客户端执行了
4. **严格模式**：如果打印了很多次，是因为开启了严格模式，关闭后应该打印两次（初始渲染 + setData 更新后的渲染），项目打包上线后会正常

#### 构建时执行

执行 `npm run build` 时，客户端代码也会执行：

```bash
npm run build
# 控制台会输出 🤠，说明构建时就执行了客户端代码
```

### 总结

- **服务端组件**：只在服务端执行（包括构建时）
- **客户端组件**：在客户端执行，也可能在服务端或构建时执行

## 交叉使用服务端和客户端组件

实际开发中，不可能全部只使用服务端或客户端组件，一般需要交叉使用。

### 重要规则

:::caution[注意]
服务端组件可以引入客户端组件，但**客户端组件一般不要直接引入服务端组件**。
:::

原因：在组件中一旦声明了 `"use client"` 指令，导入的其他模块包括子组件都会被视为客户端 bundle 的一部分，会被打包成客户端代码。

### 问题示例

首先创建一个客户端组件：

```tsx
// src/components/Client-Component.tsx
"use client";

import { useState } from "react";
export default function ClientComponent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </>
  );
}
```

在首页引入：

```tsx
// app/page.tsx
import React from "react";
import ClientComponent from "@/components/Client-Component";

export default function Page() {
  return <ClientComponent />;
}
```

创建一个服务端组件：

```tsx
// src/components/Server-Component.tsx
import React from "react";

export default function ServerComponent() {
  return <div>ServerComponent</div>;
}
```

在客户端组件中引入服务端组件：

```tsx
// src/components/Client-Component.tsx
"use client";

import { useState } from "react";
import ServerComponent from "@/components/Server-Component";

export default function ClientComponent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ServerComponent />
    </>
  );
}
```

此时如果服务端组件使用了 Node API：

```tsx
// src/components/Server-Component.tsx
import React from "react";
import fs from "node:fs";

export default function ServerComponent() {
  fs;
  return <div>ServerComponent</div>;
}
```

浏览器会报错，因为 `fs` 模块在客户端不可用。

### 解决方案一：使用 server-only

安装 `server-only` 包，在服务端组件顶部添加：

```tsx
import "server-only";
import React from "react";
import fs from "node:fs";

export default function ServerComponent() {
  // ...
}
```

这样服务端代码就只能被服务端组件导入，客户端导入时会直接报错。

### 解决方案二：通过 props 传递

将服务端组件以 props 的形式传给客户端组件，Next.js 会内部进行处理，把服务端代码和客户端进行隔离，不让它一起打包到客户端。

修改客户端组件：

```tsx
// src/components/Client-Component.tsx
"use client";

import { useState } from "react";

export default function ClientComponent({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  );
}
```

在页面中使用：

```tsx
// app/page.tsx
import ClientComponent from "@/components/Client-Component";
import ServerComponent from "@/components/Server-Component";

export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
}
```

## 最佳实践

### 服务端组件最佳实践

#### 1. 共享数据

多个服务端组件可能使用同一个数据，这时候不需要使用 React Context 或 props 传递数据，而是**直接在需要使用数据的服务端组件中再次使用 fetch 获取数据**即可。

这是因为 React 拓展了 fetch 的功能，添加了缓存相关的功能，对同一地址的多次请求，无需担心多次请求带来的性能问题。

```tsx
async function getItem() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "force-cache",
  });
  return res.json();
}
```

:::note[版本说明]
- **Next.js 14.x**：fetch 函数默认情况下就具有缓存（`cache: "force-cache"`）
- **Next.js 15.x**：默认情况下 fetch 不再进行缓存（`cache: "no-store"`）

建议学习时先使用 14 版本，等生态配套完善后再升级到 15 版本。
:::

#### 2. 将仅限 Server 的代码排除在客户端环境之外

某些代码只能在服务端运行，例如获取环境变量中的敏感信息：

```ts
export async function getData() {
  const res = await fetch("https://external-service.com/data", {
    headers: {
      authorization: process.env.API_KEY,
    },
  });
  return res.json();
}
```

如果这段代码被客户端组件导入，Next.js 出于安全性考虑会把 `API_KEY` 替换为空字符串，导致程序运行出错。

使用 `server-only` 包可以防止这种情况：

```ts
import "server-only";

export async function getData() {
  // ...
}
```

#### 3. 使用第三方包

React Server Component 是新特性，很多第三方包可能还没有跟上。例如使用 `<Carousel />` 组件时，如果它内部使用了 React Hook 但没有声明 `"use client"`，在服务端组件中引入就会报错。

解决方案：创建一个包装的客户端组件：

```tsx
// custom-carousel.tsx
"use client";

import { Carousel } from "acme-carousel";
export default Carousel;
```

然后在服务端组件中引入这个包装组件：

```tsx
import Carousel from "./custom-carousel";

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      <Carousel />
    </div>
  );
}
```

#### 4. 使用 Context Provider

在 Root Layout 中使用 React Context API 会报错，因为 Root Layout 必须是服务端组件：

```tsx
// ❌ 这样会报错
import { createContext } from "react";

export const ThemeContext = createContext({});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  );
}
```

解决方案：创建一个客户端 Provider 组件：

```tsx
// theme-provider.tsx
"use client";

import { createContext } from "react";

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
```

在 Root Layout 中使用：

```tsx
import ThemeProvider from "./theme-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 客户端组件最佳实践

#### 1. 客户端组件尽可能下移

为了尽可能减少客户端 JavaScript 包的大小，**尽可能将客户端组件在组件树中下移**。

尽量把服务端组件定义在外层去获取数据，把客户端组件定义在最里层去处理用户交互。

```tsx
// SearchBar 客户端组件
import SearchBar from "./searchbar";
// Logo 服务端组件
import Logo from "./logo";

// Layout 依然作为服务端组件
export default function Layout({ children }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  );
}
```

#### 2. 从服务端组件到客户端组件传递的数据需要序列化

当在服务端组件中获取的数据需要以 props 的形式向下传给客户端组件时，这个数据需要做序列化。

这是因为 React 需要先在服务端将组件树序列化传给客户端，再在客户端反序列化构建出组件树。如果传递了不能序列化的数据，就会导致错误。

如果数据不能序列化，就改为在客户端使用第三方包获取数据。

## 路由/服务器渲染策略

### 静态渲染

所谓静态渲染，就是路由对应的组件在**构建阶段**或者**重新验证**的时候，在后台就已经渲染完毕了，后续对路由的请求结果都会被缓存。它比较适合于静态的文章博客或产品介绍，静态渲染对应的路由打包的标志是一个 **○（圈）**。

#### 示例

```tsx
export default async function Page() {
  console.log("🤠");
  return <h1>{new Date().toLocaleTimeString()}</h1>;
}
```

执行 `npm run build` 进行打包构建，会发现构建出来的 `/` 路由对应的是一个圈，表示打包构建的时候内容就被预渲染完毕了，后续请求这个路由时会一直使用构建时候的缓存内容。

#### 重新验证

可以通过设置 `revalidate` 来实现基于时间的重新验证：

```tsx
export const revalidate = 10;

export default async function Page() {
  console.log("🤠");
  return <h1>{new Date().toLocaleTimeString()}</h1>;
}
```

超过 `revalidate` 设置的时间（10 秒），首次访问会触发缓存更新，再次请求才会返回新内容。

### 动态渲染

所谓动态渲染，就是路由在**请求的时候**进行渲染。如果使用了**动态函数（Dynamic functions）**或者**未缓存的数据请求（uncached data request）**，Next.js 就会自动切换为动态渲染，动态渲染打包时候的符号是 **ƒ**。

#### 使用动态函数

动态函数指的是只有在请求时才能得到信息（如 cookie、请求头、URL 参数）的函数：

```tsx
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  cookieStore.get("token");
  console.log("🤠");
  return <h1>{new Date().toLocaleTimeString()}</h1>;
}
```

#### 使用未缓存的数据请求

```tsx
export default async function Page() {
  const src = (
    await (
      await fetch("https://api.thecatapi.com/v1/images/search", {
        cache: "no-store",
      })
    ).json()
  )[0].url;
  return <img src={src} alt="cat" />;
}
```

### 流式渲染

- **页面级别**：使用 `loading.tsx` 进行处理
- **组件级别**：使用 `<Suspense>` 进行处理

### 如何选择？

作为开发者，**无需选择静态还是动态渲染**，Next.js 会自动根据使用的功能和 API 为每个路由选择最佳的渲染策略。
