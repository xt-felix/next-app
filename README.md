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

#### 📋 项目概述

实时通知中心是一个企业级功能模块，展示如何结合 Zustand 状态管理和 WebSocket 实时通信，构建一个完整的实时通知系统。本项目涵盖了从状态管理、实时推送、UI 交互到后端协作的全流程实现。

**项目特点：**
- 🚀 **实时性**：WebSocket 实时推送，毫秒级响应
- 📊 **状态管理**：Zustand 全局状态，自动同步
- 🎨 **用户体验**：未读计数、标记已读、时间格式化
- 📱 **响应式**：移动端适配，无障碍支持
- 🔄 **数据同步**：前后端状态同步，多标签页支持

#### 🎯 需求分析

##### 业务场景

1. **用户收到新消息**
   - 系统推送通知到用户
   - 通知铃铛显示未读数量
   - 用户点击查看详情

2. **用户处理通知**
   - 标记单个通知为已读
   - 一键标记全部为已读
   - 删除不需要的通知

3. **实时更新**
   - 新通知实时推送到前端
   - 多标签页状态同步
   - 离线后重新连接自动同步

##### 功能清单

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 通知列表展示 | P0 | 显示所有通知，支持滚动 |
| 未读计数 | P0 | 实时显示未读消息数量 |
| 标记已读 | P0 | 单个/批量标记为已读 |
| WebSocket 推送 | P0 | 实时接收新通知 |
| 删除通知 | P1 | 删除不需要的通知 |
| 时间格式化 | P1 | 显示相对时间（刚刚、5分钟前） |
| 通知类型 | P1 | 区分 info、success、warning、error |
| 历史消息加载 | P2 | 初始化时加载历史消息 |
| 多标签同步 | P2 | BroadcastChannel 同步状态 |
| 国际化支持 | P2 | 多语言切换 |

#### 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                   实时通知中心架构                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  前端层（React + Next.js）                              │
│  ┌──────────────────────────────────────────────┐    │
│  │  NotificationBell (通知铃铛)                  │    │
│  │  - 显示未读数量                                │    │
│  │  - 点击展开列表                                │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  NotificationList (通知列表)                   │    │
│  │  - 渲染通知列表                                │    │
│  │  - 标记已读/删除操作                           │    │
│  └──────────────────────────────────────────────┘    │
│                                                         │
│  状态管理层（Zustand）                                  │
│  ┌──────────────────────────────────────────────┐    │
│  │  useNotificationStore                         │    │
│  │  - list: 通知列表                             │    │
│  │  - unread: 未读计数                           │    │
│  │  - add/markRead/remove 等方法                 │    │
│  └──────────────────────────────────────────────┘    │
│                                                         │
│  实时通信层（WebSocket）                                │
│  ┌──────────────────────────────────────────────┐    │
│  │  useWebSocket Hook                            │    │
│  │  - 自动连接/重连                              │    │
│  │  - 消息解析和分发                             │    │
│  └──────────────────────────────────────────────┘    │
│                                                         │
│  后端层（API + WebSocket Server）                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  /api/notifications                          │    │
│  │  - GET: 获取历史消息                          │    │
│  │  - POST: 标记已读                            │    │
│  │  - DELETE: 删除通知                          │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  WebSocket Server                            │    │
│  │  - 推送新通知                                │    │
│  │  - 连接管理                                  │    │
│  └──────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 📁 目录结构

```
next-app/
├── stores/
│   └── notification.ts              # 通知状态管理 Store
│
├── hooks/
│   └── useWebSocket.ts               # WebSocket Hook（自动重连、消息处理）
│
├── components/
│   └── state-management/
│       ├── NotificationBell.tsx       # 通知铃铛组件（未读计数、展开/收起）
│       └── NotificationList.tsx       # 通知列表组件（列表渲染、操作按钮）
│
├── app/
│   └── 16-state-management/
│       └── notification/
│           └── page.tsx               # 通知中心页面（整合所有功能）
│
└── app/api/                           # 后端 API（可选）
    └── notifications/
        ├── route.ts                   # GET: 获取历史消息
        ├── read/route.ts              # POST: 标记已读
        └── [id]/route.ts              # DELETE: 删除通知
```

