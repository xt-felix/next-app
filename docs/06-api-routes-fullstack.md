# 第六章：API Routes 与全栈开发基础

> 完整的全栈商品管理系统案例，涵盖 Next.js API Routes、JWT 认证、数据校验、限流、文件上传等企业级开发知识点。

## 📚 案例简介

本案例是一个完整的全栈商品管理系统，包含：

- **前端部分**：商品商城、后台管理、用户登录
- **后端部分**：RESTful API、JWT 认证、数据管理
- **核心功能**：商品 CRUD、用户认证、图片上传、分页查询、搜索过滤

通过本案例，你将掌握 Next.js 全栈开发的完整流程，从 API 设计到前端实现。

---

## 🎯 学习目标

1. ✅ 掌握 Next.js API Routes 的基本用法和高级特性
2. ✅ 理解 RESTful API 设计规范和版本管理
3. ✅ 掌握 JWT 认证机制和权限控制
4. ✅ 学会数据校验（Zod）和错误处理
5. ✅ 掌握接口限流和安全防护
6. ✅ 学会文件上传（Base64）的实现
7. ✅ 理解前后端分离与一体化开发的区别
8. ✅ 掌握移动端适配和响应式设计

---

## 📁 项目结构

```
next-app/
├── app/
│   ├── shop/                 # 商城前端
│   │   ├── page.tsx          # 商品列表页
│   │   └── login/
│   │       └── page.tsx      # 登录页
│   └── admin/
│       └── page.tsx          # 后台管理页
├── pages/
│   └── api/
│       └── v1/               # API 版本管理
│           ├── products/     # 商品相关接口
│           │   ├── index.ts  # 获取商品列表
│           │   ├── [id].ts   # 获取单个商品
│           │   └── manage.ts # 管理商品（需管理员权限）
│           ├── auth/         # 认证相关接口
│           │   ├── login.ts  # 登录
│           │   ├── register.ts # 注册
│           │   └── me.ts     # 获取当前用户信息
│           └── upload/
│               └── image.ts  # 图片上传
├── lib/
│   └── api/                  # API 工具库
│       ├── response.ts       # 统一响应格式
│       ├── rateLimit.ts      # 接口限流
│       ├── validate.ts       # 数据校验（Zod）
│       ├── auth.ts           # JWT 认证
│       ├── idempotency.ts    # 幂等性控制
│       └── database.ts       # 数据库模拟（内存存储）
└── public/
    └── uploads/              # 上传文件存储目录
```

---

## 🔑 核心知识点详解

### 1. API Routes 基础

#### 1.1 什么是 API Routes？

API Routes 是 Next.js 提供的后端接口开发能力，允许你在 `/pages/api` 目录下编写 Node.js 风格的接口。

**优势：**
- 📦 前后端同项目，共享依赖和配置
- 🚀 零配置，自动路由映射
- 🔒 服务端执行，安全可靠
- 🌐 支持多种 HTTP 方法（GET、POST、PUT、DELETE）

**示例：**

```typescript
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello, API!' });
}
```

访问 `/api/hello` 即可获得响应。

---

### 2. 统一响应格式

#### 2.1 为什么需要统一响应？

- ✅ 前端可以统一处理响应数据
- ✅ 便于错误追踪和日志记录
- ✅ 提升接口可维护性

#### 2.2 实现方式

```typescript
// lib/api/response.ts
export interface ApiResponse<T = any> {
  code: number;        // 0 表示成功，非 0 表示错误
  message?: string;    // 提示信息
  data?: T;            // 响应数据
  timestamp?: number;  // 时间戳
}

export function success<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return { code: 0, message, data, timestamp: Date.now() };
}

export function error(message: string, code = 1): ApiResponse {
  return { code, message, timestamp: Date.now() };
}
```

**使用示例：**

```typescript
// 成功响应
res.status(200).json(success({ id: 1, name: 'iPhone' }));

// 错误响应
res.status(400).json(error('参数错误'));
```

---

### 3. 数据校验（Zod）

#### 3.1 为什么需要数据校验？

