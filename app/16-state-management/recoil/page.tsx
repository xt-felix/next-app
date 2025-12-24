import RecoilProvider from '@/components/state-management/RecoilProvider';
import Counter from '@/components/state-management/Counter';
import Link from 'next/link';

/**
 * Recoil 示例页面
 */
export default function RecoilPage() {
  return (
    <RecoilProvider>
      <div className="container mx-auto px-4 py-8">
        <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
          ← 返回
        </Link>
        <h1 className="text-3xl font-bold mb-8">Recoil 原子化状态示例</h1>
        
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">特点</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>原子化设计，状态可以组合</li>
              <li>按需订阅，性能优秀</li>
              <li>支持异步状态和副作用</li>
              <li>适合复杂组件树</li>
            </ul>
          </div>

          <Counter />
        </div>
      </div>
    </RecoilProvider>
  );
}