#### 🔄 数据流说明

**1. 初始化流程：**
```
页面加载
  ↓
useEffect 执行
  ↓
调用 API 获取历史消息
  ↓
setList() 更新 Store
  ↓
组件自动重渲染显示列表
```

**2. 实时推送流程：**
```
后端推送新通知
  ↓
WebSocket 接收消息
  ↓
useWebSocket onMessage 回调
  ↓
add() 添加到 Store
  ↓
未读计数自动更新
  ↓
NotificationBell 显示新数量
```

**3. 标记已读流程：**
```
用户点击"已读"按钮
  ↓
handleMarkRead() 执行
  ↓
markRead() 更新 Store（乐观更新）
  ↓
调用 API 同步到后端
  ↓
UI 立即更新（已读样式）
```

#### 💻 完整代码实现

##### 步骤 1：定义通知数据模型

**文件：** `stores/notification.ts`

```typescript
import { create } from 'zustand';

/**
 * 通知数据模型
 * 
 * 设计要点：
 * - id: 唯一标识，用于更新和删除
 * - content: 通知内容，支持富文本
 * - read: 已读状态，用于过滤和计数
 * - timestamp: 时间戳，用于排序和显示
 * - type: 通知类型，用于样式区分
 */
export interface Notification {
  id: string;
  content: string;
  read: boolean;
  timestamp: number;
  type?: 'info' | 'success' | 'warning' | 'error';
}

/**
 * 通知状态接口
 * 
 * 状态设计：
 * - list: 通知列表，按时间倒序排列
 * - unread: 未读计数，自动计算，避免手动维护
 */
interface NotificationState {
  list: Notification[];
  unread: number;
  
  // 操作方法
  add: (notification: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  setList: (list: Notification[]) => void;
  clear: () => void;
}

/**
 * Zustand 通知状态管理
 * 
 * 核心优势：
 * 1. 轻量级，无需 Provider
 * 2. TypeScript 类型安全
 * 3. 自动计算未读计数，避免状态不一致
 * 4. 支持在组件外调用（如 WebSocket 回调）
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  list: [],
  unread: 0,
  
  /**
   * 添加新通知
   * 
   * 实现要点：
   * - 新通知插入到列表开头（时间倒序）
   * - 自动计算未读数量
   * - 支持批量添加（通过 setList）
   */
  add: (notification) =>
    set((state) => {
      const newList = [notification, ...state.list];
      return {
        list: newList,
        unread: newList.filter((n) => !n.read).length,
      };
    }),
  
  /**
   * 标记单个通知为已读
   * 
   * 实现要点：
   * - 使用 map 更新特定项
   * - 重新计算未读数量
   * - 保持列表顺序不变
   */
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
  
  /**
   * 标记所有通知为已读
   * 
   * 实现要点：
   * - 批量更新所有项
   * - 未读数量归零
   */
  markAllRead: () =>
    set((state) => ({
      list: state.list.map((n) => ({ ...n, read: true })),
      unread: 0,
    })),
  
  /**
   * 删除通知
   * 
   * 实现要点：
   * - 使用 filter 移除特定项
   * - 重新计算未读数量
   */
  remove: (id) =>
    set((state) => {
      const list = state.list.filter((n) => n.id !== id);
      return {
        list,
        unread: list.filter((n) => !n.read).length,
      };
    }),
  
  /**
   * 设置通知列表（用于初始化）
   * 
   * 使用场景：
   * - 页面加载时获取历史消息
   * - 从后端同步数据
   */
  setList: (list) =>
    set({
      list,
      unread: list.filter((n) => !n.read).length,
    }),
  
  /**
   * 清空所有通知
   * 
   * 使用场景：
   * - 用户登出
   * - 清除缓存
   */
  clear: () =>
    set({
      list: [],
      unread: 0,
    }),
}));
```

