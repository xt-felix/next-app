'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * SWR 异步数据获取组件
 * 
 * SWR 的特点：
 * 1. 自动缓存和重新验证
 * 2. 支持轮询、聚焦时刷新
 * 3. 错误重试机制
 * 4. 适合接口数据管理
 */
export default function UserProfileSWR() {
  const { data, error, isLoading, mutate } = useSWR('/api/mock-user', fetcher, {
    revalidateOnFocus: true, // 窗口聚焦时重新验证
    revalidateOnReconnect: true, // 网络重连时重新验证
  });

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-red-500">加载失败</p>
        <button
          onClick={() => mutate()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">用户信息（SWR）</h3>
      <div className="space-y-2">
        <p>姓名：{data?.name || '未知'}</p>
        <p>邮箱：{data?.email || '未知'}</p>
        <button
          onClick={() => mutate()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          手动刷新
        </button>
      </div>
    </div>
  );
}

