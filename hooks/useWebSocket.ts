import { useEffect, useRef } from 'react';

interface UseWebSocketOptions {
  onMessage?: (data: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

/**
 * WebSocket Hook
 * 
 * 功能：
 * 1. 自动连接 WebSocket
 * 2. 自动重连机制
 * 3. 消息处理
 * 4. 清理资源
 */
export function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
) {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);

  useEffect(() => {
    // 服务端渲染时不执行
    if (typeof window === 'undefined') {
      return;
    }

    const connect = () => {
      try {
        const ws = new WebSocket(url);

        ws.onopen = () => {
          reconnectCountRef.current = 0;
          onOpen?.();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage?.(data);
          } catch (error) {
            console.error('WebSocket message parse error:', error);
          }
        };

        ws.onclose = () => {
          onClose?.();
          // 自动重连
          if (reconnectCountRef.current < reconnectAttempts) {
            reconnectCountRef.current += 1;
            reconnectTimerRef.current = setTimeout(() => {
              connect();
            }, reconnectInterval);
          }
        };

        ws.onerror = (error) => {
          onError?.(error);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    connect();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, reconnectInterval, reconnectAttempts, onMessage, onOpen, onClose, onError]);

  return wsRef.current;
}

