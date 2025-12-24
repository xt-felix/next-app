# 第十六章：Next.js 中的状态管理方案

## 📚 目录

- [理论讲解](#理论讲解)
- [状态管理方案对比](#状态管理方案对比)
- [代码示例](#代码示例)
- [实战项目：实时通知中心](#实战项目实时通知中心)
- [进阶功能](#进阶功能)
- [最佳实践](#最佳实践)

---

## 理论讲解

### 1. Next.js 应用中的状态管理需求

Next.js 支持多种渲染模式（SSR、SSG、CSR、ISR），状态管理需要兼容服务端与客户端。

#### 企业级项目常见状态类型：

1. **全局状态**：用户信息、主题、权限等需要在多个组件间共享的状态
2. **局部状态**：表单数据、弹窗开关等组件内部状态
3. **异步数据**：接口数据、WebSocket 实时数据等需要异步获取的状态
4. **持久化状态**：本地存储、Cookie 等需要持久化的状态

#### 状态管理的挑战：

- ✅ 服务端与客户端同步
- ✅ 性能优化（避免不必要的重渲染）
- ✅ 可维护性（代码组织清晰）
- ✅ 团队协作（统一规范）
- ✅ 类型安全（TypeScript）
- ✅ 持久化（localStorage、Cookie）
- ✅ 与后端协作（Server Actions、API Routes）

---

## 状态管理方案对比

### 1. Context API

**特点：**
- React 内置，无需安装
- 适合简单的全局状态
- 性能有限，容易导致不必要的重渲染

**适用场景：** 简单的主题切换、用户信息等

### 2. Redux Toolkit

**特点：**
- 企业级标准，生态完善
- 内置 Immer，可以直接修改状态
- 支持中间件（持久化、日志、DevTools）
- 适合复杂业务状态管理

**适用场景：** 大型项目、复杂业务逻辑、需要时间旅行调试

### 3. Zustand

**特点：**
- 轻量级，API 极简
- TypeScript 友好
- 天然支持 SSR/Next.js
- 无需 Provider，可直接使用
- 支持中间件（持久化、日志等）

**适用场景：** 中小型项目、局部全局状态、快速开发

### 4. Recoil

**特点：**
- 原子化设计，状态可以组合
- 按需订阅，性能优秀
- 支持异步状态和副作用
- 适合复杂组件树

**适用场景：** 复杂组件树、需要状态组合的场景

### 5. SWR / React Query

**特点：**
- 专注异步数据获取与缓存
- 自动缓存和重新验证
- 支持轮询、聚焦时刷新
- 错误重试机制

**适用场景：** 接口数据管理、需要缓存和自动刷新的场景

### 推荐组合

- **Zustand/Redux**：管理全局业务状态
- **SWR/React Query**：管理异步数据

---

## 代码示例

### 1. Zustand - 主题切换

**文件：** `stores/theme.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-mode', // localStorage 的 key
    }
  )
);
```

**使用示例：**

```typescript
// 组件中使用
const mode = useThemeStore((state) => state.mode);
const toggle = useThemeStore((state) => state.toggle);

// 切换主题
<button onClick={toggle}>切换主题</button>
```

**特点：**
- ✅ 轻量级，API 简洁
- ✅ 支持持久化（persist middleware）
- ✅ TypeScript 友好
- ✅ 无需 Provider

**访问路径：** `/16-state-management/theme`

---

### 2. Redux Toolkit - 用户管理

**文件：** `stores/userSlice.ts`

```typescript
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
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

**Store 配置：** `stores/reduxStore.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**使用示例：**

```typescript
// 需要 Provider 包裹
<ReduxProvider>
  <UserProfile />
</ReduxProvider>

// 组件中使用
const user = useSelector((state: RootState) => state.user);
const dispatch = useDispatch<AppDispatch>();

dispatch(setUser({ name: '张三', role: 'admin', token: 'xxx' }));
```

**特点：**
- ✅ 企业级标准，生态完善
- ✅ 内置 Immer，可以直接修改状态
- ✅ 支持中间件和 DevTools
- ✅ 类型安全

**访问路径：** `/16-state-management/redux`

---

### 3. Recoil - 原子化状态

**文件：** `stores/atoms.ts`

```typescript
import { atom } from 'recoil';

export const counterAtom = atom<number>({
  key: 'counter',
  default: 0,
});
```

**使用示例：**

```typescript
// 需要 RecoilRoot 包裹
<RecoilProvider>
  <Counter />
</RecoilProvider>

// 组件中使用
const [count, setCount] = useRecoilState(counterAtom);

<button onClick={() => setCount(count + 1)}>+</button>
```

**特点：**
- ✅ 原子化设计，状态可以组合
- ✅ 按需订阅，性能优秀
- ✅ 支持异步状态

**访问路径：** `/16-state-management/recoil`

---

### 4. SWR - 异步数据管理

**使用示例：**

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserProfile() {
  const { data, error, isLoading, mutate } = useSWR('/api/mock-user', fetcher, {
    revalidateOnFocus: true, // 窗口聚焦时重新验证
    revalidateOnReconnect: true, // 网络重连时重新验证
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div>
      <p>姓名：{data.name}</p>
      <button onClick={() => mutate()}>手动刷新</button>
    </div>
  );
}
```

**特点：**
- ✅ 自动缓存和重新验证
- ✅ 支持轮询、聚焦时刷新
- ✅ 错误重试机制
- ✅ 适合接口数据管理

**访问路径：** `/16-state-management/swr`

---

## 实战项目：实时通知中心

### 需求分析

- ✅ 全局管理消息数据
- ✅ 支持未读计数
- ✅ 消息标记为已读
- ✅ WebSocket 实时推送
- ✅ 移动端适配
- ✅ 无障碍支持
- ✅ 性能优化

### 目录结构

```
stores/
  notification.ts          # 通知状态管理
components/
  NotificationBell.tsx     # 通知铃铛组件
  NotificationList.tsx     # 通知列表组件
hooks/
  useWebSocket.ts          # WebSocket Hook
app/
  16-state-management/
    notification/
      page.tsx             # 通知中心页面
```

### 核心代码

**通知状态管理：** `stores/notification.ts`

```typescript
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
}

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
  // ... 其他方法
}));
```

**WebSocket Hook：** `hooks/useWebSocket.ts`

```typescript
import { useEffect, useRef } from 'react';

export function useWebSocket(
  url: string,
  options: {
    onMessage?: (data: unknown) => void;
    reconnectInterval?: number;
  } = {}
) {
  const { onMessage, reconnectInterval = 3000 } = options;
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connect = () => {
      const ws = new WebSocket(url);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      };
      ws.onclose = () => {
        // 自动重连
        setTimeout(connect, reconnectInterval);
      };
      wsRef.current = ws;
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [url, reconnectInterval, onMessage]);

  return wsRef.current;
}
```

**使用示例：**

```typescript
// 在通知中心页面中使用
useWebSocket('wss://api/notifications', {
  onMessage: (data) => {
    // 收到新通知，添加到 Store
    useNotificationStore.getState().add(data as Notification);
  },
});
```

**访问路径：** `/16-state-management/notification`

---

## 进阶功能

### 1. 多标签同步

**功能：** 使用 BroadcastChannel API 实现多标签页/多窗口状态同步

**实现：** `hooks/useBroadcast.ts`

```typescript
import { useEffect } from 'react';

export function useBroadcast<T>(
  channelName: string,
  onMessage: (data: T) => void
) {
  useEffect(() => {
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

// 发送广播消息
export function broadcastMessage<T>(channelName: string, data: T) {
  if (typeof window === 'undefined' || !window.BroadcastChannel) {
    return;
  }

  const channel = new BroadcastChannel(channelName);
  channel.postMessage(data);
  channel.close();
}
```

**使用场景：**
- 用户在一个标签页登出，其他标签页自动同步
- 消息已读状态多标签同步
- 主题切换多标签同步

**访问路径：** `/16-state-management/broadcast`

---

### 2. 权限控制

**功能：** 基于角色的权限管理（RBAC）

**实现：** `stores/permission.ts`

```typescript
import { create } from 'zustand';

type Role = 'admin' | 'user' | 'guest';

interface PermissionState {
  role: Role;
  permissions: string[];
  setRole: (role: Role) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: Role) => boolean;
}

const rolePermissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete', 'manage'],
  user: ['read', 'write'],
  guest: ['read'],
};

export const usePermissionStore = create<PermissionState>((set, get) => ({
  role: 'guest',
  permissions: rolePermissions.guest,
  setRole: (role) =>
    set({
      role,
      permissions: rolePermissions[role] || [],
    }),
  hasPermission: (permission) => {
    return get().permissions.includes(permission);
  },
  hasRole: (role) => {
    return get().role === role;
  },
}));
```

**权限保护组件：** `components/state-management/ProtectedButton.tsx`

```typescript
export default function ProtectedButton({
  permission,
  role,
  children,
  ...props
}) {
  const hasPermission = usePermissionStore((state) => state.hasPermission);
  const hasRole = usePermissionStore((state) => state.hasRole);

  // 权限检查
  if (permission && !hasPermission(permission)) {
    return null;
  }

  // 角色检查
  if (role && !hasRole(role)) {
    return null;
  }

  return <button {...props}>{children}</button>;
}
```

**访问路径：** `/16-state-management/permission`

---

### 3. 国际化

**功能：** 多语言状态管理

**实现：** `stores/i18n.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'zh' | 'en';

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: 'zh',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'i18n-lang',
    }
  )
);

