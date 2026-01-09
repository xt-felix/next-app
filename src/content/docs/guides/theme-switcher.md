---
title: 切换主题
description: 使用 next-themes 实现暗黑模式切换功能
---

## 安装依赖

```bash
npm install next-themes --legacy-peer-deps
npm install lucide-react --legacy-peer-deps
```

## 配置 ThemeProvider

在 Providers 中添加 NextThemesProvider：

```tsx
// src/app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <NextThemesProvider>{children}</NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
```

### HTML 根节点属性变化

配置后根节点会多出两个属性：

| 属性 | 说明 |
|------|------|
| `data-theme="light"` | 当前主题，切换时变为 `dark` |
| `style="color-scheme: light;"` | 操作系统会根据此属性调整表单控件、滚动条等系统样式 |

> 如果不需要 `color-scheme` 特性，可以通过 `enableColorScheme={false}` 关闭。

## 创建主题切换组件

```tsx
// src/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, SunMoon } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // 避免服务端渲染时的 hydration 问题
  if (!mounted) return null;

  return (
    <div onClick={() => setTheme(currentTheme)}>
      {theme === "light" ? (
        <Moon size={15} />
      ) : (
        <SunMoon size={15} color="#fff" />
      )}
    </div>
  );
}
```

### 为什么需要 mounted 状态？

服务端渲染时无法获取客户端的主题偏好，需要等组件挂载后再渲染，避免 hydration mismatch。

## 在 Header 中使用

```tsx
// src/components/header.tsx
import ThemeSwitcher from "./ThemeSwitcher";

<NavbarContent justify="end">
  <ThemeSwitcher />
  <HeaderAuth />
</NavbarContent>
```

## 自定义暗色样式

### 方式一：CSS 选择器

根据 `data-theme` 属性编写 CSS：

```css
/* src/app/globals.css */
[data-theme="dark"] {
  body {
    color: #ededed;
    background: #0a0a0a;
  }
}
```

> 删除默认的 `@media (prefers-color-scheme: dark)` 媒体查询，因为我们希望手动控制主题切换。

### 方式二：Tailwind Dark Mode

配置 Tailwind 支持 Dark Mode：

```js
// tailwind.config.js
module.exports = {
  darkMode: "class",
};
```

配置后可以使用 `dark:` 前缀定义暗色模式样式：

```tsx
// 示例：不同主题下的文字颜色
<p className="text-black dark:text-white">文本</p>
```

## 暗色样式应用示例

### Header 组件

```tsx
// src/components/header.tsx
<Navbar className="shadow-md dark:shadow-purple-800">
  {/* ... */}
</Navbar>
```

### PostList 组件

```tsx
// src/components/posts/post-list.tsx
<Listbox
  aria-label="Post List"
  itemClasses={{
    base: "border-small border-default-200 mt-4 dark:border-purple-600",
  }}
>
  {/* ... */}
</Listbox>
```

### TopicList 组件

```tsx
// src/components/topics/topic-list.tsx
<div className="max-w-[260px] p-3 rounded-small border-2 mt-4 flex gap-3 flex-wrap dark:border-purple-600">
  {/* ... */}
</div>
```

### PostShow 组件

```tsx
// src/components/posts/post-show.tsx
<>
  <h1 className="text-2xl font-bold my-2">{post.title}</h1>
  <p className="p-4 border rounded dark:border-purple-600">{post.content}</p>
</>
```

### CommentShow 组件

```tsx
// src/components/comments/comment-show.tsx
<div
  className={`border mt-2 p-4 rounded dark:border-purple-600 ${
    comment.parentId !== null && "border-dashed"
  }`}
>
  {/* ... */}
</div>
```

### CommentList 组件

```tsx
// src/components/comments/comment-list.tsx
<div className="space-y-3 !mt-8 pb-12">
  {/* ... */}
</div>
```

### SearchInput 组件

添加清除功能：

```tsx
// src/components/search-input.tsx
<Input
  // ...
  onClear={() => {
    setSearchCon("");
  }}
/>
```

## 主题样式策略对比

| 方式 | 适用场景 | 示例 |
|------|----------|------|
| NextUI 内置 | NextUI 组件 | 自动适配，无需额外配置 |
| CSS `[data-theme]` | 自定义全局样式 | `[data-theme="dark"] body { ... }` |
| Tailwind `dark:` | Tailwind 类名 | `dark:text-white` |

## next-themes API

### useTheme Hook

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme, resolvedTheme } = useTheme();
```

| 属性/方法 | 说明 |
|-----------|------|
| `theme` | 当前主题值 |
| `setTheme(theme)` | 设置主题 |
| `resolvedTheme` | 解析后的主题（考虑系统偏好） |
| `systemTheme` | 系统主题偏好 |

### ThemeProvider 属性

```tsx
<NextThemesProvider
  attribute="data-theme"        // 默认值，HTML 属性名
  defaultTheme="system"         // 默认主题
  enableSystem={true}           // 是否启用系统主题检测
  enableColorScheme={true}      // 是否设置 color-scheme CSS 属性
>
```

## 文件结构

```
src/
├── app/
│   ├── providers.tsx           # 添加 NextThemesProvider
│   └── globals.css             # 添加暗色主题样式
├── components/
│   ├── ThemeSwitcher.tsx       # 主题切换组件
│   ├── header.tsx              # 使用 ThemeSwitcher
│   └── ...                     # 其他组件添加 dark: 样式
└── tailwind.config.js          # 配置 darkMode: "class"
```

## 主题切换流程

```
用户点击切换按钮
    │
    ▼
setTheme("dark" / "light")
    │
    ▼
next-themes 更新 HTML 属性
data-theme="dark"
    │
    ├── NextUI 组件自动适配
    ├── CSS [data-theme="dark"] 样式生效
    └── Tailwind dark: 前缀样式生效
```
