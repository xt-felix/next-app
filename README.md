# Next.js API Routes 全栈开发从零到一完整教程

> 🎯 **学习目标**：通过一个完整的商品管理系统，从零开始掌握 Next.js 全栈开发

## 📖 教程说明

本教程将带你**从零开始**构建一个企业级的全栈商品管理系统。每个知识点都配有详细的讲解和代码示例，即使你是初学者，也能轻松跟上。

### 你将学会什么？

- ✅ 如何用 Next.js 开发后端 API 接口
- ✅ 如何实现用户登录和权限控制
- ✅ 如何保护接口安全（限流、校验、加密）
- ✅ 如何上传文件
- ✅ 如何设计 RESTful API
- ✅ 前后端如何配合工作

### 适合谁学习？

- 🔰 **完全初学者**：有一点 JavaScript 基础就可以
- 🔰 **前端开发者**：想学习后端开发
- 🔰 **全栈开发者**：想提升 API 开发技能

---

## 🚀 第一步：快速体验项目

### 1.1 安装依赖

打开终端，在项目目录下运行：

```bash
npm install
```

### 1.2 启动项目

```bash
npm run dev
```

看到这个提示说明启动成功：
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### 1.3 访问页面

打开浏览器，访问以下页面体验功能：

| 页面 | 地址 | 功能 |
|------|------|------|
| 商品商城 | http://localhost:3000/shop | 浏览商品、搜索、分页 |
| 登录页面 | http://localhost:3000/shop/login | 用户登录/注册 |
| 后台管理 | http://localhost:3000/admin | 管理商品（需要先登录） |

### 1.4 测试账号

| 用户名 | 密码 | 权限 |
|--------|------|------|
| admin  | admin123 | 管理员（可以增删改商品） |
| user   | user123  | 普通用户（只能浏览） |

**试试这个流程：**
1. 访问登录页面，用 `admin` / `admin123` 登录
2. 登录成功后，点击"后台管理"
3. 尝试添加一个新商品
4. 返回商城首页，看看新商品是否显示

---

## 📁 项目结构详解

在开始学习之前，先了解项目的文件组织：

```
next-app/
├── app/                      # 前端页面（用户看到的界面）
│   ├── shop/                 # 商城页面
│   │   ├── page.tsx          # 商品列表页
│   │   └── login/
│   │       └── page.tsx      # 登录页
│   ├── admin/
│   │   └── page.tsx          # 后台管理页
│   └── layout.tsx            # 全局布局（所有页面共用）
│
├── pages/api/v1/             # 后端 API 接口（数据处理）
│   ├── products/             # 商品相关接口
│   │   ├── index.ts          # 获取商品列表
│   │   ├── [id].ts           # 获取单个商品
│   │   └── manage.ts         # 增删改商品
│   ├── auth/                 # 用户认证接口
│   │   ├── login.ts          # 登录
│   │   ├── register.ts       # 注册
│   │   └── me.ts             # 获取当前用户信息
│   └── upload/
│       └── image.ts          # 图片上传
│
├── lib/api/                  # 工具库（复用的代码）
│   ├── response.ts           # 统一响应格式
│   ├── rateLimit.ts          # 接口限流（防刷）
│   ├── validate.ts           # 数据校验
│   ├── auth.ts               # JWT 认证
│   ├── idempotency.ts        # 防重复提交
│   └── database.ts           # 数据库（模拟）
│
└── public/uploads/           # 上传的文件存储位置
```

**理解两个关键目录：**
- `app/` - 前端页面，用户直接访问
- `pages/api/` - 后端接口，前端通过 fetch 调用

---

## 📚 核心知识点（从零开始）

### 知识点 1：什么是 API？

**简单理解：**
API 就像餐厅的服务员。你（前端）不用进厨房，只需要告诉服务员（API）你要什么菜（数据），服务员会去厨房（数据库）帮你拿。

**举个例子：**
- 前端：我要商品列表
- API：好的，等我去数据库查一下（查询数据库）
- API：给你，这是商品列表（返回数据）

### 知识点 2：Next.js API Routes 是什么？

**传统方式：**
- 前端项目（React）
- 后端项目（Node.js/Express）
- 需要两个项目，两套代码

**Next.js 的方式：**
- 一个项目同时包含前端和后端
- 在 `pages/api/` 目录写后端代码
- 自动生成 API 路由

