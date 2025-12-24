'use client';

import { useRecoilState } from 'recoil';
import { counterAtom } from '@/stores/atoms';

/**
 * Recoil 计数器组件
 * 
 * 演示 Recoil 的原子化状态管理：
 * 1. useRecoilState 订阅和更新原子状态
 * 2. 原子状态可以在多个组件间共享
 * 3. 按需订阅，性能优秀
 */
export default function Counter() {
  const [count, setCount] = useRecoilState(counterAtom);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">计数器（Recoil）</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-2xl font-bold">{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          重置
        </button>
      </div>
    </div>
  );
}

