import Link from 'next/link';

/**
 * 状态管理示例首页
 * 
 * 展示各种状态管理方案的入口
 */
export default function StateManagementPage() {
  const examples = [
    {
      title: 'Zustand - 主题切换',
      description: '轻量级状态管理，支持持久化',
      href: '/16-state-management/theme',
    },
    {
      title: 'Redux Toolkit - 用户管理',
      description: '企业级状态管理方案',
      href: '/16-state-management/redux',
    },
    {
      title: 'Recoil - 原子化状态',
      description: '原子化设计，按需订阅',
      href: '/16-state-management/recoil',
    },
    {
      title: 'SWR - 异步数据',
      description: '专注异步数据获取与缓存',
      href: '/16-state-management/swr',
    },
    {
      title: '实时通知中心',
      description: 'Zustand + WebSocket 完整案例',
      href: '/16-state-management/notification',
    },
    {
      title: '多标签同步',
      description: 'BroadcastChannel 实现多标签页同步',
      href: '/16-state-management/broadcast',
    },
    {
      title: '权限控制',
      description: '基于角色的权限管理',
      href: '/16-state-management/permission',
    },
    {
      title: '国际化',
      description: '多语言状态管理',
      href: '/16-state-management/i18n',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Next.js 状态管理方案</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example) => (
          <Link
            key={example.href}
            href={example.href}
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{example.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{example.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

