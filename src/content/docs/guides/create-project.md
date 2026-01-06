---
title: 项目搭建
description: 使用 create-next-app 快速创建 Next.js 项目
---

## 创建项目

使用官方脚手架创建 Next.js 项目：

```bash
npx create-next-app@latest next-stu
```

创建过程中会有以下选项：

```
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like to use `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to customize the default import alias (@/*)? ... No / Yes
```

## 启动项目

```bash
npm run dev
```

## 常见问题

### Warning: Extra attributes from the server: class ...

如果控制台出现这个警告，可能是浏览器插件导致的。

**解决方案**：关闭相关插件，或在 `src/app/layout.tsx` 中添加 `suppressHydrationWarning` 属性：

```tsx
<html lang="en" suppressHydrationWarning={true}>
  ...
</html>
```

### 为什么 useEffect 执行了两次？

在开发模式下，React 严格模式（Strict Mode）会让 `useEffect` 执行两次。

**原因**：严格模式会模拟组件的 **立即卸载和重新挂载**，帮助开发者提前发现由于重复挂载造成的 Bug，例如：
- 未正确清理的副作用（定时器、事件监听、订阅等）
- 内存泄漏问题

```tsx
'use client';

import { useEffect } from 'react';

export default function MyComponent() {
  useEffect(() => {
    console.log('组件挂载'); // 开发模式下会打印两次

    return () => {
      console.log('组件卸载'); // 清理函数
    };
  }, []);

  return <div>Hello</div>;
}
```

:::tip[提示]
这只在开发模式下发生，生产环境不会执行两次。正确的做法是确保你的 `useEffect` 有正确的清理函数，而不是试图阻止两次执行。
:::

**正确处理副作用的示例**：

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // 清理函数：组件卸载时清除定时器
  return () => clearInterval(timer);
}, []);
```