**示例：创建一个最简单的 API**

创建文件 `pages/api/hello.ts`：

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 返回一个 JSON 响应
  res.status(200).json({ message: 'Hello, World!' });
}
```

访问 `http://localhost:3000/api/hello`，就会看到：
```json
{
  "message": "Hello, World!"
}
```

**这就是你的第一个 API！**

---

### 知识点 3：统一响应格式

**为什么需要？**

假设你有 10 个接口，每个接口返回的数据格式都不一样：
```javascript
// 接口1
{ data: {...} }

// 接口2
{ result: {...} }

// 接口3
{ success: true, info: {...} }
```

前端就要写 10 种不同的处理方式，太麻烦了！

**解决方案：统一格式**

所有接口都返回相同的格式：

```typescript
{
  code: 0,           // 0=成功，非0=失败
  message: "操作成功", // 提示信息
  data: {...},       // 具体数据
  timestamp: 1234567890  // 时间戳
}
```

**实现代码：**

创建 `lib/api/response.ts`：

```typescript
// 定义响应的数据结构
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
  timestamp?: number;
}

// 成功时调用这个函数
export function success<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
    timestamp: Date.now(),
  };
}

// 失败时调用这个函数
export function error(message: string, code = 1): ApiResponse {
  return {
    code,
    message,
    timestamp: Date.now(),
  };
}
```

**如何使用：**

```typescript
// 在 API 接口中
import { success, error } from '@/lib/api/response';

// 成功时
res.status(200).json(success({ name: 'iPhone', price: 7999 }));
// 返回：{ code: 0, message: "操作成功", data: { name: "iPhone", price: 7999 } }

// 失败时
res.status(400).json(error('商品不存在'));
// 返回：{ code: 1, message: "商品不存在" }
```

**前端处理：**

```typescript
const response = await fetch('/api/products');
const json = await response.json();

if (json.code === 0) {
  // 成功，使用 json.data
  console.log(json.data);
} else {
  // 失败，显示 json.message
  alert(json.message);
}
```

---

### 知识点 4：数据校验（Zod）

**场景：**
用户在表单里随便输入，你需要检查数据是否合法。

**不使用 Zod 的痛苦：**

```typescript
// 手动校验，写一堆 if
const { name, price } = req.body;

if (!name) {
  return res.status(400).json({ error: '缺少商品名' });
}
if (typeof name !== 'string') {
  return res.status(400).json({ error: '商品名必须是字符串' });
}
if (name.length < 2) {
  return res.status(400).json({ error: '商品名至少2个字符' });
}
if (!price) {
  return res.status(400).json({ error: '缺少价格' });
}
// ... 写不完了
```

**使用 Zod 的优雅：**

创建 `lib/api/validate.ts`：

```typescript
import { z } from 'zod';

// 定义商品的校验规则
export const productSchema = z.object({
  name: z.string()
    .min(2, '商品名至少 2 个字符')
    .max(50, '商品名最多 50 个字符'),
  price: z.number()
    .positive('价格必须大于 0'),
  description: z.string()
    .max(500, '描述最多 500 个字符')
    .optional(),  // 可选字段
  stock: z.number()
    .int('库存必须是整数')
    .min(0, '库存不能为负')
    .optional(),
});

// 校验函数
export function validate<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}
```

**在接口中使用：**

```typescript
import { productSchema, validate } from '@/lib/api/validate';
import { error } from '@/lib/api/response';

export default function handler(req, res) {
  // 一行代码完成所有校验
  const result = validate(productSchema, req.body);

  if (!result.success) {
    // 校验失败，返回第一个错误
    return res.status(400).json(error(result.error.issues[0].message));
  }

  // 校验成功，result.data 是经过验证的数据
  const { name, price } = result.data;
  // 继续处理...
}
```

**Zod 的优势：**
1. 代码简洁（不用写一堆 if）
2. 类型安全（自动推导 TypeScript 类型）
3. 错误信息清晰（自动生成友好的错误提示）

---

### 知识点 5：JWT 认证（重点！）

**问题：如何知道用户已经登录？**

HTTP 是无状态的，服务器不记得你是谁。就像你每次去医院，护士都不记得你，你必须带着身份证证明自己。

**JWT 就是互联网的身份证！**

#### 5.1 JWT 工作流程

