# 快速开始指南

## 安装依赖

所有必要的依赖已在 `package.json` 中配置：

```bash
npm install
```

已安装的状态管理库：
- `zustand` - 轻量级状态管理
- `@reduxjs/toolkit` - Redux Toolkit
- `react-redux` - React Redux 绑定
- `recoil` - 原子化状态管理
- `swr` - 异步数据获取

## 运行项目

```bash
npm run dev
```

访问 `http://localhost:3000/16-state-management` 查看所有示例。

## 示例列表

### 1. Zustand - 主题切换
**路径：** `/16-state-management/theme`

演示 Zustand 的基本用法和持久化功能。

### 2. Redux Toolkit - 用户管理
**路径：** `/16-state-management/redux`

演示 Redux Toolkit 的企业级状态管理。

### 3. Recoil - 原子化状态
**路径：** `/16-state-management/recoil`

演示 Recoil 的原子化状态管理。

### 4. SWR - 异步数据
**路径：** `/16-state-management/swr`

演示 SWR 的异步数据获取和缓存。

### 5. 实时通知中心
**路径：** `/16-state-management/notification`

完整的实战项目，包含：
- Zustand 状态管理
- WebSocket 实时推送
- 消息列表管理
- 未读计数

### 6. 多标签同步
**路径：** `/16-state-management/broadcast`

演示 BroadcastChannel API 实现多标签页同步。

### 7. 权限控制
**路径：** `/16-state-management/permission`

演示基于角色的权限管理（RBAC）。

### 8. 国际化
**路径：** `/16-state-management/i18n`

演示多语言状态管理。

## 代码结构

```
stores/                    # 状态管理 Store
  theme.ts                 # Zustand 主题管理
  userSlice.ts             # Redux Toolkit 用户状态
  atoms.ts                 # Recoil 原子状态
  notification.ts          # 通知中心状态
  permission.ts            # 权限状态
  i18n.ts                  # 国际化状态
  reduxStore.ts            # Redux Store 配置

components/
  state-management/        # 状态管理相关组件
    ThemeToggle.tsx        # 主题切换组件
    UserProfile.tsx        # Redux 用户信息组件
    Counter.tsx            # Recoil 计数器组件
    UserProfileSWR.tsx     # SWR 用户信息组件
    NotificationBell.tsx   # 通知铃铛组件
    NotificationList.tsx  # 通知列表组件
    ProtectedButton.tsx    # 权限保护按钮
    ReduxProvider.tsx      # Redux Provider
    RecoilProvider.tsx     # Recoil Provider

hooks/
  useBroadcast.ts          # BroadcastChannel Hook
  useWebSocket.ts          # WebSocket Hook

app/
  16-state-management/     # 示例页面
    page.tsx               # 首页
    theme/page.tsx         # 主题示例
    redux/page.tsx         # Redux 示例
    recoil/page.tsx        # Recoil 示例
    swr/page.tsx           # SWR 示例
    notification/page.tsx  # 通知中心
    broadcast/page.tsx     # 多标签同步
    permission/page.tsx    # 权限控制
    i18n/page.tsx          # 国际化

docs/
  16-state-management/
    README.md              # 完整文档
    QUICKSTART.md          # 快速开始指南
```

## 使用示例

### Zustand 基本用法

```typescript
import { useThemeStore } from '@/stores/theme';

function MyComponent() {
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);

  return (
    <button onClick={toggle}>
      当前主题：{mode}
    </button>
  );
}
```

### Redux Toolkit 基本用法

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/stores/userSlice';

function MyComponent() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(setUser({ name: '张三', role: 'admin', token: 'xxx' }))}>
      登录
    </button>
  );
}
```

### SWR 基本用法

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function MyComponent() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return <div>{data.name}</div>;
}
```

## 注意事项

1. **Redux 和 Recoil 需要 Provider**
   - Redux 需要在页面中使用 `<ReduxProvider>` 包裹
   - Recoil 需要在页面中使用 `<RecoilProvider>` 包裹

2. **Zustand 无需 Provider**
   - 可以直接使用，适合快速开发

3. **服务端渲染**
   - 所有状态管理库都支持 SSR
   - 注意在客户端组件中使用（添加 `'use client'`）

4. **类型安全**
   - 所有 Store 都使用 TypeScript 定义
   - 避免使用 `any` 类型

## 下一步

查看 [完整文档](./README.md) 了解更多细节和最佳实践。

