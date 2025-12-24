import { useEffect } from 'react';

/**
 * BroadcastChannel Hook
 * 
 * 功能：实现多标签页/多窗口状态同步
 * 
 * 使用场景：
 * - 用户在一个标签页登出，其他标签页自动同步
 * - 消息已读状态多标签同步
 * - 主题切换多标签同步
 */
export function useBroadcast<T>(
  channelName: string,
  onMessage: (data: T) => void
) {
  useEffect(() => {
    // 检查浏览器是否支持 BroadcastChannel
    if (typeof window === 'undefined' || !window.BroadcastChannel) {
      return;
    }

    const channel = new BroadcastChannel(channelName);

    channel.onmessage = (event) => {
      onMessage(event.data);
    };

    return () => {
      channel.close();
    };
  }, [channelName, onMessage]);
}

/**
 * 发送广播消息
 */
export function broadcastMessage<T>(channelName: string, data: T) {
  if (typeof window === 'undefined' || !window.BroadcastChannel) {
    return;
  }

  const channel = new BroadcastChannel(channelName);
  channel.postMessage(data);
  channel.close();
}