```
1. 用户登录
   用户：我是 admin，密码是 admin123
   服务器：验证通过！给你一个 Token（身份证）

2. 后续请求
   用户：我要访问后台管理（带上 Token）
   服务器：验证 Token → 通过 → 允许访问
```

#### 5.2 JWT 的组成

JWT 看起来像这样：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

它由三部分组成（用 `.` 分隔）：
- **头部**：说明类型和加密算法
- **载荷**：存储用户信息（如 id、用户名）
- **签名**：防止篡改

#### 5.3 实现 JWT 认证

创建 `lib/api/auth.ts`：

```typescript
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { error } from './response';

// JWT 密钥（实际项目要放在环境变量里）
const JWT_SECRET = process.env.JWT_SECRET || 'demo_secret_key';

// 用户信息结构
export interface UserPayload {
  id: number;
  username: string;
  role?: string;
}

// 生成 Token（用户登录成功后调用）
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'  // 7天后过期
  });
}

// 验证 Token（检查用户身份）
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;  // Token 无效或过期
  }
}

// 认证中间件（保护需要登录的接口）
export function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 1. 从请求头获取 Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(error('未登录，请先登录'));
    }

    const token = authHeader.substring(7);  // 去掉 "Bearer "

    // 2. 验证 Token
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json(error('Token 无效或已过期'));
    }

    // 3. Token 有效，将用户信息注入请求
    (req as any).user = user;

    // 4. 继续执行原来的处理函数
    await handler(req, res, user);
  };
}

// 管理员权限中间件
export function withAdmin(handler: Function) {
  return withAuth(async (req, res, user) => {
    if (user.role !== 'admin') {
      return res.status(403).json(error('权限不足，仅管理员可访问'));
    }
    await handler(req, res, user);
  });
}
```

#### 5.4 登录接口实现

`pages/api/v1/auth/login.ts`：

```typescript
import { db } from '@/lib/api/database';
import { success, error } from '@/lib/api/response';
import { generateToken } from '@/lib/api/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(error('只支持 POST 请求'));
  }

  const { username, password } = req.body;

  // 1. 查询用户
  const user = db.getUserByUsername(username);
  if (!user) {
    return res.status(401).json(error('用户名或密码错误'));
  }

  // 2. 验证密码（实际项目要用 bcrypt 加密）
  if (user.password !== password) {
    return res.status(401).json(error('用户名或密码错误'));
  }

  // 3. 生成 Token
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  // 4. 返回用户信息和 Token
  const { password: _, ...userInfo } = user;  // 不返回密码
  return res.status(200).json(success({
    user: userInfo,
    token,
  }, '登录成功'));
}
```

#### 5.5 受保护的接口

`pages/api/v1/auth/me.ts`（需要登录才能访问）：

```typescript
import { withAuth } from '@/lib/api/auth';
import { success } from '@/lib/api/response';
import { db } from '@/lib/api/database';

async function handler(req, res, user) {
  // user 参数是 withAuth 自动注入的，已经验证过身份
  const fullUser = db.getUserById(user.id);
  const { password: _, ...userInfo } = fullUser;

  return res.status(200).json(success(userInfo));
}

// 导出时用 withAuth 包裹，自动验证登录
export default withAuth(handler);
```

#### 5.6 前端如何使用

**登录：**

```typescript
// 1. 发送登录请求
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' }),
});

const json = await response.json();

if (json.code === 0) {
  // 2. 保存 Token 到 localStorage
  localStorage.setItem('token', json.data.token);
  localStorage.setItem('user', JSON.stringify(json.data.user));
}
```

**访问受保护的接口：**

```typescript
// 从 localStorage 取出 Token
const token = localStorage.getItem('token');

// 在请求头里带上 Token
const response = await fetch('/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

---

### 知识点 6：接口限流（防止恶意刷接口）

**场景：**
黑客写个脚本疯狂调用你的登录接口，试图破解密码。

**解决方案：限流**
限制每个 IP 在一定时间内最多请求多少次。

#### 6.1 实现滑动窗口限流

创建 `lib/api/rateLimit.ts`：

```typescript
// 存储每个 IP 的请求记录
const rateLimitMap = new Map<string, {
  count: number;      // 请求次数
  lastReset: number;  // 上次重置时间
}>();

