import { News } from '../types';

/**
 * 模拟新闻数据
 * 实际项目中应该从数据库或 API 获取
 */
export const newsData: News[] = [
  {
    id: 1,
    title: 'Next.js 15 正式发布！带来革命性更新',
    content: 'Next.js 15 带来了全新的 App Router 性能优化，服务端组件渲染速度提升 40%，同时引入了新的缓存机制和增量静态再生成功能...',
    summary: 'Next.js 15 发布，性能大幅提升',
    author: '技术编辑部',
    publishDate: '2024-01-15',
    category: '技术资讯',
    imageUrl: '/images/nextjs15.jpg',
    views: 12500,
  },
  {
    id: 2,
    title: 'React 服务端组件深度解析',
    content: 'React Server Components 是 React 团队推出的新特性,允许组件在服务端渲染并直接访问后端资源。这篇文章将深入探讨其原理和最佳实践...',
    summary: '深入理解 React 服务端组件',
    author: '张三',
    publishDate: '2024-01-14',
    category: '前端开发',
    imageUrl: '/images/rsc.jpg',
    views: 8900,
  },
  {
    id: 3,
    title: 'TypeScript 5.3 新特性一览',
    content: 'TypeScript 5.3 版本带来了更强大的类型推断能力，支持 import attributes 和 resolution-mode，优化了类型检查性能...',
    summary: 'TypeScript 5.3 新特性详解',
    author: '李四',
    publishDate: '2024-01-13',
    category: '编程语言',
    views: 6700,
  },
  {
    id: 4,
    title: 'Tailwind CSS v4.0 Beta 版发布',
    content: 'Tailwind CSS v4.0 采用了全新的引擎架构，构建速度提升 10 倍，同时引入了容器查询、动态视口单位等现代 CSS 特性...',
    summary: 'Tailwind CSS v4.0 带来极速构建体验',
    author: '王五',
    publishDate: '2024-01-12',
    category: '前端开发',
    views: 5400,
  },
  {
    id: 5,
    title: 'Web 性能优化：Core Web Vitals 实战指南',
    content: '本文详细介绍如何优化 LCP、FID、CLS 三大核心指标，通过实际案例展示如何将网站性能提升至优秀水平...',
    summary: '实战优化 Web 核心性能指标',
    author: '赵六',
    publishDate: '2024-01-11',
    category: '性能优化',
    imageUrl: '/images/performance.jpg',
    views: 7200,
  },
  {
    id: 6,
    title: 'GraphQL vs REST：2024 年该如何选择？',
    content: '深入对比 GraphQL 和 REST API 的优劣势，分析在不同场景下的最佳选择，并提供迁移指南...',
    summary: 'API 架构选择指南',
    author: '技术编辑部',
    publishDate: '2024-01-10',
    category: '后端开发',
    views: 4500,
  },
  {
    id: 7,
    title: 'Docker 容器化部署最佳实践',
    content: '从零到一学习 Docker 容器化部署，包括镜像优化、多阶段构建、安全配置等企业级实践经验...',
    summary: 'Docker 部署完整指南',
    author: '运维团队',
    publishDate: '2024-01-09',
    category: 'DevOps',
    views: 6100,
  },
  {
    id: 8,
    title: 'Prisma ORM：现代化数据库访问方案',
    content: 'Prisma 是下一代 ORM 工具，提供类型安全的数据库访问、自动迁移、强大的查询构建器等特性...',
    summary: '使用 Prisma 简化数据库操作',
    author: '后端团队',
    publishDate: '2024-01-08',
    category: '后端开发',
    imageUrl: '/images/prisma.jpg',
    views: 5800,
  },
];

/**
 * 模拟延迟，用于演示 SSR 加载状态
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取所有新闻列表（模拟 API 调用）
 */
export async function fetchNewsList(delayMs = 300): Promise<News[]> {
  await delay(delayMs);
  return newsData;
}

/**
 * 根据分类获取新闻
 */
export async function fetchNewsByCategory(
  category: string,
  delayMs = 300
): Promise<News[]> {
  await delay(delayMs);
  return newsData.filter((news) => news.category === category);
}

/**
 * 根据 ID 获取新闻详情
 */
export async function fetchNewsById(
  id: number,
  delayMs = 300
): Promise<News | null> {
  await delay(delayMs);
  return newsData.find((news) => news.id === id) || null;
}

/**
 * 获取热门新闻（按浏览量排序）
 */
export async function fetchPopularNews(
  limit = 5,
  delayMs = 300
): Promise<News[]> {
  await delay(delayMs);
  return [...newsData].sort((a, b) => b.views - a.views).slice(0, limit);
}
