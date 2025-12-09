# Next.js SSR 从零开始超详细教程

> 🎯 **适合人群**：完全零基础的初学者
> ⏱️ **学习时间**：建议 3-5 天，每天 2 小时
> 💡 **前置知识**：会一点 JavaScript 就可以

---

## 📖 目录

- [第一步：快速开始](#第一步快速开始)
- [第二步：理解 SSR](#第二步理解-ssr)
- [第三步：动手实践](#第三步动手实践)
- [第四步：核心代码讲解](#第四步核心代码讲解)
- [第五步：常见问题](#第五步常见问题)

---

## 第一步：快速开始

### 1.1 启动项目（3 分钟）

打开终端，在项目目录下运行：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

看到这个说明成功了：
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### 1.2 体验 SSR（5 分钟）

**步骤 1：访问首页**
- 打开浏览器：http://localhost:3000
- 你会看到项目首页

**步骤 2：进入 SSR 登录**
- 点击"第七章：SSR"卡片
- 或直接访问：http://localhost:3000/ssr-login

**步骤 3：选择角色登录**
- 选择"Admin"（管理员）
- 点击"立即登录"

**步骤 4：查看新闻列表**
- 登录后自动跳转到新闻列表
- **重点**：看页面顶部的时间戳（比如：2024-01-15 14:30:15）
- 按 F5 刷新页面
- **时间戳变了！** 这就是 SSR 的效果

**步骤 5：测试权限控制**
- 点击右上角"退出"
- 重新登录，这次选择"Guest"（访客）
- 尝试访问仪表盘：http://localhost:3000/ssr-dashboard
- **被拦截了！** 跳转到 403 页面，这就是权限控制

---

## 第二步：理解 SSR

### 2.1 什么是 SSR？用最简单的话解释

#### 🍽️ 餐厅比喻

**SSR（服务端渲染）就像餐厅点菜：**

```
你：我要一份炒饭
  ↓
厨师在后厨炒好（服务器生成 HTML）
  ↓
服务员端上桌（浏览器收到完整页面）
  ↓
你立即吃（用户马上看到内容）
```

**CSR（客户端渲染）就像自己做饭：**

```
你：我要一份炒饭
  ↓
服务员给你食材和菜谱（空白 HTML + JavaScript）
  ↓
你自己在桌上炒（浏览器执行 JS）
  ↓
炒好才能吃（等待后才看到内容）
```

### 2.2 SSR 的工作流程（超详细）

```
用户在浏览器输入：http://localhost:3000/ssr-news
  ↓
请求发送到 Next.js 服务器
  ↓
服务器执行 getServerSideProps 函数
  ├─ 读取 Cookie（知道你是谁）
  ├─ 查询数据库（获取新闻列表）
  ├─ 生成时间戳（证明是服务端渲染的）
  └─ 把数据打包
  ↓
服务器用数据渲染 React 组件
  └─ 生成完整的 HTML 页面
  ↓
服务器把 HTML 发给浏览器
  ↓
浏览器收到并立即显示（用户马上看到内容）
  ↓
浏览器加载 JavaScript
  ↓
页面变得可交互（按钮可以点击）
```

**关键点：**
1. HTML 在**服务器**上生成
2. 用户**立即**看到内容
3. 搜索引擎能抓取**完整内容**

### 2.3 为什么要用 SSR？

#### 场景 1：新闻网站（首屏速度）

**不用 SSR：**
```
用户打开页面
  ↓
看到空白页
  ↓
等待 JavaScript 加载（2 秒）
  ↓
JavaScript 执行，请求数据（1 秒）
  ↓
渲染页面（1 秒）
  ↓
总共等待：4 秒 ❌ 用户可能已经关闭页面了
```

**使用 SSR：**
```
用户打开页面
  ↓
立即看到内容
  ↓
总共等待：0.5 秒 ✅ 用户体验好
```

#### 场景 2：电商商品页（SEO）

**不用 SSR（搜索引擎看到的）：**
```html
<div id="root"></div>
<script src="app.js"></script>
```
❌ 搜索引擎抓不到商品信息，不利于 SEO

**使用 SSR（搜索引擎看到的）：**
```html
<div id="root">
  <h1>iPhone 15 Pro</h1>
  <p>最新款苹果手机</p>
  <span>¥7999</span>
</div>
```
✅ 搜索引擎能抓到完整信息，有利于 SEO

#### 场景 3：需要登录的页面（安全性）

**不用 SSR：**
```
1. 用户访问页面
2. 浏览器加载页面
3. JavaScript 检查登录状态
4. 发现未登录
5. 跳转登录页

问题：用户先看到内容，然后才被踢走 ❌
```

**使用 SSR：**
```
1. 用户访问页面
2. 服务器检查登录状态
3. 发现未登录
4. 直接返回登录页

优势：用户不会看到不该看的内容 ✅
```

### 2.4 SSR 适合什么场景？

| 场景 | 是否适合 SSR | 原因 |
|------|-------------|------|
| 新闻网站 | ✅ 非常适合 | 需要 SEO + 快速首屏 |
| 博客 | ✅ 非常适合 | 需要 SEO |
| 电商商品页 | ✅ 非常适合 | 需要 SEO |
| 用户仪表盘 | ✅ 适合 | 需要权限控制 |
| 管理后台 | ⚠️ 可选 | 不需要 SEO，CSR 也行 |
| 纯前端工具 | ❌ 不适合 | 不需要 SEO，CSR 更好 |

---

## 第三步：动手实践

### 3.1 体验实验：查看源代码

这个实验能让你直观理解 SSR 和 CSR 的区别。

**实验 1：查看 SSR 页面的源代码**

1. 访问新闻列表：http://localhost:3000/ssr-news
2. 右键点击页面 → "查看网页源代码"（或按 Ctrl+U）
3. 你会看到什么？

```html
<div>
  <h1>📰 新闻中心</h1>
  <article>
    <h2>Next.js 15 正式发布！</h2>
    <p>Next.js 15 带来了全新的...</p>
  </article>
  <!-- 更多新闻内容... -->
</div>
```

✅ **完整的新闻内容**都在 HTML 里！这就是 SSR。

**实验 2：查看 CSR 页面的源代码**

1. 访问商城页面：http://localhost:3000/shop
2. 右键点击页面 → "查看网页源代码"
3. 你会看到什么？

```html
<div id="root"></div>
<script src="/_next/static/chunks/pages/shop.js"></script>
```

❌ **几乎是空的**！内容需要 JavaScript 加载后才有。

**结论：**
- SSR：HTML 里有完整内容
- CSR：HTML 里几乎是空的

### 3.2 体验实验：时间戳变化

这个实验证明页面是在服务器上渲染的。

**步骤：**
1. 访问：http://localhost:3000/ssr-news
2. 看页面顶部的时间戳（比如：2024-01-15 14:30:15）
3. 按 F5 刷新页面
4. 时间戳变了！

**为什么时间戳会变？**
- 因为每次刷新，服务器都重新渲染页面
- 时间戳是在服务器上生成的
- 这证明了页面是 SSR 的

**对比：如果是 CSR**
- 时间戳在客户端生成
- 刷新时，时间戳可能不会立即更新
- 因为可能使用了缓存

### 3.3 体验实验：权限控制

这个实验让你理解服务端权限控制。

**实验 1：Admin 用户**
1. 登录时选择"Admin"
2. 访问仪表盘：http://localhost:3000/ssr-dashboard
3. ✅ 成功访问，看到完整数据

**实验 2：Guest 用户**
1. 退出登录
2. 重新登录，选择"Guest"
3. 访问仪表盘：http://localhost:3000/ssr-dashboard
4. ❌ 被拦截，跳转到 403 页面

**为什么 Guest 会被拦截？**
```
Guest 访问仪表盘
  ↓
服务器执行 getServerSideProps
  ↓
读取 Cookie，发现是 Guest
  ↓
检查权限，Guest 不在允许列表中
  ↓
直接返回 403 页面（不渲染仪表盘）
```

**关键点：**
- 权限检查在**服务器**完成
- Guest 用户**永远看不到**仪表盘的内容
- 比客户端检查更安全

---

## 第四步：核心代码讲解

### 4.1 第一个文件：登录页面

打开文件：`pages/ssr-login.tsx`

**这个页面做了什么？**
1. 让用户选择角色（Admin / User / Guest）
2. 点击登录后，设置 Cookie
3. 跳转到新闻列表

**核心代码（简化版）：**

```typescript
export default function LoginPage() {
  // 1. 用户选择的角色
  const [selectedUser, setSelectedUser] = useState('user');

  // 2. 点击登录按钮
  const handleLogin = async () => {
    // 3. 根据角色生成不同的 token
    const tokenMap = {
      admin: 'admin-token',
      user: 'user-token',
      guest: 'guest-token',
    };
    const token = tokenMap[selectedUser];

    // 4. 把 token 存到 Cookie（就像超市的会员卡）
    document.cookie = `token=${token}; path=/; max-age=86400`;

    // 5. 跳转到新闻列表
    router.push('/ssr-news');
  };

  return (
    <div>
      {/* 选择角色 */}
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

**理解要点：**

**什么是 Cookie？**
- Cookie 就像超市的会员卡
- 登录时，服务器给你一张"会员卡"（token）
- 以后访问时，自动带上这张"卡"
- 服务器看到"卡"，就知道你是谁

**为什么用 Cookie 而不是 LocalStorage？**
| | Cookie | LocalStorage |
|---|--------|--------------|
| 服务器能读取 | ✅ 能 | ❌ 不能 |
| 自动携带 | ✅ 自动 | ❌ 需手动 |
| 适合 SSR | ✅ 完美 | ❌ 不行 |

### 4.2 第二个文件：新闻列表（重点！）

打开文件：`pages/ssr-news.tsx`

这个文件分为两部分：

#### 第一部分：页面组件（渲染界面）

```typescript
export default function NewsPage({ newsList, user, timestamp }) {
  return (
    <div>
      {/* 显示时间戳 */}
      <p>渲染时间：{timestamp}</p>

      {/* 显示用户信息 */}
      <p>你好，{user.username}！</p>

      {/* 显示新闻列表 */}
      {newsList.map((news) => (
        <article key={news.id}>
          <h2>{news.title}</h2>
          <p>{news.content}</p>
        </article>
      ))}
    </div>
  );
}
```

**理解要点：**
- 这是一个普通的 React 组件
- 接收 props：`newsList`、`user`、`timestamp`
- 这些 props 从哪来？**从 getServerSideProps 传来！**

#### 第二部分：getServerSideProps（重点中的重点！）

```typescript
export const getServerSideProps = withAuth(async (context) => {
  // ⭐ 这段代码在服务器上运行！

  // 1. 获取当前用户（从 Cookie 读取）
  const user = getCurrentUser(context.req);
  // 结果：{ id: 1, username: 'admin', role: 'admin' }

  // 2. 获取新闻列表（可以访问数据库）
  const newsList = await fetchNewsList();
  // 结果：[{ id: 1, title: 'xxx', content: 'xxx' }, ...]

  // 3. 生成时间戳（证明是服务端渲染）
  const timestamp = new Date().toLocaleString('zh-CN');
  // 结果：'2024-01-15 14:30:15'

  // 4. 把数据返回给页面组件
  return {
    props: {
      newsList,  // 传给 NewsPage 组件
      user,      // 传给 NewsPage 组件
      timestamp, // 传给 NewsPage 组件
    },
  };
});
```

**完整流程图：**

```
用户访问 /ssr-news
  ↓
Next.js 服务器收到请求
  ↓
执行 getServerSideProps
  ├─ 读取 Cookie：context.req.cookies.token
  ├─ 解析用户信息：getCurrentUser()
  ├─ 查询数据库：fetchNewsList()
  ├─ 生成时间戳：new Date()
  └─ 返回数据：{ props: { ... } }
  ↓
用数据渲染 NewsPage 组件
  └─ <p>你好，admin！</p>
  └─ <p>渲染时间：2024-01-15 14:30:15</p>
  └─ <article>...</article>
  ↓
生成完整 HTML
  ↓
发送给浏览器
  ↓
用户立即看到完整内容 ✅
```

**关键理解点：**

**Q1: getServerSideProps 在哪里执行？**
- A: 在服务器上！（Node.js 环境）

**Q2: 可以在 getServerSideProps 里做什么？**
```typescript
// ✅ 可以做
await fetch('https://api.example.com')  // 调用 API
await prisma.user.findMany()            // 查询数据库
const file = fs.readFileSync('file.txt') // 读取文件
const secret = process.env.API_KEY      // 读取环境变量
const ip = context.req.socket.remoteAddress // 获取 IP

// ❌ 不能做
window.alert('hello')        // 错误！服务器没有 window
localStorage.getItem('token') // 错误！服务器没有 localStorage
document.getElementById('root') // 错误！服务器没有 DOM
```

**Q3: context 是什么？**
```typescript
context = {
  req: {
    cookies: { token: 'admin-token' },  // Cookie
    headers: { 'user-agent': '...' },   // 请求头
    socket: { remoteAddress: '192.168.1.1' } // IP
  },
  res: {
    setHeader: (name, value) => {}      // 设置响应头
  },
  query: { page: '1', id: '123' },      // URL 参数 ?page=1&id=123
  params: { id: '123' },                // 动态路由 /post/[id]
}
```

### 4.3 第三个文件：中间件

打开文件：`middlewares/ssr.ts`

**什么是中间件？**

中间件就像"安检门"：

```
用户请求页面
  ↓
中间件拦截（检查）
  ├─ 未登录 → 拦截，跳转登录页 ❌
  └─ 已登录 → 放行 ✅
      ↓
  执行 getServerSideProps
      ↓
  返回数据
```

**withAuth 中间件代码：**

```typescript
export function withAuth(getServerSidePropsFunc) {
  return async (context) => {
    // 1. 检查 Cookie 里有没有 token
    const token = context.req.cookies.token;

    // 2. 如果没有 token，说明未登录
    if (!token) {
      return {
        redirect: {
          destination: '/ssr-login',  // 跳转到登录页
          permanent: false,
        },
      };
    }

    // 3. 有 token，继续执行原函数
    return await getServerSidePropsFunc(context);
  };
}
```

**如何使用？**

```typescript
// 不用中间件（每个页面都要写重复代码）
export const getServerSideProps = async (context) => {
  // 检查登录
  if (!context.req.cookies.token) {
    return { redirect: { destination: '/login' } };
  }
  // 获取数据...
};

// 用中间件（简洁！）
export const getServerSideProps = withAuth(async (context) => {
  // 不用检查登录，中间件已经帮你检查了
  // 直接获取数据...
});
```

**withRole 中间件（权限控制）：**

```typescript
export function withRole(allowedRoles, getServerSidePropsFunc) {
  return async (context) => {
    // 1. 先检查登录
    if (!checkLogin(context.req)) {
      return { redirect: { destination: '/ssr-login' } };
    }

    // 2. 获取用户信息
    const user = getCurrentUser(context.req);
    // user = { id: 1, username: 'guest', role: 'guest' }

    // 3. 检查角色是否在允许列表中
    if (!allowedRoles.includes(user.role)) {
      return { redirect: { destination: '/ssr-403' } };
    }

    // 4. 权限通过，继续执行
    return await getServerSidePropsFunc(context);
  };
}
```

**使用例子：**

```typescript
// 只允许 admin 和 user 访问
export const getServerSideProps = withRole(
  ['admin', 'user'],
  async (context) => {
    // Guest 会被拦截
  }
);
```

**完整流程：**

```
Guest 用户访问仪表盘
  ↓
withRole 中间件执行
  ↓
检查登录：✅ 已登录（有 token）
  ↓
获取用户角色：role = 'guest'
  ↓
检查权限：'guest' 在 ['admin', 'user'] 中吗？
  ↓
不在！❌
  ↓
返回 redirect 到 /ssr-403
  ↓
Guest 看到 403 页面
```

---

## 第五步：常见问题

### Q1: 为什么刷新页面时间戳不变？

**原因：** 浏览器缓存了页面。

**解决方法：**
1. 打开开发者工具（F12）
2. 勾选"Disable cache"
3. 刷新页面

或者按 `Ctrl+Shift+R` 强制刷新。

### Q2: 如何知道代码在服务端还是客户端执行？

**方法 1：看 console.log 输出在哪里**

```typescript
export const getServerSideProps = async (context) => {
  console.log('这条消息在终端显示'); // 服务端
};

export default function Page() {
  console.log('这条消息在浏览器显示'); // 客户端
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

### Q3: 为什么不能在 getServerSideProps 中使用 useState？

**错误示例：**

```typescript
export const getServerSideProps = async (context) => {
  const [data, setData] = useState(null); // ❌ 错误！
};
```

**原因：**
- `getServerSideProps` 在服务端执行
- React Hooks 只能在组件中使用
- 服务端没有 React 组件生命周期

**正确做法：**

```typescript
// getServerSideProps: 只获取数据
export const getServerSideProps = async (context) => {
  const data = await fetchData();
  return { props: { data } };
};

// 组件: 使用 useState
export default function Page({ data }) {
  const [localData, setLocalData] = useState(data);
}
```

### Q4: 如何调试 getServerSideProps？

**方法 1：在终端查看输出**

```typescript
export const getServerSideProps = async (context) => {
  console.log('请求参数:', context.query);
  console.log('Cookie:', context.req.cookies);
  // 在终端（npm run dev 运行的窗口）查看
};
```

**方法 2：返回调试信息到页面**

```typescript
export const getServerSideProps = async (context) => {
  return {
    props: {
      debug: {
        query: context.query,
        cookies: context.req.cookies,
      }
    }
  };
};

export default function Page({ debug }) {
  return <pre>{JSON.stringify(debug, null, 2)}</pre>;
}
```

### Q5: getServerSideProps 可以访问什么？

**✅ 可以访问：**
- 数据库
- 文件系统
- 环境变量（`process.env`）
- Node.js API
- Cookie、Header

**❌ 不能访问：**
- `window`、`document`（浏览器 API）
- `localStorage`、`sessionStorage`
- React Hooks（`useState`、`useEffect`）

### Q6: SSR 页面可以使用客户端功能吗？

**可以！** SSR 只是首次渲染在服务端，之后和普通 React 一样。

```typescript
export default function Page({ data }) {
  // ✅ 可以用 hooks
  const [count, setCount] = useState(0);

  // ✅ 可以用 useEffect
  useEffect(() => {
    console.log('页面加载完成');
  }, []);

  // ✅ 可以用事件处理
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>服务端数据：{data}</p>
      <p>客户端状态：{count}</p>
      <button onClick={handleClick}>点击</button>
    </div>
  );
}
```

---

## 🎓 学习建议

### 第 1 天：理解概念

**上午（1 小时）：**
1. 阅读"第二步：理解 SSR"
2. 理解餐厅比喻
3. 理解 SSR 的工作流程

**下午（1 小时）：**
1. 完成"第三步：动手实践"的所有实验
2. 特别是源代码对比实验
3. 理解 SSR 和 CSR 的区别

### 第 2 天：理解代码

**上午（1.5 小时）：**
1. 阅读"第四步：核心代码讲解"
2. 重点理解 getServerSideProps
3. 在 VS Code 中打开代码，对照着看

**下午（1.5 小时）：**
1. 在代码中加 `console.log`
2. 观察输出在终端还是浏览器
3. 尝试修改数据，看效果

### 第 3 天：动手练习

**任务 1：修改时间格式（30 分钟）**

```typescript
// 把时间戳改成英文格式
const timestamp = new Date().toLocaleString('en-US');
```

**任务 2：添加访问计数（1 小时）**

```typescript
export const getServerSideProps = withAuth(async (context) => {
  // 读取访问次数
  const count = parseInt(context.req.cookies.visitCount || '0');

  // 次数 +1
  const newCount = count + 1;

  // 保存到 Cookie
  context.res.setHeader(
    'Set-Cookie',
    `visitCount=${newCount}; Path=/; Max-Age=86400`
  );

  return {
    props: {
      // ... 其他数据
      visitCount: newCount,
    }
  };
});
```

**任务 3：添加搜索功能（1.5 小时）**

参考"docs/chapter7-ssr-exercises.md"中的练习 5。

---

## 📚 更多学习资源

### 详细文档
- [零基础入门教程](./docs/chapter7-ssr-beginner-guide.md) - 最详细的讲解
- [实战练习题](./docs/chapter7-ssr-exercises.md) - 8 个练习 + 答案
- [快速开始指南](./QUICKSTART-SSR.md) - 5 分钟上手

### 测试账号

| 角色 | 权限说明 |
|------|----------|
| Admin | 全部权限，可访问所有页面 |
| User | 部分权限，可访问新闻和仪表盘 |
| Guest | 有限权限，只能访问新闻列表 |

---

## 🎯 检查清单

学完后，检查你是否能：

**概念理解：**
- [ ] 用自己的话解释什么是 SSR
- [ ] 说出 SSR 和 CSR 的 3 个主要区别
- [ ] 知道什么场景适合用 SSR

**代码理解：**
- [ ] 知道 getServerSideProps 在哪里执行
- [ ] 理解 withAuth 中间件的作用
- [ ] 能看懂权限控制的实现

**动手能力：**
- [ ] 能成功启动项目
- [ ] 能用不同角色登录并观察区别
- [ ] 能修改代码并看到效果

---

## 💬 还是不懂？

如果还是不明白，可能因为：

1. **没有动手实践** → 一定要自己运行代码，看效果
2. **跳过了实验** → 回去做"第三步：动手实践"的实验
3. **没有对照代码看** → 打开 VS Code，边看文档边看代码

**记住：**
> 学编程最重要的是**动手写**，不是光看。每天写一点，一个月后你会惊讶于自己的进步！

**加油！你可以的！** 🚀
