'use client';

import { deleteFile } from '../actions';
import { useState, useTransition } from 'react';

/**
 * 删除文件按钮组件
 */
export function DeleteFileButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!confirm('确定要删除这个文件吗？')) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await deleteFile(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : '删除失败');
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? '删除中...' : '删除文件'}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