- 🛡️ 防止非法数据进入系统
- 🔒 提升接口安全性
- 📝 自动生成 TypeScript 类型

#### 3.2 使用 Zod 进行校验

```typescript
// lib/api/validate.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, '商品名至少 2 个字符'),
  price: z.number().positive('价格必须大于 0'),
  description: z.string().max(500).optional(),
});

export function validate<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}
```

**在接口中使用：**

```typescript
const result = validate(productSchema, req.body);
if (!result.success) {
  return res.status(400).json(error(result.error.errors[0].message));
}
// result.data 已通过类型校验
```

---

### 4. JWT 认证与权限控制

#### 4.1 JWT 工作原理

1. 用户登录成功后，服务端生成 JWT Token
2. 前端将 Token 存储在 localStorage
3. 每次请求携带 Token（在 `Authorization` 请求头）
4. 服务端验证 Token 有效性和权限

#### 4.2 实现 JWT 认证

```typescript
// lib/api/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'demo_secret';

export interface UserPayload {
  id: number;
  username: string;
  role?: string;
}

// 生成 Token
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// 验证 Token
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

// 认证中间件
export function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json(error('未登录'));
    }
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json(error('Token 无效'));
    }
    (req as any).user = user;
    await handler(req, res, user);
  };
}
```

**使用示例：**

```typescript
// 受保护的接口
async function handler(req, res, user) {
  // user 是从 Token 中解析出的用户信息
  res.status(200).json(success({ user }));
}

export default withAuth(handler);
```

---

### 5. 接口限流

#### 5.1 为什么需要限流？

- 🛡️ 防止恶意刷接口
- 🚀 保护服务器资源
- 🔒 防止暴力破解（如登录接口）

#### 5.2 实现滑动窗口限流

```typescript
// lib/api/rateLimit.ts
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // 如果窗口已过期，重置计数
  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return false;
  }

  // 如果超过限制，返回 true
  if (entry.count >= limit) {
    return true;
  }

  // 增加计数
  entry.count++;
  return false;
}
```

**使用示例：**

```typescript
const ip = getClientIp(req);
if (checkRateLimit(ip, 5, 60_000)) {
  return res.status(429).json(error('请求过于频繁'));
}
```

---

### 6. 文件上传（Base64）

#### 6.1 Base64 上传流程

1. 前端读取文件并转为 Base64
2. 发送到后端接口
3. 后端解析 Base64，保存到服务器
4. 返回文件访问 URL

#### 6.2 实现图片上传接口

```typescript
// pages/api/v1/upload/image.ts
async function handler(req, res) {
  const { image } = req.body;

  // 解析 Base64
  const matches = image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json(error('图片格式不正确'));
  }

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, 'base64');

  // 校验大小（最大 5MB）
  if (buffer.length > 5 * 1024 * 1024) {
    return res.status(400).json(error('图片不能超过 5MB'));
  }

  // 生成唯一文件名
  const ext = mimeType.split('/')[1];
  const filename = `${Date.now()}.${ext}`;
  const filePath = path.join(process.cwd(), 'public/uploads', filename);

  // 保存文件
  fs.writeFileSync(filePath, buffer);

  return res.status(200).json(success({ url: `/uploads/${filename}` }));
}

export default withAuth(handler);
```

---

### 7. RESTful API 设计规范

#### 7.1 常见的 RESTful 路由设计

| 方法   | 路径                      | 说明           |
|--------|---------------------------|----------------|
| GET    | `/api/v1/products`        | 获取商品列表   |
| GET    | `/api/v1/products/:id`    | 获取单个商品   |
| POST   | `/api/v1/products/manage` | 创建商品       |
| PUT    | `/api/v1/products/manage` | 更新商品       |
| DELETE | `/api/v1/products/manage` | 删除商品       |

#### 7.2 接口版本管理

推荐在路径中加入版本号，便于平滑升级：

```
/api/v1/products  ✅ 推荐
/api/products     ❌ 不推荐
```

---

### 8. 幂等性与防重复提交

