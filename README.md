# Next.js 全栈开发从零到一完整教程

> 🎯 **学习目标**：从零开始掌握 Next.js 全栈开发，包括 SSR、API Routes、权限控制等企业级技能

## 📖 教程说明

本教程将带你**从零开始**学习 Next.js 全栈开发。每个知识点都配有详细的讲解和代码示例，即使你是初学者，也能轻松跟上。

### 🎓 课程章节

#### 📰 第七章：服务端渲染 (SSR) 深度探究

**核心内容**：
- ✅ 理解 SSR 基本概念和工作原理
- ✅ 掌握 getServerSideProps 数据获取
- ✅ 实现基于 Cookie 的身份验证
- ✅ 使用中间件模式实现权限控制
- ✅ SSR 性能优化与安全防护

**项目功能**：
- 🔐 登录系统（支持 Admin / User / Guest 三种角色）
- 📰 新闻列表（服务端实时渲染）
- 📊 用户仪表盘（带权限控制）
- 🛡️ 错误处理（403 / 通用错误页面）

**快速开始**：
```bash
npm run dev
# 访问 http://localhost:3000/ssr-login
```

👉 [查看第七章详细教程](./docs/chapter7-ssr-guide.md)
👉 [快速开始 SSR 项目](./QUICKSTART-SSR.md)

---

#### 🛍️ API Routes 与全栈开发

**核心内容**：
- ✅ Next.js API Routes 后端开发
- ✅ JWT 认证与权限控制
- ✅ 数据校验（Zod）与接口限流
- ✅ 文件上传与 RESTful API
- ✅ 完整的商品管理系统

**项目功能**：
- 🛒 商品商城（浏览、搜索、分页）
- 🔐 用户登录/注册（JWT 认证）
- ⚙️ 后台管理（商品增删改查）
- 📤 图片上传（Base64）

**快速开始**：
```bash
npm run dev
# 访问 http://localhost:3000/shop
```

---

## 🚀 快速体验项目

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 启动项目

```bash
npm run dev
```

看到这个提示说明启动成功：
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### 3️⃣ 访问页面

打开浏览器，访问以下页面体验功能：

#### SSR 相关页面

| 页面 | 地址 | 功能 |
|------|------|------|
| 登录页面 | http://localhost:3000/ssr-login | SSR 登录（3种角色） |
| 新闻列表 | http://localhost:3000/ssr-news | 服务端实时渲染 |
| 用户仪表盘 | http://localhost:3000/ssr-dashboard | 权限控制示例 |

#### API Routes 相关页面

| 页面 | 地址 | 功能 |
|------|------|------|
| 商品商城 | http://localhost:3000/shop | 浏览商品、搜索、分页 |
| 登录页面 | http://localhost:3000/shop/login | 用户登录/注册 |
| 后台管理 | http://localhost:3000/admin | 管理商品（需要先登录） |

### 4️⃣ 测试账号

#### SSR 登录测试

| 角色 | 权限说明 | 能访问的页面 |
|------|----------|--------------|
| **Admin** | 全部权限 | 新闻列表 + 仪表盘 |
| **User** | 部分权限 | 新闻列表 + 仪表盘 |
| **Guest** | 有限权限 | 仅新闻列表 |

#### API 商城测试

| 用户名 | 密码 | 权限 |
|--------|------|------|
| admin | admin123 | 管理员（可以增删改商品） |
| user | user123 | 普通用户（只能浏览） |

---

## 📁 项目结构详解

```
next-app/
├── app/                      # App Router 页面（前端界面）
│   ├── page.tsx              # 首页导航
│   ├── shop/                 # 商城页面
│   │   ├── page.tsx          # 商品列表页
│   │   └── login/
│   │       └── page.tsx      # 登录页
│   └── admin/
│       └── page.tsx          # 后台管理页
│
├── pages/                    # Pages Router（SSR 页面 + API）
│   ├── ssr-login.tsx         # SSR 登录页
│   ├── ssr-news.tsx          # SSR 新闻列表
│   ├── ssr-dashboard.tsx     # SSR 用户仪表盘
│   ├── ssr-403.tsx           # 403 禁止访问
│   ├── ssr-error.tsx         # 错误页面
│   │
│   └── api/v1/               # 后端 API 接口
│       ├── products/         # 商品相关接口
│       │   ├── index.ts      # 获取商品列表
│       │   ├── [id].ts       # 获取单个商品
│       │   └── manage.ts     # 增删改商品
│       ├── auth/             # 用户认证接口
│       │   ├── login.ts      # 登录
│       │   ├── register.ts   # 注册
│       │   └── me.ts         # 获取当前用户信息
│       └── upload/
│           └── image.ts      # 图片上传
│
├── middlewares/              # SSR 中间件
│   └── ssr.ts                # withAuth、withRole、withErrorHandling
│
├── lib/api/                  # API 工具库
│   ├── response.ts           # 统一响应格式
│   ├── rateLimit.ts          # 接口限流（防刷）
│   ├── validate.ts           # 数据校验（Zod）
│   ├── auth.ts               # JWT 认证
│   ├── idempotency.ts        # 防重复提交
│   └── database.ts           # 数据库（模拟）
│
├── utils/                    # SSR 工具函数
│   └── auth.ts               # SSR 身份验证
│
├── data/                     # 模拟数据
│   ├── news.ts               # 新闻数据
│   └── users.ts              # 用户数据
│
├── types/                    # TypeScript 类型定义
│   └── index.ts
│
├── styles/                   # 样式文件
│   ├── Login.module.css      # SSR 登录页样式
│   ├── News.module.css       # SSR 新闻页样式
│   ├── Dashboard.module.css  # SSR 仪表盘样式
│   └── Error.module.css      # SSR 错误页样式
│
├── docs/                     # 详细文档
│   └── chapter7-ssr-guide.md # 第七章完整教程
│
├── README.md                 # 主文档（本文件）
├── README-SSR.md             # SSR 项目总结
└── QUICKSTART-SSR.md         # SSR 快速开始
```

