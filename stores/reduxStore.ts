import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

/**
 * Redux Store 配置
 * 
 * configureStore 自动配置：
 * - Redux DevTools
 * - 默认中间件（thunk、immutability check 等）
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

