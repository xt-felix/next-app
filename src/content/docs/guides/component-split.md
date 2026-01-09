---
title: 拆分组件优化
description: 将数据获取逻辑拆分到独立组件，配合 Suspense 优化加载体验
---

## 为什么要拆分组件

目前把获取详情的请求和 UI 直接放到页面中并不是最好的方式，原因如下：

1. **页面职责单一** - 页面后面可能还有其他更多的业务逻辑
2. **加载优化** - 把请求数据的操作放到组件里面，可以配合 `Suspense` 优化加载体验
3. **代码复用** - 独立组件更容易在其他地方复用

## 拆分帖子详情组件

### 页面组件

页面只负责接收参数并渲染组件：

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
import PostShow from "@/components/posts/post-show";

interface PostShowPageProps {
  params: {
    name: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { postId } = await params;
  return <PostShow postId={postId} />;
}
```

### 详情组件

组件内部负责数据获取和渲染：

```tsx
// src/components/posts/post-show.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/prisma";

interface PostShowProps {
  postId: string;
}

export default async function PostShow({ postId }: PostShowProps) {
  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold my-2">{post.title}</h1>
      <p className="p-4 border rounded">{post.content}</p>
    </div>
  );
}
```

## 使用 Suspense 添加 Loading

### 页面添加 Suspense

```tsx
// src/app/topics/[name]/posts/[postId]/page.tsx
import PostShow from "@/components/posts/post-show";
import PostShowLoading from "@/components/posts/post-show-loading";
import { Suspense } from "react";

interface PostShowPageProps {
  params: {
    name: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { postId } = await params;
  return (
    <Suspense fallback={<PostShowLoading />}>
      <PostShow postId={postId} />
    </Suspense>
  );
}
```

### Loading 组件（骨架屏）

使用 NextUI 的 `Skeleton` 组件创建骨架屏：

```tsx
// src/components/posts/post-show-loading.tsx
import { Skeleton } from "@nextui-org/react";

export default function PostShowLoading() {
  return (
    <div>
      <div className="my-2">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="p-4 border rounded space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
}
```

## Skeleton 组件

NextUI 的 `Skeleton` 组件用于显示加载占位符：

```tsx
import { Skeleton } from "@nextui-org/react";

<Skeleton className="h-8 w-48" />  // 高度 8，宽度 48
```

| 属性 | 说明 |
|------|------|
| `className` | 自定义样式，通常设置宽高 |
| `isLoaded` | 是否加载完成，为 `true` 时显示子元素 |

## Suspense 工作原理

```
页面渲染
    │
    ▼
遇到 Suspense 边界
    │
    ▼
PostShow 开始数据获取（异步）
    │
    ├── 获取中 → 显示 fallback（PostShowLoading）
    │
    ▼
数据获取完成
    │
    ▼
替换为 PostShow 真实内容
```

## 拆分前后对比

### 拆分前

```tsx
// 页面直接包含所有逻辑
export default async function PostShowPage({ params }) {
  const post = await prisma.post.findFirst({ ... });

  if (!post) notFound();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

**问题**：整个页面在数据加载完成前都无法显示

### 拆分后

```tsx
// 页面
export default async function PostShowPage({ params }) {
  return (
    <Suspense fallback={<PostShowLoading />}>
      <PostShow postId={postId} />
    </Suspense>
  );
}

// 组件
export default async function PostShow({ postId }) {
  const post = await prisma.post.findFirst({ ... });
  // ...
}
```

**优势**：
- 页面立即显示骨架屏
- 数据加载完成后平滑过渡到真实内容
- 用户体验更好

## 最佳实践

### 1. 数据获取放在子组件

```tsx
// ✅ 推荐：数据获取在组件内部
<Suspense fallback={<Loading />}>
  <DataComponent />  {/* 内部进行数据获取 */}
</Suspense>

// ❌ 不推荐：页面顶层获取所有数据
const data = await fetchData();
return <DataComponent data={data} />;
```

### 2. 骨架屏与真实内容结构一致

```tsx
// 真实内容
<div>
  <h1 className="text-2xl font-bold my-2">{post.title}</h1>
  <p className="p-4 border rounded">{post.content}</p>
</div>

// 骨架屏（结构对应）
<div>
  <div className="my-2">
    <Skeleton className="h-8 w-48" />  {/* 对应 h1 */}
  </div>
  <div className="p-4 border rounded">
    <Skeleton className="h-6 w-32" />  {/* 对应 p */}
  </div>
</div>
```

### 3. 多个独立区域使用多个 Suspense

```tsx
<div>
  <Suspense fallback={<PostLoading />}>
    <PostShow postId={postId} />
  </Suspense>

  <Suspense fallback={<CommentsLoading />}>
    <CommentList postId={postId} />
  </Suspense>
</div>
```

这样不同区域可以独立加载，先加载完的先显示。

## 文件结构

```
src/
├── app/
│   └── topics/
│       └── [name]/
│           └── posts/
│               └── [postId]/
│                   └── page.tsx        # 页面（使用 Suspense）
└── components/
    └── posts/
        ├── post-show.tsx               # 详情组件（数据获取）
        └── post-show-loading.tsx       # 骨架屏组件
```
