# Next.js App Router：客户端组件 vs 服务端组件完全指南

## 目录
1. [核心概念](#核心概念)
2. [项目中的组件分类](#项目中的组件分类)
3. [何时使用客户端/服务端组件](#何时使用客户端服务端组件)
4. [常见问题](#常见问题)

---

## 核心概念

### 服务端组件（Server Component）- 默认

**标识：没有 `"use client"` 声明**

```tsx
// ✅ 服务端组件（默认）
export default async function Page() {
  const data = await fetchData(); // 可以直接获取数据
  return <div>{data}</div>;
}
```

**特点：**
- ✅ 在服务器上运行，不发送到客户端
- ✅ 可以直接访问数据库、文件系统、API
- ✅ 不增加客户端 JavaScript bundle 体积
- ✅ 支持 `async/await` 直接获取数据
- ✅ SEO 友好（HTML 在服务端生成）
- ❌ 不能使用 React Hooks（useState、useEffect 等）
- ❌ 不能使用浏览器 API（window、document、localStorage 等）
- ❌ 不能添加事件监听器（onClick、onChange 等）

### 客户端组件（Client Component）

**标识：文件顶部有 `"use client"` 声明**

```tsx
"use client"; // 👈 必须在文件顶部

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0); // 可以使用 Hooks
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**特点：**
- ✅ 可以使用 React Hooks（useState、useEffect、useContext 等）
- ✅ 可以使用浏览器 API（window、document、localStorage 等）
- ✅ 可以添加事件监听器（onClick、onChange 等）
- ✅ 支持交互和动态行为
- ❌ 增加客户端 JavaScript bundle 体积
- ❌ 不能直接访问服务端资源（数据库、文件系统）
- ❌ 不能使用仅服务端的 API（如 fs、path 等）

---

## 项目中的组件分类

### 🟢 服务端组件

#### 1. [src/app/blog/page.tsx](src/app/blog/page.tsx) - 博客列表页

```tsx
// 没有 "use client" = 服务端组件

// ✅ 可以导出 metadata（仅服务端）
export const metadata = {
  title: "博客列表",
  description: "...",
};

// ✅ 可以是异步函数
async function BlogList() {
  const posts = await getAllPosts(); // 直接获取数据
  return <div>{posts.map(...)}</div>;
}

export default function BlogPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BlogList /> {/* 异步服务端组件 */}
    </Suspense>
  );
}
```

**为什么是服务端组件？**
- 需要获取博客文章数据
- 不需要任何交互逻辑
- 使用 Suspense 优化加载体验
- 减少客户端 JS 体积

#### 2. [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) - 博客详情页

```tsx
// 没有 "use client" = 服务端组件

// ✅ generateMetadata 只能在服务端组件中使用
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    // ...
  };
}

// ✅ generateStaticParams 只能在服务端组件中使用
export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  return <article>{post.content}</article>;
}
```

**为什么是服务端组件？**
- 需要动态生成 SEO 元数据
- 需要使用 generateStaticParams 预生成页面
- 直接在服务端获取文章数据
- 不需要客户端交互

#### 3. [src/app/blog/loading.tsx](src/app/blog/loading.tsx) - 加载状态

```tsx
// 没有 "use client" = 服务端组件

export default function BlogLoading() {
  return <div>加载中...</div>;
}
```

**为什么是服务端组件？**
- 只是静态的骨架屏 UI
- 不需要任何交互或状态
- 服务端生成 HTML 更快

#### 4. [src/app/blog/[slug]/not-found.tsx](src/app/blog/[slug]/not-found.tsx) - 404 页面

```tsx
// 没有 "use client" = 服务端组件

