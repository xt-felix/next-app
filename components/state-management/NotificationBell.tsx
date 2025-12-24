'use client';

import { useNotificationStore } from '@/stores/notification';
import { useState } from 'react';
import NotificationList from './NotificationList';

/**
 * 通知铃铛组件
 * 
 * 功能：
 * 1. 显示未读消息数量
 * 2. 点击展开/收起通知列表
 * 3. 响应式设计，支持移动端
 */
export default function NotificationBell() {
  const unread = useNotificationStore((state) => state.unread);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="通知"
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unread > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          {/* 通知列表 */}
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-20">
            <NotificationList onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}