// 检查是否超过限流
export function checkRateLimit(
  identifier: string,  // 标识符（通常是 IP）
  limit = 10,          // 最多请求次数
  windowMs = 60_000    // 时间窗口（毫秒）
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // 如果没有记录，或者时间窗口已过，重置计数
  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return false;  // 未超限
  }

  // 如果超过限制，返回 true
  if (entry.count >= limit) {
    return true;  // 超限！
  }

  // 增加计数
  entry.count++;
  return false;
}

// 获取客户端 IP
export function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.socket?.remoteAddress || 'unknown';
}
```

#### 6.2 在登录接口中使用

```typescript
import { checkRateLimit, getClientIp } from '@/lib/api/rateLimit';

export default async function handler(req, res) {
  // 获取 IP
  const ip = getClientIp(req);

  // 检查限流：每个 IP 每分钟最多 5 次请求
  if (checkRateLimit(ip, 5, 60_000)) {
    return res.status(429).json(error('请求过于频繁，请1分钟后再试'));
  }

  // 继续处理登录逻辑...
}
```

**原理图：**

```
IP: 192.168.1.1
时间窗口: 1分钟
限制: 5次

请求1 (0秒)  -> 计数: 1 ✅ 通过
请求2 (10秒) -> 计数: 2 ✅ 通过
请求3 (20秒) -> 计数: 3 ✅ 通过
请求4 (30秒) -> 计数: 4 ✅ 通过
请求5 (40秒) -> 计数: 5 ✅ 通过
请求6 (50秒) -> 计数: 6 ❌ 拒绝！超过限制
请求7 (70秒) -> 时间窗口过期，重置计数 -> 计数: 1 ✅ 通过
```

---

### 知识点 7：文件上传（Base64 方式）

#### 7.1 为什么用 Base64？

**传统方式：**
- 需要 multipart/form-data
- 需要处理文件流
- 配置复杂

**Base64 方式：**
- 图片转成字符串
- 当成普通 JSON 数据传输
- 简单易懂

#### 7.2 Base64 是什么？

Base64 是一种编码方式，把二进制数据（如图片）转成文本：

```
图片文件 -> Base64 编码 -> "iVBORw0KGgoAAAANSUhEUgAA..."
```

#### 7.3 实现图片上传接口

`pages/api/v1/upload/image.ts`：

```typescript
import { withAuth } from '@/lib/api/auth';
import { success, error } from '@/lib/api/response';
import fs from 'fs';
import path from 'path';

async function handler(req, res) {
  const { image } = req.body;

  // 1. 解析 Base64 数据
  // 格式：data:image/png;base64,iVBORw0KG...
  const matches = image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json(error('图片格式不正确'));
  }

  const [, mimeType, base64Data] = matches;

  // 2. 校验文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(mimeType)) {
    return res.status(400).json(error('只支持 JPG/PNG/GIF/WebP 格式'));
  }

  // 3. Base64 解码成二进制
  const buffer = Buffer.from(base64Data, 'base64');

  // 4. 校验文件大小（5MB）
  const maxSize = 5 * 1024 * 1024;
  if (buffer.length > maxSize) {
    return res.status(400).json(error('图片不能超过 5MB'));
  }

  // 5. 生成唯一文件名
  const ext = mimeType.split('/')[1];
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  // 6. 保存到 public/uploads 目录
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);

  // 7. 返回访问 URL
  return res.status(200).json(success({
    url: `/uploads/${filename}`,
    filename,
  }, '上传成功'));
}

// 需要登录才能上传
export default withAuth(handler);
```

#### 7.4 前端如何使用

```typescript
// 1. 用户选择文件
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];

  // 2. 读取文件并转为 Base64
  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result;  // data:image/png;base64,...

    // 3. 上传到服务器
    const token = localStorage.getItem('token');
    const response = await fetch('/api/v1/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ image: base64 }),
    });

    const json = await response.json();
    if (json.code === 0) {
      console.log('图片URL:', json.data.url);
      // 可以用 <img src={json.data.url} /> 显示
    }
  };

  reader.readAsDataURL(file);
});
```

---

### 知识点 8：RESTful API 设计规范

**什么是 RESTful？**

一种设计 API 的规范，让接口更直观、易懂。

#### 8.1 核心原则

| HTTP 方法 | 含义 | 示例 |
|-----------|------|------|
| GET | 获取数据（查） | GET /api/products - 获取商品列表 |
| POST | 创建数据（增） | POST /api/products - 创建商品 |
| PUT | 更新数据（改） | PUT /api/products/1 - 更新商品1 |
| DELETE | 删除数据（删） | DELETE /api/products/1 - 删除商品1 |

#### 8.2 URL 设计规范

```
✅ 好的设计：
GET    /api/v1/products          # 获取列表
GET    /api/v1/products/1        # 获取ID=1的商品
POST   /api/v1/products          # 创建商品
PUT    /api/v1/products/1        # 更新商品
DELETE /api/v1/products/1        # 删除商品

