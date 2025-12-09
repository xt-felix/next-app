import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Login.module.css';

/**
 * SSR 登录页面
 *
 * 知识点：
 * 1. 这是一个纯客户端页面，不使用 getServerSideProps
 * 2. 演示如何通过设置 Cookie 实现简单的身份验证
 * 3. 支持登录后跳转回原页面（通过 redirect 参数）
 */
export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState('user');
  const [isLoading, setIsLoading] = useState(false);

  const redirect = (router.query.redirect as string) || '/ssr-news';

  const handleLogin = async () => {
    setIsLoading(true);

    // 模拟登录延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 根据选择的用户类型设置不同的 token
    const tokenMap: Record<string, string> = {
      admin: 'admin-token',
      user: 'user-token',
      guest: 'guest-token',
    };

    const token = tokenMap[selectedUser];

    // 设置 Cookie（实际项目中应该使用 httpOnly cookie）
    document.cookie = `token=${token}; path=/; max-age=86400`; // 24小时过期

    // 跳转到目标页面
    router.push(redirect);
  };

  return (
    <>
      <Head>
        <title>登录 - SSR 示例</title>
        <meta name="description" content="SSR 登录页面示例" />
      </Head>

      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>欢迎登录</h1>
          <p className={styles.subtitle}>SSR 服务端渲染示例项目</p>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>选择用户身份：</label>
              <select
                className={styles.select}
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={isLoading}
              >
                <option value="admin">管理员 (Admin)</option>
                <option value="user">普通用户 (User)</option>
                <option value="guest">访客 (Guest)</option>
              </select>
            </div>

            <div className={styles.userInfo}>
              <h3>身份说明：</h3>
              <ul>
                <li>
                  <strong>管理员：</strong>可以访问所有页面，包括仪表盘
                </li>
                <li>
                  <strong>普通用户：</strong>可以访问新闻列表和仪表盘
                </li>
                <li>
                  <strong>访客：</strong>只能访问新闻列表，无法访问仪表盘
                </li>
              </ul>
            </div>

            <button
              className={styles.loginButton}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '立即登录'}
            </button>

            <div className={styles.links}>
              <Link href="/">返回首页</Link>
            </div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <h2>SSR 知识点</h2>
          <div className={styles.knowledgePoints}>
            <div className={styles.point}>
              <h3>🔐 身份验证</h3>
              <p>演示如何在 SSR 中实现基于 Cookie 的身份验证</p>
            </div>
            <div className={styles.point}>
              <h3>🛡️ 权限控制</h3>
              <p>展示不同角色用户访问不同页面的权限管理</p>
            </div>
            <div className={styles.point}>
              <h3>🔄 中间件</h3>
              <p>使用 withAuth 和 withRole 中间件保护页面</p>
            </div>
            <div className={styles.point}>
              <h3>📄 服务端渲染</h3>
              <p>每次请求都在服务端动态获取最新数据</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
