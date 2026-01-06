---
title: Header 组件
description: 创建一个通用的导航栏组件
---

## 创建 Header 组件

在 `src/components` 目录下创建 `header.tsx` 文件：

```tsx
// src/components/header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <div className="absolute w-full text-white z-10">
      <nav className="container flex items-center justify-between mx-auto p-8">
        <Link className="font-bold text-3xl" href="/">
          Home
        </Link>
        <div className="space-x-4 text-xl">
          <Link href="/performance">Performance</Link>
          <Link href="/reliability">Reliability</Link>
          <Link href="/scale">Scale</Link>
        </div>
      </nav>
    </div>
  );
}
```

## 代码解析

### 样式说明

| 类名 | 作用 |
|------|------|
| `absolute` | 绝对定位，脱离文档流 |
| `w-full` | 宽度 100% |
| `text-white` | 文字颜色为白色 |
| `z-10` | z-index: 10，确保在其他元素上层 |
| `container` | 响应式容器 |
| `flex` | 弹性布局 |
| `items-center` | 垂直居中 |
| `justify-between` | 两端对齐 |
| `mx-auto` | 水平居中 |
| `p-8` | padding: 2rem |
| `space-x-4` | 子元素水平间距 1rem |

### 使用 Link 组件

- `Link` 组件来自 `next/link`
- 实现客户端导航，无需刷新页面
- 自动预加载链接指向的页面

## 在 Layout 中使用

```tsx
// src/app/layout.tsx
import Header from "@/components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

## 组件目录结构

推荐的组件组织方式：

```
src/
├── components/
│   ├── header.tsx      # 导航栏
│   ├── footer.tsx      # 页脚
│   └── ui/             # 通用 UI 组件
│       ├── button.tsx
│       └── card.tsx
└── app/
    └── layout.tsx      # 引入 Header
```

:::tip[提示]
使用 `@/` 路径别名可以简化导入路径，这是 Next.js 默认配置的。`@/components/header` 等同于 `src/components/header`。
:::