❌ 不好的设计：
GET    /api/getProducts          # 不要在URL里写动词
POST   /api/createProduct        # 不要在URL里写动词
GET    /api/product?id=1         # 不要用查询参数表示ID
```

#### 8.3 版本管理

```
/api/v1/products  ✅ 推荐（方便以后升级到 v2）
/api/products     ❌ 不推荐
```

#### 8.4 HTTP 状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | 成功 | 正常返回数据 |
| 201 | 已创建 | 创建资源成功 |
| 400 | 请求错误 | 参数校验失败 |
| 401 | 未登录 | 需要登录才能访问 |
| 403 | 权限不足 | 登录了但权限不够 |
| 404 | 未找到 | 资源不存在 |
| 429 | 请求过多 | 触发限流 |
| 500 | 服务器错误 | 程序出bug |

---

## 🎯 完整案例：商品管理接口

### 案例1：获取商品列表（支持分页、搜索）

`pages/api/v1/products/index.ts`：

```typescript
import { db } from '@/lib/api/database';
import { paginated, error } from '@/lib/api/response';
import { checkRateLimit, getClientIp } from '@/lib/api/rateLimit';

export default async function handler(req, res) {
  // 1. 限流保护
  const ip = getClientIp(req);
  if (checkRateLimit(ip, 30, 60_000)) {
    return res.status(429).json(error('请求过于频繁'));
  }

  // 2. 只支持 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json(error('只支持 GET 请求'));
  }

  // 3. 解析查询参数
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const keyword = req.query.keyword as string;

  // 4. 参数校验
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json(error('分页参数不合法'));
  }

  // 5. 查询数据
  let result;
  if (keyword) {
    // 搜索模式
    const allItems = db.searchProducts(keyword);
    const start = (page - 1) * limit;
    const end = start + limit;
    result = {
      items: allItems.slice(start, end),
      total: allItems.length,
    };
  } else {
    // 普通分页
    result = db.getProductsPaginated(page, limit);
  }

  // 6. 返回数据
  return res.status(200).json(paginated(
    result.items,
    result.total,
    page,
    limit
  ));
}
```

**如何测试：**

```bash
# 获取第1页，每页10条
curl http://localhost:3000/api/v1/products?page=1&limit=10

# 搜索关键词 "iPhone"
curl http://localhost:3000/api/v1/products?keyword=iPhone
```

### 案例2：创建商品（需要管理员权限）

`pages/api/v1/products/manage.ts`：

```typescript
import { withAdmin } from '@/lib/api/auth';
import { db } from '@/lib/api/database';
import { success, error } from '@/lib/api/response';
import { productSchema, validate } from '@/lib/api/validate';

async function handler(req, res) {
  if (req.method === 'POST') {
    // 1. 校验数据
    const result = validate(productSchema, req.body);
    if (!result.success) {
      return res.status(400).json(
        error(result.error.issues[0].message)
      );
    }

    // 2. 创建商品
    const product = db.createProduct(result.data);

    // 3. 返回结果
    return res.status(201).json(success(product, '商品创建成功'));
  }

  return res.status(405).json(error('不支持的请求方法'));
}

// 只有管理员能访问
export default withAdmin(handler);
```

**如何测试：**

```bash
# 先登录获取 Token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 创建商品（把上面返回的 token 填入下面）
curl -X POST http://localhost:3000/api/v1/products/manage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <你的token>" \
  -d '{"name":"新商品","price":999,"description":"测试商品"}'
