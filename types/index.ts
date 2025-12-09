// 用户类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
}

// 新闻类型定义
export interface News {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  views: number;
}

// 用户统计数据
export interface UserStats {
  totalViews: number;
  totalArticles: number;
  totalComments: number;
  recentActivity: Activity[];
}

// 活动记录
export interface Activity {
  id: number;
  type: 'view' | 'comment' | 'like';
  description: string;
  timestamp: string;
}