export default function NotFound() {
  return <div>文章未找到</div>;
}
```

**为什么是服务端组件？**
- 静态内容
- 不需要交互
- 服务端生成更利于 SEO

### 🔵 客户端组件

#### 1. [src/app/blog/components/BlogPostCard.tsx](src/app/blog/components/BlogPostCard.tsx) - 博客卡片

```tsx
"use client"; // 👈 客户端组件标记

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group ...">
      {/* 虽然没有交互，但标记为客户端组件是为了演示 */}
      <Link href={`/blog/${post.slug}`}>
        <Image src={post.coverImage} alt={post.title} />
      </Link>
      {/* ... */}
    </article>
  );
}
```

**为什么是客户端组件？**
- 实际上这个组件也可以是服务端组件
- 这里标记为客户端组件是为了**演示目的**
- 在实际项目中，如果需要添加 onClick、hover 等交互，才需要客户端组件

**如果需要添加交互：**
```tsx
"use client";

export function BlogPostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false); // ✅ 使用 Hook

  const handleLike = () => {
    setIsLiked(!isLiked); // ✅ 事件处理
    // 调用 API 保存点赞状态
  };

  return (
    <article>
      {/* ... */}
      <button onClick={handleLike}> {/* ✅ 事件监听 */}
        {isLiked ? "❤️" : "🤍"}
      </button>
    </article>
  );
}
```

#### 2. [src/app/blog/[slug]/error.tsx](src/app/blog/[slug]/error.tsx) - 错误边界

```tsx
"use client"; // 👈 必须是客户端组件

export default function BlogPostError({ error, reset }) {
  return (
    <div>
      <h1>出错了</h1>
      <button onClick={() => reset()}> {/* ✅ 需要事件处理 */}
        重试
      </button>
    </div>
  );
}
```

**为什么必须是客户端组件？**
- `error.tsx` 必须是客户端组件（Next.js 限制）
- 需要 `onClick` 事件处理 `reset()` 函数
- 需要在客户端捕获和处理错误

---

## 何时使用客户端/服务端组件

### ✅ 使用服务端组件（默认优先）

| 场景 | 示例 |
|------|------|
| 获取数据 | `const posts = await fetchPosts()` |
| 访问后端资源 | 数据库查询、读取文件系统 |
| 敏感信息 | API Key、数据库凭证 |
| 大型依赖库 | 只在服务端使用的库，不增加客户端体积 |
| SEO 优化 | 需要搜索引擎抓取的内容 |

### ✅ 使用客户端组件（需要时才用）

| 场景 | 示例 |
|------|------|
| 交互逻辑 | `onClick`、`onChange`、`onSubmit` |
| 状态管理 | `useState`、`useReducer` |
| 生命周期 | `useEffect`、`useLayoutEffect` |
| 浏览器 API | `window`、`document`、`localStorage` |
| 自定义 Hook | `useDebounce`、`useMediaQuery` |
| 第三方组件库 | 许多 UI 库需要客户端环境 |

---

## 组件组合模式

### ✅ 推荐：服务端组件嵌套客户端组件

```tsx
// ✅ app/page.tsx (服务端组件)
import ClientCounter from "./ClientCounter";

export default async function Page() {
  const data = await fetchData(); // 在服务端获取数据

  return (
    <div>
      <h1>{data.title}</h1>
      <ClientCounter initialCount={data.count} /> {/* 客户端组件 */}
    </div>
  );
}

// ✅ app/ClientCounter.tsx (客户端组件)
"use client";
import { useState } from "react";

export default function ClientCounter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### ❌ 避免：客户端组件导入服务端组件

```tsx
// ❌ app/ClientWrapper.tsx
"use client";

import ServerComponent from "./ServerComponent"; // ❌ 错误

export default function ClientWrapper() {
  return <ServerComponent />; // 会变成客户端组件
}
```

**解决方案：通过 children 传递**
```tsx
// ✅ app/page.tsx (服务端组件)
import ClientWrapper from "./ClientWrapper";
import ServerComponent from "./ServerComponent";

export default function Page() {
  return (
    <ClientWrapper>
      <ServerComponent /> {/* ✅ 作为 children 传递 */}
    </ClientWrapper>
  );
}

// ✅ app/ClientWrapper.tsx
"use client";

export default function ClientWrapper({ children }) {
  return <div className="wrapper">{children}</div>;
}
```

