import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { News, User } from '../types';
import { withAuth } from '../middlewares/ssr';
import { getCurrentUser } from '../utils/auth';
import { fetchNewsList } from '../data/news';
import styles from '../styles/News.module.css';

interface NewsPageProps {
  newsList: News[];
  user: User;
  timestamp: string;
}

/**
 * SSR 新闻列表页面
 *
 * 🎯 核心知识点：
 * 1. getServerSideProps：每次请求都在服务端执行
 * 2. withAuth 中间件：确保用户已登录
 * 3. 服务端数据获取：直接访问数据库/API
 * 4. SEO 友好：搜索引擎可以直接抓取完整内容
 */
export default function NewsPage({ newsList, user, timestamp }: NewsPageProps) {
  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/ssr-login';
  };

  return (
    <>
      <Head>
        <title>新闻列表 - SSR 示例</title>
        <meta name="description" content="使用服务端渲染展示最新新闻列表" />
        <meta property="og:title" content="新闻列表 - SSR 示例" />
        <meta property="og:description" content="实时新闻，每次请求都获取最新数据" />
      </Head>

      <div className={styles.container}>
        {/* 顶部导航栏 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.logo}>📰 新闻中心</h1>
            <nav className={styles.nav}>
              <Link href="/">首页</Link>
              <Link href="/ssr-news" className={styles.active}>
                新闻列表
              </Link>
              <Link href="/ssr-dashboard">仪表盘</Link>
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
          {/* SSR 信息提示 */}
          <div className={styles.ssrInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>🚀 渲染方式：</span>
              <span className={styles.infoValue}>服务端渲染 (SSR)</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>⏰ 渲染时间：</span>
              <span className={styles.infoValue}>{timestamp}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>📊 数据条数：</span>
              <span className={styles.infoValue}>{newsList.length} 条</span>
            </div>
          </div>

          {/* 新闻列表 */}
          <div className={styles.newsList}>
            {newsList.map((news) => (
              <article key={news.id} className={styles.newsCard}>
                <div className={styles.newsContent}>
                  <div className={styles.newsHeader}>
                    <h2 className={styles.newsTitle}>{news.title}</h2>
                    <span className={styles.newsCategory}>{news.category}</span>
                  </div>
                  <p className={styles.newsSummary}>{news.summary}</p>
                  <div className={styles.newsFooter}>
                    <div className={styles.newsMeta}>
                      <span className={styles.newsAuthor}>✍️ {news.author}</span>
                      <span className={styles.newsDate}>📅 {news.publishDate}</span>
                      <span className={styles.newsViews}>👁️ {news.views.toLocaleString()}</span>
                    </div>
                    <button className={styles.readMore}>阅读全文 →</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* SSR 优势说明 */}
          <div className={styles.advantagesSection}>
            <h2 className={styles.advantagesTitle}>✨ SSR 的优势</h2>
            <div className={styles.advantagesGrid}>
              <div className={styles.advantageCard}>
                <h3>⚡ 首屏加载快</h3>
                <p>服务端直接返回完整 HTML，用户可以立即看到内容，无需等待 JavaScript 加载</p>
              </div>
              <div className={styles.advantageCard}>
                <h3>🔍 SEO 友好</h3>
                <p>搜索引擎爬虫可以直接抓取完整内容，有利于网站排名和收录</p>
              </div>
              <div className={styles.advantageCard}>
                <h3>🔄 实时数据</h3>
                <p>每次请求都获取最新数据，适合需要展示实时信息的场景</p>
              </div>
              <div className={styles.advantageCard}>
                <h3>🛡️ 安全性高</h3>
                <p>敏感逻辑在服务端执行，API 密钥等不会暴露给客户端</p>
              </div>
            </div>
          </div>

          {/* 技术实现说明 */}
          <div className={styles.techSection}>
            <h2 className={styles.techTitle}>🔧 技术实现</h2>
            <div className={styles.codeExample}>
              <h3>getServerSideProps 代码示例：</h3>
              <pre className={styles.code}>
{`export const getServerSideProps = withAuth(async (context) => {
  // 1. 获取当前用户信息（从 Cookie 解析）
  const user = getCurrentUser(context.req);

  // 2. 服务端获取数据（可以直接访问数据库）
  const newsList = await fetchNewsList();

  // 3. 生成时间戳，证明这是服务端渲染
  const timestamp = new Date().toLocaleString('zh-CN');

  // 4. 将数据传递给页面组件
  return {
    props: {
      newsList,
      user,
      timestamp,
    },
  };
});`}
              </pre>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p>💡 每次刷新页面，时间戳都会更新，证明这是服务端渲染</p>
          <p>🔄 试试退出登录再访问，会自动跳转到登录页</p>
        </footer>
      </div>
    </>
  );
}

/**
 * getServerSideProps：服务端数据获取函数
 *
 * 执行时机：每次页面请求时在服务端执行
 * 执行环境：Node.js 服务端
 * 特点：可以访问数据库、文件系统、环境变量等服务端资源
 */
export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  try {
    // 获取当前用户信息
    const user = getCurrentUser(context.req);

    if (!user) {
      throw new Error('用户信息获取失败');
    }

    // 从服务端获取新闻列表数据
    // 实际项目中这里可以：
    // 1. 直接查询数据库
    // 2. 调用内部 API
    // 3. 读取文件系统
    // 4. 使用服务端缓存（Redis）
    const newsList = await fetchNewsList();

    // 生成时间戳，用于演示 SSR 的实时性
    const timestamp = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // 设置缓存头（可选）
    // 这里演示如何设置缓存策略
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59'
    );

    return {
      props: {
        newsList,
        user,
        timestamp,
      },
    };
  } catch (error) {
    console.error('SSR Error:', error);

    // 错误处理：返回空数据而不是崩溃
    return {
      props: {
        newsList: [],
        user: {
          id: 0,
          username: 'Unknown',
          email: '',
          role: 'guest' as const,
        },
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
});