##### 步骤 2：实现 WebSocket Hook

**文件：** `hooks/useWebSocket.ts`

```typescript
import { useEffect, useRef } from 'react';

interface UseWebSocketOptions {
  onMessage?: (data: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;      // 重连间隔（毫秒）
  reconnectAttempts?: number;       // 最大重连次数
}

/**
 * WebSocket Hook
 * 
 * 功能特性：
 * 1. 自动连接和重连
 * 2. 消息解析和错误处理
 * 3. 生命周期管理（组件卸载时清理）
 * 4. 可配置的重连策略
 * 
 * 使用示例：
 * ```typescript
 * useWebSocket('wss://api/notifications', {
 *   onMessage: (data) => {
 *     console.log('收到消息:', data);
 *   },
 *   reconnectInterval: 3000,
 *   reconnectAttempts: 5,
 * });
 * ```
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

  // 使用 useRef 保存 WebSocket 实例和重连相关状态
  // 避免在 useEffect 依赖中引起不必要的重连
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);

  useEffect(() => {
    // 服务端渲染时不执行
    if (typeof window === 'undefined') {
      return;
    }

    /**
     * 连接函数
     * 
     * 实现要点：
     * - 创建 WebSocket 连接
     * - 绑定事件处理器
     * - 实现自动重连逻辑
     */
    const connect = () => {
      try {
        const ws = new WebSocket(url);

        // 连接成功
        ws.onopen = () => {
          console.log('[WebSocket] 连接成功');
          reconnectCountRef.current = 0; // 重置重连计数
          onOpen?.();
        };

        // 接收消息
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage?.(data);
          } catch (error) {
            console.error('[WebSocket] 消息解析失败:', error);
          }
        };

        // 连接关闭
        ws.onclose = () => {
          console.log('[WebSocket] 连接关闭');
          onClose?.();
          
          // 自动重连逻辑
          if (reconnectCountRef.current < reconnectAttempts) {
            reconnectCountRef.current += 1;
            console.log(`[WebSocket] ${reconnectInterval}ms 后尝试重连 (${reconnectCountRef.current}/${reconnectAttempts})`);
            
            reconnectTimerRef.current = setTimeout(() => {
              connect();
            }, reconnectInterval);
          } else {
            console.error('[WebSocket] 达到最大重连次数，停止重连');
          }
        };

        // 连接错误
        ws.onerror = (error) => {
          console.error('[WebSocket] 连接错误:', error);
          onError?.(error);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('[WebSocket] 连接失败:', error);
      }
    };

    // 开始连接
    connect();

    // 清理函数：组件卸载时关闭连接
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url, reconnectInterval, reconnectAttempts, onMessage, onOpen, onClose, onError]);

  return wsRef.current;
}
```

##### 步骤 3：实现通知铃铛组件

**文件：** `components/state-management/NotificationBell.tsx`

```typescript
'use client';

import { useNotificationStore } from '@/stores/notification';
import { useState } from 'react';
import NotificationList from './NotificationList';

/**
 * 通知铃铛组件
 * 
 * 功能：
 * 1. 显示未读消息数量（红点徽章）
 * 2. 点击展开/收起通知列表
 * 3. 响应式设计，支持移动端
 * 4. 无障碍支持（aria-label）
 * 
 * 设计要点：
 * - 使用相对定位实现下拉菜单
 * - 使用遮罩层实现点击外部关闭
 * - 未读数量超过 99 显示 "99+"
 */
export default function NotificationBell() {
  // 订阅未读数量（按需订阅，性能优化）
  const unread = useNotificationStore((state) => state.unread);
  
  // 控制下拉菜单的显示/隐藏
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 通知铃铛按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`通知${unread > 0 ? `，${unread}条未读` : ''}`}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-2xl">🔔</span>
        
        {/* 未读数量徽章 */}
        {unread > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 遮罩层：点击外部关闭 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* 通知列表容器 */}
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-20">
            <NotificationList onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
```

