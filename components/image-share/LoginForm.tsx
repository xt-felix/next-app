/**
 * 登录表单组件
 */
'use client';

import { useState } from 'react';
import styles from '@/styles/image-share/LoginForm.module.css';

interface LoginFormProps {
  onLoginSuccess: (token: string, username: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        // 保存 Token 到 localStorage
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('username', result.data.username);
        onLoginSuccess(result.data.token, result.data.username);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>登录</h2>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="username" className={styles.label}>
          用户名
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          placeholder="请输入用户名"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          密码
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          placeholder="请输入密码"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={styles.button}
      >
        {loading ? '登录中...' : '登录'}
      </button>

      <div className={styles.hint}>
        <p>测试账号：</p>
        <p>admin / admin123（管理员）</p>
        <p>user / user123（普通用户）</p>
      </div>
    </form>
  );
}
