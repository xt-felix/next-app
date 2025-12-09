import { UserStats } from '../types';

/**
 * 模拟用户数据
 */
const userStatsMap: Record<number, UserStats> = {
  1: {
    totalViews: 125000,
    totalArticles: 48,
    totalComments: 356,
    recentActivity: [
      {
        id: 1,
        type: 'view',
        description: '查看了文章《Next.js 15 正式发布》',
        timestamp: '2024-01-15 14:30:00',
      },
      {
        id: 2,
        type: 'comment',
        description: '评论了文章《React 服务端组件深度解析》',
        timestamp: '2024-01-15 13:20:00',
      },
      {
        id: 3,
        type: 'like',
        description: '点赞了文章《TypeScript 5.3 新特性一览》',
        timestamp: '2024-01-15 12:10:00',
      },
    ],
  },
  2: {
    totalViews: 8900,
    totalArticles: 12,
    totalComments: 89,
    recentActivity: [
      {
        id: 1,
        type: 'view',
        description: '查看了文章《Tailwind CSS v4.0 Beta 版发布》',
        timestamp: '2024-01-15 10:15:00',
      },
      {
        id: 2,
        type: 'comment',
        description: '评论了文章《Web 性能优化实战指南》',
        timestamp: '2024-01-14 16:45:00',
      },
    ],
  },
  3: {
    totalViews: 230,
    totalArticles: 0,
    totalComments: 3,
    recentActivity: [
      {
        id: 1,
        type: 'view',
        description: '浏览了首页',
        timestamp: '2024-01-15 09:00:00',
      },
    ],
  },
};

/**
 * 模拟延迟
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取用户统计数据（模拟 API 调用）
 */
export async function fetchUserStats(
  userId: number,
  delayMs = 400
): Promise<UserStats | null> {
  await delay(delayMs);
  return userStatsMap[userId] || null;
}

/**
 * 更新用户浏览量（模拟 API 调用）
 */
export async function updateUserViews(
  userId: number,
  delayMs = 200
): Promise<void> {
  await delay(delayMs);
  if (userStatsMap[userId]) {
    userStatsMap[userId].totalViews += 1;
  }
}
