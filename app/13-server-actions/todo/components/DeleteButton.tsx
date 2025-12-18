'use client';

import { deleteTodo } from '../actions';
import { useState, useTransition } from 'react';

/**
 * 删除按钮组件（客户端组件）
 * 演示：事件驱动 Server Action + 乐观 UI + 错误处理
 */
export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('确定要删除这个待办事项吗？')) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await deleteTodo(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : '删除失败');
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="删除待办事项"
      >
        {isPending ? '删除中...' : '删除'}
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
