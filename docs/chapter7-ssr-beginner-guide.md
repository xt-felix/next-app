# 第七章：SSR 从零开始超详细教程

> 🎯 **目标读者**：完全没接触过 SSR 的初学者
> 📚 **学习时间**：建议分 3 天学完，每天 2-3 小时
> 💡 **前置知识**：会一点 React 和 JavaScript 就够了

---

## 📖 目录

- [第一部分：概念理解](#第一部分概念理解)
  - [什么是 SSR？](#什么是-ssr)
  - [为什么需要 SSR？](#为什么需要-ssr)
  - [SSR vs CSR 对比](#ssr-vs-csr-对比)
- [第二部分：动手实践](#第二部分动手实践)
  - [第一步：启动项目](#第一步启动项目)
  - [第二步：体验 SSR](#第二步体验-ssr)
  - [第三步：理解代码](#第三步理解代码)
- [第三部分：核心知识](#第三部分核心知识)
  - [getServerSideProps 详解](#getserversideprops-详解)
  - [中间件是什么](#中间件是什么)
  - [权限控制实现](#权限控制实现)
- [第四部分：常见问题](#第四部分常见问题)

---

## 第一部分：概念理解

### 什么是 SSR？

#### 用最简单的话解释

想象你去餐厅吃饭：

**🍽️ SSR（服务端渲染）**
- 你点了一份炒饭
- 厨师在后厨做好（服务器生成 HTML）
- 服务员直接端上桌（浏览器收到完整页面）
- 你立即就能吃（用户马上看到内容）

**💻 CSR（客户端渲染）**
- 你点了一份炒饭
- 服务员给你一堆食材和菜谱（空白 HTML + JavaScript）
- 你自己在桌上炒（浏览器执行 JS 渲染页面）
- 炒好才能吃（用户等待后才看到内容）

#### 技术层面的解释

**SSR 的工作流程：**

```
1. 用户访问网址
   ↓
2. 服务器接收请求
   ↓
3. 服务器执行 getServerSideProps（获取数据）
   ↓
4. 服务器生成完整的 HTML
   ↓
5. 浏览器收到并立即显示
   ↓
6. JavaScript 加载后，页面变得可交互（hydration）
```

**关键点：**
- HTML 是在**服务器**上生成的
- 用户**立即**看到内容
- 对**SEO 友好**（搜索引擎能抓取）

---

### 为什么需要 SSR？

#### 场景 1：新闻网站

**不用 SSR 的问题：**
```
用户打开页面 → 看到空白 → 等待 JS 加载 → 等待数据请求 → 才看到新闻
总共等待：3-5 秒 ❌
```

**使用 SSR：**
```
用户打开页面 → 立即看到新闻内容
总共等待：0.5 秒 ✅
```

#### 场景 2：电商产品页

**SEO 对比：**

**CSR（不利于 SEO）：**
```html
<!-- 搜索引擎看到的是空的 -->
<div id="root"></div>
<script src="app.js"></script>
```

**SSR（有利于 SEO）：**
```html
<!-- 搜索引擎看到完整内容 -->
<div id="root">
  <h1>iPhone 15 Pro</h1>
  <p>最新款苹果手机，现货发售</p>
  <span>价格：¥7999</span>
</div>
```

#### 场景 3：需要登录的页面

**CSR 的问题：**
```
1. 用户打开页面
2. 页面加载完成
3. JavaScript 检查登录状态
4. 发现未登录
5. 跳转到登录页

问题：用户先看到内容，然后才被踢走 ❌
```

**SSR 的优势：**
```
1. 用户请求页面
2. 服务器检查登录状态
3. 发现未登录
4. 直接返回登录页

优势：用户不会看到闪烁 ✅
```

---

### SSR vs CSR 对比

| 对比项 | SSR | CSR |
|--------|-----|-----|
| **首屏速度** | ⚡ 很快（立即显示） | 🐌 较慢（需等待 JS） |
| **SEO** | ✅ 非常好（完整 HTML） | ❌ 较差（需等 JS 执行） |
| **服务器压力** | 🔥 较大（每次都渲染） | ✅ 较小（只返回静态文件） |
| **用户体验** | ✅ 好（无闪烁） | ⚠️ 一般（可能闪烁） |
| **开发难度** | ⚠️ 中等 | ✅ 简单 |
| **适用场景** | 新闻、博客、电商 | 管理后台、工具应用 |

**简单判断标准：**
- 需要 SEO？ → 用 SSR ✅
- 需要快速首屏？ → 用 SSR ✅
- 是管理后台？ → 可以用 CSR ⚠️
- 交互很复杂？ → 考虑用 CSR ⚠️

---

## 第二部分：动手实践

### 第一步：启动项目

#### 1. 确保项目已安装依赖

打开终端，在项目目录运行：

```bash
npm install
```

#### 2. 启动开发服务器

```bash
npm run dev
```

看到这个说明成功了：
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

#### 3. 打开浏览器

访问：http://localhost:3000

你应该能看到项目首页。

---

### 第二步：体验 SSR

#### 任务 1：登录体验

1. **点击首页的"第七章：SSR"卡片**
2. **进入登录页面**（`/ssr-login`）
3. **选择角色：Admin**
4. **点击"立即登录"**

**观察要点：**
- 登录后自动跳转到新闻列表
- 右上角显示你的用户名

#### 任务 2：查看 SSR 效果

现在你在新闻列表页面（`/ssr-news`），注意看：

**🔍 关键观察点 1：时间戳**
- 页面顶部有个时间戳（比如：2024-01-15 14:30:15）
- 按 F5 刷新页面
- 时间戳变了！这证明页面是**服务端重新渲染**的

**🔍 关键观察点 2：查看源代码**
- 右键点击页面 → "查看网页源代码"
- 你会看到**完整的新闻内容**在 HTML 里
- 这就是 SSR！内容在服务器就生成好了

**对比实验：**

访问商城页面（`/shop`），它是 CSR：
- 右键 → "查看网页源代码"
- 你会看到只有一个空的 `<div id="root"></div>`
- 内容需要 JavaScript 加载后才有

#### 任务 3：权限控制体验

1. **退出登录**（点击右上角"退出"）
2. **重新登录，这次选择"Guest"**
3. **尝试访问仪表盘**（`/ssr-dashboard`）

**观察要点：**
- 你会被跳转到 403 页面
- 提示"权限不足"
- 这就是**服务端权限控制**！

4. **再次登录，选择"User"或"Admin"**
5. **现在可以访问仪表盘了**

---

### 第三步：理解代码

#### 打开第一个文件：登录页面

文件位置：`pages/ssr-login.tsx`

**关键代码解读：**

```tsx
// 1. 这是一个普通的 React 组件
export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState('user');

  const handleLogin = async () => {
    // 2. 设置 Cookie（简单的身份验证）
    document.cookie = `token=${token}; path=/; max-age=86400`;

    // 3. 跳转到新闻页面
    router.push('/ssr-news');
  };

  return (
    // 4. 渲染登录界面
    <div>
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="admin">管理员</option>
        <option value="user">普通用户</option>
        <option value="guest">访客</option>
      </select>
      <button onClick={handleLogin}>立即登录</button>
    </div>
  );
}
```

**理解要点：**
- 这是**客户端渲染**的页面（没有 `getServerSideProps`）
- 登录时设置 Cookie，后续请求会带上
- Cookie 就像你的"会员卡"，服务器看到就知道你是谁

#### 打开第二个文件：新闻列表

文件位置：`pages/ssr-news.tsx`

**关键代码解读：**

```tsx
// 1. 页面组件（这部分在服务端和客户端都会执行）
export default function NewsPage({ newsList, user, timestamp }) {
  return (
    <div>
      <p>渲染时间：{timestamp}</p>
      {newsList.map(news => (
        <div key={news.id}>
          <h2>{news.title}</h2>
          <p>{news.content}</p>
        </div>
      ))}
    </div>
  );
}

// 2. 服务端数据获取（只在服务端执行）
export const getServerSideProps = withAuth(async (context) => {
  // ⭐ 这段代码在服务器上运行！

  // 3. 获取当前用户（从 Cookie 读取）
  const user = getCurrentUser(context.req);

  // 4. 获取新闻数据（可以访问数据库）
  const newsList = await fetchNewsList();

  // 5. 生成时间戳（证明是服务端渲染）
  const timestamp = new Date().toLocaleString('zh-CN');

  // 6. 返回数据给页面组件
  return {
    props: {
      newsList,  // 新闻列表
      user,      // 用户信息
      timestamp, // 时间戳
    }
  };
});
```

**理解要点：**

**🔑 关键 1：两个部分**
- `NewsPage` 组件：渲染界面（服务端先执行一次，客户端 hydration）
- `getServerSideProps`：获取数据（**只在服务端执行**）

**🔑 关键 2：执行流程**
```
用户访问 /ssr-news
  ↓
服务器执行 getServerSideProps
  ↓ 获取 user（从 Cookie）
  ↓ 获取 newsList（从数据库）
  ↓ 生成 timestamp
  ↓
服务器用这些数据渲染 NewsPage 组件
  ↓ 生成完整 HTML
  ↓
返回给浏览器
  ↓
浏览器显示（用户立即看到）
  ↓
JavaScript 加载，页面变得可交互
```

**🔑 关键 3：context 对象**

`context` 包含请求信息：

```typescript
context.req        // 请求对象（可以读 Cookie、Header）
context.res        // 响应对象（可以设置 Header、Cookie）
context.query      // URL 参数 (?page=1 → { page: '1' })
context.params     // 动态路由参数
```

#### 打开第三个文件：中间件

文件位置：`middlewares/ssr.ts`

**withAuth 中间件解读：**

```typescript
// 这是一个"高阶函数"（函数返回函数）
export function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    // 1. 检查用户是否登录
    if (!checkLogin(context.req)) {
      // 2. 未登录 → 重定向到登录页
      return {
        redirect: {
          destination: '/ssr-login',
          permanent: false,
        },
      };
    }

    // 3. 已登录 → 继续执行原函数
    return await getServerSidePropsFunc(context);
  };
}
```

**理解要点：**

**🤔 什么是中间件？**

中间件就像"安检门"：

```
用户请求
  ↓
中间件检查（withAuth）
  ├─ 未登录 → 拦截，跳转登录页 ❌
  └─ 已登录 → 放行 ✅
      ↓
  执行原函数（getServerSideProps）
```

**💡 使用方法：**

```typescript
// 不用中间件（每个页面都要写重复代码）
export const getServerSideProps = async (context) => {
  if (!checkLogin(context.req)) {
    return { redirect: { destination: '/login' } };
  }
  // 获取数据...
};

// 用中间件（简洁！）
export const getServerSideProps = withAuth(async (context) => {
  // 不用检查登录，中间件已经帮你检查了
  // 获取数据...
});
```

---

## 第三部分：核心知识

### getServerSideProps 详解

#### 基本语法

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  // 在服务端执行的代码

  return {
    props: { /* 数据 */ }  // 传给页面组件
  };
};
```

#### 返回值类型

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
    permanent: false,       // 是否永久重定向
  }
};
```

**3. 返回 notFound（404）**

```typescript
return {
  notFound: true  // 显示 404 页面
};
```

#### 实际例子

**例子 1：获取用户信息**

```typescript
export const getServerSideProps = async (context) => {
  // 从 URL 获取用户 ID
  const userId = context.query.id;

  // 查询数据库
  const user = await db.getUserById(userId);

  // 如果用户不存在
  if (!user) {
    return { notFound: true };
  }

  // 返回用户数据
  return {
    props: { user }
  };
};
```

**例子 2：权限检查**

```typescript
export const getServerSideProps = async (context) => {
  // 检查是否登录
  const token = context.req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    };
  }

  // 获取数据
  const data = await fetchData();
  return { props: { data } };
};
```

**例子 3：并发请求**

```typescript
export const getServerSideProps = async (context) => {
  // 同时请求多个数据源（更快！）
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);

  return {
    props: { user, posts, comments }
  };
};
```

---

### 中间件是什么

#### 用生活例子理解

**场景：进入图书馆**

```
你想进图书馆
  ↓
门卫检查（中间件 1）
  ├─ 没带学生证 → 拦下 ❌
  └─ 有学生证 → 放行 ✅
      ↓
  管理员检查（中间件 2）
      ├─ 书包太大 → 让你寄存 ⚠️
      └─ 没问题 → 放行 ✅
          ↓
      进入图书馆 ✅
```

#### 在 SSR 中的应用

**我们有 3 个中间件：**

**1. withAuth（登录检查）**

```typescript
export const getServerSideProps = withAuth(async (ctx) => {
  // 这里的代码只有登录用户才能执行
});
```

**2. withRole（权限检查）**

```typescript
export const getServerSideProps = withRole(['admin', 'user'], async (ctx) => {
  // 只有 admin 和 user 能访问
});
```

**3. withErrorHandling（错误处理）**

```typescript
export const getServerSideProps = withErrorHandling(async (ctx) => {
  // 如果出错，自动跳转到错误页面
});
```

#### 中间件的组合使用

```typescript
// 同时使用多个中间件
export const getServerSideProps = compose(
  withErrorHandling,  // 外层：捕获所有错误
  withAuth,          // 中层：检查登录
  async (ctx) => {   // 内层：业务逻辑
    return { props: { data } };
  }
);
```

**执行顺序：**

```
请求进来
  ↓
withErrorHandling（开始监听错误）
  ↓
withAuth（检查登录）
  ├─ 未登录 → 重定向 ❌
  └─ 已登录 ✅
      ↓
  执行业务逻辑
      ├─ 出错 → withErrorHandling 捕获 ⚠️
      └─ 成功 → 返回数据 ✅
```

---

### 权限控制实现

#### 三种角色的区别

| 角色 | 英文 | 权限 |
|------|------|------|
| 管理员 | Admin | 全部页面 ✅ |
| 普通用户 | User | 新闻列表 ✅<br>仪表盘 ✅ |
| 访客 | Guest | 新闻列表 ✅<br>仪表盘 ❌ |

#### 实现原理

**1. 登录时设置角色**

```typescript
// 登录成功后
const token = generateToken({
  id: user.id,
  username: user.username,
  role: user.role,  // 'admin', 'user', 或 'guest'
});

// 保存到 Cookie
document.cookie = `token=${token}`;
```

**2. 服务端读取角色**

```typescript
export const getServerSideProps = async (context) => {
  // 从 Cookie 读取 token
  const token = context.req.cookies.token;

  // 解析出用户信息（包含 role）
  const user = verifyToken(token);
  // user = { id: 1, username: 'admin', role: 'admin' }
};
```

**3. 检查权限**

```typescript
export const getServerSideProps = withRole(
  ['admin', 'user'],  // 允许的角色列表
  async (context) => {
    // Guest 会被拦截
    // Admin 和 User 可以访问
  }
);
```

#### 完整流程图

```
用户访问仪表盘
  ↓
服务器执行 withRole 中间件
  ↓
读取 Cookie 中的 token
  ↓
解析出用户角色
  ↓
检查角色是否在允许列表中
  ├─ Admin → 在列表中 ✅ → 继续
  ├─ User  → 在列表中 ✅ → 继续
  └─ Guest → 不在列表中 ❌ → 跳转 403
      ↓
  获取数据并渲染页面
```

---

## 第四部分：常见问题

### Q1: 为什么时间戳不更新？

**问题：**刷新页面，时间戳还是旧的。

**原因：**浏览器缓存了页面。

**解决方法：**

1. 打开浏览器开发者工具（F12）
2. 勾选"Disable cache"
3. 刷新页面

或者按 `Ctrl+Shift+R`（Windows）/ `Cmd+Shift+R`（Mac）强制刷新。

---

### Q2: 如何知道代码在服务端还是客户端执行？

**简单判断：**

```typescript
// 只在服务端执行
export const getServerSideProps = async (context) => {
  console.log('这里只在服务端打印'); // 在终端看到
};

// 服务端和客户端都执行
export default function Page() {
  console.log('这里两边都会打印'); // 在终端和浏览器都看到

  useEffect(() => {
    console.log('这里只在客户端打印'); // 只在浏览器看到
  }, []);
}
```

**实用技巧：**

```typescript
// 检查是否在服务端
if (typeof window === 'undefined') {
  // 服务端代码
} else {
  // 客户端代码
}
```

---

### Q3: 为什么不能在 getServerSideProps 中使用 useState？

**错误示例：**

```typescript
export const getServerSideProps = async (context) => {
  const [data, setData] = useState(null); // ❌ 错误！
};
```

**原因：**
- `getServerSideProps` 在服务端执行
- React Hooks（useState, useEffect）只能在组件中使用
- 服务端没有 React 组件生命周期

**正确做法：**

```typescript
// getServerSideProps: 只获取数据
export const getServerSideProps = async (context) => {
  const data = await fetchData();
  return { props: { data } };
};

// 组件: 使用 useState 管理状态
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

1. **自动携带**：浏览器会自动把 Cookie 带上
2. **服务端可读**：getServerSideProps 能直接读取
3. **安全**：可以设置 httpOnly，防止 JavaScript 窃取

**Cookie vs LocalStorage：**

| | Cookie | LocalStorage |
|---|--------|--------------|
| 服务端可读 | ✅ 可以 | ❌ 不可以 |
| 自动携带 | ✅ 自动 | ❌ 需手动 |
| 容量 | 4KB | 5MB |
| 适合 SSR | ✅ 完美 | ❌ 不适合 |

---

### Q5: 如何调试 getServerSideProps？

**方法 1：查看终端**

```typescript
export const getServerSideProps = async (context) => {
  console.log('用户 ID:', context.query.id);
  console.log('Cookie:', context.req.cookies);
  // 这些会在终端（运行 npm run dev 的窗口）打印
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

**方法 3：使用 VS Code 断点**

1. 在 `getServerSideProps` 中打断点
2. 按 F5 启动调试
3. 访问页面，代码会在断点处停下

---

### Q6: 我能在 getServerSideProps 里做什么？

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
  const userAgent = context.req.headers['user-agent'];

  return { props: { data } };
};
```

**❌ 不能做：**

```typescript
export const getServerSideProps = async (context) => {
  // ❌ 使用浏览器 API
  window.location.href = '/login'; // 错误！服务端没有 window

  // ❌ 使用 React Hooks
  const [data, setData] = useState(null); // 错误！

  // ❌ 操作 DOM
  document.getElementById('root'); // 错误！服务端没有 DOM
};
```

---

## 🎓 学习路线建议

### 第 1 天：理解概念

**上午（1-2小时）：**
1. 阅读"第一部分：概念理解"
2. 理解 SSR vs CSR 的区别
3. 思考：你的项目适合用 SSR 吗？

**下午（1-2小时）：**
1. 启动项目
2. 完成"第二步：体验 SSR"的所有任务
3. 尝试不同角色登录，观察区别

**晚上（可选）：**
- 思考今天学到的内容
- 记录不懂的地方，明天继续

---

### 第 2 天：理解代码

**上午（2小时）：**
1. 阅读"第三步：理解代码"
2. 打开 VS Code，跟着文档看代码
3. 在关键位置加 `console.log`，观察输出

**下午（2小时）：**
1. 阅读"第三部分：核心知识"
2. 重点理解 getServerSideProps
3. 尝试修改代码，看看效果

**练习：**

在 `pages/ssr-news.tsx` 中：

```typescript
export const getServerSideProps = withAuth(async (context) => {
  const user = getCurrentUser(context.req);
  const newsList = await fetchNewsList();

  // 🎯 练习1：打印用户信息
  console.log('当前用户:', user);

  // 🎯 练习2：只返回3条新闻
  const limitedNews = newsList.slice(0, 3);

  return {
    props: {
      newsList: limitedNews, // 改这里
      user,
      timestamp: new Date().toLocaleString('zh-CN'),
    }
  };
});
```

---

### 第 3 天：动手实践

**任务 1：添加分页（1-2小时）**

在新闻列表添加分页功能：

```typescript
export const getServerSideProps = withAuth(async (context) => {
  // 从 URL 获取页码 (?page=2)
  const page = parseInt(context.query.page as string) || 1;
  const pageSize = 5;

  const newsList = await fetchNewsList();

  // 计算起始位置
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // 切片
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

**任务 2：添加搜索（1-2小时）**

```typescript
export const getServerSideProps = withAuth(async (context) => {
  const keyword = context.query.q as string;

  let newsList = await fetchNewsList();

  // 如果有搜索关键词，过滤新闻
  if (keyword) {
    newsList = newsList.filter(news =>
      news.title.includes(keyword) ||
      news.content.includes(keyword)
    );
  }

  return { props: { newsList, keyword } };
});
```

**任务 3：自由发挥**

尝试实现一个你自己的功能！

---

## 🎯 检查清单

学完后，检查你是否：

**概念理解：**
- [ ] 能用自己的话解释什么是 SSR
- [ ] 知道 SSR 和 CSR 的区别
- [ ] 理解 SSR 的优缺点

**代码理解：**
- [ ] 知道 getServerSideProps 在哪里执行
- [ ] 能看懂 withAuth 中间件的代码
- [ ] 理解权限控制的实现原理

**动手能力：**
- [ ] 能成功启动项目
- [ ] 能体验不同角色的权限
- [ ] 能修改代码并看到效果

**进阶能力：**
- [ ] 能自己实现一个简单的 SSR 页面
- [ ] 能处理常见的错误
- [ ] 知道如何调试

---

## 📚 推荐阅读顺序

1. 本文档（零基础入门）
2. [QUICKSTART-SSR.md](../QUICKSTART-SSR.md)（快速参考）
3. [chapter7-ssr-guide.md](./chapter7-ssr-guide.md)（详细教程）
4. [README-SSR.md](../README-SSR.md)（项目总结）

---

## 💬 还有问题？

如果你还是不懂，可能是因为：

1. **前置知识不够**：建议先学习 React 基础
2. **没有动手实践**：一定要自己跑一遍代码
3. **理解方式不对**：试试换个角度，从生活例子理解

**记住：**
> 学编程最重要的是**动手写**，而不是光看。每天写一点，一个月后你会惊讶于自己的进步！

**加油！** 🚀
