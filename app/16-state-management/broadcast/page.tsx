'use client';

import { useEffect, useState } from 'react';
import { useBroadcast, broadcastMessage } from '@/hooks/useBroadcast';
import { useThemeStore } from '@/stores/theme';
import Link from 'next/link';

/**
 * 多标签同步示例页面
 * 
 * 功能：
 * 1. BroadcastChannel 实现多标签页同步
 * 2. 主题切换多标签同步
 * 3. 状态变更自动广播
 */
export default function BroadcastPage() {
  const [syncStatus, setSyncStatus] = useState<string>('等待同步...');
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);

  // 监听广播消息
  useBroadcast<{ type: string; data: unknown }>('theme-sync', (message) => {
    if (message.type === 'theme-changed') {
      setSyncStatus(`收到其他标签页的主题变更：${message.data}`);
      // 同步主题状态
      useThemeStore.getState().setMode(message.data as 'light' | 'dark');
    }
  });

  // 主题切换时广播
  const handleToggle = () => {
    toggle();
    broadcastMessage('theme-sync', {
      type: 'theme-changed',
      data: mode === 'light' ? 'dark' : 'light',
    });
    setSyncStatus('已发送主题变更广播');
  };

  useEffect(() => {
    setSyncStatus('多标签同步已启用');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
        ← 返回
      </Link>
      <h1 className="text-3xl font-bold mb-8">多标签同步示例</h1>
      
      <div className="space-y-4">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">功能说明</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>使用 BroadcastChannel API 实现多标签页同步</li>
            <li>在一个标签页切换主题，其他标签页自动同步</li>
            <li>适用于用户登出、Token 失效等场景</li>
          </ul>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">当前主题：{mode === 'light' ? '🌞 亮色' : '🌙 暗色'}</h3>
          <div className="space-y-4">
            <button
              onClick={handleToggle}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              切换主题（会同步到其他标签页）
            </button>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                同步状态：{syncStatus}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                提示：打开多个标签页访问此页面，在一个标签页切换主题，其他标签页会自动同步
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

