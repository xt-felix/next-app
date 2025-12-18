/**
 * 登录页面
 * 支持多种登录方式：GitHub OAuth、账号密码、邮箱验证码
 */

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const [loginMethod, setLoginMethod] = useState<'credentials' | 'email-code'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) {
      setMessage('请输入邮箱地址');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'email-login' }),
      });

      const data = await response.json();

      if (response.ok) {
        setCodeSent(true);
        setMessage('验证码已发送，请查收邮件');
        setCountdown(60);

        // 倒计时
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setMessage(data.error || '发送验证码失败');
      }
    } catch (error) {
      setMessage('发送验证码失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理登录
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;

      if (loginMethod === 'credentials') {
        // 账号密码登录
        result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
      } else {
        // 邮箱验证码登录
        result = await signIn('email-code', {
          email,
          code,
          redirect: false,
        });
      }

      if (result?.error) {
        setMessage(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setMessage('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // GitHub 登录
  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            或{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              注册新账户
            </Link>
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">
              {error === 'CredentialsSignin' ? '邮箱或密码错误' : '登录失败，请重试'}
            </div>
          </div>
        )}

        {/* 消息提示 */}
        {message && (
          <div className={`rounded-md p-4 ${message.includes('失败') || message.includes('错误') ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`text-sm ${message.includes('失败') || message.includes('错误') ? 'text-red-800' : 'text-green-800'}`}>
              {message}
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* OAuth 登录 */}
          <div className="space-y-3">
            <button
              onClick={handleGitHubSignIn}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              使用 GitHub 登录
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或使用</span>
              </div>
            </div>
          </div>

          {/* 登录方式切换 */}
          <div className="mt-6 flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMethod('credentials')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'credentials'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              账号密码
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email-code')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'email-code'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              邮箱验证码
            </button>
          </div>

          {/* 登录表单 */}
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="user@example.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                测试账号：admin@example.com / user@example.com
              </p>
            </div>

            {loginMethod === 'credentials' ? (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  测试密码：admin123 / user123
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  验证码
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="6位数字验证码"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading || countdown > 0}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  验证码将发送到您的邮箱，有效期 10 分钟
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>测试账号信息：</p>
          <p className="mt-1">管理员：admin@example.com / admin123</p>
          <p>普通用户：user@example.com / user123</p>
        </div>
      </div>
    </div>
  );
}
