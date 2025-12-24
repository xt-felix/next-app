import ThemeToggle from '@/components/state-management/ThemeToggle';
import Link from 'next/link';

/**
 * Zustand 主题切换示例
 */
export default function ThemePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
        ← 返回
      </Link>
      <h1 className="text-3xl font-bold mb-8">Zustand 主题切换示例</h1>
      
      <div className="space-y-4">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">特点</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>轻量级，API 简洁</li>
            <li>支持持久化（localStorage）</li>
            <li>TypeScript 友好</li>
            <li>无需 Provider，可直接使用</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">示例</h2>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