**理解两个关键目录：**
- `app/` - App Router 前端页面（React Server Components）
- `pages/` - Pages Router（SSR 页面 + API Routes）

---

## 🎯 核心知识点

### 🚀 SSR 服务端渲染

#### 什么是 SSR？

**简单理解：**
SSR 就像餐厅服务。厨师在后厨把菜做好（服务端渲染 HTML），直接端上桌（返回给浏览器），你可以立即享用（快速显示内容）。

**SSR 的优势：**
- ⚡ 首屏加载快（用户立即看到内容）
- 🔍 SEO 友好（搜索引擎能抓取完整内容）
- 🔄 实时数据（每次请求都获取最新数据）
- 🛡️ 更安全（API 密钥不暴露给客户端）

#### getServerSideProps 基础

```typescript
// pages/ssr-news.tsx
export const getServerSideProps = async (context) => {
  // 这段代码在服务端执行
  const data = await fetchData();

  return {
    props: { data }  // 传递给页面组件
  };
};
```

#### SSR 中间件模式

```typescript
// 登录验证中间件
export const getServerSideProps = withAuth(async (context) => {
  // 只有登录用户才能执行这里的代码
  return { props: { data } };
});

// 角色权限中间件
export const getServerSideProps = withRole(['admin', 'user'], async (ctx) => {
  // 只有 admin 和 user 能访问
  return { props: { data } };
});
```

---

### 🔌 API Routes 开发

#### 什么是 API？

**简单理解：**
API 就像餐厅的服务员。你（前端）不用进厨房，只需要告诉服务员（API）你要什么菜（数据），服务员会去厨房（数据库）帮你拿。

#### 创建第一个 API

```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello, World!' });
}
```

访问 `http://localhost:3000/api/hello`，就会看到返回的 JSON 数据。

#### 统一响应格式

```typescript
// 所有接口都返回相同格式
{
  code: 0,           // 0=成功，非0=失败
  message: "操作成功",
  data: {...},
  timestamp: 1234567890
}
```

---

### 🔐 JWT 认证

**JWT 就是互联网的身份证！**

#### 工作流程

```
1. 用户登录
   → 服务器验证通过 → 生成 Token

2. 后续请求
   → 客户端带上 Token → 服务器验证 → 允许访问
```

#### 代码示例

```typescript
// 生成 Token
const token = generateToken({ id: user.id, username: user.username });

// 验证 Token
const user = verifyToken(token);

// 保护接口
export default withAuth(handler);  // 需要登录才能访问
export default withAdmin(handler); // 需要管理员权限
```

---

### ✅ 数据校验（Zod）

**不用写一堆 if 判断！**

```typescript
// 定义校验规则
const productSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.number().positive(),
  stock: z.number().int().min(0).optional(),
});

// 一行代码完成校验
const result = validate(productSchema, req.body);
```

---

### 🚦 接口限流

**防止恶意刷接口！**

```typescript
// 每个 IP 每分钟最多 5 次请求
if (checkRateLimit(ip, 5, 60_000)) {
  return res.status(429).json(error('请求过于频繁'));
}
```

---

### 📤 文件上传

**Base64 方式，简单易懂！**

```typescript
// 前端：读取文件转 Base64
const reader = new FileReader();
reader.readAsDataURL(file);

// 后端：解码并保存
const buffer = Buffer.from(base64Data, 'base64');
fs.writeFileSync(filePath, buffer);
```

---

## 📚 详细教程文档

### 第七章：SSR 深度探究

- **[完整教程](./docs/chapter7-ssr-guide.md)** - 13000+字详细讲解
  - SSR 基本概念
  - getServerSideProps 详解
  - 中间件模式设计
  - 权限控制实战
  - 性能优化技巧
  - 企业级最佳实践

