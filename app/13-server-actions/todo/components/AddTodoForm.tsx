'use client';

import { addTodo } from '../actions';
import { useState, useTransition } from 'react';

/**
 * 添加待办事项表单（客户端组件）
 * 演示：表单无刷新提交 + 错误处理 + 用户反馈
 */
export function AddTodoForm() {
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      try {
        await addTodo(formData);
        setInput(''); // 清空输入框
      } catch (e) {
        setError(e instanceof Error ? e.message : '添加失败');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          name="title"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入待办事项，按回车或点击添加..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={isPending}
          aria-label="待办事项标题"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending ? '添加中...' : '添加'}
        </button>
      </div>

      {error && (
        <div
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          role="alert"
        >
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        提示：Server Actions 自动处理表单提交，无需手动 fetch
      </p>
    </form>
  );
}