#### 8.1 什么是幂等性？

幂等性是指多次执行同一操作，结果应该一致。例如：
- ✅ 查询操作（GET）天然幂等
- ✅ 删除操作（DELETE）删除一次和多次结果相同
- ❌ 创建订单（POST）不幂等，需要特殊处理

#### 8.2 实现幂等性

```typescript
// lib/api/idempotency.ts
const idempotencyMap = new Map<string, number>();

export function isDuplicateRequest(key: string, windowMs = 60_000): boolean {
  const entry = idempotencyMap.get(key);
  const now = Date.now();

  if (!entry) {
    idempotencyMap.set(key, now);
    setTimeout(() => idempotencyMap.delete(key), windowMs);
    return false;
  }

  // 在时间窗口内，视为重复请求
  return now - entry <= windowMs;
}
```

**使用示例：**

```typescript
const idempotencyKey = req.headers['x-idempotency-key'];
if (!idempotencyKey || isDuplicateRequest(idempotencyKey)) {
  return res.status(409).json(error('重复提交'));
}
```

---

## 🚀 运行项目

### 1. 安装依赖

确保已安装 `jsonwebtoken` 和 `zod`：

```bash
npm install jsonwebtoken zod
npm install --save-dev @types/jsonwebtoken
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问页面

- 商城首页：http://localhost:3000/shop
- 后台管理：http://localhost:3000/admin（需要管理员登录）
- 登录页面：http://localhost:3000/shop/login

### 4. 测试账号

| 用户名 | 密码      | 角色     |
|--------|-----------|----------|
| admin  | admin123  | 管理员   |
| user   | user123   | 普通用户 |

---

## 📋 功能清单

### ✅ 已实现功能

#### 后端 API
- [x] 商品列表查询（支持分页、搜索）
- [x] 商品详情查询
- [x] 商品创建/更新/删除（需管理员权限）
- [x] 用户登录/注册
- [x] 获取当前用户信息
- [x] 图片上传（Base64）
- [x] JWT 认证与权限控制
- [x] 接口限流
- [x] 数据校验（Zod）
- [x] 统一响应格式
- [x] 错误处理

#### 前端页面
- [x] 商品商城（列表展示、分页、搜索）
- [x] 后台管理（商品 CRUD、图片上传）
- [x] 用户登录（支持登录/注册切换）
- [x] 响应式设计（移动端适配）
- [x] 暗黑模式支持
- [x] 加载状态与错误提示

---

## 🎓 学习路径

### 初学者（入门）

1. 先理解 API Routes 的基本概念
2. 学习如何创建简单的 GET/POST 接口
3. 掌握统一响应格式的设计
4. 理解前后端如何通信（fetch）

### 进阶开发者

1. 深入学习 JWT 认证机制
2. 掌握数据校验（Zod）的使用
3. 学习接口限流和安全防护
4. 理解幂等性和防重复提交
5. 掌握文件上传的实现

### 高级开发者

1. 设计 RESTful API 的最佳实践
2. 实现接口版本管理
3. 集成数据库（Prisma、TypeORM）
4. 实现复杂权限控制（RBAC）
5. 接口性能优化（缓存、CDN）
6. 接口监控与日志（Sentry、LogRocket）

---

## 📝 API 接口文档

### 1. 商品相关接口

#### 1.1 获取商品列表

**请求：**
```
GET /api/v1/products?page=1&limit=10&keyword=iPhone
```

**响应：**
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "price": 7999,
        "description": "最新款 iPhone",
        "image": "https://...",
        "stock": 50
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

#### 1.2 获取商品详情

**请求：**
```
GET /api/v1/products/1
```

**响应：**
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "price": 7999
  }
}
```

#### 1.3 创建商品（需管理员权限）

**请求：**
```
POST /api/v1/products/manage
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "新商品",
  "price": 999,
  "description": "商品描述",
  "stock": 10,
  "image": "https://..."
}
```

**响应：**
```json
{
  "code": 0,
  "message": "商品创建成功",
  "data": { ... }
}
```

