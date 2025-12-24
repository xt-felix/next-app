'use client';

import { useNotificationStore } from '@/stores/notification';
import { useI18nStore, t } from '@/stores/i18n';
import { useEffect } from 'react';

interface NotificationListProps {
  onClose?: () => void;
}

/**
 * 通知列表组件
 * 
 * 功能：
 * 1. 显示所有通知
 * 2. 标记单个/全部为已读
 * 3. 删除通知
 * 4. 国际化支持
 */
export default function NotificationList({ onClose }: NotificationListProps) {
  const list = useNotificationStore((state) => state.list);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const remove = useNotificationStore((state) => state.remove);
  const lang = useI18nStore((state) => state.lang);

  // 标记已读后同步到后端（模拟）
  const handleMarkRead = async (id: string) => {
    markRead(id);
    // 这里可以调用 API 同步状态
    // await fetch('/api/notifications/read', { method: 'POST', body: JSON.stringify({ id }) });
  };

  const handleMarkAllRead = async () => {
    markAllRead();
    // 同步到后端
    // await fetch('/api/notifications/read-all', { method: 'POST' });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('notification.title', lang)}</h3>
        {list.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {t('notification.markAllRead', lang)}
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('notification.noNotifications', lang)}
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((notification) => (
            <li
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.read
                  ? 'bg-gray-50 dark:bg-gray-900 opacity-60'
                  : 'bg-blue-50 dark:bg-blue-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      已读
                    </button>
                  )}
                  <button
                    onClick={() => remove(notification.id)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

