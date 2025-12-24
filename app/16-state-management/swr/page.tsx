import UserProfileSWR from '@/components/state-management/UserProfileSWR';
import Link from 'next/link';

/**
 * SWR 示例页面
 */
export default function SWRPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
        ← 返回
      </Link>
      <h1 className="text-3xl font-bold mb-8">SWR 异步数据管理示例</h1>
      
      <div className="space-y-4">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">特点</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>自动缓存和重新验证</li>
            <li>支持轮询、聚焦时刷新</li>
            <li>错误重试机制</li>
            <li>适合接口数据管理</li>
          </ul>
        </div>

        <UserProfileSWR />
      </div>
    </div>
  );
}

