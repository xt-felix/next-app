'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/stores/reduxStore';
import { setUser, clearUser } from '@/stores/userSlice';

/**
 * Redux Toolkit 用户信息组件
 * 
 * 演示 Redux Toolkit 的用法：
 * 1. useSelector 订阅状态
 * 2. useDispatch 派发 action
 * 3. 类型安全的 state 和 dispatch
 */
export default function UserProfile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    dispatch(
      setUser({
        name: '张三',
        role: 'admin',
        token: 'mock-token-123',
      })
    );
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">用户信息（Redux）</h3>
      {user.name ? (
        <div className="space-y-2">
          <p>姓名：{user.name}</p>
          <p>角色：{user.role}</p>
          <p className="text-sm text-gray-500">Token: {user.token}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            登出
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-500 mb-2">未登录</p>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            登录
          </button>
        </div>
      )}
    </div>
  );
}

