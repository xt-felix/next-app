---
title: Favicon 配置
description: 配置网站图标（favicon）的多种方式
---

## 方式一：文件约定（推荐）

将图标文件放在 `app` 目录下，Next.js 会自动识别：

```
app/
├── favicon.ico          # 浏览器标签图标
├── icon.png             # 通用图标
├── icon.svg             # SVG 图标
├── apple-icon.png       # Apple 设备图标
└── ...
```

支持的文件名：

| 文件名 | 格式 | 用途 |
|--------|------|------|
| `favicon.ico` | .ico | 浏览器标签图标 |
| `icon` | .ico, .jpg, .jpeg, .png, .svg | 通用图标 |
| `apple-icon` | .jpg, .jpeg, .png | Apple 设备图标 |

:::tip[提示]
使用文件约定方式最简单，只需将图标文件放到 `app` 目录即可，无需任何代码配置。
:::

## 方式二：Metadata API

在 `layout.tsx` 中通过 metadata 配置：

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
};
```

## 多尺寸图标

```tsx
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};
```

生成的 HTML：

```html
<link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="/apple-icon-180x180.png" sizes="180x180" type="image/png" />
```

## 动态生成图标

使用 `icon.tsx` 动态生成图标：

```tsx
// app/icon.tsx
import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 8,
        }}
      >
        N
      </div>
    ),
    { ...size }
  );
}
```

## 推荐的图标尺寸

| 图标类型 | 推荐尺寸 |
|----------|----------|
| favicon.ico | 16x16, 32x32 |
| icon.png | 192x192, 512x512 |
| apple-icon.png | 180x180 |
