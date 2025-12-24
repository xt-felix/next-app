# Next.js 零基础到全栈实战教程

> 🎯 **学习目标**：从零掌握 Next.js 全栈开发能力
>
> 📚 **教程特点**：理论 + 实战，每章配套完整项目
>
> ⏱️ **学习周期**：建议 2-3 周，循序渐进

---

## 📖 教程目录

### 核心章节

- [第十二章：API Routes - 后端接口开发](#第十二章api-routes)
- [第十三章：Server Actions - 新一代全栈能力](#第十三章server-actions)
- [第十四章：NextAuth.js - 身份认证与授权](#第十四章nextauthjs)
- [第十五章：复杂表单处理与数据校验](#第十五章复杂表单处理与数据校验)
- [第十六章：Next.js 中的状态管理方案](#第十六章nextjs-中的状态管理方案) 🆕
- [数据缓存策略](#数据缓存策略)

### 快速导航

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [学习路线](#学习路线)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 访问项目

打开浏览器访问：http://localhost:3000

---

## 第十六章：Next.js 中的状态管理方案

### 📘 章节概述

Next.js 支持 SSR、SSG、CSR、ISR 等多种渲染模式，状态管理需要兼容服务端与客户端。本章深入讲解企业级状态管理方案，包括 Zustand、Redux Toolkit、Recoil、SWR 等主流方案，以及多标签同步、权限控制、国际化等进阶功能。

### 🎯 学习目标

- ✅ 理解 Next.js 应用中的状态管理需求
- ✅ 掌握主流状态管理方案的对比与选择
- ✅ 学会使用 Zustand、Redux Toolkit、Recoil、SWR
- ✅ 实现实时通知中心（WebSocket + Zustand）
- ✅ 掌握多标签同步、权限控制、国际化等进阶功能
- ✅ 理解状态持久化与服务端协作

### 📚 核心知识点

#### 1. Next.js 应用中的状态管理需求

**企业级项目常见状态类型：**

1. **全局状态**：用户信息、主题、权限等需要在多个组件间共享的状态
2. **局部状态**：表单数据、弹窗开关等组件内部状态
3. **异步数据**：接口数据、WebSocket 实时数据等需要异步获取的状态
4. **持久化状态**：本地存储、Cookie 等需要持久化的状态

**状态管理的挑战：**

- ✅ 服务端与客户端同步
- ✅ 性能优化（避免不必要的重渲染）
- ✅ 可维护性（代码组织清晰）
- ✅ 团队协作（统一规范）
- ✅ 类型安全（TypeScript）
- ✅ 持久化（localStorage、Cookie）
- ✅ 与后端协作（Server Actions、API Routes）

#### 2. 主流状态管理方案对比

| 方案 | 特点 | 适用场景 | 学习曲线 |
|------|------|---------|---------|
| **Context API** | React 内置，无需安装 | 简单的全局状态 | ⭐ 简单 |
| **Redux Toolkit** | 企业级标准，生态完善 | 大型项目、复杂业务 | ⭐⭐⭐ 中等 |
| **Zustand** | 轻量级，API 极简 | 中小型项目、快速开发 | ⭐⭐ 简单 |
| **Recoil** | 原子化设计，按需订阅 | 复杂组件树 | ⭐⭐⭐ 中等 |
| **SWR/React Query** | 专注异步数据获取 | 接口数据管理 | ⭐⭐ 简单 |

**推荐组合：**
- **Zustand/Redux**：管理全局业务状态
- **SWR/React Query**：管理异步数据

### 💻 实战项目

#### 项目访问路径

**主导航页：** `/16-state-management`

#### 功能清单

| 示例 | 难度 | 访问路径 | 核心知识点 |
|------|------|---------|-----------|
| Zustand 主题切换 | 入门 | `/16-state-management/theme` | Zustand 基础、持久化 |
| Redux Toolkit 用户管理 | 中级 | `/16-state-management/redux` | Redux Toolkit、Provider |
| Recoil 原子化状态 | 中级 | `/16-state-management/recoil` | Recoil 原子、按需订阅 |
| SWR 异步数据 | 中级 | `/16-state-management/swr` | SWR、缓存、自动刷新 |
| 实时通知中心 | 高级 | `/16-state-management/notification` | Zustand + WebSocket |
| 多标签同步 | 高级 | `/16-state-management/broadcast` | BroadcastChannel API |
| 权限控制 | 高级 | `/16-state-management/permission` | RBAC、权限管理 |
| 国际化 | 中级 | `/16-state-management/i18n` | 多语言状态管理 |

### 📝 代码示例

#### 1. Zustand - 主题切换

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

/**
 * Zustand 主题状态管理
 * 
 * 特点：
 * 1. 轻量级，API 简洁
 * 2. 支持持久化（persist middleware）
 * 3. TypeScript 友好
 * 4. 无需 Provider，可直接使用
 */
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

#### 2. Redux Toolkit - 用户管理

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
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

**Store 配置：** `stores/reduxStore.ts`

```typescript
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

#### 3. Recoil - 原子化状态

**文件：** `stores/atoms.ts`

```typescript
import { atom } from 'recoil';

/**
 * Recoil 原子化状态
 * 
 * Recoil 的特点：
 * 1. 原子化设计，状态可以组合
 * 2. 按需订阅，性能优秀
 * 3. 支持异步状态和副作用
 * 4. 适合复杂组件树
 */

// 计数器原子
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

#### 4. SWR - 异步数据管理

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

### 🎯 实战项目：实时通知中心

#### 需求分析

- ✅ 全局管理消息数据
- ✅ 支持未读计数
- ✅ 消息标记为已读
- ✅ WebSocket 实时推送
- ✅ 移动端适配
- ✅ 无障碍支持
- ✅ 性能优化

#### 目录结构

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

#### 核心代码

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

### 🚀 进阶功能

#### 1. 多标签同步

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

#### 2. 权限控制

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

#### 3. 国际化

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

### 💡 最佳实践

#### 1. 状态拆分

- ✅ **全局状态**：用户信息、主题、权限等
- ✅ **局部状态**：表单数据、弹窗开关等
- ✅ **异步数据**：使用 SWR/React Query
- ✅ **持久化状态**：使用 persist middleware

#### 2. 类型安全

- ✅ 使用 TypeScript 全面约束
- ✅ 定义清晰的接口类型
- ✅ 避免使用 `any` 类型

#### 3. 性能优化

- ✅ 按需订阅状态（Zustand selector）
- ✅ 避免不必要的重渲染
- ✅ 使用 React.memo 优化组件
- ✅ 懒加载和代码分割

#### 4. 团队协作

- ✅ 统一目录结构
- ✅ 命名规范
- ✅ 代码审查
- ✅ 自动化测试

#### 5. 安全

- ✅ Token/敏感信息仅存内存或 HttpOnly Cookie
- ✅ 状态变更需鉴权
- ✅ 防止 XSS/CSRF 攻击

---

### ❓ 常见问题

#### Q1: Zustand 和 Redux 如何选择？

**A:** 
- **Zustand**：适合中小型项目、快速开发、简单状态管理
- **Redux**：适合大型项目、复杂业务逻辑、需要时间旅行调试

#### Q2: 如何在 Next.js App Router 中使用 Redux？

**A:** 需要在客户端组件中使用 Provider：

```typescript
'use client';
import { Provider } from 'react-redux';
import { store } from '@/stores/reduxStore';

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
```

#### Q3: 多标签页如何同步状态？

**A:** 使用 BroadcastChannel API：

```typescript
// 发送广播
broadcastMessage('channel-name', { type: 'event', data: {} });

// 接收广播
useBroadcast('channel-name', (data) => {
  // 处理同步逻辑
});
```

#### Q4: 状态如何持久化？

**A:** 
- **Zustand**：使用 `persist` middleware
- **Redux**：使用 `redux-persist`
- **手动**：使用 `localStorage`、`sessionStorage`、`Cookie`

#### Q5: 如何与 Server Actions 协作？

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

### 📖 详细文档

查看完整文档：[docs/16-state-management/README.md](docs/16-state-management/README.md)

内容包括：
- ✅ 理论讲解（状态管理需求、方案对比）
- ✅ 代码示例（Zustand、Redux、Recoil、SWR）
- ✅ 实战项目（实时通知中心）
- ✅ 进阶功能（多标签同步、权限控制、国际化）
- ✅ 最佳实践指南
- ✅ 常见问题与解决方案

---

### 🎓 学习建议

#### 第 1 天：理解概念（2-3 小时）

**上午（1.5 小时）：阅读理论**
1. 阅读"核心知识点"部分
2. 理解各种状态管理方案的区别
3. 掌握状态管理的适用场景

**下午（1.5 小时）：运行项目**
1. 启动开发服务器：`npm run dev`
2. 访问主导航页：http://localhost:3000/16-state-management
3. 依次体验各个示例
4. 观察浏览器开发者工具

#### 第 2 天：阅读代码（3-4 小时）

**上午（2 小时）：基础示例**
1. 打开 `stores/theme.ts`，理解 Zustand 用法
2. 打开 `stores/userSlice.ts`，理解 Redux Toolkit
3. 打开 `stores/atoms.ts`，理解 Recoil
4. 对比三种方案的差异

**下午（2 小时）：进阶功能**
1. 研究通知中心的实现
2. 理解 WebSocket 集成
3. 学习多标签同步机制
4. 总结最佳实践

#### 第 3 天：动手实践（4-5 小时）

**任务 1：扩展主题功能（1.5 小时）**
```typescript
// 添加更多主题选项
type ThemeMode = 'light' | 'dark' | 'auto';

// 添加主题色自定义
interface ThemeState {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}
```

**任务 2：实现购物车状态（1.5 小时）**
```typescript
// 使用 Zustand 实现购物车
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}
```

**任务 3：添加状态持久化（1.5 小时）**
```typescript
// 为购物车添加持久化
export const useCartStore = create(
  persist(
    (set) => ({
      // ... 状态
    }),
    { name: 'cart' }
  )
);
```

---

### 🎯 检查清单

学完本章后，检查你是否能：

**概念理解：**
- [ ] 能解释不同状态管理方案的特点
- [ ] 理解 Zustand、Redux、Recoil 的区别
- [ ] 掌握 SWR 的缓存机制
- [ ] 明白多标签同步的原理

**代码能力：**
- [ ] 能创建 Zustand Store
- [ ] 能配置 Redux Toolkit
- [ ] 能使用 Recoil 原子状态
- [ ] 能集成 SWR 获取数据
- [ ] 能实现 WebSocket 实时推送

**调试能力：**
- [ ] 知道如何查看状态变化
- [ ] 能使用浏览器开发者工具调试
- [ ] 理解性能问题并优化

**最佳实践：**
- [ ] 合理选择状态管理方案
- [ ] 实现状态持久化
- [ ] 优化性能（按需订阅）
- [ ] 代码组织清晰、类型安全

---

### 🚀 进阶方向

1. **集成真实数据库**（Prisma + PostgreSQL）
2. **添加状态监控**（Redux DevTools、LogRocket）
3. **实现状态同步**（多标签、多设备）
4. **添加单元测试**（Jest、React Testing Library）
5. **探索更多方案**（Jotai、MobX、Valtio）

---

### 📚 额外资源

- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Recoil 文档](https://recoiljs.org/)
- [SWR 文档](https://swr.vercel.app/)
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

---

### 🎉 总结

Next.js 中的状态管理需要根据项目规模和需求选择合适的方案：

- **简单项目**：Context API 或 Zustand
- **中型项目**：Zustand + SWR
- **大型项目**：Redux Toolkit + React Query
- **复杂组件树**：Recoil

关键是要理解各种方案的适用场景，合理组合使用，才能构建出高性能、可维护的应用。

通过本章学习，你已经掌握：
- ✅ 主流状态管理方案的对比与选择
- ✅ Zustand、Redux、Recoil、SWR 的用法
- ✅ 实时通知中心的完整实现
- ✅ 多标签同步、权限控制、国际化
- ✅ 最佳实践和性能优化

**下一步：**
1. 完成所有实战案例
2. 尝试集成到真实项目
3. 探索更多高级特性

**记住：** 状态管理不是目的，而是手段。选择最适合你项目的方案，才是最重要的！

Happy Coding! 🚀

---

## 其他章节

### 第十二章：API Routes

Next.js 提供的后端 API 开发功能，让你可以在同一个项目中同时开发前端和后端。

**访问路径：** `/image-share`

**核心功能：**
- ✅ RESTful API 设计
- ✅ 文件上传处理
- ✅ 身份验证与授权
- ✅ 错误处理与响应规范

### 第十三章：Server Actions

Server Actions 是 Next.js 13+ 引入的革命性全栈能力，允许开发者**直接在 React 组件中声明服务端函数**。

**访问路径：** `/13-server-actions`

**核心功能：**
- ✅ 表单无刷新提交
- ✅ 乐观 UI 更新
- ✅ 数据自动刷新
- ✅ 权限校验和安全实践

### 第十四章：NextAuth.js

NextAuth.js 是 Next.js 生态中最流行的身份认证解决方案，提供完整的认证与授权功能。

**访问路径：** `/auth/signin`

**核心功能：**
- ✅ 多种登录方式（OAuth、账号密码、邮箱验证码）
- ✅ Session 管理
- ✅ 权限控制（RBAC）
- ✅ 审计日志

### 第十五章：复杂表单处理与数据校验

使用 React Hook Form + Zod 实现高性能、类型安全的复杂表单处理方案。

**访问路径：** `/15-complex-forms`

**核心功能：**
- ✅ 多步骤表单
- ✅ 动态字段表单
- ✅ 文件上传和批量导入
- ✅ 自动保存和草稿恢复

---

## 📁 项目结构

```
next-app/
├── app/                          # Next.js App Router
│   ├── 13-server-actions/       # Server Actions 示例
│   ├── 15-complex-forms/        # 复杂表单示例
│   ├── 16-state-management/     # 状态管理示例 🆕
│   ├── api/                     # API Routes
│   └── (auth)/                  # 认证相关页面
│
├── stores/                      # 状态管理 Store 🆕
│   ├── theme.ts                 # Zustand 主题管理
│   ├── userSlice.ts             # Redux Toolkit 用户状态
│   ├── atoms.ts                 # Recoil 原子状态
│   ├── notification.ts          # 通知中心状态
│   ├── permission.ts            # 权限状态
│   └── i18n.ts                  # 国际化状态
│
├── components/                   # React 组件
│   └── state-management/        # 状态管理相关组件 🆕
│
├── hooks/                       # 自定义 Hooks 🆕
│   ├── useBroadcast.ts          # BroadcastChannel Hook
│   └── useWebSocket.ts          # WebSocket Hook
│
├── lib/                         # 工具库
│   ├── auth/                    # 认证相关
│   └── api/                     # API 工具
│
└── docs/                        # 文档
    └── 16-state-management/     # 状态管理文档 🆕
```

---

## 🎓 学习路线

### 第一阶段：基础（第 1-2 周）

1. **Next.js 基础**
   - 路由系统
   - 页面和布局
   - 数据获取

2. **API Routes**
   - RESTful API 设计
   - 文件上传
   - 身份验证

### 第二阶段：进阶（第 3-4 周）

3. **Server Actions**
   - 表单处理
   - 乐观 UI
   - 数据刷新

4. **状态管理**
   - Zustand/Redux
   - SWR/React Query
   - 实时数据推送

5. **认证与授权**
   - NextAuth.js
   - 权限控制
   - Session 管理

### 第三阶段：实战（第 5-6 周）

6. **复杂表单**
   - React Hook Form
   - Zod 验证
   - 动态字段

7. **企业级功能**
   - 多标签同步
   - 国际化
   - 性能优化

---

## ❓ 常见问题

### Q: 如何选择状态管理方案？

**A:** 根据项目规模选择：
- 小型项目：Context API 或 Zustand
- 中型项目：Zustand + SWR
- 大型项目：Redux Toolkit + React Query

### Q: Server Actions 和 API Routes 有什么区别？

**A:** 
- **Server Actions**：适合表单提交、数据变更，更简洁
- **API Routes**：适合复杂接口、第三方调用，更灵活

### Q: 如何在 Next.js 中使用 Redux？

**A:** 需要在客户端组件中使用 Provider：

```typescript
'use client';
import { Provider } from 'react-redux';
import { store } from '@/stores/reduxStore';

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
```

---

## 📚 更多资源

### 官方文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

### 状态管理文档

- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Recoil 文档](https://recoiljs.org/)
- [SWR 文档](https://swr.vercel.app/)

---

## 💬 反馈与贡献

如果发现错误或有改进建议，欢迎提交 Issue 或 Pull Request！

---

**记住：**
> 学习编程最重要的是动手实践。不要只看文档，一定要运行代码，修改代码，观察效果！

**加油！你可以的！** 🚀
