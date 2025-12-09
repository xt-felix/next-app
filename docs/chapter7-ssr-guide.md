# 第七章：服务端渲染 (SSR) 深度探究

> 🎯 **学习目标**：从零开始学习 Next.js 服务端渲染（SSR），掌握 `getServerSideProps`、中间件、权限控制等企业级实战技能。

## 📚 目录

- [什么是 SSR？](#什么是-ssr)
- [快速开始](#快速开始)
- [核心概念](#核心概念)
- [项目结构](#项目结构)
- [功能演示](#功能演示)
- [代码详解](#代码详解)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 什么是 SSR？

### 🤔 用简单的话解释

想象你去一家餐厅点餐：

- **SSR（服务端渲染）**：厨师在后厨把菜做好，直接端上桌，你可以立即享用。
- **CSR（客户端渲染）**：厨师只给你原材料和菜谱，你需要自己在桌上做菜，做好后才能吃。

在网页中：
- **SSR**：服务器生成完整的 HTML，浏览器直接显示，速度快！
- **CSR**：服务器只返回空白页面和 JavaScript，浏览器执行 JS 后才显示内容。

### ✅ SSR 的优势

| 优势 | 说明 | 适用场景 |
|------|------|----------|
| ⚡ **首屏加载快** | 用户立即看到内容，无需等待 JavaScript | 新闻网站、电商首页 |
| 🔍 **SEO 友好** | 搜索引擎能抓取完整内容 | 博客、产品页面 |
| 🔄 **实时数据** | 每次请求获取最新数据 | 股票行情、天气信息 |
| 🛡️ **更安全** | API 密钥等敏感信息不暴露给客户端 | 用户仪表盘、后台管理 |

### ❌ SSR 的劣势

- 服务器压力大（每次请求都要渲染）
- 复杂交互仍需客户端 JavaScript
- 开发成本相对较高

---

## 快速开始

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

### 3️⃣ 访问项目

打开浏览器访问：[http://localhost:3000](http://localhost:3000)

### 4️⃣ 体验 SSR 功能

1. **登录页面**：[http://localhost:3000/ssr-login](http://localhost:3000/ssr-login)
   - 选择不同身份登录（Admin / User / Guest）

2. **新闻列表**：[http://localhost:3000/ssr-news](http://localhost:3000/ssr-news)
   - 查看 SSR 渲染的新闻内容
   - 注意页面上的时间戳（每次刷新都会更新）

3. **用户仪表盘**：[http://localhost:3000/ssr-dashboard](http://localhost:3000/ssr-dashboard)
   - 需要 Admin 或 User 权限
   - Guest 用户会被重定向到 403 页面

---

## 核心概念

### 🔑 getServerSideProps

`getServerSideProps` 是 Next.js 提供的服务端数据获取函数，它在**每次页面请求**时都会在服务端执行。

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  // ✅ 这段代码在服务端执行
  // ✅ 可以访问数据库、文件系统、环境变量
  // ✅ 可以读取 Cookie、请求头等

  const data = await fetchData(); // 获取数据

  return {
    props: { data }, // 将数据传递给页面组件
  };
};
```

### 🎯 执行时机

```
用户访问页面
    ↓
服务端执行 getServerSideProps
    ↓
获取数据
    ↓
生成完整的 HTML
    ↓
返回给浏览器
    ↓
浏览器立即显示内容
```

### 📦 Context 对象

`getServerSideProps` 的 `context` 参数包含丰富的请求信息：

```typescript
export const getServerSideProps = async (context) => {
  context.req        // Node.js 请求对象（可读取 Cookie）
  context.res        // Node.js 响应对象（可设置 Header）
  context.query      // URL 查询参数：?id=123 → { id: '123' }
  context.params     // 动态路由参数：/post/[id] → { id: '...' }
  context.resolvedUrl // 完整的请求 URL

  return { props: {} };
};
```

### 🔄 返回值类型

`getServerSideProps` 可以返回三种结果：

#### 1. 返回 props（正常渲染）

```typescript
return {
  props: {
    data: '数据内容'
  }
};
```

#### 2. 返回 redirect（重定向）

```typescript
return {
  redirect: {
    destination: '/login',  // 重定向目标
    permanent: false,       // 是否永久重定向（SEO）
  }
};
```

#### 3. 返回 notFound（404 页面）

```typescript
return {
  notFound: true  // 显示 404 页面
};
```

---

## 项目结构

```
next-app/
├── pages/                    # 页面路由
│   ├── ssr-login.tsx        # 登录页面
│   ├── ssr-news.tsx         # 新闻列表（SSR）
│   ├── ssr-dashboard.tsx    # 用户仪表盘（权限控制）
│   ├── ssr-403.tsx          # 403 禁止访问
│   └── ssr-error.tsx        # 错误页面
│
├── middlewares/             # SSR 中间件
│   └── ssr.ts               # 鉴权、权限控制中间件
│
├── utils/                   # 工具函数
│   └── auth.ts              # 身份验证工具
│
├── data/                    # 模拟数据
│   ├── news.ts              # 新闻数据
│   └── users.ts             # 用户数据
│
├── types/                   # TypeScript 类型定义
│   └── index.ts
│
└── styles/                  # 样式文件
    ├── Login.module.css
    ├── News.module.css
    ├── Dashboard.module.css
    └── Error.module.css
```

---

## 功能演示

### 1. 登录系统

#### 📍 页面：`/ssr-login`

![登录页面](https://via.placeholder.com/800x400?text=Login+Page)

**功能**：
- 提供 3 种角色选择：Admin、User、Guest
- 登录后设置 Cookie（模拟真实登录）
- 支持登录后跳转回原页面

**代码示例**：

```typescript
// pages/ssr-login.tsx
const handleLogin = async () => {
  // 设置 Cookie
  document.cookie = `token=${token}; path=/; max-age=86400`;

  // 跳转到目标页面
  router.push(redirect);
};
```

### 2. 新闻列表（SSR）

#### 📍 页面：`/ssr-news`

![新闻列表](https://via.placeholder.com/800x400?text=News+List)

**功能**：
- 使用 `getServerSideProps` 服务端渲染
- 展示实时新闻数据
- 每次刷新都更新时间戳（证明是 SSR）
- 使用 `withAuth` 中间件保护页面

**核心代码**：

```typescript
// pages/ssr-news.tsx
export const getServerSideProps = withAuth(async (context) => {
  // 1. 获取当前用户
  const user = getCurrentUser(context.req);

  // 2. 获取新闻数据
  const newsList = await fetchNewsList();

  // 3. 生成时间戳
  const timestamp = new Date().toLocaleString('zh-CN');

  return {
    props: { newsList, user, timestamp }
  };
});
```

**亮点**：
- ⏰ 显示服务端渲染时间，证明每次请求都是实时的
- 🔐 未登录用户自动跳转到登录页
- 📊 展示新闻的作者、日期、浏览量等信息

### 3. 用户仪表盘（权限控制）

#### 📍 页面：`/ssr-dashboard`

![用户仪表盘](https://via.placeholder.com/800x400?text=Dashboard)

**功能**：
- 使用 `withRole` 中间件限制访问权限
- 只有 Admin 和 User 可以访问
- Guest 用户会被重定向到 403 页面
- 展示用户统计数据和最近活动

**核心代码**：

```typescript
// pages/ssr-dashboard.tsx
export const getServerSideProps = withRole(
  ['admin', 'user'],  // 允许的角色
  async (context) => {
    const user = getCurrentUser(context.req);
    const stats = await fetchUserStats(user.id);

    return { props: { user, stats } };
  }
);
```

**权限控制流程**：

```
用户访问仪表盘
    ↓
withRole 中间件检查权限
    ↓
[Admin/User]     [Guest]
    ↓               ↓
显示仪表盘      重定向到 403
```

---

## 代码详解

### 🔐 鉴权中间件：withAuth

**作用**：保护需要登录才能访问的页面。

```typescript
// middlewares/ssr.ts
export function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    // 检查用户是否已登录
    if (!checkLogin(context.req)) {
      // 未登录 → 重定向到登录页
      return {
        redirect: {
          destination: `/ssr-login?redirect=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    // 已登录 → 继续执行原函数
    return await getServerSidePropsFunc(context);
  };
}
```

**使用方法**：

```typescript
export const getServerSideProps = withAuth(async (context) => {
  // 这里的代码只有登录用户才能执行
  return { props: { data: '受保护的数据' } };
});
```

### 🛡️ 权限控制中间件：withRole

**作用**：基于角色的权限控制。

```typescript
// middlewares/ssr.ts
export function withRole(roles, getServerSidePropsFunc) {
  return async (context) => {
    // 1. 检查是否登录
    if (!checkLogin(context.req)) {
      return { redirect: { destination: '/ssr-login', permanent: false } };
    }

    // 2. 获取用户信息
    const user = getCurrentUser(context.req);

    // 3. 检查用户角色
    if (!user || !roles.includes(user.role)) {
      return { redirect: { destination: '/ssr-403', permanent: false } };
    }

    // 4. 权限验证通过
    return await getServerSidePropsFunc(context);
  };
}
```

**使用方法**：

```typescript
// 只允许 admin 访问
export const getServerSideProps = withRole(['admin'], async (ctx) => {
  return { props: { data: '管理员专属数据' } };
});

// 允许 admin 和 user 访问
export const getServerSideProps = withRole(['admin', 'user'], async (ctx) => {
  return { props: { data: '用户数据' } };
});
```

### 🔄 错误处理中间件：withErrorHandling

**作用**：自动捕获 SSR 错误，避免页面崩溃。

```typescript
// middlewares/ssr.ts
export function withErrorHandling(getServerSidePropsFunc) {
  return async (context) => {
    try {
      return await getServerSidePropsFunc(context);
    } catch (error) {
      console.error('SSR Error:', error);

      // 重定向到错误页面
      return {
        redirect: {
          destination: '/ssr-error?message=' + error.message,
          permanent: false,
        },
      };
    }
  };
}
```

### 🎨 组合多个中间件

```typescript
// 方式 1：嵌套调用
export const getServerSideProps = withErrorHandling(
  withAuth(async (ctx) => {
    // 业务逻辑
  })
);

// 方式 2：使用 compose 函数
export const getServerSideProps = compose(
  withErrorHandling,
  withAuth,
  async (ctx) => {
    // 业务逻辑
  }
);
```

---

## 最佳实践

### ✅ 1. 性能优化

#### 设置缓存头

```typescript
export const getServerSideProps = async (context) => {
  // 设置缓存策略
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  return { props: { data } };
};
```

**缓存策略说明**：
- `public`：允许 CDN 缓存
- `s-maxage=10`：CDN 缓存 10 秒
- `stale-while-revalidate=59`：允许返回过期数据，同时在后台更新

#### 并发获取数据

```typescript
export const getServerSideProps = async (context) => {
  // ❌ 不好：串行获取数据（慢）
  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  // ✅ 推荐：并发获取数据（快）
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);

  return { props: { user, posts, comments } };
};
```

### ✅ 2. 安全实践

#### 敏感信息不要传给客户端

```typescript
export const getServerSideProps = async (context) => {
  const user = await fetchUser();

  // ❌ 不要这样做
  return {
    props: {
      user,  // 可能包含敏感信息（密码哈希、密钥等）
    }
  };

  // ✅ 只传递必要的信息
  return {
    props: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // 不包含敏感字段
      }
    }
  };
};
```

#### Cookie 安全配置

```typescript
// 生产环境应该使用 httpOnly cookie
document.cookie = `token=${token}; path=/; max-age=86400; httpOnly; secure; sameSite=strict`;
```

### ✅ 3. 错误处理

```typescript
export const getServerSideProps = async (context) => {
  try {
    const data = await fetchData();

    // 数据不存在 → 返回 404
    if (!data) {
      return { notFound: true };
    }

    return { props: { data } };
  } catch (error) {
    console.error('SSR Error:', error);

    // 错误处理 → 返回空数据或重定向
    return {
      props: { data: null, error: error.message }
    };
  }
};
```

### ✅ 4. TypeScript 类型安全

```typescript
import { GetServerSideProps } from 'next';

// 定义 Props 类型
interface PageProps {
  user: User;
  data: Data[];
}

// 使用泛型确保类型安全
export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  // TypeScript 会自动检查返回值类型
  return {
    props: {
      user: await fetchUser(),
      data: await fetchData(),
    }
  };
};

// 页面组件也会得到类型推断
export default function Page({ user, data }: PageProps) {
  // ...
}
```

---

## 常见问题

### ❓ 1. getServerSideProps 什么时候执行？

**答**：每次页面请求时都会执行，包括：
- 直接访问页面（浏览器地址栏输入）
- 页面刷新（F5）
- 客户端路由跳转（`next/link` 或 `router.push`）

### ❓ 2. getServerSideProps 能访问什么？

**答**：可以访问服务端资源：
- ✅ 数据库
- ✅ 文件系统
- ✅ 环境变量（`process.env`）
- ✅ Node.js API
- ❌ 浏览器 API（`window`、`document` 等）

### ❓ 3. SSR vs SSG 该如何选择？

| 场景 | 推荐方案 | 理由 |
|------|----------|------|
| 博客文章 | SSG (`getStaticProps`) | 内容不常变，构建时生成 |
| 新闻列表 | SSR (`getServerSideProps`) | 需要实时数据 |
| 用户仪表盘 | SSR | 需要鉴权和个性化数据 |
| 产品列表 | SSG + ISR | 静态页面 + 增量更新 |

### ❓ 4. 如何调试 getServerSideProps？

```typescript
export const getServerSideProps = async (context) => {
  console.log('这会输出到终端（服务端）');
  console.log('请求路径:', context.resolvedUrl);
  console.log('Cookie:', context.req.headers.cookie);

  return { props: {} };
};
```

**查看日志**：打开终端（运行 `npm run dev` 的窗口）。

### ❓ 5. 为什么页面时间戳不更新？

**答**：可能是浏览器缓存。解决方法：
1. 打开浏览器开发者工具（F12）
2. 勾选 "Disable cache"
3. 刷新页面

### ❓ 6. 如何测试不同角色？

1. 访问 `/ssr-login` 登录页面
2. 选择不同角色：
   - **Admin**：可以访问所有页面
   - **User**：可以访问新闻和仪表盘
   - **Guest**：只能访问新闻，仪表盘会跳转到 403
3. 点击"立即登录"

---

## 实战练习

### 练习 1：添加分页功能

在新闻列表页面添加分页功能：

```typescript
export const getServerSideProps = withAuth(async (context) => {
  const page = parseInt(context.query.page as string) || 1;
  const pageSize = 5;

  const newsList = await fetchNewsList();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagedNews = newsList.slice(start, end);

  return {
    props: {
      newsList: pagedNews,
      currentPage: page,
      totalPages: Math.ceil(newsList.length / pageSize),
    }
  };
});
```

### 练习 2：添加搜索功能

根据关键词搜索新闻：

```typescript
export const getServerSideProps = withAuth(async (context) => {
  const keyword = context.query.q as string;

  let newsList = await fetchNewsList();

  if (keyword) {
    newsList = newsList.filter(news =>
      news.title.includes(keyword) ||
      news.content.includes(keyword)
    );
  }

  return { props: { newsList, keyword } };
});
```

### 练习 3：添加新角色

添加一个 "Editor"（编辑）角色，可以访问特定页面：

```typescript
// utils/auth.ts
const userMap = {
  'editor-token': {
    id: 4,
    username: 'editor',
    email: 'editor@example.com',
    role: 'editor',
  },
  // ...
};

// pages/ssr-editor-panel.tsx
export const getServerSideProps = withRole(['admin', 'editor'], async (ctx) => {
  // 编辑面板逻辑
});
```

---

## 技术栈

- **框架**：Next.js 15+ (Pages Router)
- **语言**：TypeScript
- **样式**：CSS Modules
- **状态管理**：原生 React State
- **路由**：Next.js File-based Routing

---

## 学习路线

```
第一步：理解 SSR 基本概念
    ↓
第二步：掌握 getServerSideProps
    ↓
第三步：学习中间件模式
    ↓
第四步：实现权限控制
    ↓
第五步：优化性能和安全
    ↓
第六步：实战项目练习
```

---

## 下一步

学完本章后，你可以：

1. ✅ 理解 SSR 的工作原理和适用场景
2. ✅ 熟练使用 `getServerSideProps` 获取数据
3. ✅ 实现基于 Cookie 的身份验证
4. ✅ 使用中间件实现权限控制
5. ✅ 掌握 SSR 性能优化技巧
6. ✅ 处理 SSR 常见错误

**推荐下一章**：学习 API Routes，构建全栈应用！

---

## 资源链接

- [Next.js 官方文档](https://nextjs.org/docs)
- [getServerSideProps 详解](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props)
- [Next.js 中文教程](https://www.nextjs.cn/)

---

## 反馈与贡献

如果你在学习过程中遇到问题，或者有好的建议，欢迎：

- 提交 Issue
- 发起 Pull Request
- 在项目中提问

**祝你学习愉快！** 🎉
