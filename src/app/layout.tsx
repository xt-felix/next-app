import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 全局 SEO 元数据配置
 * 这些是默认值，可以在子页面中通过 generateMetadata 覆盖
 */
export const metadata: Metadata = {
  // 基础信息
  title: {
    default: "我的技术博客 - Next.js 实战案例",
    template: "%s | 我的技术博客", // 子页面标题会自动拼接
  },
  description: "分享 Next.js、React、TypeScript 等前端技术的实战经验和最佳实践",

  // 关键词（部分搜索引擎支持）
  keywords: ["Next.js", "React", "TypeScript", "Web开发", "前端技术"],

  // 作者信息
  authors: [{ name: "技术博客团队" }],

  // 网站分类
  category: "技术博客",

  // Open Graph 标签（Facebook、LinkedIn 等社交媒体）
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://yourdomain.com",
    siteName: "我的技术博客",
    title: "我的技术博客 - Next.js 实战案例",
    description: "分享前端技术的实战经验和最佳实践",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "网站预览图",
      },
    ],
  },

  // Twitter Card 标签
  twitter: {
    card: "summary_large_image",
    title: "我的技术博客",
    description: "分享前端技术的实战经验",
    creator: "@yourusername",
    images: ["https://yourdomain.com/twitter-image.jpg"],
  },

  // 机器人爬虫控制
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 网站图标
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // 验证标签（Google、Bing 等）
  verification: {
    google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 移动端适配：viewport 设置 */}
        {/*
          width=device-width: 视口宽度等于设备宽度
          initial-scale=1: 初始缩放比例为 1
          maximum-scale=5: 最大缩放比例为 5（提升无障碍访问）
          user-scalable=yes: 允许用户缩放
        */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

        {/* 移动端主题颜色（影响浏览器地址栏颜色） */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

        {/* iOS Safari 独立模式 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* 格式检测：防止自动将数字识别为电话号码 */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
