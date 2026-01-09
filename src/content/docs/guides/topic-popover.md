---
title: 创建话题弹框
description: 使用 Popover 创建话题表单弹框
---

## 概述

将话题创建按钮改造为弹框形式，点击按钮弹出包含表单的 Popover。

## 更新 TopicCreateForm 组件

```tsx
// src/components/topics/topic-create-form.tsx
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Textarea,
} from "@nextui-org/react";
import * as actions from "@/actions";

export default function TopicCreateForm() {
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="secondary" variant="bordered">
          Create a Topic
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={actions.createTopic}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Topic</h3>
            <Input
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
            />
            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Describe your topic"
            />
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

## 创建 createTopic Action

```ts
// src/actions/create-topic.ts
"use server";

export async function createTopic(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");
  console.log(name, description);
}
```

## 更新 actions 导出

```ts
// src/actions/index.ts
export { signIn } from "./sign-in";
export { signOut } from "./sign-out";
export { createTopic } from "./create-topic";
```

## 组件说明

### Popover 组件

| 属性 | 说明 |
|------|------|
| `placement` | 弹出位置，可选 `top`、`bottom`、`left`、`right` 等 |

### Input 组件

| 属性 | 说明 |
|------|------|
| `name` | 表单字段名，用于 FormData |
| `label` | 标签文字 |
| `labelPlacement` | 标签位置，`outside` 表示在输入框外部 |
| `placeholder` | 占位文字 |

### Textarea 组件

与 Input 类似，用于多行文本输入。

## 表单数据获取

在 Server Action 中，使用 `FormData` 获取表单数据：

```ts
export async function createTopic(formData: FormData) {
  const name = formData.get("name");        // 获取 name 字段
  const description = formData.get("description"); // 获取 description 字段
}
```

`formData.get()` 返回的值类型为 `FormDataEntryValue | null`，后续需要进行类型检查和验证。

## 表单布局样式

```tsx
<div className="flex flex-col gap-4 p-4 w-80">
```

| 类名 | 说明 |
|------|------|
| `flex flex-col` | 纵向排列 |
| `gap-4` | 元素间距 1rem |
| `p-4` | 内边距 1rem |
| `w-80` | 宽度 20rem (320px) |

## 效果示意

```
点击按钮后：

┌─────────────────────────────────────────┐
│  Top Posts                              │
│                    ┌─────────────────┐  │
│                    │ Create a Topic  │  │
│                    │                 │  │
│  ┌──────────────┐  │ Name            │  │
│  │Create a Topic│◀─│ ┌─────────────┐ │  │
│  └──────────────┘  │ │             │ │  │
│                    │ └─────────────┘ │  │
│                    │                 │  │
│                    │ Description     │  │
│                    │ ┌─────────────┐ │  │
│                    │ │             │ │  │
│                    │ │             │ │  │
│                    │ └─────────────┘ │  │
│                    │                 │  │
│                    │ [  Submit  ]    │  │
│                    └─────────────────┘  │
└─────────────────────────────────────────┘
```

## 项目结构

```
src/
├── actions/
│   ├── index.ts         # 统一导出
│   ├── sign-in.ts
│   ├── sign-out.ts
│   └── create-topic.ts  # 新增
└── components/
    └── topics/
        └── topic-create-form.tsx
```
