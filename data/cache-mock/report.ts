/**
 * 模拟报表数据
 * 用于演示缓存策略
 */

export interface ReportMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface ReportData {
  timestamp: string;
  metrics: ReportMetric[];
  summary: {
    totalUsers: number;
    totalRevenue: number;
    avgResponseTime: number;
  };
}

/**
 * 生成模拟报表数据
 * 每次调用都会生成新的随机数据，用于演示缓存效果
 */
export function generateReportData(): ReportData {
  const now = new Date();

  return {
    timestamp: now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    metrics: [
      {
        name: '活跃用户数',
        value: Math.floor(Math.random() * 10000) + 5000,
        unit: '人',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        changePercent: Math.floor(Math.random() * 20) + 5,
      },
      {
        name: '今日订单量',
        value: Math.floor(Math.random() * 1000) + 500,
        unit: '笔',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        changePercent: Math.floor(Math.random() * 15) + 3,
      },
      {
        name: '营收金额',
        value: Math.floor(Math.random() * 500000) + 100000,
        unit: '元',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        changePercent: Math.floor(Math.random() * 25) + 8,
      },
      {
        name: '系统响应时间',
        value: Math.floor(Math.random() * 300) + 50,
        unit: 'ms',
        trend: Math.random() > 0.5 ? 'down' : 'up',
        changePercent: Math.floor(Math.random() * 10) + 2,
      },
    ],
    summary: {
      totalUsers: Math.floor(Math.random() * 100000) + 50000,
      totalRevenue: Math.floor(Math.random() * 10000000) + 5000000,
      avgResponseTime: Math.floor(Math.random() * 500) + 100,
    },
  };
}

/**
 * 模拟延迟（用于演示加载状态）
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
