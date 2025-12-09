import styles from '@/styles/cache/Skeleton.module.css';

/**
 * 骨架屏组件
 *
 * 功能：
 * - 在数据加载时显示占位符
 * - 提升用户体验
 * - 模拟真实内容的布局
 */
export default function Skeleton() {
  return (
    <div className={styles.skeleton}>
      {/* 时间戳骨架 */}
      <div className={styles.timestampSkeleton}></div>

      {/* 指标卡片骨架 */}
      <div className={styles.metricsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricHeader}></div>
            <div className={styles.metricValue}></div>
            <div className={styles.metricTrend}></div>
          </div>
        ))}
      </div>

      {/* 汇总骨架 */}
      <div className={styles.summary}>
        <div className={styles.summaryTitle}></div>
        <div className={styles.summaryGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.summaryItem}></div>
          ))}
        </div>
      </div>

      <div className={styles.loadingText}>报表数据加载中...</div>
    </div>
  );
}