```

---

## 🔒 安全最佳实践

### 1. 环境变量管理

**不要把密钥写在代码里！**

创建 `.env.local` 文件：

```env
JWT_SECRET=your_super_secret_key_here_change_it_in_production
```

在代码中使用：

```typescript
const JWT_SECRET = process.env.JWT_SECRET;
```

### 2. 密码加密

**当前项目为了演示，密码是明文存储的。实际项目必须加密！**

安装 bcrypt：

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

使用方法：

```typescript
import bcrypt from 'bcrypt';

// 注册时，加密密码
const hashedPassword = await bcrypt.hash(password, 10);
db.createUser({ username, password: hashedPassword });

// 登录时，验证密码
const user = db.getUserByUsername(username);
const valid = await bcrypt.compare(password, user.password);
if (!valid) {
  return res.status(401).json(error('密码错误'));
}
```

### 3. HTTPS

生产环境必须用 HTTPS，否则 Token 会被窃取。

Vercel 部署时会自动启用 HTTPS。

### 4. CORS 配置

如果前后端分离部署，需要配置 CORS：

```typescript
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-frontend.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};
```

---

## 🚧 常见问题解答

### Q1: 为什么我的接口返回 404？

**检查清单：**
1. 文件是否在 `pages/api/` 目录下？
2. 文件名是否正确？（例如 `index.ts` 不是 `Index.ts`）
3. 访问的 URL 是否正确？（`/api/v1/products` 不是 `/api/products`）

### Q2: Token 无效怎么办？

**可能原因：**
1. Token 过期了（默认7天）
2. JWT_SECRET 变了
3. Token 格式错误（必须是 `Bearer xxxxxx`）

**解决方法：**
重新登录获取新 Token。

### Q3: 如何切换到真实数据库？

**当前是内存数据库**（重启就清空）。

**替换为 Prisma + PostgreSQL：**

```bash
# 1. 安装 Prisma
npm install prisma @prisma/client

# 2. 初始化
npx prisma init

# 3. 配置数据库连接（.env）
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# 4. 定义数据模型（prisma/schema.prisma）
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  description String?
  createdAt   DateTime @default(now())
}

# 5. 生成客户端
npx prisma generate

# 6. 在代码中使用
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = await prisma.product.findMany();
```

### Q4: 怎么部署到线上？

**最简单的方式：Vercel**

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 配置环境变量（在 Vercel 网站上）
JWT_SECRET=your_production_secret
```

**或者直接连接 GitHub：**
1. 推送代码到 GitHub
2. 在 Vercel 官网导入项目
3. 自动部署

---

## 📝 学习建议

### 第1天：熟悉项目

1. 启动项目，浏览所有页面
2. 用测试账号登录，体验完整流程
3. 打开浏览器开发者工具，看看网络请求

### 第2天：理解基础知识

1. 学习"知识点1-4"（API、响应格式、校验、JWT）
2. 阅读 `lib/api/` 下的工具代码
3. 自己写一个简单的 API 测试

### 第3天：深入接口开发

1. 学习"知识点5-8"（限流、上传、RESTful）
2. 阅读 `pages/api/` 下的接口代码
3. 尝试修改一个接口，添加新功能

### 第4天：前端集成

1. 阅读 `app/shop/` 下的前端代码
2. 理解前端如何调用 API
3. 尝试添加一个新页面

### 第5天：实战练习

自己动手实现一个新功能，例如：
- 添加商品收藏功能
- 添加评论功能
- 添加购物车功能

---

## 🎉 总结

恭喜你！通过这个教程，你已经学会了：

- ✅ 如何用 Next.js 开发 API
- ✅ 如何实现用户登录和权限控制
- ✅ 如何保护接口安全
- ✅ 如何设计 RESTful API
- ✅ 如何上传文件
- ✅ 如何实现分页、搜索、限流等功能

### 下一步学习方向

1. **数据库**：学习 Prisma，连接真实数据库
2. **测试**：学习 Jest，为 API 编写测试
3. **部署**：学习 Docker，部署到云服务器
4. **性能优化**：学习缓存（Redis）、CDN
5. **监控**：学习 Sentry，监控线上错误

### 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [JWT 官网](https://jwt.io/)
- [Zod 文档](https://zod.dev/)
- [Prisma 文档](https://www.prisma.io/docs)

---

**最后，记住：**

> 编程就像学游泳，看再多教程都不如下水试试。遇到问题别慌，Google/ChatGPT 是你的好朋友！

**祝你学习愉快！** 🚀
