import { ReportData } from '@/data/cache-mock/report';
import styles from '@/styles/cache/Report.module.css';

interface ReportProps {
  data: ReportData;
}

/**
 * 报表组件
 *
 * 功能：
 * - 展示核心指标（活跃用户、订单量、营收、响应时间）
 * - 展示趋势（上升/下降）
 * - 展示变化百分比
 * - 展示数据生成时间戳
 */
export default function Report({ data }: ReportProps) {
  return (
    <div className={styles.report}>
      {/* 数据时间戳 */}
      <div className={styles.timestamp}>
        <span className={styles.label}>数据生成时间：</span>
        <span className={styles.time}>{data.timestamp}</span>
        <span className={styles.hint}>
          （刷新页面观察时间戳，验证缓存效果）
        </span>
      </div>

      {/* 核心指标卡片 */}
      <div className={styles.metricsGrid}>
        {data.metrics.map((metric) => (
          <div key={metric.name} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h3 className={styles.metricName}>{metric.name}</h3>
              <span
                className={`${styles.trend} ${styles[metric.trend]}`}
              >
                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                {metric.changePercent}%
              </span>
            </div>

            <div className={styles.metricValue}>
              {metric.value.toLocaleString()}
              <span className={styles.unit}>{metric.unit}</span>
            </div>

            <div className={styles.metricTrend}>
              {metric.trend === 'up' && '较昨日上升'}
              {metric.trend === 'down' && '较昨日下降'}
              {metric.trend === 'stable' && '较昨日持平'}
            </div>
          </div>
        ))}
      </div>

      {/* 汇总数据 */}
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>数据汇总</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>总用户数：</span>
            <span className={styles.summaryValue}>
              {data.summary.totalUsers.toLocaleString()} 人
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>总营收：</span>
            <span className={styles.summaryValue}>
              ¥{data.summary.totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>平均响应时间：</span>
            <span className={styles.summaryValue}>
              {data.summary.avgResponseTime} ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
