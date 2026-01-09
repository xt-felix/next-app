---
title: 创建 TopicCreateForm 组件
description: 创建话题表单组件和首页布局
---

## 概述

创建一个话题创建按钮组件，并在首页中使用。

## 创建 TopicCreateForm 组件

```tsx
// src/components/topics/topic-create-form.tsx
import { Button } from "@nextui-org/react";

export default function TopicCreateForm() {
  return (
    <Button color="secondary" variant="bordered">
      Create a Topic
    </Button>
  );
}
```

## 更新首页

```tsx
// src/app/page.tsx
import TopicCreateForm from "@/components/topics/topic-create-form";

export default function Page() {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-xl m-2">Top Posts</h1>
      </div>
      <div>
        <TopicCreateForm />
      </div>
    </div>
  );
}
```

## 更新根布局

添加容器样式，限制最大宽度并居中：

```tsx
// src/app/layout.tsx
import { Providers } from "./providers";
import Header from "@/components/header";
import { geistSans, geistMono } from "./fonts"; // 假设字体配置

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <div className="max-w-[1024px] mx-auto px-6 pt-5">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
```

## 布局样式说明

| 类名 | 说明 |
|------|------|
| `max-w-[1024px]` | 最大宽度 1024px |
| `mx-auto` | 水平居中 |
| `px-6` | 左右内边距 1.5rem |
| `pt-5` | 上内边距 1.25rem |

## 项目结构

```
src/
├── app/
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 首页
└── components/
    ├── header.tsx      # 表头组件
    └── topics/
        └── topic-create-form.tsx  # 话题创建表单
```

## 首页布局效果

```
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │  Top Posts      [Create a Topic] │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│           max-w-[1024px] mx-auto        │
│                                         │
└─────────────────────────────────────────┘
```

使用 `flex justify-between` 让标题和按钮分别靠左和靠右对齐。
