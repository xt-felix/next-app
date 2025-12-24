import ReduxProvider from '@/components/state-management/ReduxProvider';
import UserProfile from '@/components/state-management/UserProfile';
import Link from 'next/link';

/**
 * Redux Toolkit 示例页面
 */
export default function ReduxPage() {
  return (
    <ReduxProvider>
      <div className="container mx-auto px-4 py-8">
        <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
          ← 返回
        </Link>
        <h1 className="text-3xl font-bold mb-8">Redux Toolkit 示例</h1>
        
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">特点</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>企业级标准，生态完善</li>
              <li>内置 Immer，可以直接修改状态</li>
              <li>支持中间件（持久化、日志等）</li>
              <li>强大的 DevTools 支持</li>
            </ul>
          </div>

          <UserProfile />
        </div>
      </div>
    </ReduxProvider>
  );
}