##### 步骤 4：实现通知列表组件

**文件：** `components/state-management/NotificationList.tsx`

```typescript
'use client';

import { useNotificationStore } from '@/stores/notification';
import { useI18nStore, t } from '@/stores/i18n';

interface NotificationListProps {
  onClose?: () => void;
}

/**
 * 通知列表组件
 * 
 * 功能：
 * 1. 渲染通知列表
 * 2. 标记单个/全部为已读
 * 3. 删除通知
 * 4. 时间格式化显示
 * 5. 国际化支持
 * 
 * 设计要点：
 * - 已读和未读通知使用不同样式区分
 * - 时间显示相对时间（刚刚、5分钟前）
 * - 支持操作按钮（已读、删除）
 */
export default function NotificationList({ onClose }: NotificationListProps) {
  // 订阅状态和方法
  const list = useNotificationStore((state) => state.list);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const remove = useNotificationStore((state) => state.remove);
  const lang = useI18nStore((state) => state.lang);

  /**
   * 标记单个通知为已读
   * 
   * 实现要点：
   * - 乐观更新：立即更新 UI
   * - 后端同步：调用 API 同步状态
   * - 错误处理：失败时回滚（可选）
   */
  const handleMarkRead = async (id: string) => {
    // 乐观更新
    markRead(id);
    
    // 同步到后端（实际项目中取消注释）
    // try {
    //   await fetch('/api/notifications/read', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ id }),
    //   });
    // } catch (error) {
    //   console.error('标记已读失败:', error);
    //   // 可选：回滚状态
    // }
  };

  /**
   * 标记所有通知为已读
   */
  const handleMarkAllRead = async () => {
    markAllRead();
    
    // 同步到后端
    // await fetch('/api/notifications/read-all', {
    //   method: 'POST',
    // });
  };

  /**
   * 时间格式化函数
   * 
   * 显示规则：
   * - < 1分钟：刚刚
   * - < 1小时：X分钟前
   * - < 24小时：X小时前
   * - < 7天：X天前
   * - >= 7天：显示具体日期
   */
  const formatTime = (timestamp: number): string => {
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
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4">
      {/* 头部：标题和全部已读按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {t('notification.title', lang)}
        </h3>
        {list.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {t('notification.markAllRead', lang)}
          </button>
        )}
      </div>

      {/* 通知列表 */}
      {list.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('notification.noNotifications', lang)}
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((notification) => (
            <li
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read
                  ? 'bg-gray-50 dark:bg-gray-900 opacity-60'
                  : 'bg-blue-50 dark:bg-blue-900'
              }`}
            >
              <div className="flex items-start justify-between">
                {/* 通知内容 */}
                <div className="flex-1">
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
                
                {/* 操作按钮 */}
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
```

##### 步骤 5：整合所有功能

**文件：** `app/16-state-management/notification/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useNotificationStore, Notification } from '@/stores/notification';
import { useWebSocket } from '@/hooks/useWebSocket';
import NotificationBell from '@/components/state-management/NotificationBell';
import Link from 'next/link';

/**
 * 实时通知中心页面
 * 
 * 功能整合：
 * 1. WebSocket 实时推送新消息
 * 2. 初始化时加载历史消息
 * 3. 提供模拟添加通知的功能（用于演示）
 * 
 * 数据流：
 * 初始化 → 加载历史消息 → WebSocket 连接 → 接收新消息 → 更新 UI
 */