#### 1.4 更新商品（需管理员权限）

**请求：**
```
PUT /api/v1/products/manage
Authorization: Bearer <token>

{
  "id": 1,
  "name": "更新后的名称",
  "price": 1099
}
```

#### 1.5 删除商品（需管理员权限）

**请求：**
```
DELETE /api/v1/products/manage?id=1
Authorization: Bearer <token>
```

---

### 2. 认证相关接口

#### 2.1 用户登录

**请求：**
```
POST /api/v1/auth/login

{
  "username": "admin",
  "password": "admin123"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2.2 用户注册

**请求：**
```
POST /api/v1/auth/register

{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

#### 2.3 获取当前用户信息（需登录）

**请求：**
```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

---

### 3. 文件上传接口

#### 3.1 上传图片（需登录）

**请求：**
```
POST /api/v1/upload/image
Authorization: Bearer <token>

{
  "image": "data:image/png;base64,iVBORw0KG...",
  "filename": "product.png"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "/uploads/1234567890.png",
    "filename": "1234567890.png"
  }
}
```

---

## 🔒 安全最佳实践

### 1. 环境变量管理

敏感信息（如 JWT 密钥）应存储在环境变量中：

```env
# .env.local
JWT_SECRET=your_super_secret_key_here
```

### 2. 密码加密

生产环境应使用 bcrypt 加密密码：

```typescript
import bcrypt from 'bcrypt';

// 加密
const hashed = await bcrypt.hash(password, 10);

// 验证
const valid = await bcrypt.compare(password, hashed);
```

### 3. HTTPS

生产环境务必使用 HTTPS，防止 Token 被窃取。

### 4. CORS 配置

合理配置 CORS，只允许信任的域名访问接口。

### 5. 输入校验

所有用户输入必须经过严格校验，防止 SQL 注入、XSS 攻击。

---

## 🚧 常见问题

### 1. 如何切换到真实数据库？

目前使用内存存储（`lib/api/database.ts`），生产环境应替换为真实数据库：

```bash
# 安装 Prisma
npm install prisma @prisma/client

# 初始化
npx prisma init

# 定义数据模型后，生成客户端
npx prisma generate
```

然后在接口中使用 Prisma：

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = await prisma.product.findMany();
```

### 2. 如何部署到 Vercel？

直接推送到 GitHub，然后在 Vercel 导入项目即可。记得配置环境变量：

```
JWT_SECRET=your_production_secret
```

### 3. 如何实现 SSR 数据获取？

在 App Router 中，Server Component 可以直接调用数据库：

```typescript
// app/shop/page.tsx (Server Component)
import { db } from '@/lib/api/database';

export default async function ShopPage() {
  const products = db.getAllProducts(); // 服务端直接调用
  return <div>...</div>;
}
```

但本案例为了演示 API 调用，使用的是 Client Component。

---

## 📚 扩展学习

### 推荐资源

1. [Next.js 官方文档 - API Routes](https://nextjs.org/docs/api-routes/introduction)
2. [JWT 官网](https://jwt.io/)
3. [Zod 文档](https://zod.dev/)
4. [RESTful API 设计最佳实践](https://restfulapi.net/)

### 进阶主题

- GraphQL API 开发
- WebSocket 实时通信
- 微服务架构
- 接口性能优化（缓存、CDN、边缘计算）
- 接口监控与告警
- 多租户系统设计

---

## 🎉 总结

通过本案例，你已经掌握了：

1. ✅ Next.js API Routes 的完整开发流程
2. ✅ RESTful API 的设计规范
3. ✅ JWT 认证与权限控制
4. ✅ 数据校验、限流、幂等性等企业级特性
5. ✅ 前后端一体化开发的优势
6. ✅ 移动端适配和响应式设计

这是一个生产级别的全栈项目模板，你可以在此基础上扩展更多功能，如：

- 购物车与订单系统
- 支付集成（微信、支付宝）
- 邮件通知
- 数据导出（Excel）
- 实时消息推送

继续加油，祝你在全栈开发的道路上越走越远！🚀
