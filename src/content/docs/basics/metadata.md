---
title: 页面元数据
description: 使用 Metadata API 配置页面的 title、description 等 SEO 信息
---

## 什么是 Metadata？

Metadata（元数据）是页面的 SEO 信息，包括 `<title>`、`<meta>` 标签等，用于：
- 搜索引擎优化（SEO）
- 社交媒体分享预览
- 浏览器标签页标题

## 静态 Metadata

在 `page.tsx` 或 `layout.tsx` 中导出 `metadata` 对象：

```tsx
// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页 - 我的网站",
  description: "这是网站的首页描述",
};

export default function Home() {
  return <div>首页内容</div>;
}
```

生成的 HTML：

```html
<head>
  <title>首页 - 我的网站</title>
  <meta name="description" content="这是网站的首页描述" />
</head>
```

## 常用 Metadata 字段

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "页面标题",
  description: "页面描述，用于 SEO",
  keywords: ["Next.js", "React", "JavaScript"],
  authors: [{ name: "作者名" }],
  creator: "创建者",
  publisher: "发布者",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "分享标题",
    description: "分享描述",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter 标题",
    description: "Twitter 描述",
    images: ["/twitter-image.png"],
  },
};
```

## 动态 Metadata

使用 `generateMetadata` 函数根据页面参数动态生成：

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // 获取文章数据
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  return <article>{post.content}</article>;
}
```

## Layout 中的全局 Metadata

在根 `layout.tsx` 中设置全站默认 metadata：

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "我的网站",           // 默认标题
    template: "%s | 我的网站",     // 子页面标题模板
  },
  description: "网站默认描述",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

### title.template 用法

| 页面 | title 值 | 最终标题 |
|------|----------|----------|
| 根布局 | `{ default: "我的网站", template: "%s \| 我的网站" }` | 我的网站 |
| /about | `"关于我们"` | 关于我们 \| 我的网站 |
| /blog | `"博客"` | 博客 \| 我的网站 |

`%s` 会被子页面的 title 替换。

## Metadata 继承与合并

子页面的 metadata 会与父布局的 metadata 合并：

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: "%s | 我的网站",
    default: "我的网站",
  },
  openGraph: {
    siteName: "我的网站",
  },
};

// app/blog/page.tsx
export const metadata: Metadata = {
  title: "博客",  // 最终: "博客 | 我的网站"
  description: "所有博客文章",
  openGraph: {
    title: "博客列表",  // 会与父级 openGraph 合并
  },
};
```

## Open Graph 图片

配置社交媒体分享时的预览图：

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: "页面标题",
    description: "页面描述",
    url: "https://example.com/page",
    siteName: "网站名称",
    images: [
      {
        url: "https://example.com/og.png",
        width: 1200,
        height: 630,
        alt: "预览图描述",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
};
```

:::tip[推荐尺寸]
Open Graph 图片推荐尺寸为 1200x630 像素，这样在各平台分享时显示效果最佳。
:::

## 完整示例

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "我的网站",
    template: "%s | 我的网站",
  },
  description: "一个使用 Next.js 构建的网站",
  keywords: ["Next.js", "React", "Web 开发"],
  authors: [{ name: "张三" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "我的网站",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```
