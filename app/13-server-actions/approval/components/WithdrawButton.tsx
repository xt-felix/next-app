'use client';

import { withdrawApproval } from '../actions';
import { useState, useTransition } from 'react';

/**
 * 撤回按钮组件
 * 演示：业务逻辑校验 + 二次确认
 */
export function WithdrawButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleWithdraw = () => {
    if (!confirm('确定要撤回这个审批申请吗？')) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await withdrawApproval(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : '撤回失败');
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleWithdraw}
        disabled={isPending}
        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? '撤回中...' : '撤回申请'}
      </button>
      {error && (
        <p className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