- **[项目总结](./README-SSR.md)** - 快速了解 SSR 项目

- **[快速开始](./QUICKSTART-SSR.md)** - 5分钟上手 SSR

### API Routes 开发

参考本文档下方的详细内容。

---

## 🔍 学习路线

### 第1阶段：理解 SSR（1-2天）

1. **阅读文档**：[第七章完整教程](./docs/chapter7-ssr-guide.md)
2. **体验项目**：访问 `/ssr-login`，体验三种角色
3. **阅读代码**：
   ```
   types/index.ts → utils/auth.ts → middlewares/ssr.ts
   → pages/ssr-login.tsx → pages/ssr-news.tsx
   ```

### 第2阶段：学习 API Routes（2-3天）

1. **理解基础**：统一响应、数据校验、JWT 认证
2. **阅读代码**：`lib/api/` 和 `pages/api/` 目录
3. **动手实践**：修改一个接口，添加新功能

### 第3阶段：综合实战（3-5天）

1. **SSR + API 结合**：实现一个完整功能
2. **性能优化**：缓存、限流、并发优化
3. **部署上线**：Vercel 部署

---

## 💡 实战练习

### 练习 1：SSR 分页

在新闻列表添加分页功能：

```typescript
const page = parseInt(context.query.page as string) || 1;
const pageSize = 5;
// 实现分页逻辑...
```

### 练习 2：SSR 搜索

根据关键词搜索新闻：

```typescript
const keyword = context.query.q as string;
if (keyword) {
  newsList = newsList.filter(news =>
    news.title.includes(keyword)
  );
}
```

### 练习 3：添加新功能

自己动手实现：
- 商品收藏功能
- 评论功能
- 购物车功能

---

## 🔒 安全最佳实践

### 1. 环境变量

```env
# .env.local
JWT_SECRET=your_super_secret_key
```

### 2. 密码加密

```bash
npm install bcrypt
```

```typescript
// 注册时加密
const hashedPassword = await bcrypt.hash(password, 10);

// 登录时验证
const valid = await bcrypt.compare(password, user.password);
```

### 3. HTTPS

生产环境必须使用 HTTPS（Vercel 自动启用）。

---

## 🚧 常见问题

### Q1: 接口返回 404？

**检查清单：**
- 文件是否在 `pages/api/` 目录？
- 文件名大小写是否正确？
- 访问的 URL 是否正确？

### Q2: Token 无效？

**可能原因：**
- Token 过期（默认7天）
- JWT_SECRET 变了
- Token 格式错误（必须是 `Bearer xxx`）

**解决方法：**重新登录获取新 Token

### Q3: SSR 时间戳不更新？

**原因：**浏览器缓存

**解决：**打开开发者工具，勾选"Disable cache"

---

## 🎉 学习成果

完成本教程后，你将掌握：

### SSR 相关
1. ✅ SSR 基本原理和工作流程
2. ✅ getServerSideProps 使用方法
3. ✅ 服务端身份验证
4. ✅ 中间件模式设计
5. ✅ 基于角色的权限控制（RBAC）

### API Routes 相关
6. ✅ RESTful API 设计
7. ✅ JWT 认证实现
8. ✅ 数据校验（Zod）
9. ✅ 接口限流
10. ✅ 文件上传

### 企业级实践
11. ✅ 代码组织与分层
12. ✅ 错误处理
13. ✅ 性能优化
14. ✅ 安全防护

---

## 📖 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [getServerSideProps 详解](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props)
- [JWT 官网](https://jwt.io/)
- [Zod 文档](https://zod.dev/)
- [Prisma 文档](https://www.prisma.io/docs)

---

## 🚀 部署上线

### 使用 Vercel（推荐）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 配置环境变量
# 在 Vercel 网站上配置 JWT_SECRET
```

**或者直接连接 GitHub：**
1. 推送代码到 GitHub
2. 在 Vercel 官网导入项目
3. 自动部署

---

## 💻 技术栈

- **框架**：Next.js 15+
- **语言**：TypeScript
- **样式**：Tailwind CSS + CSS Modules
- **认证**：JWT (jsonwebtoken)
- **校验**：Zod
- **部署**：Vercel

---

## 📝 项目统计

- **页面数量**：10+ 个
- **API 接口**：8 个
- **中间件**：3 个（SSR）
- **工具函数**：10+ 个
- **代码行数**：5000+ 行
- **文档字数**：20000+ 字

---

## 🤝 贡献指南

欢迎贡献代码或提出建议！

1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

---

## 📄 开源协议

MIT License

---

**最后，记住：**

> 编程就像学游泳，看再多教程都不如下水试试。遇到问题别慌，Google/ChatGPT 是你的好朋友！

**祝你学习愉快！** 🚀
