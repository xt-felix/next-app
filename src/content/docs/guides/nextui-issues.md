---
title: NextUI 组件的坑
description: 解决 NextUI 表单验证冲突和使用 Spinner 组件
---

## 问题描述

使用 NextUI 的 Input 组件时，可能会遇到以下问题：

1. 填写不符合规则的信息，点击提交触发错误校验
2. 修改为符合规则的内容，再次点击提交
3. **预期**：错误信息消失
4. **实际**：界面没有变化，表单的 `onSubmit` 事件都没有触发

## 问题原因

NextUI 的 JS 校验逻辑和 HTML Input 原生的数据校验产生了冲突。

## 解决方案

### 方案一：关闭原生表单校验

给 form 元素添加 `noValidate` 属性，关闭原生校验：

```tsx
<form action={formAction} noValidate>
  {/* ... */}
</form>
```

### 方案二：使用 NextUI Form 组件

将原生 form 标签替换为 NextUI 提供的 Form 组件：

```tsx
import { Form } from "@nextui-org/react";

<Form onSubmit={handleSubmit} validationBehavior="aria">
  {/* ... */}
</Form>
```

### 方案三：使用原生 input 标签

将 NextUI 的 Input/Textarea 组件替换为原生的 input/textarea 标签。

## 推荐方案

最简单的方式是添加 `noValidate` 属性：

```tsx
// src/components/topics/topic-create-form.tsx
"use client";

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Textarea,
} from "@nextui-org/react";
import * as actions from "@/actions";
import { useActionState } from "react";

export default function TopicCreateForm() {
  const [state, formAction] = useActionState(actions.createTopic, {
    errors: {},
  });

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="secondary" variant="bordered">
          Create a Topic
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {/* 添加 noValidate 关闭原生校验 */}
        <form action={formAction} noValidate>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Topic</h3>
            <Input
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
              isInvalid={!!state.errors.name}
              errorMessage={state.errors.name?.join(", ")}
            />
            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Describe your topic"
              isInvalid={!!state.errors.description}
              errorMessage={state.errors.description?.join(", ")}
            />
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

## 使用 Spinner 组件优化加载状态

之前我们在 HeaderAuth 组件中使用自定义的 Tailwind 样式来显示加载状态，可以改用 NextUI 提供的 Spinner 组件：

```tsx
// src/components/header-auth.tsx
"use client";

import * as actions from "@/actions";
import {
  NavbarItem,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,  // 导入 Spinner
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function HeaderAuth() {
  const { data: session, status } = useSession();

  let authContent: React.ReactNode;

  if (status === "loading") {
    // 使用 NextUI Spinner 组件
    authContent = <Spinner size="sm" color="secondary" />;
  } else if (session?.user) {
    authContent = (
      <Popover placement="bottom">
        <PopoverTrigger>
          <Avatar
            src={
              session.user.image ||
              "https://i.pravatar.cc/150?u=a042581f4e29026024d"
            }
          />
        </PopoverTrigger>
        <PopoverContent>
          <form className="p-4" action={actions.signOut}>
            <Button type="submit">退出</Button>
          </form>
        </PopoverContent>
      </Popover>
    );
  } else {
    authContent = (
      <>
        <NavbarItem className="hidden lg:flex">
          <form action={actions.signIn}>
            <Button type="submit" color="secondary" variant="bordered">
              Sign In
            </Button>
          </form>
        </NavbarItem>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="secondary">
              Sign Up
            </Button>
          </form>
        </NavbarItem>
      </>
    );
  }

  return authContent;
}
```

## Spinner 组件属性

| 属性 | 说明 | 可选值 |
|------|------|--------|
| `size` | 大小 | `sm`、`md`、`lg` |
| `color` | 颜色 | `default`、`primary`、`secondary`、`success`、`warning`、`danger` |
| `label` | 加载文字 | 字符串 |
| `labelColor` | 文字颜色 | 同 color |

### 示例

```tsx
<Spinner size="sm" />
<Spinner size="md" color="primary" />
<Spinner size="lg" color="secondary" label="加载中..." />
```

## 总结

| 问题 | 解决方案 |
|------|----------|
| NextUI Input 和原生校验冲突 | 添加 `noValidate` 属性 |
| 加载状态样式 | 使用 NextUI `Spinner` 组件 |
