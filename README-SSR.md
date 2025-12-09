# 第七章：SSR 深度探究 - 完整项目

> 🎯 从零开始学习 Next.js 服务端渲染（SSR），掌握企业级开发技能

## 🚀 快速开始

### 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问项目
打开浏览器访问 http://localhost:3000
```

### 体验 SSR 功能

1. **首页** → 点击"第七章：SSR"卡片
2. **登录页面** → 选择角色登录（Admin / User / Guest）
3. **新闻列表** → 查看 SSR 渲染的实时数据
4. **用户仪表盘** → 体验权限控制（Guest 无法访问）

---

## 📖 完整教程

详细的学习指南请查看：[第七章：SSR 深度探究](./docs/chapter7-ssr-guide.md)

---

## 🎯 项目结构

```
next-app/
├── pages/                      # Pages Router（SSR 页面）
│   ├── ssr-login.tsx          # 登录页面
│   ├── ssr-news.tsx           # 新闻列表（SSR）
│   ├── ssr-dashboard.tsx      # 用户仪表盘（权限控制）
│   ├── ssr-403.tsx            # 403 禁止访问
│   └── ssr-error.tsx          # 错误页面
│
├── middlewares/                # SSR 中间件
│   └── ssr.ts                 # withAuth、withRole、withErrorHandling
│
├── utils/                      # 工具函数
│   └── auth.ts                # 身份验证工具
│
├── data/                       # 模拟数据
│   ├── news.ts                # 新闻数据
│   └── users.ts               # 用户数据
│
├── types/                      # TypeScript 类型
│   └── index.ts
│
├── styles/                     # 样式文件
│   ├── Login.module.css
│   ├── News.module.css
│   ├── Dashboard.module.css
│   └── Error.module.css
│
└── docs/                       # 文档
    └── chapter7-ssr-guide.md  # 完整学习指南
```

---

## ✨ 核心功能

### 🔐 登录系统

- **页面**：`/ssr-login`
- **功能**：
  - 选择角色登录（Admin / User / Guest）
  - Cookie 身份验证
  - 自动跳转到原页面

### 📰 新闻列表（SSR）

- **页面**：`/ssr-news`
- **功能**：
  - 服务端实时渲染
  - 显示渲染时间戳（证明 SSR）
  - 8 条模拟新闻数据
  - 需要登录访问

**核心代码**：

```typescript
export const getServerSideProps = withAuth(async (context) => {
  const user = getCurrentUser(context.req);
  const newsList = await fetchNewsList();
  const timestamp = new Date().toLocaleString('zh-CN');

  return { props: { newsList, user, timestamp } };
});
```

### 📊 用户仪表盘（权限控制）

- **页面**：`/ssr-dashboard`
- **功能**：
  - 基于角色的权限控制
  - 只有 Admin 和 User 可访问
  - Guest 会被重定向到 403
  - 显示用户统计数据

**核心代码**：

```typescript
export const getServerSideProps = withRole(
  ['admin', 'user'],  // 允许的角色
  async (context) => {
    const user = getCurrentUser(context.req);
    const stats = await fetchUserStats(user.id);
    return { props: { user, stats } };
  }
);
```

---

## 🔧 核心技术

### SSR 中间件

#### withAuth（登录验证）

```typescript
export function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    if (!checkLogin(context.req)) {
      return {
        redirect: {
          destination: '/ssr-login',
          permanent: false,
        },
      };
    }
    return await getServerSidePropsFunc(context);
  };
}
```

#### withRole（角色权限）

```typescript
export function withRole(roles, getServerSidePropsFunc) {
  return async (context) => {
    const user = getCurrentUser(context.req);
    if (!user || !roles.includes(user.role)) {
      return {
        redirect: {
          destination: '/ssr-403',
          permanent: false,
        },
      };
    }
    return await getServerSidePropsFunc(context);
  };
}
```

---

## 🎨 页面展示

### 登录页面

- 选择用户角色
- 显示权限说明
- 登录后跳转

### 新闻列表

- 服务端渲染
- 实时数据
- 时间戳更新
- 用户信息展示

### 用户仪表盘

- 用户信息卡片
- 统计数据展示
- 最近活动列表
- 权限控制说明

---

## 📚 学习路线

```
1. 理解 SSR 概念
   ↓
2. 学习 getServerSideProps
   ↓
3. 实现身份验证
   ↓
4. 掌握中间件模式
   ↓
5. 实现权限控制
   ↓
6. 性能优化与安全
```

---

## 💡 测试账号

### SSR 登录测试

| 角色  | 权限说明       | 能访问的页面          |
|-------|----------------|----------------------|
| Admin | 全部权限       | 新闻列表 + 仪表盘    |
| User  | 部分权限       | 新闻列表 + 仪表盘    |
| Guest | 有限权限       | 仅新闻列表           |

### 商城登录测试

| 用户     | 密码     | 权限   |
|----------|----------|--------|
| admin    | admin123 | 管理员 |
| user     | user123  | 普通用户|

---

## 🔍 核心知识点

### 1. getServerSideProps

- 每次请求都在服务端执行
- 可以访问数据库、环境变量
- 支持 redirect 和 notFound

### 2. Context 对象

```typescript
context.req        // Node.js 请求对象
context.res        // Node.js 响应对象
context.query      // URL 查询参数
context.params     // 动态路由参数
context.resolvedUrl // 完整 URL
```

### 3. 返回值类型

```typescript
// 返回 props
return { props: { data } };

// 重定向
return {
  redirect: {
    destination: '/login',
    permanent: false,
  }
};

// 404
return { notFound: true };
```

---

## 🎯 实战练习

### 练习 1：添加分页

在新闻列表添加分页功能：

```typescript
const page = parseInt(context.query.page as string) || 1;
const pageSize = 5;
// 实现分页逻辑...
```

### 练习 2：添加搜索

根据关键词搜索新闻：

```typescript
const keyword = context.query.q as string;
if (keyword) {
  newsList = newsList.filter(news =>
    news.title.includes(keyword)
  );
}
```

### 练习 3：添加缓存

设置 HTTP 缓存头：

```typescript
context.res.setHeader(
  'Cache-Control',
  'public, s-maxage=10, stale-while-revalidate=59'
);
```

---

## 🔗 相关链接

- [完整学习指南](./docs/chapter7-ssr-guide.md) - 零基础详细教程
- [Next.js 官方文档](https://nextjs.org/docs)
- [getServerSideProps 详解](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props)

---

## 📋 技术栈

- **框架**：Next.js 15+ (Pages Router)
- **语言**：TypeScript
- **样式**：CSS Modules
- **状态管理**：React State
- **路由**：File-based Routing

---

## ✅ 完成清单

- [x] 理解 SSR 基本概念
- [x] 掌握 getServerSideProps
- [x] 实现登录系统
- [x] 使用中间件模式
- [x] 实现权限控制
- [x] 错误处理
- [x] 性能优化
- [x] 移动端适配
- [x] 完整文档

---

## 🎉 下一步

学完本章后，你已经掌握：

1. ✅ SSR 的工作原理和适用场景
2. ✅ getServerSideProps 的使用方法
3. ✅ 基于 Cookie 的身份验证
4. ✅ 中间件模式实现权限控制
5. ✅ SSR 性能优化技巧
6. ✅ 错误处理与安全防护

**推荐下一章**：学习 App Router 和 React Server Components！

---

**祝你学习愉快！** 🚀
