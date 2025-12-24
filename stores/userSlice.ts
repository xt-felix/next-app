import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  role: string;
  token: string;
}

const initialState: UserState = {
  name: '',
  role: '',
  token: '',
};

/**
 * Redux Toolkit 用户状态切片
 * 
 * Redux Toolkit 的优势：
 * 1. 企业级标准，生态完善
 * 2. 内置 Immer，可以直接修改状态
 * 3. 支持中间件（如持久化、日志）
 * 4. 强大的 DevTools 支持
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      return initialState;
    },
    updateRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
  },
});

export const { setUser, clearUser, updateRole } = userSlice.actions;
export default userSlice.reducer;

