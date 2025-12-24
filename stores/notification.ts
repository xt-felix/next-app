import { create } from 'zustand';

export interface Notification {
  id: string;
  content: string;
  read: boolean;
  timestamp: number;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  list: Notification[];
  unread: number;
  add: (notification: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  setList: (list: Notification[]) => void;
  clear: () => void;
}

/**
 * Zustand 通知中心状态管理
 * 
 * 功能：
 * 1. 消息列表管理
 * 2. 未读计数自动计算
 * 3. 支持标记已读、删除等操作
 * 4. 与 WebSocket 实时推送协作
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  list: [],
  unread: 0,
  add: (notification) =>
    set((state) => {
      const newList = [notification, ...state.list];
      return {
        list: newList,
        unread: newList.filter((n) => !n.read).length,
      };
    }),
  markRead: (id) =>
    set((state) => {
      const list = state.list.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        list,
        unread: list.filter((n) => !n.read).length,
      };
    }),
  markAllRead: () =>
    set((state) => ({
      list: state.list.map((n) => ({ ...n, read: true })),
      unread: 0,
    })),
  remove: (id) =>
    set((state) => {
      const list = state.list.filter((n) => n.id !== id);
      return {
        list,
        unread: list.filter((n) => !n.read).length,
      };
    }),
  setList: (list) =>
    set({
      list,
      unread: list.filter((n) => !n.read).length,
    }),
  clear: () =>
    set({
      list: [],
      unread: 0,
    }),
}));