export default function NotificationPage() {
  // 获取 Store 方法
  const addNotification = useNotificationStore((state) => state.add);
  const setList = useNotificationStore((state) => state.setList);

  /**
   * WebSocket 连接
   * 
   * 实际项目中：
   * - 替换为真实的 WebSocket URL
   * - 添加认证 Token
   * - 处理连接失败的情况
   */
  useWebSocket('wss://echo.websocket.org', {
    onMessage: (data) => {
      // 实际项目中，这里会收到服务器推送的通知
      console.log('[WebSocket] 收到消息:', data);
      
      // 解析并添加到 Store
      // const notification = data as Notification;
      // addNotification(notification);
    },
    onOpen: () => {
      console.log('[WebSocket] 连接已建立');
    },
    onClose: () => {
      console.log('[WebSocket] 连接已关闭');
    },
    onError: (error) => {
      console.error('[WebSocket] 连接错误:', error);
    },
  });

  /**
   * 初始化：加载历史消息
   * 
   * 实际项目中：
   * - 调用 API 获取历史消息
   * - 处理加载失败的情况
   * - 显示加载状态
   */
  useEffect(() => {
    // 模拟 API 调用
    const loadHistory = async () => {
      try {
        // 实际项目中：
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        // setList(data.notifications);
        
        // 模拟数据
        const mockNotifications: Notification[] = [
          {
            id: '1',
            content: '欢迎使用通知中心！',
            read: false,
            timestamp: Date.now() - 60000, // 1分钟前
            type: 'info',
          },
          {
            id: '2',
            content: '您有一条新消息',
            read: false,
            timestamp: Date.now() - 300000, // 5分钟前
            type: 'success',
          },
          {
            id: '3',
            content: '系统维护通知',
            read: true,
            timestamp: Date.now() - 86400000, // 1天前
            type: 'warning',
          },
        ];
        
        setList(mockNotifications);
      } catch (error) {
        console.error('加载历史消息失败:', error);
      }
    };

    loadHistory();
  }, [setList]);

  /**
   * 模拟添加通知（用于演示）
   * 
   * 实际项目中：
   * - 这个功能由 WebSocket 推送触发
   * - 不需要手动添加
   */
  const handleAddNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      content: `新通知 ${new Date().toLocaleTimeString()}`,
      read: false,
      timestamp: Date.now(),
      type: 'info',
    };
    addNotification(notification);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/16-state-management" 
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← 返回
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">实时通知中心</h1>
      
      <div className="space-y-4">
        {/* 功能说明 */}
        <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4">功能说明</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Zustand 状态管理</strong>：全局管理消息数据，自动计算未读计数</li>
            <li><strong>WebSocket 实时推送</strong>：接收服务器推送的新消息，毫秒级响应</li>
            <li><strong>未读计数</strong>：实时显示未读消息数量，支持 99+ 显示</li>
            <li><strong>标记已读</strong>：支持单个和批量标记为已读，状态同步到后端</li>
            <li><strong>时间格式化</strong>：智能显示相对时间（刚刚、5分钟前）</li>
            <li><strong>响应式设计</strong>：完美适配移动端和桌面端</li>
            <li><strong>国际化支持</strong>：多语言切换，用户体验友好</li>
          </ul>
        </div>

        {/* 通知中心操作区 */}
        <div className="flex items-center justify-between p-6 border rounded-lg">
          <h3 className="text-lg font-semibold">通知中心</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddNotification}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              模拟新通知
            </button>
            <NotificationBell />
          </div>
        </div>

        {/* 技术实现说明 */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">技术实现</h3>
          <div className="space-y-2 text-sm">
            <p><strong>状态管理：</strong>使用 Zustand 管理通知列表和未读计数，支持在组件外调用（如 WebSocket 回调）</p>
            <p><strong>实时通信：</strong>使用 WebSocket 接收服务器推送，自动重连机制保证连接稳定</p>
            <p><strong>性能优化：</strong>按需订阅状态，避免不必要的重渲染；使用 useRef 保存 WebSocket 实例</p>
            <p><strong>用户体验：</strong>乐观更新 UI，后端同步在后台进行；时间格式化提升可读性</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 🔌 与后端 API 协作

##### API 接口设计

**1. 获取历史消息**

```typescript
// GET /api/notifications
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { timestamp: 'desc' },
    take: 50, // 最多返回 50 条
  });

  return NextResponse.json({
    success: true,
    data: { notifications },
  });
}
```

**2. 标记已读**

```typescript
// POST /api/notifications/read
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const { id } = await request.json();

  await db.notification.update({
    where: { id, userId: session.user.id },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
```

**3. 删除通知**

```typescript
// DELETE /api/notifications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  await db.notification.delete({
    where: { id: params.id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
```

#### ⚡ 性能优化建议

1. **按需订阅状态**
   ```typescript
   // ✅ 好的做法：只订阅需要的状态
   const unread = useNotificationStore((state) => state.unread);
   
   // ❌ 不好的做法：订阅整个 Store
   const store = useNotificationStore();
   ```

2. **使用 useRef 保存 WebSocket**
   ```typescript
   // ✅ 避免在依赖数组中包含 WebSocket 实例
   const wsRef = useRef<WebSocket | null>(null);
   ```

3. **防抖处理批量操作**
   ```typescript
   // 标记多个通知为已读时，可以批量请求
   const markMultipleRead = debounce((ids: string[]) => {
     fetch('/api/notifications/read-batch', {
       method: 'POST',
       body: JSON.stringify({ ids }),
     });
   }, 300);
   ```

4. **虚拟滚动（大量数据时）**
   ```typescript
   // 使用 react-window 或 react-virtualized
   import { FixedSizeList } from 'react-window';
   ```

#### 🧪 测试建议

1. **单元测试**
   ```typescript
   // stores/notification.test.ts
   import { useNotificationStore } from './notification';
   
   test('添加通知后未读计数增加', () => {
     const store = useNotificationStore.getState();
     store.add({ id: '1', content: 'test', read: false, timestamp: Date.now() });
     expect(store.unread).toBe(1);
   });
   ```

2. **集成测试**
   ```typescript
   // 测试 WebSocket 连接和消息处理
   test('WebSocket 收到消息后添加到 Store', async () => {
     // 模拟 WebSocket 消息
     // 验证 Store 状态更新
   });
   ```

#### ❓ 常见问题

**Q1: WebSocket 连接失败怎么办？**

**A:** 实现自动重连机制，并在 UI 上显示连接状态：

```typescript
const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

useWebSocket(url, {
  onOpen: () => setWsStatus('connected'),
  onClose: () => setWsStatus('disconnected'),
});
```

**Q2: 如何防止重复添加通知？**

**A:** 在 Store 中添加去重逻辑：

```typescript
add: (notification) =>
  set((state) => {
    // 检查是否已存在
    if (state.list.some(n => n.id === notification.id)) {
      return state;
    }
    // 添加新通知
    const newList = [notification, ...state.list];
    return {
      list: newList,
      unread: newList.filter((n) => !n.read).length,
    };
  }),
```

**Q3: 如何实现多标签页同步？**

**A:** 使用 BroadcastChannel API（参考"多标签同步"章节）：

```typescript
// 在 markRead 时广播消息
markRead: (id) => {
  // 更新状态
  // ...
  // 广播到其他标签页
  broadcastMessage('notifications', { type: 'markRead', id });
},
```

#### 🚀 扩展功能建议

1. **通知分类**
   - 按类型筛选（info、success、warning、error）
   - 按时间筛选（今天、本周、本月）

2. **通知设置**
   - 免打扰时间段
   - 通知类型偏好设置

3. **富文本通知**
   - 支持 Markdown
   - 支持图片和链接

4. **通知声音**
   - 播放提示音
   - 自定义提示音

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
