# Next.js SSR 完整教程

> 🎯 **学习目标**：掌握 Next.js 服务端渲染（SSR）的核心概念和实战技能
>
> 📚 **教程特点**：先讲解知识点，再给出代码实现
>
> ⏱️ **学习时间**：建议 3-5 天，每天 2 小时

---

## 📖 目录

- [快速开始](#快速开始)
- [知识点一：什么是 SSR](#知识点一什么是-ssr)
- [知识点二：getServerSideProps 数据获取](#知识点二getserversideprops-数据获取)
- [知识点三：Cookie 身份验证](#知识点三cookie-身份验证)
- [知识点四：中间件模式](#知识点四中间件模式)
- [知识点五：权限控制](#知识点五权限控制)
- [知识点六：错误处理](#知识点六错误处理)
- [完整项目实战](#完整项目实战)
- [常见问题](#常见问题)

---

## 快速开始

### 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 访问页面

1. 打开浏览器访问：http://localhost:3000
2. 点击"第七章：SSR"卡片
3. 选择角色登录（Admin / User / Guest）
4. 体验不同的权限控制效果

---

## 知识点一：什么是 SSR

### 📚 概念讲解

**SSR（Server-Side Rendering，服务端渲染）** 是指在服务器上生成完整的 HTML 页面，然后发送给浏览器。

#### 🍽️ 用餐厅来比喻

**SSR 就像餐厅点菜：**
- 你点一份炒饭
- 厨师在后厨炒好（服务器生成 HTML）
- 服务员直接端上桌（浏览器收到完整页面）
- 你立即就能吃（用户马上看到内容）

**CSR 就像自己做饭：**
- 你点一份炒饭
- 服务员给你食材和菜谱（空白 HTML + JavaScript）
- 你自己在桌上炒（浏览器执行 JS）
- 炒好才能吃（等待后才看到内容）

#### ⚡ SSR vs CSR 对比

| 对比项 | SSR | CSR |
|--------|-----|-----|
| **首屏速度** | 快（立即显示） | 慢（需等待 JS） |
| **SEO** | 好（完整 HTML） | 差（需等 JS 执行） |
| **服务器压力** | 大（每次都渲染） | 小（只返回静态文件） |
| **适用场景** | 新闻、博客、电商 | 管理后台、工具应用 |

#### 🔍 SSR 的工作流程

```
1. 用户在浏览器输入 URL
   ↓
2. 请求发送到 Next.js 服务器
   ↓
3. 服务器执行 getServerSideProps（获取数据）
   ↓
4. 服务器用数据渲染 React 组件
   ↓
5. 服务器生成完整的 HTML
   ↓
6. 浏览器收到 HTML 并立即显示
   ↓
7. JavaScript 加载后，页面变得可交互
```

#### 📊 何时使用 SSR

**适合 SSR 的场景：**
- ✅ 需要 SEO（搜索引擎优化）
- ✅ 需要快速首屏加载
- ✅ 数据频繁变化（新闻、股票）
- ✅ 需要服务端权限控制

**不适合 SSR 的场景：**
- ❌ 管理后台（不需要 SEO）
- ❌ 纯前端工具（如计算器）
- ❌ 交互复杂的应用（如游戏）

### 🧪 实验验证

**实验 1：查看页面源代码**

1. 访问 SSR 页面：http://localhost:3000/ssr-news
2. 右键 → "查看网页源代码"
3. 你会看到**完整的新闻内容**在 HTML 里

对比：访问普通 CSR 页面，源代码里只有空的 `<div id="root"></div>`

**实验 2：时间戳测试**

1. 访问新闻列表：http://localhost:3000/ssr-news
2. 看页面顶部的时间戳（比如：2024-01-15 14:30:15）
3. 按 F5 刷新页面
4. 时间戳变了！这证明页面是在服务端重新渲染的

---

## 知识点二：getServerSideProps 数据获取

### 📚 概念讲解

`getServerSideProps` 是 Next.js 提供的**服务端数据获取函数**，它在每次请求时都会在服务器上执行。

#### 🔑 核心特点

1. **只在服务端执行**：不会在浏览器运行
2. **每次请求都执行**：不会缓存（除非你设置缓存头）
3. **可以访问服务端资源**：数据库、文件系统、环境变量
4. **可以读取请求信息**：Cookie、Header、URL 参数

#### 📝 基本语法

```typescript
export const getServerSideProps = async (context) => {
  // 在服务器上执行的代码

  return {
    props: {
      // 传递给页面组件的数据
    }
  };
};
```

#### 🔍 context 对象详解

`context` 包含了请求的所有信息：

```typescript
context = {
  req: {
    cookies: { token: 'xxx' },     // Cookie
    headers: { 'user-agent': '...' }, // 请求头
  },
  res: {
    setHeader: () => {},           // 设置响应头
  },
  query: { page: '1', id: '123' }, // URL 参数 ?page=1
  params: { id: '123' },           // 动态路由参数 /post/[id]
}
```

#### 📊 返回值类型

**1. 返回 props（正常情况）**

```typescript
return {
  props: {
    data: '数据内容',
    timestamp: Date.now(),
  }
};
```

**2. 返回 redirect（重定向）**

```typescript
return {
  redirect: {
    destination: '/login',  // 跳转地址
    permanent: false,       // 是否永久重定向（301/302）
  }
};
```

**3. 返回 notFound（404）**

```typescript
return {
  notFound: true  // 显示 404 页面
};
```

### 💻 代码实现

#### 示例 1：基础用法

**场景**：获取新闻列表并显示在页面上

```typescript
// pages/ssr-news.tsx

// 1. 页面组件（渲染界面）
export default function NewsPage({ newsList, timestamp }) {
  return (
    <div>
      <p>渲染时间：{timestamp}</p>

      {newsList.map((news) => (
        <article key={news.id}>
          <h2>{news.title}</h2>
          <p>{news.content}</p>
        </article>
      ))}
    </div>
  );
}

// 2. 服务端数据获取（⭐ 核心部分）
export const getServerSideProps = async (context) => {
  // 获取新闻数据（可以从数据库、API 获取）
  const newsList = await fetchNewsList();

  // 生成时间戳（证明是服务端渲染）
  const timestamp = new Date().toLocaleString('zh-CN');

  // 返回数据给页面组件
  return {
    props: {
      newsList,
      timestamp,
    }
  };
};
```

**执行流程：**

```
用户访问 /ssr-news
  ↓
服务器执行 getServerSideProps
  ↓ 调用 fetchNewsList() 获取数据
  ↓ 生成 timestamp
  ↓
服务器用这些数据渲染 NewsPage 组件
  ↓ 生成完整 HTML
  ↓
返回给浏览器
  ↓
用户立即看到新闻列表
```

#### 示例 2：读取 URL 参数

**场景**：分页功能，从 URL 读取页码

```typescript
// URL: /ssr-news?page=2

export const getServerSideProps = async (context) => {
  // 从 URL 获取页码
  const page = parseInt(context.query.page as string) || 1;
  const pageSize = 10;

  // 获取所有新闻
  const allNews = await fetchNewsList();

  // 计算分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagedNews = allNews.slice(start, end);

  return {
    props: {
      newsList: pagedNews,
      currentPage: page,
      totalPages: Math.ceil(allNews.length / pageSize),
    }
  };
};
```

#### 示例 3：处理动态路由

**场景**：查看单篇新闻详情

```typescript
// 文件名: pages/news/[id].tsx
// URL: /news/123

export const getServerSideProps = async (context) => {
  // 从动态路由获取 ID
  const newsId = parseInt(context.params.id as string);

  // 查询数据库
  const news = await fetchNewsById(newsId);

  // 如果新闻不存在，返回 404
  if (!news) {
    return { notFound: true };
  }

  return {
    props: { news }
  };
};
```

#### 示例 4：并发请求优化

**场景**：同时获取多个数据源

```typescript
export const getServerSideProps = async (context) => {
  // 并发请求多个数据源（更快！）
  const [newsList, categories, hotNews] = await Promise.all([
    fetchNewsList(),
    fetchCategories(),
    fetchHotNews(),
  ]);

  return {
    props: {
      newsList,
      categories,
      hotNews,
    }
  };
};
```

### ⚠️ 注意事项

**❌ 不能在 getServerSideProps 中使用的：**

```typescript
export const getServerSideProps = async (context) => {
  // ❌ 错误：使用浏览器 API
  window.alert('hello');  // 服务器没有 window

  // ❌ 错误：使用 React Hooks
  const [data, setData] = useState(null);

  // ❌ 错误：操作 DOM
  document.getElementById('root');
};
```

**✅ 可以在 getServerSideProps 中使用的：**

```typescript
export const getServerSideProps = async (context) => {
  // ✅ 正确：访问数据库
  const data = await prisma.user.findMany();

  // ✅ 正确：读取环境变量
  const apiKey = process.env.API_KEY;

  // ✅ 正确：读取文件
  const fs = require('fs');
  const content = fs.readFileSync('data.json');

  // ✅ 正确：调用外部 API
  const response = await fetch('https://api.example.com');

  return { props: { data } };
};
```

---

## 知识点三：Cookie 身份验证

### 📚 概念讲解

**Cookie** 是存储在浏览器中的小型文本数据，用于在客户端和服务器之间传递信息。

#### 🎫 Cookie 就像会员卡

想象你去超市购物：

```
第一次去超市（登录）
  ↓
办理会员卡（服务器生成 Cookie）
  ↓
把卡给你（浏览器保存 Cookie）
  ↓
下次去超市（再次访问）
  ↓
出示会员卡（浏览器自动带上 Cookie）
  ↓
收银员识别你（服务器读取 Cookie）
```

#### 🔑 Cookie 的特点

1. **自动携带**：浏览器会自动在每次请求时带上 Cookie
2. **服务端可读**：`getServerSideProps` 能直接读取 Cookie
3. **有过期时间**：可以设置 Cookie 的有效期
4. **安全性**：可以设置 `httpOnly`、`secure` 等标志

#### 📊 Cookie vs LocalStorage

| | Cookie | LocalStorage |
|---|--------|--------------|
| 服务端可读 | ✅ 可以 | ❌ 不可以 |
| 自动携带 | ✅ 自动 | ❌ 需手动 |
| 容量 | 4KB | 5MB |
| 适合 SSR | ✅ 完美 | ❌ 不适合 |
| 安全性 | ✅ 可设置 httpOnly | ❌ JS 可读取 |

#### 🔒 为什么 SSR 必须用 Cookie

因为 `getServerSideProps` 在**服务器上**执行：
- ✅ 服务器可以读取 Cookie（通过 `context.req.cookies`）
- ❌ 服务器无法读取 LocalStorage（LocalStorage 只存在于浏览器）

### 💻 代码实现

#### 示例 1：登录时设置 Cookie

**场景**：用户登录后，保存身份信息

```typescript
// pages/ssr-login.tsx

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState('user');
  const router = useRouter();

  const handleLogin = async () => {
    // 1. 根据用户选择生成 token
    const tokenMap = {
      admin: 'admin-token-xxx',
      user: 'user-token-xxx',
      guest: 'guest-token-xxx',
    };
    const token = tokenMap[selectedUser];

    // 2. 设置 Cookie
    document.cookie = `token=${token}; path=/; max-age=86400`;
    //                  ↑ Cookie名  ↑ 值      ↑ 路径   ↑ 过期时间（秒）

    // 3. 跳转到新闻页面
    router.push('/ssr-news');
  };

  return (
    <div>
      {/* 选择用户角色 */}
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="admin">管理员</option>
        <option value="user">普通用户</option>
        <option value="guest">访客</option>
      </select>

      {/* 登录按钮 */}
      <button onClick={handleLogin}>立即登录</button>
    </div>
  );
}
```

**Cookie 格式说明：**

```
token=admin-token-xxx; path=/; max-age=86400
  ↑          ↑           ↑         ↑
名字        值         路径    过期时间（秒）

path=/        表示在整个网站都有效
max-age=86400 表示 24 小时后过期（86400秒 = 24小时）
```

#### 示例 2：服务端读取 Cookie

**场景**：在 `getServerSideProps` 中验证用户身份

```typescript
// pages/ssr-news.tsx

export const getServerSideProps = async (context) => {
  // 1. 从请求中读取 Cookie
  const token = context.req.cookies.token;

  // 2. 验证 token 是否存在
  if (!token) {
    // 未登录，重定向到登录页
    return {
      redirect: {
        destination: '/ssr-login',
        permanent: false,
      }
    };
  }

  // 3. 根据 token 解析用户信息
  const user = parseToken(token);
  // user = { id: 1, username: 'admin', role: 'admin' }

  // 4. 获取数据并返回
  const newsList = await fetchNewsList();

  return {
    props: {
      user,
      newsList,
    }
  };
};
```

#### 示例 3：解析 Cookie 的工具函数

**位置**：`utils/auth.ts`

```typescript
import { IncomingMessage } from 'http';

/**
 * 从请求中解析 Cookie
 */
function parseCookies(req: IncomingMessage): Record<string, string> {
  const cookieHeader = req.headers.cookie || '';

  // Cookie 格式: "token=xxx; user=yyy"
  // 解析成对象: { token: 'xxx', user: 'yyy' }
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * 检查用户是否登录
 */
export function checkLogin(req: IncomingMessage): boolean {
  const cookies = parseCookies(req);
  return !!cookies.token;  // 如果有 token 就说明已登录
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(req: IncomingMessage): User | null {
  const cookies = parseCookies(req);
  const token = cookies.token;

  if (!token) return null;

  // 简单的 token 映射（实际项目应该用 JWT）
  const userMap = {
    'admin-token-xxx': { id: 1, username: 'admin', role: 'admin' },
    'user-token-xxx': { id: 2, username: 'user', role: 'user' },
    'guest-token-xxx': { id: 3, username: 'guest', role: 'guest' },
  };

  return userMap[token] || null;
}
```

#### 示例 4：退出登录（删除 Cookie）

```typescript
const handleLogout = () => {
  // 设置过期时间为过去的时间，Cookie 会被删除
  document.cookie = 'token=; path=/; max-age=0';

  // 跳转到登录页
  router.push('/ssr-login');
};
```

---

## 知识点四：中间件模式

### 📚 概念讲解

**中间件（Middleware）** 是一种设计模式，用于在请求到达最终处理函数之前进行预处理。

#### 🚪 中间件就像安检门

想象你进入图书馆：

```
你想进图书馆
  ↓
门卫检查学生证（中间件 1：登录检查）
  ├─ 没带学生证 → 拦下 ❌
  └─ 有学生证 → 放行 ✅
      ↓
  管理员检查书包（中间件 2：权限检查）
      ├─ 书包太大 → 让你寄存 ⚠️
      └─ 没问题 → 放行 ✅
          ↓
      进入图书馆 ✅
```

#### 🔑 中间件的优势

**没有中间件（每个页面都要写重复代码）：**

```typescript
// pages/page1.tsx
export const getServerSideProps = async (context) => {
  // 检查登录
  if (!checkLogin(context.req)) {
    return { redirect: { destination: '/login' } };
  }
  // 业务逻辑...
};

// pages/page2.tsx
export const getServerSideProps = async (context) => {
  // 又要检查登录（重复代码！）
  if (!checkLogin(context.req)) {
    return { redirect: { destination: '/login' } };
  }
  // 业务逻辑...
};
```

**使用中间件（代码复用）：**

```typescript
// pages/page1.tsx
export const getServerSideProps = withAuth(async (context) => {
  // 不用检查登录，中间件已经帮你检查了！
  // 直接写业务逻辑
});

// pages/page2.tsx
export const getServerSideProps = withAuth(async (context) => {
  // 也不用检查登录！
  // 直接写业务逻辑
});
```

#### 📊 中间件的执行流程

```
用户请求页面
  ↓
中间件 1（withAuth：检查登录）
  ├─ 未登录 → 返回重定向 ❌
  └─ 已登录 → 继续 ✅
      ↓
  中间件 2（withRole：检查权限）
      ├─ 权限不足 → 返回 403 ❌
      └─ 权限足够 → 继续 ✅
          ↓
      执行业务逻辑（getServerSideProps）
          ↓
      返回数据
```

### 💻 代码实现

#### 示例 1：withAuth（登录验证中间件）

**位置**：`middlewares/ssr.ts`

```typescript
/**
 * 登录验证中间件
 *
 * 作用：检查用户是否已登录
 * 未登录 → 重定向到登录页
 * 已登录 → 继续执行
 */
export function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    // 1. 检查 Cookie 里有没有 token
    const token = context.req.cookies.token;

    // 2. 如果没有 token，说明未登录
    if (!token) {
      return {
        redirect: {
          destination: '/ssr-login',  // 跳转到登录页
          permanent: false,           // 临时重定向（302）
        },
      };
    }

    // 3. 已登录，继续执行原函数
    return await getServerSidePropsFunc(context);
  };
}
```

**使用方法：**

```typescript
// pages/ssr-news.tsx

export const getServerSideProps = withAuth(async (context) => {
  // 这里的代码只有登录用户才能执行
  // withAuth 已经帮你检查过登录状态了

  const user = getCurrentUser(context.req);
  const newsList = await fetchNewsList();

  return {
    props: { user, newsList }
  };
});
```

**执行流程：**

```
用户访问 /ssr-news
  ↓
withAuth 中间件执行
  ↓
检查 context.req.cookies.token
  ├─ token 不存在 → 返回 redirect 到 /ssr-login ❌
  └─ token 存在 → 继续执行 ✅
      ↓
  执行 getServerSideProps（获取新闻数据）
      ↓
  返回数据给页面
```

#### 示例 2：withRole（权限控制中间件）

**位置**：`middlewares/ssr.ts`

```typescript
/**
 * 权限控制中间件
 *
 * 作用：检查用户角色是否有权限访问
 *
 * @param roles - 允许访问的角色列表，如 ['admin', 'user']
 * @param getServerSidePropsFunc - 原始的 getServerSideProps 函数
 */
export function withRole(roles: string[], getServerSidePropsFunc) {
  return async (context) => {
    // 1. 先检查是否登录
    const token = context.req.cookies.token;
    if (!token) {
      return {
        redirect: {
          destination: '/ssr-login',
          permanent: false,
        },
      };
    }

    // 2. 获取用户信息
    const user = getCurrentUser(context.req);
    // user = { id: 3, username: 'guest', role: 'guest' }

    // 3. 检查用户角色是否在允许列表中
    if (!user || !roles.includes(user.role)) {
      // 权限不足，跳转到 403 页面
      return {
        redirect: {
          destination: '/ssr-403',
          permanent: false,
        },
      };
    }

    // 4. 权限通过，继续执行
    return await getServerSidePropsFunc(context);
  };
}
```

**使用方法：**

```typescript
// pages/ssr-dashboard.tsx

// 只允许 admin 和 user 访问，guest 会被拦截
export const getServerSideProps = withRole(
  ['admin', 'user'],  // 允许的角色列表
  async (context) => {
    // Guest 用户永远不会执行到这里
    // 只有 Admin 和 User 能执行

    const user = getCurrentUser(context.req);
    const stats = await fetchUserStats(user.id);

    return {
      props: { user, stats }
    };
  }
);
```

**执行流程（Guest 用户）：**

```
Guest 访问 /ssr-dashboard
  ↓
withRole 中间件执行
  ↓
检查登录：✅ 有 token（已登录）
  ↓
获取用户信息：{ role: 'guest' }
  ↓
检查权限：'guest' 在 ['admin', 'user'] 中吗？
  ↓
不在！❌
  ↓
返回 redirect 到 /ssr-403
  ↓
Guest 看到 403 禁止访问页面
```

**执行流程（Admin 用户）：**

```
Admin 访问 /ssr-dashboard
  ↓
withRole 中间件执行
  ↓
检查登录：✅ 有 token
  ↓
获取用户信息：{ role: 'admin' }
  ↓
检查权限：'admin' 在 ['admin', 'user'] 中吗？
  ↓
在！✅
  ↓
执行 getServerSideProps（获取仪表盘数据）
  ↓
返回数据给页面
  ↓
Admin 看到仪表盘内容
```

#### 示例 3：withErrorHandling（错误处理中间件）

**位置**：`middlewares/ssr.ts`

```typescript
/**
 * 错误处理中间件
 *
 * 作用：捕获 getServerSideProps 中的错误
 * 防止服务器崩溃，返回友好的错误页面
 */
export function withErrorHandling(getServerSidePropsFunc) {
  return async (context) => {
    try {
      // 尝试执行原函数
      return await getServerSidePropsFunc(context);
    } catch (error) {
      // 捕获错误
      console.error('SSR 错误:', error);

      // 重定向到错误页面
      return {
        redirect: {
          destination: '/ssr-error',
          permanent: false,
        },
      };
    }
  };
}
```

**使用方法：**

```typescript
export const getServerSideProps = withErrorHandling(
  async (context) => {
    // 如果这里抛出错误，会被 withErrorHandling 捕获
    const data = await fetchDataThatMightFail();

    return {
      props: { data }
    };
  }
);
```

#### 示例 4：组合多个中间件

**场景**：同时使用登录验证、权限控制、错误处理

```typescript
// 手动组合
export const getServerSideProps = withErrorHandling(
  withRole(['admin', 'user'],
    async (context) => {
      // 业务逻辑
    }
  )
);

// 或者创建一个组合函数
function compose(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight(
      (wrapped, middleware) => middleware(wrapped),
      handler
    );
  };
}

// 使用组合函数
export const getServerSideProps = compose(
  withErrorHandling,
  withRole(['admin', 'user'])
)(async (context) => {
  // 业务逻辑
});
```

**执行顺序：**

```
用户请求
  ↓
withErrorHandling（开始监听错误）
  ↓
withRole（检查权限）
  ├─ 权限不足 → 返回 403 ❌
  └─ 权限足够 ✅
      ↓
  执行业务逻辑
      ├─ 出错 → withErrorHandling 捕获 ⚠️
      └─ 成功 → 返回数据 ✅
```

---

## 知识点五：权限控制

### 📚 概念讲解

**权限控制（Access Control）** 是指根据用户的角色或权限，限制其能访问的资源。

#### 🎭 三种角色对比

本项目实现了基于角色的访问控制（RBAC - Role-Based Access Control）：

| 角色 | 英文 | 权限 |
|------|------|------|
| 管理员 | Admin | 新闻列表 ✅<br>仪表盘 ✅<br>所有功能 ✅ |
| 普通用户 | User | 新闻列表 ✅<br>仪表盘 ✅<br>部分功能 ✅ |
| 访客 | Guest | 新闻列表 ✅<br>仪表盘 ❌<br>有限功能 ⚠️ |

#### 🔒 为什么要在服务端做权限控制

**客户端权限控制（不安全）：**

```typescript
// ❌ 不安全：前端检查权限
export default function DashboardPage() {
  const user = getUser();

  if (user.role !== 'admin') {
    return <div>权限不足</div>;
  }

  return <div>仪表盘数据...</div>;
}
```

**问题：**
1. 用户可以通过浏览器开发者工具修改代码
2. 页面数据已经加载到客户端，可以查看源代码获取
3. 可以通过 API 直接获取数据

**服务端权限控制（安全）：**

```typescript
// ✅ 安全：服务端检查权限
export const getServerSideProps = withRole(['admin'], async (ctx) => {
  // Guest 用户永远不会执行到这里
  // 服务器直接返回 403，不会泄露任何数据

  const data = await fetchSensitiveData();
  return { props: { data } };
});
```

**优势：**
1. 在服务器检查，用户无法绕过
2. 权限不足时不返回任何数据
3. 更安全、更可靠

#### 📊 权限控制的完整流程

```
用户访问受保护的页面
  ↓
服务器执行 getServerSideProps
  ↓
中间件检查 Cookie 中的 token
  ├─ 没有 token → 重定向到登录页 ❌
  └─ 有 token → 解析出用户角色 ✅
      ↓
  检查用户角色是否有权限
      ├─ Admin → 在允许列表中 ✅ → 返回完整数据
      ├─ User  → 在允许列表中 ✅ → 返回部分数据
      └─ Guest → 不在允许列表中 ❌ → 返回 403
```

### 💻 代码实现

#### 示例 1：用户角色定义

**位置**：`types/index.ts`

```typescript
/**
 * 用户角色类型
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * 用户信息接口
 */
export interface User {
  id: number;
  username: string;
  role: UserRole;
}
```

#### 示例 2：登录时设置角色

**位置**：`pages/ssr-login.tsx`

```typescript
export default function LoginPage() {
  const handleLogin = async () => {
    // 根据用户选择生成不同的 token
    const tokenMap = {
      admin: 'admin-token-xxx',  // Admin 的 token
      user: 'user-token-xxx',    // User 的 token
      guest: 'guest-token-xxx',  // Guest 的 token
    };

    const token = tokenMap[selectedUser];

    // 保存到 Cookie
    document.cookie = `token=${token}; path=/; max-age=86400`;

    // 跳转到新闻列表
    router.push('/ssr-news');
  };

  // ... 其他代码
}
```

#### 示例 3：服务端解析用户角色

**位置**：`utils/auth.ts`

```typescript
/**
 * 从请求中获取当前用户信息
 */
export function getCurrentUser(req: IncomingMessage): User | null {
  const cookies = parseCookies(req);
  const token = cookies.token;

  if (!token) return null;

  // 根据 token 返回对应的用户信息
  // 实际项目中应该使用 JWT 或查询数据库
  const userMap: Record<string, User> = {
    'admin-token-xxx': {
      id: 1,
      username: 'admin',
      role: 'admin',  // 管理员角色
    },
    'user-token-xxx': {
      id: 2,
      username: 'user',
      role: 'user',   // 普通用户角色
    },
    'guest-token-xxx': {
      id: 3,
      username: 'guest',
      role: 'guest',  // 访客角色
    },
  };

  return userMap[token] || null;
}

/**
 * 检查用户是否有指定角色
 */
export function hasRole(user: User | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
```

#### 示例 4：新闻列表（所有角色可访问）

**位置**：`pages/ssr-news.tsx`

```typescript
export const getServerSideProps = withAuth(async (context) => {
  // 只要登录就能访问，不限制角色

  const user = getCurrentUser(context.req);
  const newsList = await fetchNewsList();
  const timestamp = new Date().toLocaleString('zh-CN');

  return {
    props: {
      user,
      newsList,
      timestamp,
    }
  };
});
```

**权限结果：**
- ✅ Admin 可以访问
- ✅ User 可以访问
- ✅ Guest 可以访问
- ❌ 未登录用户会被重定向到登录页

#### 示例 5：仪表盘（限制 Guest 访问）

**位置**：`pages/ssr-dashboard.tsx`

```typescript
export const getServerSideProps = withRole(
  ['admin', 'user'],  // 只允许 admin 和 user
  async (context) => {
    // Guest 永远不会执行到这里

    const user = getCurrentUser(context.req);

    // 根据角色返回不同的数据
    let stats;
    if (user.role === 'admin') {
      // Admin 看到所有统计数据
      stats = await fetchAllStats();
    } else {
      // User 只看到自己的统计数据
      stats = await fetchUserStats(user.id);
    }

    return {
      props: {
        user,
        stats,
      }
    };
  }
);
```

**权限结果：**
- ✅ Admin 可以访问，看到所有数据
- ✅ User 可以访问，看到自己的数据
- ❌ Guest 被重定向到 403 页面
- ❌ 未登录用户被重定向到登录页

#### 示例 6：测试权限控制

**测试步骤：**

```typescript
// 1. 以 Guest 身份登录
// 选择 "Guest" → 点击登录

// 2. 访问新闻列表
// URL: http://localhost:3000/ssr-news
// 结果: ✅ 成功访问

// 3. 尝试访问仪表盘
// URL: http://localhost:3000/ssr-dashboard
// 结果: ❌ 被重定向到 /ssr-403

// 4. 重新以 Admin 身份登录
// 点击退出 → 选择 "Admin" → 登录

// 5. 再次访问仪表盘
// URL: http://localhost:3000/ssr-dashboard
// 结果: ✅ 成功访问，看到完整数据
```

#### 示例 7：403 禁止访问页面

**位置**：`pages/ssr-403.tsx`

```typescript
export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.icon}>🚫</div>
        <h1 className={styles.title}>403</h1>
        <h2 className={styles.subtitle}>权限不足</h2>
        <p className={styles.message}>
          抱歉，您没有权限访问此页面
        </p>

        <div className={styles.actions}>
          <button onClick={() => router.push('/ssr-news')}>
            返回新闻列表
          </button>
          <button onClick={() => router.push('/ssr-login')}>
            重新登录
          </button>
        </div>

        {/* 权限说明 */}
        <div className={styles.info}>
          <h3>权限说明</h3>
          <ul>
            <li><strong>Admin</strong>：全部权限</li>
            <li><strong>User</strong>：新闻列表 + 仪表盘</li>
            <li><strong>Guest</strong>：仅新闻列表</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## 知识点六：错误处理

### 📚 概念讲解

**错误处理（Error Handling）** 是指在程序运行过程中，捕获并优雅地处理各种错误情况。

#### 🔍 SSR 中可能出现的错误

1. **数据获取失败**：数据库连接失败、API 超时
2. **参数错误**：URL 参数不合法、ID 不存在
3. **权限错误**：用户没有权限访问
4. **服务器错误**：代码bug、内存溢出

#### ⚠️ 不处理错误的后果

```typescript
// ❌ 没有错误处理
export const getServerSideProps = async (context) => {
  const data = await fetchData();  // 如果出错，整个服务器崩溃
  return { props: { data } };
};
```

**问题：**
- 服务器崩溃，所有用户都无法访问
- 用户看到难看的错误堆栈
- 无法追踪错误原因

#### ✅ 正确的错误处理

```typescript
// ✅ 有错误处理
export const getServerSideProps = withErrorHandling(
  async (context) => {
    const data = await fetchData();  // 如果出错，返回友好的错误页面
    return { props: { data } };
  }
);
```

**优势：**
- 服务器不会崩溃
- 用户看到友好的错误提示
- 可以记录错误日志

### 💻 代码实现

#### 示例 1：基础错误处理

```typescript
export const getServerSideProps = async (context) => {
  try {
    // 尝试获取数据
    const data = await fetchData();
    return { props: { data } };
  } catch (error) {
    // 捕获错误
    console.error('获取数据失败:', error);

    // 返回错误页面
    return {
      redirect: {
        destination: '/ssr-error',
        permanent: false,
      }
    };
  }
};
```

#### 示例 2：处理 404 错误

**场景**：用户访问不存在的新闻

```typescript
// pages/news/[id].tsx

export const getServerSideProps = async (context) => {
  const newsId = parseInt(context.params.id as string);

  // 查询数据库
  const news = await fetchNewsById(newsId);

  // 如果新闻不存在，返回 404
  if (!news) {
    return {
      notFound: true,  // Next.js 会显示 404 页面
    };
  }

  return {
    props: { news }
  };
};
```

#### 示例 3：错误处理中间件

**位置**：`middlewares/ssr.ts`

```typescript
/**
 * 错误处理中间件
 */
export function withErrorHandling(getServerSidePropsFunc) {
  return async (context) => {
    try {
      return await getServerSidePropsFunc(context);
    } catch (error) {
      // 记录错误日志
      console.error('[SSR Error]', {
        url: context.resolvedUrl,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      // 重定向到错误页面
      return {
        redirect: {
          destination: '/ssr-error',
          permanent: false,
        },
      };
    }
  };
}
```

#### 示例 4：通用错误页面

**位置**：`pages/ssr-error.tsx`

```typescript
export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.icon}>⚠️</div>
        <h1 className={styles.title}>出错了</h1>
        <p className={styles.message}>
          抱歉，页面加载时出现了问题
        </p>

        <div className={styles.actions}>
          <button onClick={() => router.back()}>
            返回上一页
          </button>
          <button onClick={() => router.push('/')}>
            返回首页
          </button>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>

        <div className={styles.tips}>
          <h3>可能的原因：</h3>
          <ul>
            <li>网络连接问题</li>
            <li>服务器暂时无响应</li>
            <li>请求的资源不存在</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

#### 示例 5：不同类型的错误处理

```typescript
export const getServerSideProps = async (context) => {
  try {
    // 1. 验证参数
    const id = parseInt(context.query.id as string);
    if (isNaN(id) || id <= 0) {
      // 参数错误，返回 400
      return {
        redirect: {
          destination: '/ssr-error?code=400',
          permanent: false,
        }
      };
    }

    // 2. 查询数据
    const data = await fetchData(id);

    // 3. 数据不存在，返回 404
    if (!data) {
      return { notFound: true };
    }

    // 4. 检查权限
    const user = getCurrentUser(context.req);
    if (!canAccess(user, data)) {
      // 权限不足，返回 403
      return {
        redirect: {
          destination: '/ssr-403',
          permanent: false,
        }
      };
    }

    return { props: { data } };

  } catch (error) {
    // 5. 其他错误，返回 500
    console.error('服务器错误:', error);
    return {
      redirect: {
        destination: '/ssr-error?code=500',
        permanent: false,
      }
    };
  }
};
```

---

## 完整项目实战

### 🎯 项目功能概览

这是一个完整的 SSR 新闻系统，包含以下功能：

1. **登录系统**：3种角色（Admin / User / Guest）
2. **新闻列表**：服务端渲染，实时更新
3. **用户仪表盘**：权限控制，不同角色看到不同内容
4. **错误处理**：403、404、500 错误页面

### 📁 项目结构

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
└── styles/                     # 样式文件
    ├── Login.module.css
    ├── News.module.css
    ├── Dashboard.module.css
    └── Error.module.css
```

### 🔄 完整请求流程

以 **Guest 访问仪表盘** 为例：

```
1. Guest 在浏览器输入: http://localhost:3000/ssr-dashboard
   ↓
2. 浏览器发送请求到 Next.js 服务器
   请求头包含 Cookie: token=guest-token-xxx
   ↓
3. Next.js 路由匹配到 pages/ssr-dashboard.tsx
   ↓
4. 执行 getServerSideProps（包含 withRole 中间件）
   ↓
5. withRole 中间件执行：
   - 读取 Cookie: context.req.cookies.token = 'guest-token-xxx'
   - 解析用户: getCurrentUser() → { role: 'guest' }
   - 检查权限: 'guest' in ['admin', 'user']? → false
   - 返回 redirect: { destination: '/ssr-403' }
   ↓
6. 服务器返回 302 重定向响应
   Location: /ssr-403
   ↓
7. 浏览器自动跳转到 /ssr-403
   ↓
8. 执行 pages/ssr-403.tsx
   ↓
9. 渲染 403 页面
   ↓
10. 返回 HTML 给浏览器
    ↓
11. Guest 看到 "权限不足" 页面
```

### 📝 核心代码文件解析

#### 1. 类型定义 (`types/index.ts`)

```typescript
/**
 * 用户角色类型
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * 用户接口
 */
export interface User {
  id: number;
  username: string;
  role: UserRole;
}

/**
 * 新闻接口
 */
export interface News {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  views: number;
}

/**
 * 用户统计数据
 */
export interface UserStats {
  totalNews: number;
  totalViews: number;
  totalComments: number;
  recentActivity: Activity[];
}

/**
 * 活动记录
 */
export interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}
```

#### 2. 认证工具 (`utils/auth.ts`)

```typescript
import { IncomingMessage } from 'http';
import { User } from '@/types';

/**
 * 解析 Cookie
 */
function parseCookies(req: IncomingMessage): Record<string, string> {
  const cookieHeader = req.headers.cookie || '';
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * 检查是否登录
 */
export function checkLogin(req: IncomingMessage): boolean {
  const cookies = parseCookies(req);
  return !!cookies.token;
}

/**
 * 获取当前用户
 */
export function getCurrentUser(req: IncomingMessage): User | null {
  const cookies = parseCookies(req);
  const token = cookies.token;

  if (!token) return null;

  // Token 到用户的映射
  const userMap: Record<string, User> = {
    'admin-token-xxx': { id: 1, username: 'admin', role: 'admin' },
    'user-token-xxx': { id: 2, username: 'user', role: 'user' },
    'guest-token-xxx': { id: 3, username: 'guest', role: 'guest' },
  };

  return userMap[token] || null;
}

/**
 * 检查用户是否有指定角色
 */
export function hasRole(user: User | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
```

#### 3. SSR 中间件 (`middlewares/ssr.ts`)

```typescript
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { checkLogin, getCurrentUser, hasRole } from '@/utils/auth';

type GetServerSidePropsFunction<P = any> = (
  context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>>;

/**
 * 登录验证中间件
 */
export function withAuth<P = any>(
  getServerSidePropsFunc: GetServerSidePropsFunction<P>
): GetServerSidePropsFunction<P> {
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

/**
 * 角色权限中间件
 */
export function withRole<P = any>(
  roles: string[],
  getServerSidePropsFunc: GetServerSidePropsFunction<P>
): GetServerSidePropsFunction<P> {
  return async (context) => {
    if (!checkLogin(context.req)) {
      return {
        redirect: {
          destination: '/ssr-login',
          permanent: false,
        },
      };
    }

    const user = getCurrentUser(context.req);
    if (!hasRole(user, roles)) {
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

/**
 * 错误处理中间件
 */
export function withErrorHandling<P = any>(
  getServerSidePropsFunc: GetServerSidePropsFunction<P>
): GetServerSidePropsFunction<P> {
  return async (context) => {
    try {
      return await getServerSidePropsFunc(context);
    } catch (error) {
      console.error('[SSR Error]', {
        url: context.resolvedUrl,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      return {
        redirect: {
          destination: '/ssr-error',
          permanent: false,
        },
      };
    }
  };
}
```

#### 4. 登录页面 (`pages/ssr-login.tsx`)

```typescript
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Login.module.css';

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState('user');
  const router = useRouter();

  const userOptions = [
    { value: 'admin', label: '管理员 (Admin)', desc: '全部权限' },
    { value: 'user', label: '普通用户 (User)', desc: '部分权限' },
    { value: 'guest', label: '访客 (Guest)', desc: '有限权限' },
  ];

  const handleLogin = async () => {
    // 根据角色生成 token
    const tokenMap = {
      admin: 'admin-token-xxx',
      user: 'user-token-xxx',
      guest: 'guest-token-xxx',
    };

    const token = tokenMap[selectedUser];

    // 设置 Cookie
    document.cookie = `token=${token}; path=/; max-age=86400`;

    // 跳转到新闻列表
    router.push('/ssr-news');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>SSR 登录</h1>
        <p className={styles.subtitle}>选择角色体验不同权限</p>

        <div className={styles.userList}>
          {userOptions.map((option) => (
            <label
              key={option.value}
              className={`${styles.userOption} ${
                selectedUser === option.value ? styles.selected : ''
              }`}
            >
              <input
                type="radio"
                name="user"
                value={option.value}
                checked={selectedUser === option.value}
                onChange={(e) => setSelectedUser(e.target.value)}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>{option.label}</div>
                <div className={styles.userDesc}>{option.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <button onClick={handleLogin} className={styles.loginBtn}>
          立即登录
        </button>

        {/* 权限说明 */}
        <div className={styles.permissionInfo}>
          <h3>权限说明</h3>
          <ul>
            <li><strong>Admin</strong>：可以访问所有页面</li>
            <li><strong>User</strong>：可以访问新闻列表和仪表盘</li>
            <li><strong>Guest</strong>：只能访问新闻列表</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

#### 5. 新闻列表页 (`pages/ssr-news.tsx`)

```typescript
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { withAuth } from '@/middlewares/ssr';
import { getCurrentUser } from '@/utils/auth';
import { fetchNewsList } from '@/data/news';
import { News, User } from '@/types';
import styles from '@/styles/News.module.css';

interface NewsPageProps {
  newsList: News[];
  user: User;
  timestamp: string;
}

export default function NewsPage({ newsList, user, timestamp }: NewsPageProps) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/ssr-login');
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <header className={styles.header}>
        <h1 className={styles.title}>📰 新闻中心</h1>
        <div className={styles.userInfo}>
          <span>你好，{user.username}！</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            退出
          </button>
        </div>
      </header>

      {/* SSR 证明 */}
      <div className={styles.ssrProof}>
        <span>⏰ 服务端渲染时间：{timestamp}</span>
        <span className={styles.tip}>
          刷新页面，时间戳会更新（证明是 SSR）
        </span>
      </div>

      {/* 新闻列表 */}
      <div className={styles.newsList}>
        {newsList.map((news) => (
          <article key={news.id} className={styles.newsCard}>
            <h2 className={styles.newsTitle}>{news.title}</h2>
            <p className={styles.newsContent}>{news.content}</p>
            <div className={styles.newsMeta}>
              <span className={styles.category}>{news.category}</span>
              <span className={styles.author}>作者：{news.author}</span>
              <span className={styles.date}>{news.publishDate}</span>
              <span className={styles.views}>👁 {news.views}</span>
            </div>
          </article>
        ))}
      </div>

      {/* 导航 */}
      <div className={styles.navigation}>
        <button
          onClick={() => router.push('/ssr-dashboard')}
          className={styles.navBtn}
        >
          前往仪表盘
        </button>
      </div>
    </div>
  );
}

/**
 * 服务端数据获取
 *
 * 使用 withAuth 中间件，确保只有登录用户才能访问
 */
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    // 获取当前用户
    const user = getCurrentUser(context.req);

    // 获取新闻列表
    const newsList = await fetchNewsList();

    // 生成时间戳（证明是服务端渲染）
    const timestamp = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return {
      props: {
        newsList,
        user,
        timestamp,
      },
    };
  }
);
```

#### 6. 仪表盘页面 (`pages/ssr-dashboard.tsx`)

```typescript
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { withRole } from '@/middlewares/ssr';
import { getCurrentUser } from '@/utils/auth';
import { fetchUserStats } from '@/data/users';
import { User, UserStats } from '@/types';
import styles from '@/styles/Dashboard.module.css';

interface DashboardPageProps {
  user: User;
  stats: UserStats;
}

export default function DashboardPage({ user, stats }: DashboardPageProps) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/ssr-login');
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <header className={styles.header}>
        <h1 className={styles.title}>📊 用户仪表盘</h1>
        <div className={styles.userInfo}>
          <span>{user.username} ({user.role})</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            退出
          </button>
        </div>
      </header>

      {/* 权限提示 */}
      <div className={styles.permissionTip}>
        {user.role === 'admin' && (
          <span>✅ 您是管理员，可以看到所有统计数据</span>
        )}
        {user.role === 'user' && (
          <span>✅ 您是普通用户，可以看到个人统计数据</span>
        )}
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📰</div>
          <div className={styles.statValue}>{stats.totalNews}</div>
          <div className={styles.statLabel}>发布文章</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👁</div>
          <div className={styles.statValue}>{stats.totalViews}</div>
          <div className={styles.statLabel}>总浏览量</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statValue}>{stats.totalComments}</div>
          <div className={styles.statLabel}>收到评论</div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>最近活动</h2>
        <div className={styles.activityList}>
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityType}>{activity.type}</div>
              <div className={styles.activityDesc}>
                {activity.description}
              </div>
              <div className={styles.activityTime}>
                {activity.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 导航 */}
      <div className={styles.navigation}>
        <button
          onClick={() => router.push('/ssr-news')}
          className={styles.navBtn}
        >
          返回新闻列表
        </button>
      </div>
    </div>
  );
}

/**
 * 服务端数据获取
 *
 * 使用 withRole 中间件，只允许 admin 和 user 访问
 * guest 会被重定向到 403 页面
 */
export const getServerSideProps: GetServerSideProps = withRole(
  ['admin', 'user'],  // 允许的角色
  async (context) => {
    // Guest 永远不会执行到这里

    const user = getCurrentUser(context.req);

    // 获取用户统计数据
    const stats = await fetchUserStats(user.id);

    return {
      props: {
        user,
        stats,
      },
    };
  }
);
```

### 🧪 完整测试流程

#### 测试 1：Admin 用户

```
1. 访问首页 → 点击 "第七章：SSR"
2. 选择 "管理员 (Admin)" → 点击登录
3. 查看新闻列表 → ✅ 成功访问
4. 点击 "前往仪表盘" → ✅ 成功访问
5. 看到完整的统计数据 → ✅ 正常显示
```

#### 测试 2：User 用户

```
1. 退出登录
2. 选择 "普通用户 (User)" → 点击登录
3. 查看新闻列表 → ✅ 成功访问
4. 点击 "前往仪表盘" → ✅ 成功访问
5. 看到个人的统计数据 → ✅ 正常显示
```

#### 测试 3：Guest 用户（重点）

```
1. 退出登录
2. 选择 "访客 (Guest)" → 点击登录
3. 查看新闻列表 → ✅ 成功访问
4. 点击 "前往仪表盘" → ❌ 被拦截
5. 跳转到 403 页面 → ✅ 显示 "权限不足"
6. 手动访问 /ssr-dashboard → ❌ 依然被拦截
```

#### 测试 4：未登录用户

```
1. 退出登录
2. 手动访问 /ssr-news → ❌ 被拦截
3. 自动跳转到登录页 → ✅ 跳转成功
```

#### 测试 5：SSR 验证

```
1. 访问新闻列表
2. 查看页面顶部的时间戳: 2024-01-15 14:30:15
3. 按 F5 刷新页面
4. 时间戳变化: 2024-01-15 14:30:20
5. ✅ 证明页面是服务端重新渲染的
```

---

## 常见问题

### Q1: 为什么刷新页面时间戳不变？

**原因**：浏览器缓存了页面。

**解决方法**：
1. 打开浏览器开发者工具（F12）
2. 勾选 "Disable cache"
3. 刷新页面

或者按 `Ctrl+Shift+R`（Windows）/ `Cmd+Shift+R`（Mac）强制刷新。

---

### Q2: 如何知道代码在服务端还是客户端执行？

**方法 1：看 console.log 输出在哪里**

```typescript
// 只在服务端执行
export const getServerSideProps = async (context) => {
  console.log('这条消息在终端显示');  // 在运行 npm run dev 的终端
};

// 服务端和客户端都执行
export default function Page() {
  console.log('这条消息两边都显示');  // 终端 + 浏览器

  useEffect(() => {
    console.log('这条消息只在浏览器显示');  // 只在浏览器
  }, []);
}
```

**方法 2：检查 window 对象**

```typescript
if (typeof window === 'undefined') {
  console.log('服务端');
} else {
  console.log('客户端');
}
```

---

### Q3: 为什么不能在 getServerSideProps 中使用 useState？

**错误示例**：

```typescript
export const getServerSideProps = async (context) => {
  const [data, setData] = useState(null);  // ❌ 错误！
};
```

**原因**：
- `getServerSideProps` 在服务端执行
- React Hooks 只能在组件中使用
- 服务端没有 React 组件生命周期

**正确做法**：

```typescript
// getServerSideProps: 只获取数据
export const getServerSideProps = async (context) => {
  const data = await fetchData();
  return { props: { data } };
};

// 组件: 使用 useState
export default function Page({ data }) {
  const [localData, setLocalData] = useState(data);
  // ...
}
```

---

### Q4: Cookie 是什么？为什么用它做身份验证？

**什么是 Cookie？**

Cookie 就像超市的会员卡：

```
第一次去超市（登录）
  ↓
办理会员卡（服务器生成 Cookie）
  ↓
把卡给你（浏览器保存 Cookie）
  ↓
下次去超市（再次访问）
  ↓
出示会员卡（浏览器自动带上 Cookie）
  ↓
收银员识别你（服务器读取 Cookie）
```

**为什么用 Cookie？**

| | Cookie | LocalStorage |
|---|--------|--------------|
| 服务端可读 | ✅ 可以 | ❌ 不可以 |
| 自动携带 | ✅ 自动 | ❌ 需手动 |
| 适合 SSR | ✅ 完美 | ❌ 不适合 |

---

### Q5: 如何调试 getServerSideProps？

**方法 1：查看终端**

```typescript
export const getServerSideProps = async (context) => {
  console.log('用户 ID:', context.query.id);
  console.log('Cookie:', context.req.cookies);
  // 这些会在终端打印
};
```

**方法 2：返回到页面**

```typescript
export const getServerSideProps = async (context) => {
  const debugInfo = {
    query: context.query,
    cookies: context.req.cookies,
  };

  return {
    props: { debugInfo }
  };
};

export default function Page({ debugInfo }) {
  return <pre>{JSON.stringify(debugInfo, null, 2)}</pre>;
}
```

---

### Q6: getServerSideProps 可以做什么？

**✅ 可以做：**

```typescript
export const getServerSideProps = async (context) => {
  // 1. 访问数据库
  const data = await prisma.user.findMany();

  // 2. 读取环境变量
  const apiKey = process.env.API_KEY;

  // 3. 读取文件
  const fs = require('fs');
  const content = fs.readFileSync('data.json');

  // 4. 调用外部 API
  const response = await fetch('https://api.example.com');

  // 5. 读取请求信息
  const ip = context.req.socket.remoteAddress;

  return { props: { data } };
};
```

**❌ 不能做：**

```typescript
export const getServerSideProps = async (context) => {
  // ❌ 使用浏览器 API
  window.alert('hello');  // 错误！服务端没有 window

  // ❌ 使用 React Hooks
  const [data, setData] = useState(null);  // 错误！

  // ❌ 操作 DOM
  document.getElementById('root');  // 错误！服务端没有 DOM
};
```

---

## 🎓 学习建议

### 第 1 天：理解概念（2 小时）

**上午（1 小时）：**
1. 阅读"知识点一：什么是 SSR"
2. 理解 SSR vs CSR 的区别
3. 完成实验验证

**下午（1 小时）：**
1. 阅读"知识点二：getServerSideProps"
2. 理解 context 对象
3. 尝试修改示例代码

### 第 2 天：学习中间件（3 小时）

**上午（1.5 小时）：**
1. 阅读"知识点三：Cookie 身份验证"
2. 阅读"知识点四：中间件模式"
3. 理解中间件的执行流程

**下午（1.5 小时）：**
1. 阅读"知识点五：权限控制"
2. 在 VS Code 中打开代码，对照着看
3. 加 `console.log` 观察执行顺序

### 第 3 天：实战练习（3 小时）

**任务 1：添加分页（1 小时）**

在新闻列表添加分页功能：

```typescript
const page = parseInt(context.query.page as string) || 1;
const pageSize = 5;
// 实现分页逻辑...
```

**任务 2：添加搜索（1 小时）**

根据关键词搜索新闻：

```typescript
const keyword = context.query.q as string;
if (keyword) {
  newsList = newsList.filter(news =>
    news.title.includes(keyword)
  );
}
```

**任务 3：自由发挥（1 小时）**

尝试实现一个你自己的功能！

---

## 🎯 检查清单

学完后，检查你是否：

**概念理解：**
- [ ] 能用自己的话解释什么是 SSR
- [ ] 知道 SSR 和 CSR 的区别
- [ ] 理解 SSR 的适用场景

**代码理解：**
- [ ] 知道 getServerSideProps 在哪里执行
- [ ] 理解 context 对象包含什么
- [ ] 能看懂 withAuth 和 withRole 中间件

**动手能力：**
- [ ] 能成功启动项目
- [ ] 能体验不同角色的权限
- [ ] 能修改代码并看到效果

**进阶能力：**
- [ ] 能自己实现一个 SSR 页面
- [ ] 能实现一个简单的中间件
- [ ] 知道如何调试和排错

---

## 📚 更多学习资源

### 详细文档

- [零基础入门教程](./docs/chapter7-ssr-beginner-guide.md) - 最详细的讲解
- [实战练习题](./docs/chapter7-ssr-exercises.md) - 8 个练习 + 答案
- [快速开始指南](./QUICKSTART-SSR.md) - 5 分钟上手

### 推荐阅读顺序

1. 本文档（README.md）- 知识点驱动教程
2. [零基础入门教程](./docs/chapter7-ssr-beginner-guide.md) - 补充详细讲解
3. [实战练习题](./docs/chapter7-ssr-exercises.md) - 巩固知识
4. [快速开始指南](./QUICKSTART-SSR.md) - 项目总结

---

## 💬 还有问题？

如果还是不明白，可能因为：

1. **没有动手实践** → 一定要自己运行代码，看效果
2. **跳过了某个知识点** → 建议按顺序阅读
3. **没有对照代码看** → 打开 VS Code，边看文档边看代码

**记住：**
> 学编程最重要的是**动手写**，不是光看。每天写一点，一个月后你会惊讶于自己的进步！

**加油！你可以的！** 🚀
