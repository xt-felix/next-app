import { BlogPost } from "@/types/blog";

/**
 * 模拟博客文章数据
 * 在实际项目中，这些数据会从 CMS、数据库或 API 获取
 */
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Next.js 15 App Router 完全指南",
    slug: "nextjs-15-app-router-guide",
    excerpt: "深入了解 Next.js 15 的 App Router 架构，学习如何构建高性能的现代 Web 应用。",
    content: `
# Next.js 15 App Router 完全指南

App Router 是 Next.js 13+ 引入的新一代路由系统...

## 主要特性
- 服务端组件默认
- 嵌套布局
- 流式渲染
- 并行路由

## 性能优化
利用服务端组件可以显著减少客户端 JavaScript 体积...
    `.trim(),
    coverImage: "/images/blog/nextjs-app-router.jpg",
    author: {
      name: "张三",
      avatar: "/images/avatars/zhangsan.jpg",
    },
    publishedAt: "2025-12-01T10:00:00Z",
    readingTime: 8,
    tags: ["Next.js", "React", "Web开发"],
    views: 1234,
  },
  {
    id: "2",
    title: "TypeScript 5.0 新特性详解",
    slug: "typescript-5-new-features",
    excerpt: "探索 TypeScript 5.0 带来的装饰器、const 类型参数等激动人心的新功能。",
    content: `
# TypeScript 5.0 新特性详解

TypeScript 5.0 带来了许多重要更新...

## 装饰器
新的装饰器实现更符合 ECMAScript 标准...

## Const 类型参数
提供更精确的类型推断...
    `.trim(),
    coverImage: "/images/blog/typescript-5.jpg",
    author: {
      name: "李四",
      avatar: "/images/avatars/lisi.jpg",
    },
    publishedAt: "2025-11-28T14:30:00Z",
    readingTime: 6,
    tags: ["TypeScript", "编程语言"],
    views: 892,
  },
  {
    id: "3",
    title: "Web 性能优化实战技巧",
    slug: "web-performance-optimization",
    excerpt: "从图片优化到代码分割，全面提升你的 Web 应用性能。",
    content: `
# Web 性能优化实战技巧

性能是用户体验的关键...

## 图片优化
- 使用 WebP 格式
- 实现懒加载
- 响应式图片

## 代码优化
- 代码分割
- Tree shaking
- 压缩与混淆
    `.trim(),
    coverImage: "/images/blog/web-performance.jpg",
    author: {
      name: "王五",
      avatar: "/images/avatars/wangwu.jpg",
    },
    publishedAt: "2025-11-25T09:15:00Z",
    readingTime: 10,
    tags: ["性能优化", "Web开发", "最佳实践"],
    views: 1567,
  },
];

/**
 * 模拟异步获取所有博客文章
 * 实际项目中会调用 API 或查询数据库
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return blogPosts;
}

/**
 * 根据 slug 获取单篇文章
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800));
  return blogPosts.find((post) => post.slug === slug);
}

/**
 * 获取所有文章的 slug（用于静态生成）
 */
export async function getAllPostSlugs(): Promise<string[]> {
  return blogPosts.map((post) => post.slug);
}