---

## 常见问题

### Q1: 为什么默认是服务端组件？

**A:** 性能和安全性
- 减少客户端 JavaScript 体积（更快的加载速度）
- 保护敏感信息（API Key 不暴露给客户端）
- 更好的 SEO（HTML 在服务端生成）
- 更接近数据源（直接访问数据库）

### Q2: next/image 和 next/link 可以在服务端组件中使用吗？

**A:** 可以！
```tsx
// ✅ 服务端组件中可以使用
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <Image src="/logo.png" alt="Logo" width={100} height={100} />
      <Link href="/about">关于</Link>
    </>
  );
}
```

### Q3: 如何判断一个第三方库是否支持服务端组件？

**A:** 查看是否使用了客户端特性
- 如果使用了 `useState`、`useEffect` 等 Hook → 必须是客户端组件
- 如果使用了 `window`、`document` 等浏览器 API → 必须是客户端组件
- 如果只是纯函数或工具库（如 `date-fns`、`lodash`）→ 可以在服务端使用

### Q4: 为什么 error.tsx 必须是客户端组件？

**A:** Next.js 的设计限制
- 错误边界需要在客户端捕获和处理
- `reset()` 函数需要客户端交互
- React 的错误边界本身就是客户端特性

### Q5: 服务端组件可以使用 Context 吗？

**A:** 不能创建，但可以读取
```tsx
// ❌ 服务端组件中不能创建 Context
"use client"; // 必须标记为客户端组件
const ThemeContext = createContext();

// ✅ 但服务端组件可以接收 Context Provider 作为 children
export default async function Layout({ children }) {
  return <div>{children}</div>; // children 可以包含 Context Provider
}
```

### Q6: 本项目中哪些组件可以改为服务端组件？

**A:** [BlogPostCard.tsx](src/app/blog/components/BlogPostCard.tsx)

```tsx
// 当前：客户端组件（演示用）
"use client";
export function BlogPostCard({ post }) { ... }

// 可以改为：服务端组件（如果不需要交互）
// 移除 "use client"
export function BlogPostCard({ post }) { ... }
```

---

## 实践建议

### 1. 默认使用服务端组件
```tsx
// ✅ 除非需要交互，否则默认不加 "use client"
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### 2. 尽可能将客户端组件推到组件树的叶子节点
```tsx
// ✅ 好的做法
<ServerLayout>
  <ServerContent>
    <ClientInteractiveButton /> {/* 只有这个是客户端 */}
  </ServerContent>
</ServerLayout>

// ❌ 不好的做法
<ClientLayout> {/* 整个树都变成客户端 */}
  <Content>
    <InteractiveButton />
  </Content>
</ClientLayout>
```

### 3. 通过 props 传递数据，而非在客户端重新获取
```tsx
// ✅ 好的做法：在服务端获取数据，通过 props 传递
export default async function Page() {
  const data = await fetchData(); // 服务端获取
  return <ClientComponent data={data} />; // 传递给客户端
}

// ❌ 不好的做法：在客户端重新获取数据
"use client";
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData); // 客户端再次获取
  }, []);
  return <div>{data}</div>;
}
```

---

## 总结对比表

| 特性 | 服务端组件 | 客户端组件 |
|------|-----------|-----------|
| 标识 | 无（默认） | `"use client"` |
| 运行环境 | 服务器 | 浏览器 |
| JavaScript bundle | 不增加 | 增加 |
| 数据获取 | 直接 async/await | useEffect + fetch |
| React Hooks | ❌ | ✅ |
| 事件处理 | ❌ | ✅ |
| 浏览器 API | ❌ | ✅ |
| 后端资源访问 | ✅ | ❌ |
| SEO | ✅ 优秀 | ⚠️ 需要额外处理 |
| metadata | ✅ | ❌ |
| generateStaticParams | ✅ | ❌ |

---

通过本指南，你应该清楚了解如何在 Next.js App Router 中选择和使用客户端/服务端组件了！
