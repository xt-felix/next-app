import Link from 'next/link';

/**
 * 第十三章：Server Actions 主导航页
 */
export default function ServerActionsPage() {
  const examples = [
    {
      title: '待办事项管理',
      description: '基础 Server Actions 演示：表单提交、乐观 UI、错误处理',
      href: '/13-server-actions/todo',
      icon: '✓',
      color: 'from-blue-500 to-indigo-600',
      features: [
        '表单无刷新提交',
        '乐观 UI 更新',
        '自动数据刷新',
        '权限校验',
      ],
    },
    {
      title: '审批流系统',
      description: '复杂表单处理：动态字段、嵌套数据、业务逻辑',
      href: '/13-server-actions/approval',
      icon: '📋',
      color: 'from-purple-500 to-pink-600',
      features: [
        '动态表单字段',
        '嵌套数据解析',
        '状态管理',
        '业务逻辑校验',
      ],
    },
    {
      title: '文件上传系统',
      description: '文件处理：上传、预览、管理',
      href: '/13-server-actions/upload',
      icon: '📁',
      color: 'from-green-500 to-teal-600',
      features: [
        '文件上传处理',
        '实时预览',
        '文件校验',
        '图片优化',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* 页面头部 */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            第十三章：Server Actions
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            新一代全栈能力
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Server Actions 是 Next.js 13+ 引入的革命性全栈能力，
            允许开发者直接在 React 组件中声明服务端函数，
            实现"前端即后端"的开发体验
          </p>
        </div>

        {/* 核心特性 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: '无缝集成',
              description: '与 RSC 深度集成',
              icon: '🔗',
            },
            {
              title: '安全可靠',
              description: 'CSRF 防护、Session 透传',
              icon: '🔒',
            },
            {
              title: '简化开发',
              description: '消除 API Route 冗余代码',
              icon: '⚡',
            },
            {
              title: '极致体验',
              description: '表单无刷新、乐观 UI',
              icon: '✨',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* 示例列表 */}
        <div className="space-y-8">
          {examples.map((example, index) => (
            <Link
              key={index}
              href={example.href}
              className="block group"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                <div className="flex flex-col md:flex-row">
                  {/* 左侧：图标和标题 */}
                  <div
                    className={`bg-gradient-to-br ${example.color} p-8 md:w-72 flex flex-col justify-center items-center text-white`}
                  >
                    <div className="text-6xl mb-4">{example.icon}</div>
                    <h2 className="text-2xl font-bold text-center">
                      {example.title}
                    </h2>
                  </div>

                  {/* 右侧：详细信息 */}
                  <div className="flex-1 p-8">
                    <p className="text-gray-600 mb-6">
                      {example.description}
                    </p>

                    {/* 功能特性 */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {example.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* 查看按钮 */}
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      <span>查看示例</span>
                      <svg
                        className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 技术对比 */}
        <div className="mt-16 bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Server Actions vs API Routes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700">特性</th>
                  <th className="text-left py-3 px-4 text-gray-700">
                    API Routes
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700">
                    Server Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">代码分布</td>
                  <td className="py-3 px-4 text-gray-600">前后端分离</td>
                  <td className="py-3 px-4 text-green-600">
                    组件内声明服务端逻辑
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">调用方式</td>
                  <td className="py-3 px-4 text-gray-600">fetch/AJAX</td>
                  <td className="py-3 px-4 text-green-600">
                    直接调用/表单 action
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">适用场景</td>
                  <td className="py-3 px-4 text-gray-600">
                    复杂接口、第三方集成
                  </td>
                  <td className="py-3 px-4 text-green-600">
                    表单、数据变更、轻量接口
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">错误处理</td>
                  <td className="py-3 px-4 text-gray-600">
                    手动 try/catch
                  </td>
                  <td className="py-3 px-4 text-green-600">
                    自动捕获并传递
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">性能优化</td>
                  <td className="py-3 px-4 text-gray-600">需手动缓存</td>
                  <td className="py-3 px-4 text-green-600">
                    支持 RSC 缓存、自动优化
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 学习资源 */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            学习资源
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              📚 官方文档
            </a>
            <Link
              href="/"
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              🏠 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
