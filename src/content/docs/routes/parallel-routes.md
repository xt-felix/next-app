---
title: 平行路由
description: 使用平行路由在同一布局中同时或有条件地渲染多个页面
---

## 什么是平行路由？

平行路由（Parallel Routes）可以在**同一个布局中同时或有条件地渲染一个或多个页面**，类似于 Vue 的插槽（slot）功能。

## 平行路由的特点

- **条件路由** - 根据条件决定渲染哪个页面
- **共享 Layout** - 多个页面共享同一个布局，不影响 URL
- **独立加载状态** - 每个插槽可以有自己的 `loading.tsx`
- **独立错误处理** - 每个插槽可以有自己的 `error.tsx`
- **独立导航** - 每个插槽可以独立导航，互不影响

## 基本语法

使用 `@folder` 语法定义平行路由插槽：

```
app/
├── @team/
│   └── page.tsx           # team 插槽
├── @visitors/
│   └── page.tsx           # visitors 插槽
├── layout.tsx             # 布局，接收插槽作为 props
└── page.tsx               # 主页面（默认的 children）
```

## 基础示例

### 目录结构

```
app/
└── dashboard/
    ├── @team/
    │   └── page.tsx
    ├── @visitors/
    │   └── page.tsx
    ├── layout.tsx
    └── page.tsx
```

### 插槽页面

```tsx
// app/dashboard/@team/page.tsx
export default function TeamPage() {
  return (
    <div className="p-4 bg-blue-100 rounded">
      <h2>团队成员</h2>
      <ul>
        <li>张三 - 前端开发</li>
        <li>李四 - 后端开发</li>
        <li>王五 - UI 设计</li>
      </ul>
    </div>
  );
}
```

```tsx
// app/dashboard/@visitors/page.tsx
export default function VisitorsPage() {
  return (
    <div className="p-4 bg-green-100 rounded">
      <h2>访客统计</h2>
      <p>今日访客: 1,234</p>
      <p>本周访客: 8,567</p>
    </div>
  );
}
```

### 布局文件

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  team,
  visitors,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  visitors: React.ReactNode;
}) {
  return (
    <div>
      <h1>仪表盘</h1>
      {/* 主内容 */}
      <div>{children}</div>
      {/* 平行路由插槽 */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {team}
        {visitors}
      </div>
    </div>
  );
}
```

### 运行效果

```
┌─────────────────────────────────────────────────────────┐
│  /dashboard                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  仪表盘                                                  │
│                                                         │
│  [主内容区域 - children]                                 │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ 团队成员             │  │ 访客统计             │      │
│  │                     │  │                     │      │
│  │ • 张三 - 前端开发    │  │ 今日访客: 1,234     │      │
│  │ • 李四 - 后端开发    │  │ 本周访客: 8,567     │      │
│  │ • 王五 - UI 设计     │  │                     │      │
│  │                     │  │                     │      │
│  │ [@team 插槽]        │  │ [@visitors 插槽]    │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 条件渲染

可以根据条件决定渲染哪个插槽：

```tsx
// app/dashboard/layout.tsx
import { getUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
  team,
  visitors,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  visitors: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div>
      <h1>仪表盘</h1>
      <div>{children}</div>
      <div className="grid grid-cols-2 gap-4">
        {/* 管理员才能看到团队信息 */}
        {user.role === "admin" && team}
        {visitors}
      </div>
    </div>
  );
}
```

## 独立加载状态

每个插槽可以有自己的 `loading.tsx`：

```
app/
└── dashboard/
    ├── @team/
    │   ├── page.tsx
    │   └── loading.tsx    # team 插槽的加载状态
    ├── @visitors/
    │   ├── page.tsx
    │   └── loading.tsx    # visitors 插槽的加载状态
    └── layout.tsx
```

```tsx
// app/dashboard/@team/loading.tsx
export default function TeamLoading() {
  return (
    <div className="p-4 bg-gray-100 rounded animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
}
```

这样当 `@team` 插槽加载时，会显示骨架屏，而其他插槽不受影响。

## 独立错误处理

每个插槽也可以有自己的 `error.tsx`：

```
app/
└── dashboard/
    ├── @team/
    │   ├── page.tsx
    │   └── error.tsx      # team 插槽的错误处理
    ├── @visitors/
    │   ├── page.tsx
    │   └── error.tsx      # visitors 插槽的错误处理
    └── layout.tsx
```

```tsx
// app/dashboard/@team/error.tsx
"use client";

export default function TeamError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-4 bg-red-100 rounded">
      <h2>团队数据加载失败</h2>
      <p>{error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  );
}
```

这样即使 `@team` 插槽出错，`@visitors` 插槽仍能正常显示。

## default.tsx 文件

当平行路由的子路由不匹配时，需要提供 `default.tsx` 作为回退：

```
app/
└── dashboard/
    ├── @team/
    │   ├── page.tsx
    │   ├── settings/
    │   │   └── page.tsx   # /dashboard/settings 时显示
    │   └── default.tsx    # 回退内容
    ├── @visitors/
    │   ├── page.tsx
    │   └── default.tsx    # 回退内容
    └── layout.tsx
```

```tsx
// app/dashboard/@team/default.tsx
export default function TeamDefault() {
  return null; // 或者返回默认内容
}
```

:::caution[注意]
如果没有 `default.tsx`，当导航到子路由时，没有匹配内容的插槽会导致 404 错误。
:::

## 实战：模态框

平行路由的一个常见用例是实现模态框（Modal）：

```
app/
├── @modal/
│   ├── (.)photo/
│   │   └── [id]/
│   │       └── page.tsx   # 拦截路由，显示模态框
│   └── default.tsx        # 默认不显示
├── photo/
│   └── [id]/
│       └── page.tsx       # 直接访问时的完整页面
├── layout.tsx
└── page.tsx
```

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

```tsx
// app/@modal/default.tsx
export default function ModalDefault() {
  return null;
}
```

```tsx
// app/@modal/(.)photo/[id]/page.tsx
import Modal from "@/components/modal";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal>
      <img src={`/photos/${id}.jpg`} alt="Photo" />
    </Modal>
  );
}
```

这样：
- 从列表点击图片 → 打开模态框（URL 变为 `/photo/1`）
- 直接访问 `/photo/1` → 显示完整页面
- 刷新模态框页面 → 显示完整页面

## 平行路由 vs 路由分组

| 特性 | 平行路由 `@folder` | 路由分组 `(folder)` |
|------|-------------------|---------------------|
| 影响 URL | 否 | 否 |
| 同时渲染多个页面 | 是 | 否 |
| 作为 props 传递 | 是 | 否 |
| 独立 loading/error | 是 | 是 |
| 主要用途 | 同一页面多个区域 | 组织代码结构 |

## 总结

平行路由适用于：

1. **仪表盘** - 同时显示多个独立的数据面板
2. **模态框** - 结合拦截路由实现优雅的模态框
3. **分栏布局** - 左右分栏独立加载和导航
4. **条件渲染** - 根据用户权限显示不同内容
