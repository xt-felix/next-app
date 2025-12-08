/**
 * 博客文章类型定义
 * 用于类型安全和代码提示
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: number; // 阅读时长（分钟）
  tags: string[];
  views: number;
}

/**
 * SEO 相关的元数据类型
 */
export interface BlogPostMetadata {
  title: string;
  description: string;
  ogImage: string;
  publishedTime: string;
  modifiedTime: string;
  tags: string[];
  author: string;
}
