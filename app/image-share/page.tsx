/**
 * 图片分享应用主页
 * 路由：/image-share
 *
 * 知识点演示：
 * 1. API Routes 综合应用
 * 2. 文件上传
 * 3. JWT 认证
 * 4. GET/POST 请求
 * 5. 客户端状态管理
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/image-share/LoginForm';
import UploadForm from '@/components/image-share/UploadForm';
import ImageList from '@/components/image-share/ImageList';
import styles from '@/styles/image-share/Page.module.css';

export default function ImageSharePage() {
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 检查本地存储的登录状态
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
  };

  const handleUploadSuccess = () => {
    // 触发图片列表刷新
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles.page}>
      {/* 头部 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.icon}>🖼️</span>
            图片分享应用
          </h1>
          <p className={styles.subtitle}>
            第十二章：API Routes 实战演示
          </p>

          <div className={styles.nav}>
            <Link href="/" className={styles.backLink}>
              ← 返回首页
            </Link>

            {username && (
              <div className={styles.userInfo}>
                <span>👤 {username}</span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className={styles.main}>
        <div className={styles.container}>
          {!token ? (
            // 未登录：显示登录表单
            <div className={styles.loginSection}>
              <LoginForm onLoginSuccess={handleLoginSuccess} />

              <div className={styles.knowledgeBox}>
                <h3>💡 知识点演示</h3>
                <ul>
                  <li>✅ POST 请求处理</li>
                  <li>✅ 请求体解析（JSON）</li>
                  <li>✅ JWT Token 生成（简化版）</li>
                  <li>✅ 错误处理和响应</li>
                </ul>
              </div>
            </div>
          ) : (
            // 已登录：显示上传表单和图片列表
            <div className={styles.contentSection}>
              {/* 上传区域 */}
              <div className={styles.uploadSection}>
                <UploadForm
                  token={token}
                  onUploadSuccess={handleUploadSuccess}
                />

                <div className={styles.knowledgeBox}>
                  <h3>💡 知识点演示</h3>
                  <ul>
                    <li>✅ multipart/form-data 处理</li>
                    <li>✅ 文件上传（FormData）</li>
                    <li>✅ Authorization Header 验证</li>
                    <li>✅ 文件类型和大小验证</li>
                  </ul>
                </div>
              </div>

              {/* 图片列表区域 */}
              <div className={styles.listSection}>
                <ImageList refreshTrigger={refreshTrigger} />

                <div className={styles.knowledgeBox}>
                  <h3>💡 知识点演示</h3>
                  <ul>
                    <li>✅ GET 请求处理</li>
                    <li>✅ URL 参数解析（分页）</li>
                    <li>✅ 数据筛选和排序</li>
                    <li>✅ RESTful API 设计</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 底部说明 */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h3>📖 本项目演示的 API Routes 知识点</h3>
          <div className={styles.apiList}>
            <div className={styles.apiCard}>
              <h4>POST /api/auth/login</h4>
              <p>用户登录，返回 Token</p>
              <code>请求体：JSON</code>
            </div>
            <div className={styles.apiCard}>
              <h4>POST /api/images/upload</h4>
              <p>上传图片，需要认证</p>
              <code>请求体：FormData</code>
            </div>
            <div className={styles.apiCard}>
              <h4>GET /api/images/list</h4>
              <p>获取图片列表，支持分页</p>
              <code>查询参数：page、pageSize</code>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
