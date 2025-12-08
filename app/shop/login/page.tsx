/**
 * 登录页面
 * 路由：/shop/login
 * 知识点：
 * 1. 表单提交与验证
 * 2. JWT Token 存储（localStorage）
 * 3. 登录成功后跳转
 * 4. 错误处理与提示
 * 5. 响应式表单设计
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ApiResponse {
  code: number;
  message?: string;
  data?: {
    user: any;
    token: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 表单数据
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  // 处理登录/注册
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // 基础校验
    if (!formData.username || !formData.password) {
      setError('请填写用户名和密码');
      return;
    }

    if (formData.username.length < 3) {
      setError('用户名至少 3 个字符');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码至少 6 个字符');
      return;
    }

    try {
      setLoading(true);

      const url = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body = isLogin
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, password: formData.password, email: formData.email };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const json: ApiResponse = await res.json();

      if (json.code === 0 && json.data?.token) {
        // 保存 Token 到 localStorage
        localStorage.setItem('token', json.data.token);
        // 保存用户信息（可选）
        localStorage.setItem('user', JSON.stringify(json.data.user));

        // 根据用户角色跳转
        if (json.data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/shop');
        }
      } else {
        setError(json.message || '操作失败');
      }
    } catch (e: any) {
      setError(e.message || '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 快速登录
  const quickLogin = (username: string, password: string) => {
    setFormData({ username, password, email: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* 返回商城 */}
        <div className="text-center mb-6">
          <Link href="/shop" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← 返回商城首页
          </Link>
        </div>

        {/* 登录/注册卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? '登录' : '注册'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? '欢迎回来' : '创建您的账号'}
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="请输入用户名"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                密码
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="请输入密码"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  邮箱（可选）
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
            </button>
          </div>

          {/* 快速登录（测试用） */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
              快速登录（测试账号）
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => quickLogin('admin', 'admin123')}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 text-sm transition"
              >
                管理员
              </button>
              <button
                type="button"
                onClick={() => quickLogin('user', 'user123')}
                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 text-sm transition"
              >
                普通用户
              </button>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>💡 提示：管理员可以访问后台管理页面</p>
        </div>
      </div>
    </div>
  );
}
