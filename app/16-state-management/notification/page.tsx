'use client';

import { useEffect } from 'react';
import { useNotificationStore, Notification } from '@/stores/notification';
import { useWebSocket } from '@/hooks/useWebSocket';
import NotificationBell from '@/components/state-management/NotificationBell';
import Link from 'next/link';

/**
 * 实时通知中心页面
 * 
 * 功能：
 * 1. WebSocket 实时推送新消息
 * 2. 消息列表管理
 * 3. 未读计数
 * 4. 标记已读、删除等操作
 */
export default function NotificationPage() {
  const addNotification = useNotificationStore((state) => state.add);
  const setList = useNotificationStore((state) => state.setList);

  // 模拟 WebSocket 连接（实际项目中替换为真实 WebSocket URL）
  useWebSocket('wss://echo.websocket.org', {
    onMessage: (data) => {
      // 实际项目中，这里会收到服务器推送的通知
      console.log('WebSocket message:', data);
    },
  });

  // 初始化时加载历史消息（模拟）
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        content: '欢迎使用通知中心！',
        read: false,
        timestamp: Date.now() - 60000,
        type: 'info',
      },
      {
        id: '2',
        content: '您有一条新消息',
        read: false,
        timestamp: Date.now() - 300000,
        type: 'success',
      },
    ];
    setList(mockNotifications);
  }, [setList]);

  // 模拟添加通知（实际项目中由 WebSocket 触发）
  const handleAddNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      content: `新通知 ${new Date().toLocaleTimeString()}`,
      read: false,
      timestamp: Date.now(),
      type: 'info',
    };
    addNotification(notification);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/16-state-management" className="text-blue-500 hover:underline mb-4 inline-block">
        ← 返回
      </Link>
      <h1 className="text-3xl font-bold mb-8">实时通知中心</h1>
      
      <div className="space-y-4">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">功能说明</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Zustand 管理全局消息状态</li>
            <li>WebSocket 实时推送新消息</li>
            <li>未读计数自动计算</li>
            <li>支持标记已读、删除等操作</li>
            <li>消息状态可同步到后端</li>
          </ul>
        </div>

        <div className="flex items-center justify-between p-6 border rounded-lg">
          <h3 className="text-lg font-semibold">通知中心</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddNotification}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              模拟新通知
            </button>
            <NotificationBell />
          </div>
        </div>
      </div>
    </div>
  );
}