// 翻译函数
export const t = (key: string, lang: Language = useI18nStore.getState().lang): string => {
  const translations: Record<string, Record<Language, string>> = {
    'notification.title': {
      zh: '通知中心',
      en: 'Notification Center',
    },
    // ... 更多翻译
  };

  return translations[key]?.[lang] || key;
};
```

**访问路径：** `/16-state-management/i18n`

---

## 最佳实践

### 1. 状态拆分

- ✅ **全局状态**：用户信息、主题、权限等
- ✅ **局部状态**：表单数据、弹窗开关等
- ✅ **异步数据**：使用 SWR/React Query
- ✅ **持久化状态**：使用 persist middleware

### 2. 类型安全

- ✅ 使用 TypeScript 全面约束
- ✅ 定义清晰的接口类型
- ✅ 避免使用 `any` 类型

### 3. 性能优化

- ✅ 按需订阅状态（Zustand selector）
- ✅ 避免不必要的重渲染
- ✅ 使用 React.memo 优化组件
- ✅ 懒加载和代码分割

### 4. 团队协作

- ✅ 统一目录结构
- ✅ 命名规范
- ✅ 代码审查
- ✅ 自动化测试

### 5. 安全

- ✅ Token/敏感信息仅存内存或 HttpOnly Cookie
- ✅ 状态变更需鉴权
- ✅ 防止 XSS/CSRF 攻击

---

## 常见问题

### Q1: Zustand 和 Redux 如何选择？

**A:** 
- **Zustand**：适合中小型项目、快速开发、简单状态管理
- **Redux**：适合大型项目、复杂业务逻辑、需要时间旅行调试

### Q2: 如何在 Next.js App Router 中使用 Redux？

**A:** 需要在客户端组件中使用 Provider：

```typescript
'use client';
import { Provider } from 'react-redux';
import { store } from '@/stores/reduxStore';

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
```

### Q3: 多标签页如何同步状态？

**A:** 使用 BroadcastChannel API：

```typescript
// 发送广播
broadcastMessage('channel-name', { type: 'event', data: {} });

// 接收广播
useBroadcast('channel-name', (data) => {
  // 处理同步逻辑
});
```

### Q4: 状态如何持久化？

**A:** 
- **Zustand**：使用 `persist` middleware
- **Redux**：使用 `redux-persist`
- **手动**：使用 `localStorage`、`sessionStorage`、`Cookie`

### Q5: 如何与 Server Actions 协作？

**A:** 在 Server Action 中更新状态后，可以调用 `mutate` 刷新客户端状态：

```typescript
'use server';
export async function updateUser(data) {
  // 更新数据库
  await updateUserInDB(data);
  // 返回结果，客户端调用 mutate 刷新
}
```

---

## 总结

Next.js 中的状态管理需要根据项目规模和需求选择合适的方案：

- **简单项目**：Context API 或 Zustand
- **中型项目**：Zustand + SWR
- **大型项目**：Redux Toolkit + React Query
- **复杂组件树**：Recoil

关键是要理解各种方案的适用场景，合理组合使用，才能构建出高性能、可维护的应用。

---

## 相关链接

- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Recoil 文档](https://recoiljs.org/)
- [SWR 文档](https://swr.vercel.app/)
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

