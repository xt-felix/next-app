---
title: 在首页展示话题列表
description: 创建话题列表组件和帖子列表组件
---

## 话题列表组件

```tsx
// src/components/topic-list.tsx
import { prisma } from "@/prisma";
import { Badge, Chip } from "@nextui-org/react";
import Link from "next/link";

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-[260px] p-3 rounded-small border-2 mt-4 flex gap-3 flex-wrap">
    {children}
  </div>
);

export default async function TopicList() {
  const topics = await prisma.topic.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return (
    <ListboxWrapper>
      {topics.map((topic) => {
        return (
          <Badge
            color="secondary"
            content={topic._count.posts}
            shape="circle"
            size="sm"
            key={topic.id}
          >
            <Chip variant="shadow" color="default">
              <Link href={`/topics/${topic.name}`} className="text-xs">
                {topic.name}
              </Link>
            </Chip>
          </Badge>
        );
      })}
    </ListboxWrapper>
  );
}
```

## 更新首页

```tsx
// src/app/page.tsx
import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topic-list";

export default function Page() {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-xl mt-2">Top Posts</h1>
      </div>
      <div>
        <TopicCreateForm />
        <TopicList />
      </div>
    </div>
  );
}
```

## 按钮右对齐

```tsx
// src/components/topics/topic-create-form.tsx
<Button color="secondary" variant="bordered" className="block ml-auto">
  Create a Topic
</Button>
```

## 查询帖子数量

使用 Prisma 的 `include` 和 `_count` 查询关联数据：

```ts
const topics = await prisma.topic.findMany({
  include: {
    _count: {
      select: {
        posts: true,
      },
    },
  },
});

// 返回结果示例
// [
//   { id: "xxx", name: "javascript", _count: { posts: 5 } },
//   { id: "yyy", name: "react", _count: { posts: 3 } },
// ]
```

## 话题详情页

```tsx
// src/app/topics/[name]/page.tsx
import PostCreateForm from "@/components/posts/post-create-form";
import PostList from "@/components/posts/posts-list";

interface TopicShowPageProps {
  params: Promise<{ name: string }>;
}

export default async function TopicShowPage({ params }: TopicShowPageProps) {
  const name = (await params).name;

  return (
    <div className="flex justify-between">
      <div className="w-3/5">
        <h1 className="text-xl mt-2 pl-2">{name}</h1>
        <PostList />
      </div>
      <div>
        <PostCreateForm />
      </div>
    </div>
  );
}
```

## PostList 组件

```tsx
// src/components/posts/posts-list.tsx
"use client";

import { Listbox, ListboxItem } from "@nextui-org/react";

export default function PostList() {
  return (
    <Listbox
      aria-label="Posts List"
      itemClasses={{
        base: "border-small border-default-200 mt-4",
      }}
    >
      <ListboxItem
        description={<p className="mt-3 text-small">Hello Next</p>}
        endContent={
          <span className="text-small text-gray-400 whitespace-nowrap self-end">
            88 comments
          </span>
        }
        onPress={() => {
          console.log("🤠");
        }}
      >
        Next.js
      </ListboxItem>
      <ListboxItem
        description={<p className="mt-3 text-small">Hello Next</p>}
        endContent={
          <span className="text-small text-gray-400 whitespace-nowrap self-end">
            88 comments
          </span>
        }
        onPress={() => {
          console.log("🤠");
        }}
      >
        Next.js
      </ListboxItem>
    </Listbox>
  );
}
```

## NextUI 组件说明

### Badge 组件

在元素上显示徽章：

```tsx
<Badge color="secondary" content={5} shape="circle" size="sm">
  <Chip>内容</Chip>
</Badge>
```

| 属性 | 说明 |
|------|------|
| `color` | 颜色 |
| `content` | 徽章内容（数字或文本） |
| `shape` | 形状：`circle`、`rectangle` |
| `size` | 大小：`sm`、`md`、`lg` |

### Chip 组件

标签/芯片组件：

```tsx
<Chip variant="shadow" color="default">
  标签内容
</Chip>
```

| 属性 | 说明 |
|------|------|
| `variant` | 变体：`solid`、`bordered`、`light`、`flat`、`faded`、`shadow`、`dot` |
| `color` | 颜色 |

### Listbox 组件

列表框组件：

```tsx
<Listbox aria-label="列表" itemClasses={{ base: "样式类名" }}>
  <ListboxItem
    description={<p>描述</p>}
    endContent={<span>右侧内容</span>}
    onPress={() => {}}
  >
    标题
  </ListboxItem>
</Listbox>
```

| 属性 | 说明 |
|------|------|
| `aria-label` | 无障碍标签 |
| `itemClasses` | 列表项的样式类 |

### ListboxItem 属性

| 属性 | 说明 |
|------|------|
| `description` | 描述内容 |
| `endContent` | 右侧内容 |
| `onPress` | 点击事件 |

## 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 首页
│   └── topics/
│       └── [name]/
│           └── page.tsx            # 话题详情页
└── components/
    ├── topic-list.tsx              # 话题列表
    ├── topics/
    │   └── topic-create-form.tsx   # 创建话题表单
    └── posts/
        ├── post-create-form.tsx    # 创建帖子表单
        └── posts-list.tsx          # 帖子列表
```

## 页面布局效果

### 首页

```
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│                                         │
│  Top Posts          [Create a Topic]    │
│                     ┌─────────────────┐ │
│                     │ ┌─────┐ ┌─────┐ │ │
│                     │ │js 5 │ │react│ │ │
│                     │ └─────┘ └─────┘ │ │
│                     └─────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 话题详情页

```
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│                                         │
│  javascript          [Create a Post]    │
│  ┌──────────────┐                       │
│  │ Post Title   │                       │
│  │ Description  │          88 comments  │
│  └──────────────┘                       │
│  ┌──────────────┐                       │
│  │ Post Title   │                       │
│  │ Description  │          88 comments  │
│  └──────────────┘                       │
│                                         │
└─────────────────────────────────────────┘
```
