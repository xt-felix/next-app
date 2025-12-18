'use client';

import { toggleTodo } from '../actions';
import { useState, useTransition } from 'react';

/**
 * 切换完成状态按钮（客户端组件）
 * 演示：乐观 UI 更新
 */
export function ToggleButton({
  id,
  completed,
}: {
  id: string;
  completed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);

  const handleToggle = () => {
    // 乐观更新：立即更新 UI
    setOptimisticCompleted(!optimisticCompleted);

    startTransition(async () => {
      try {
        await toggleTodo(id);
      } catch (e) {
        // 失败时回滚
        setOptimisticCompleted(completed);
        alert(e instanceof Error ? e.message : '操作失败');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`w-5 h-5 rounded border-2 transition-all disabled:opacity-50 ${
        optimisticCompleted
          ? 'bg-blue-500 border-blue-500'
          : 'border-gray-300 hover:border-blue-400'
      }`}
      aria-label={optimisticCompleted ? '标记为未完成' : '标记为已完成'}
    >
      {optimisticCompleted && (
        <svg
          className="w-full h-full text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}
