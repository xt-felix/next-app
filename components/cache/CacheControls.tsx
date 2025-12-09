'use client';

import { useState } from 'react';
import styles from '@/styles/cache/CacheControls.module.css';

/**
 * 缓存控制组件
 *
 * 功能：
 * - 手动刷新缓存
 * - 显示刷新状态
 * - 提示用户操作结果
 */
export default function CacheControls() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * 刷新报表缓存
   */
  const handleRevalidate = async () => {
    setLoading(true);
    setMessage('正在刷新缓存...');

    try {
      const response = await fetch('/api/cache-revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag: 'report',
          secret: 'my-secret-key-123', // 实际项目中应该从环境变量读取
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ 缓存刷新成功！刷新页面查看新数据');
        // 3秒后自动刷新页面
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(`❌ 刷新失败：${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ 刷新失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 强制刷新页面
   */
  const handleHardRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.controls}>
      <div className={styles.buttonsGroup}>
        <button
          onClick={handleRevalidate}
          disabled={loading}
          className={styles.revalidateBtn}
        >
          {loading ? '刷新中...' : '🔄 手动刷新缓存'}
        </button>

        <button
          onClick={handleHardRefresh}
          className={styles.refreshBtn}
        >
          🔃 强制刷新页面
        </button>
      </div>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      <div className={styles.hint}>
        <h4>💡 缓存验证方法：</h4>
        <ul>
          <li>1️⃣ 观察页面顶部的"数据生成时间"</li>
          <li>2️⃣ 多次刷新页面，时间戳不变 = 缓存生效</li>
          <li>3️⃣ 点击"手动刷新缓存"，再刷新页面，时间戳更新 = 缓存已清除</li>
          <li>4️⃣ 等待 2 分钟后刷新，时间戳自动更新 = 自动失效生效</li>
        </ul>
      </div>
    </div>
  );
}
