import { Suspense } from 'react';
import Link from 'next/link';
import Report from '@/components/cache/Report';
import Skeleton from '@/components/cache/Skeleton';
import CacheControls from '@/components/cache/CacheControls';
import { ReportData } from '@/data/cache-mock/report';
import styles from '@/styles/cache/Dashboard.module.css';

/**
 * 缓存演示仪表盘页面
 *
 * 核心知识点：
 * 1. Data Cache - fetch 请求缓存
 * 2. revalidate - 自动失效时间（120秒）
 * 3. tags - 缓存标签，便于手动刷新
 * 4. Server Components - 默认服务端渲染
 */

// ⭐ 页面级别缓存配置
// export const revalidate = 120; // 可选：页面整体缓存 120 秒

/**
 * 获取报表数据（使用 Data Cache）
 */
async function getReportData(): Promise<ReportData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // ⭐ 核心：fetch 缓存配置
  const response = await fetch(`${baseUrl}/api/mock-report`, {
    // Data Cache 配置
    next: {
      revalidate: 120, // 120秒后自动失效
      tags: ['report'], // 缓存标签
    },
    cache: 'force-cache', // 强制缓存（默认值）
  });

  if (!response.ok) {
    throw new Error('获取报表数据失败');
  }

  const result = await response.json();
  return result.data;
}

/**
 * 仪表盘页面组件
 */
export default async function CacheDashboard() {
  try {
    // 获取数据（会被缓存）
    const data = await getReportData();

    return (
      <div className={styles.container}>
        {/* 页面标题 */}
        <header className={styles.header}>
          <h1 className={styles.title}>📊 数据缓存策略演示</h1>
          <p className={styles.subtitle}>
            Next.js App Router + Data Cache + Revalidate
          </p>
          <Link href="/" className={styles.backLink}>
            ← 返回首页
          </Link>
        </header>

        {/* 缓存说明 */}
        <div className={styles.cacheInfo}>
          <h2>🔍 当前缓存配置</h2>
          <ul>
            <li>
              <strong>缓存类型：</strong>Data Cache（fetch 数据缓存）
            </li>
            <li>
              <strong>自动失效：</strong>120 秒后自动刷新
            </li>
            <li>
              <strong>缓存标签：</strong>report（便于手动刷新）
            </li>
            <li>
              <strong>缓存策略：</strong>force-cache（强制缓存）
            </li>
          </ul>
        </div>

        {/* 报表内容 */}
        <Suspense fallback={<Skeleton />}>
          <Report data={data} />
        </Suspense>

        {/* 缓存控制 */}
        <CacheControls />

        {/* 知识点总结 */}
        <div className={styles.knowledgeBox}>
          <h2>📚 核心知识点</h2>
          <div className={styles.knowledgeGrid}>
            <div className={styles.knowledgeCard}>
              <h3>1️⃣ Data Cache</h3>
              <p>
                使用 <code>fetch(url, {'{'} next: {'{'} revalidate {'}'} {'}'})</code> 配置数据缓存
              </p>
            </div>
            <div className={styles.knowledgeCard}>
              <h3>2️⃣ Revalidate</h3>
              <p>设置缓存自动失效时间（秒），到期后自动重新获取数据</p>
            </div>
            <div className={styles.knowledgeCard}>
              <h3>3️⃣ Tags</h3>
              <p>为缓存打标签，使用 <code>revalidateTag()</code> 手动刷新</p>
            </div>
            <div className={styles.knowledgeCard}>
              <h3>4️⃣ Server Components</h3>
              <p>默认在服务端执行，可以直接使用 async/await 获取数据</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>❌ 数据加载失败</h2>
          <p>{error instanceof Error ? error.message : '未知错误'}</p>
          <button onClick={() => window.location.reload()}>
            重新加载
          </button>
        </div>
      </div>
    );
  }
}
