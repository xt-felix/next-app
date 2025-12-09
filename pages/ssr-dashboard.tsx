import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { User, UserStats } from '../types';
import { withRole } from '../middlewares/ssr';
import { getCurrentUser } from '../utils/auth';
import { fetchUserStats } from '../data/users';
import styles from '../styles/Dashboard.module.css';

interface DashboardPageProps {
  user: User;
  stats: UserStats;
  timestamp: string;
  serverTime: number; // 服务端处理时间（毫秒）
}

/**
 * SSR 用户仪表盘页面
 *
 * 🎯 核心知识点：
 * 1. withRole 中间件：基于角色的权限控制
 * 2. 只有 admin 和 user 角色可以访问
 * 3. guest 角色会被重定向到 403 页面
 * 4. 展示如何在 SSR 中实现复杂的权限逻辑
 */
export default function DashboardPage({
  user,
  stats,
  timestamp,
  serverTime,
}: DashboardPageProps) {
  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/ssr-login';
  };

  return (
    <>
      <Head>
        <title>用户仪表盘 - SSR 示例</title>
        <meta name="description" content="用户个人数据仪表盘" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        {/* 顶部导航栏 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.logo}>📊 仪表盘</h1>
            <nav className={styles.nav}>
              <Link href="/">首页</Link>
              <Link href="/ssr-news">新闻列表</Link>
              <Link href="/ssr-dashboard" className={styles.active}>
                仪表盘
              </Link>
            </nav>
            <div className={styles.userSection}>
              <span className={styles.userName}>
                👤 {user.username}
                <span className={styles.userRole}>({user.role})</span>
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                退出
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {/* SSR 性能信息 */}
          <div className={styles.performanceInfo}>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>🚀 渲染方式</span>
              <span className={styles.infoValue}>SSR</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>⏰ 渲染时间</span>
              <span className={styles.infoValue}>{timestamp}</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>⚡ 服务端耗时</span>
              <span className={styles.infoValue}>{serverTime}ms</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>🛡️ 权限要求</span>
              <span className={styles.infoValue}>Admin / User</span>
            </div>
          </div>

          {/* 用户信息卡片 */}
          <div className={styles.userCard}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span className={styles.avatarPlaceholder}>
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>{user.username}</h2>
                <p className={styles.userEmail}>{user.email}</p>
                <span className={`${styles.roleBadge} ${styles[`role${user.role}`]}`}>
                  {user.role === 'admin' ? '管理员' : '普通用户'}
                </span>
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👁️</div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>
                  {stats.totalViews.toLocaleString()}
                </h3>
                <p className={styles.statLabel}>总浏览量</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>
                  {stats.totalArticles.toLocaleString()}
                </h3>
                <p className={styles.statLabel}>发布文章</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💬</div>
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>
                  {stats.totalComments.toLocaleString()}
                </h3>
                <p className={styles.statLabel}>评论数量</p>
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <div className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>📋 最近活动</h2>
            <div className={styles.activityList}>
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === 'view' && '👁️'}
                    {activity.type === 'comment' && '💬'}
                    {activity.type === 'like' && '❤️'}
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityDescription}>
                      {activity.description}
                    </p>
                    <span className={styles.activityTime}>
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 权限说明 */}
          <div className={styles.permissionSection}>
            <h2 className={styles.sectionTitle}>🛡️ 权限控制说明</h2>
            <div className={styles.permissionGrid}>
              <div className={styles.permissionCard}>
                <h3>✅ 您的权限 ({user.role})</h3>
                <ul>
                  {user.role === 'admin' && (
                    <>
                      <li>✓ 访问所有页面</li>
                      <li>✓ 查看所有用户数据</li>
                      <li>✓ 管理系统设置</li>
                      <li>✓ 访问仪表盘</li>
                    </>
                  )}
                  {user.role === 'user' && (
                    <>
                      <li>✓ 访问新闻列表</li>
                      <li>✓ 访问个人仪表盘</li>
                      <li>✓ 查看个人数据</li>
                      <li>✗ 无管理员权限</li>
                    </>
                  )}
                </ul>
              </div>
              <div className={styles.permissionCard}>
                <h3>🔒 权限实现方式</h3>
                <pre className={styles.codeSnippet}>
{`// 使用 withRole 中间件
export const getServerSideProps =
  withRole(['admin', 'user'],
    async (ctx) => {
      // 只有 admin 和 user
      // 能执行这里的代码
      return { props: {...} };
    }
  );`}
                </pre>
              </div>
            </div>
          </div>

          {/* 技术亮点 */}
          <div className={styles.highlightsSection}>
            <h2 className={styles.sectionTitle}>✨ 技术亮点</h2>
            <div className={styles.highlightsList}>
              <div className={styles.highlightItem}>
                <h3>🔐 服务端鉴权</h3>
                <p>
                  所有权限验证都在服务端完成，客户端无法绕过。
                  未授权用户会在服务端直接被拦截并重定向。
                </p>
              </div>
              <div className={styles.highlightItem}>
                <h3>⚡ 性能优化</h3>
                <p>
                  并发获取多个数据源，记录服务端处理时间。
                  实际项目可结合 Redis 缓存进一步优化。
                </p>
              </div>
              <div className={styles.highlightItem}>
                <h3>🛡️ 安全防护</h3>
                <p>
                  敏感数据（如 API 密钥）永远不会暴露给客户端。
                  所有数据查询都在服务端完成。
                </p>
              </div>
              <div className={styles.highlightItem}>
                <h3>🔄 实时数据</h3>
                <p>
                  每次访问都获取最新数据，无需手动刷新。
                  适合需要展示实时信息的仪表盘场景。
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p>💡 试试用 Guest 身份登录，将无法访问此页面</p>
        </footer>
      </div>
    </>
  );
}

/**
 * getServerSideProps with Role-Based Access Control
 *
 * 使用 withRole 中间件保护页面
 * 只允许 admin 和 user 角色访问
 * guest 用户会被重定向到 403 页面
 */
export const getServerSideProps: GetServerSideProps = withRole(
  ['admin', 'user'], // 允许的角色列表
  async (context) => {
    const startTime = Date.now();

    try {
      // 获取当前用户信息
      const user = getCurrentUser(context.req);

      if (!user) {
        throw new Error('用户信息获取失败');
      }

      // 并发获取用户统计数据
      // 实际项目中可以并发多个 API 请求
      const [stats] = await Promise.all([
        fetchUserStats(user.id),
        // 可以添加更多并发请求
        // fetchUserPosts(user.id),
        // fetchUserNotifications(user.id),
      ]);

      if (!stats) {
        throw new Error('统计数据获取失败');
      }

      // 计算服务端处理时间
      const serverTime = Date.now() - startTime;

      // 生成时间戳
      const timestamp = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // 设置缓存策略
      // 仪表盘数据通常需要实时性，这里设置较短的缓存时间
      context.res.setHeader(
        'Cache-Control',
        'private, no-cache, no-store, must-revalidate'
      );

      return {
        props: {
          user,
          stats,
          timestamp,
          serverTime,
        },
      };
    } catch (error) {
      console.error('Dashboard SSR Error:', error);

      // 错误时重定向到错误页面
      return {
        redirect: {
          destination: '/ssr-error?message=' + encodeURIComponent('数据加载失败'),
          permanent: false,
        },
      };
    }
  }
);
