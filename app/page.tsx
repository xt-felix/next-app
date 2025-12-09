/**
 * 首页 - 项目导航
 * 路由：/
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* 头部 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js 全栈开发案例
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            从零开始的 Next.js 学习之旅
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            SSR、API Routes、全栈开发完整教程
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {/* SSR 新闻列表 */}
          <Link href="/ssr-login" className="card hover:scale-105 transition-transform">
            <div className="card-body">
              <div className="text-4xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                第七章：SSR
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                服务端渲染、权限控制、中间件
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-info">SSR</span>
                <span className="badge badge-info">中间件</span>
                <span className="badge badge-info">权限控制</span>
              </div>
            </div>
          </Link>

          {/* 商城页面 */}
          <Link href="/shop" className="card hover:scale-105 transition-transform">
            <div className="card-body">
              <div className="text-4xl mb-4">🛍️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                商品商城
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                浏览商品、搜索、分页等功能
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary">商品列表</span>
                <span className="badge badge-primary">搜索功能</span>
                <span className="badge badge-primary">分页</span>
              </div>
            </div>
          </Link>

          {/* 登录页面 */}
          <Link href="/shop/login" className="card hover:scale-105 transition-transform">
            <div className="card-body">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                用户登录
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                JWT 认证、登录注册功能
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-success">JWT Token</span>
                <span className="badge badge-success">表单验证</span>
                <span className="badge badge-success">权限控制</span>
              </div>
            </div>
          </Link>

          {/* 后台管理 */}
          <Link href="/admin" className="card hover:scale-105 transition-transform">
            <div className="card-body">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                后台管理
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                商品增删改查、图片上传
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-warning">CRUD</span>
                <span className="badge badge-warning">文件上传</span>
                <span className="badge badge-warning">管理员</span>
              </div>
            </div>
          </Link>
        </div>

        {/* 核心知识点 */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            核心知识点
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🚀', title: 'SSR 渲染', desc: 'getServerSideProps 服务端渲染' },
              { icon: '🔐', title: 'SSR 鉴权', desc: '服务端身份验证与权限控制' },
              { icon: '🔌', title: 'API Routes', desc: 'Next.js 后端接口开发' },
              { icon: '🔒', title: 'JWT 认证', desc: '用户登录与权限控制' },
              { icon: '✅', title: 'Zod 校验', desc: '类型安全的数据验证' },
              { icon: '🚦', title: '接口限流', desc: '防止恶意刷接口攻击' },
              { icon: '📤', title: '文件上传', desc: 'Base64 图片上传' },
              { icon: '🎨', title: 'RESTful', desc: '标准化 API 设计' },
              { icon: '📦', title: '统一响应', desc: '规范的响应格式' },
              { icon: '🔁', title: '幂等性', desc: '防止重复提交' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 测试账号 */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">
              💡 测试账号
            </h3>
            <div className="space-y-2 text-sm">
              <div className="mb-4 pb-4 border-b border-blue-200 dark:border-blue-800">
                <p className="text-blue-900 dark:text-blue-300 font-medium mb-2">SSR 登录测试：</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-blue-900 dark:text-blue-300 font-medium mb-1">Admin</div>
                    <div className="text-xs text-blue-700 dark:text-blue-400">全部权限</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-900 dark:text-blue-300 font-medium mb-1">User</div>
                    <div className="text-xs text-blue-700 dark:text-blue-400">部分权限</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-900 dark:text-blue-300 font-medium mb-1">Guest</div>
                    <div className="text-xs text-blue-700 dark:text-blue-400">有限权限</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-800">
                <span className="text-blue-900 dark:text-blue-300 font-medium">商城管理员：</span>
                <div className="flex gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">admin</code>
                  <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">admin123</code>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-blue-900 dark:text-blue-300 font-medium">普通用户：</span>
                <div className="flex gap-2">
                  <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">user</code>
                  <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">user123</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p className="mb-2">查看完整文档</p>
          <a
            href="https://github.com/xt-felix/next-app/blob/feature/api-routes-fullstack/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            📖 README.md
          </a>
        </div>
      </div>
    </div>
  );
}
