---
title: 集成 NextUI
description: 在 Next.js 项目中集成 NextUI 组件库
---

## 创建项目

```bash
npx create-next-app@latest
```

:::note[提示]
如果控制台有报错，可能是浏览器插件（如 Trancy）导致的。
:::

## 安装依赖

参考 [NextUI 官方文档](https://nextui.org/docs/frameworks/nextjs#manual-installation) 进行手动安装：

```bash
npm i @nextui-org/react framer-motion
```

### 解决 React 19 兼容性问题

如果你使用的是 React 19 候选版本（如 `19.0.0-rc-66855b96-20241106`），`@nextui-org/react` 目前的 peer dependency 明确指定需要 `react@>=18`，候选版本可能不在兼容范围内。

有两种解决办法：

**方法一：强制跳过版本检查**

```bash
npm install @nextui-org/react framer-motion --legacy-peer-deps
```

:::caution[注意]
这可能导致某些依赖出现问题，因为你在强制跳过版本检查。
:::

**方法二：降级 React 版本**

```bash
npm install react@18 react-dom@18
npm install @nextui-org/react framer-motion
```

## 配置 Tailwind CSS

在 `tailwind.config.js` 中添加 NextUI 配置：

```js
// tailwind.config.js
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    // 确保指向根目录的 node_modules
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;
```

## 配置 Provider

在根布局中添加 `NextUIProvider`：

```tsx
// app/layout.tsx
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
```

## 配置全局样式

确保 `global.css` 包含 Tailwind 指令：

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 使用组件

配置完成后，可以在页面中使用 NextUI 组件：

```tsx
// src/app/page.tsx
import { Button } from "@nextui-org/button";

export default function Page() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```

## 更多组件示例

### 按钮变体

```tsx
import { Button } from "@nextui-org/button";

export default function ButtonDemo() {
  return (
    <div className="flex gap-4">
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="danger">Danger</Button>
    </div>
  );
}
```

### 输入框

```tsx
"use client";

import { Input } from "@nextui-org/input";

export default function InputDemo() {
  return (
    <Input
      type="email"
      label="Email"
      placeholder="Enter your email"
    />
  );
}
```

### 卡片

```tsx
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

export default function CardDemo() {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">NextUI</p>
          <p className="text-small text-default-500">nextui.org</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <CardFooter>
        <Button color="primary">Learn More</Button>
      </CardFooter>
    </Card>
  );
}
```

## 暗色模式

NextUI 内置支持暗色模式，通过 `darkMode: "class"` 配置和 HTML 的 class 切换实现：

```tsx
"use client";

import { useTheme } from "next-themes";
import { Button } from "@nextui-org/button";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      Toggle Theme
    </Button>
  );
}
```

:::tip[提示]
使用 `next-themes` 库可以方便地管理主题切换，需要先安装：`npm install next-themes`
:::

## 常见问题

### 组件样式不生效

确保：
1. `tailwind.config.js` 中正确配置了 NextUI 的 content 路径
2. `global.css` 中包含了 Tailwind 指令
3. `NextUIProvider` 正确包裹了应用

### 客户端组件报错

NextUI 的交互组件（如 Input、Modal 等）需要在客户端运行，确保组件文件顶部添加了 `"use client"` 指令。
