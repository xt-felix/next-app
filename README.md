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
- [第十三章：Server Actions - 新一代全栈能力](#第十三章server-actions) 🆕
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

## 第十三章：Server Actions

### 📘 章节概述

Server Actions 是 Next.js 13+ 引入的革命性全栈能力，允许开发者直接在 React 组件中声明服务端函数，实现"前端即后端"的开发体验。

### 🎯 学习目标

- 理解 Server Actions 的核心概念和优势
- 掌握表单无刷新提交和数据变更
- 学会实现乐观 UI 和错误处理
- 掌握复杂表单处理和文件上传
- 理解与 RSC 的深度集成

### 📚 核心知识点

#### 1. Server Actions 基础

**与 API Routes 的对比：**

| 特性 | API Routes | Server Actions |
|------|-----------|----------------|
| 代码分布 | 前后端分离 | 组件内声明服务端逻辑 |
| 调用方式 | fetch/AJAX | 直接调用/表单 action |
| 适用场景 | 复杂接口、第三方集成 | 表单、数据变更、轻量接口 |
| 错误处理 | 手动 try/catch | 自动捕获并传递 |

**核心优势：**
- 彻底消除传统 API Route 冗余代码
- 支持表单无刷新提交
- 与 RSC 深度集成，自动刷新
- 自动 CSRF 防护、Session 透传

#### 2. 声明与调用

```typescript
// 声明 Server Action
'use server';

export async function addTodo(formData: FormData) {
  const title = formData.get('title');
  await db.todo.create({ data: { title } });
  revalidatePath('/todos');
}

// 表单调用
<form action={addTodo}>
  <input name="title" required />
  <button type="submit">添加</button>
</form>

// 事件驱动调用
<button onClick={() => deleteTodo(id)}>删除</button>
```

#### 3. 乐观 UI 更新

```tsx
'use client';

export function ToggleButton({ id, completed }) {
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    setOptimisticCompleted(!optimisticCompleted); // 立即更新 UI

    startTransition(async () => {
      try {
        await toggleTodo(id);
      } catch (e) {
        setOptimisticCompleted(completed); // 失败时回滚
      }
    });
  };

  return <button onClick={handleToggle}>...</button>;
}
```

#### 4. 数据刷新策略

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';

// 刷新特定路径
revalidatePath('/todos');

// 刷新特定标签
revalidateTag('todos');
```

### 💻 实战项目

#### 项目一：待办事项管理系统

**访问路径：** `/13-server-actions/todo`

**功能特性：**
- 添加、删除、切换完成状态
- 乐观 UI 更新
- 自动数据刷新
- 权限校验
- 错误处理

**技术亮点：**
- 表单无刷新提交
- `useTransition` 实现乐观 UI
- `revalidatePath` 自动刷新
- 完善的错误边界

**核心代码：**

```typescript
// actions.ts
'use server';

export async function addTodo(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const title = formData.get('title') as string;
  if (!title.trim()) throw new Error('标题不能为空');

  await db.todo.create({ data: { title, userId: session.user.id } });
  revalidatePath('/13-server-actions/todo');
}
```

#### 项目二：审批流系统

**访问路径：** `/13-server-actions/approval`

**功能特性：**
- 动态表单字段
- 嵌套数据处理
- 审批状态管理(待审批/通过/驳回)
- 撤回功能
- 业务逻辑校验

**技术亮点：**
- 复杂表单数据解析
- FormData 嵌套字段处理
- 企业级业务场景
- 状态流转管理

#### 项目三：文件上传系统

**访问路径：** `/13-server-actions/upload`

**功能特性：**
- 文件上传与预览
- 文件大小和类型校验
- 图片优化展示
- 文件管理(列表、删除)

**技术亮点：**
- FormData 文件处理
- 客户端实时预览
- Next.js Image 组件优化
- 响应式网格布局

### 📖 详细文档

查看完整文档：[docs/13-server-actions/README.md](docs/13-server-actions/README.md)

内容包括：
- 理论基础详解
- 核心概念深入
- 完整代码示例
- 最佳实践指南
- 常见问题解答
- 企业级场景应用

### 🎓 学习建议

1. **理解概念**：先理解 Server Actions 与 API Routes 的区别
2. **动手实践**：运行三个实战项目，体验不同场景
3. **阅读代码**：仔细阅读 `actions.ts` 中的服务端逻辑
4. **对比学习**：对比 API Routes 的实现方式
5. **扩展练习**：尝试添加新功能，如批量操作、权限管理等

---

## 第十二章：API Routes

### 📘 章节概述

API Routes 是 Next.js 提供的后端 API 开发功能，让你可以在同一个项目中同时开发前端和后端。

### 📖 目录

- [API Routes 基础](#知识点一api-routes-基础)
- [处理不同 HTTP 方法](#知识点二处理不同-http-方法)
- [请求体解析](#知识点三请求体解析)
- [文件上传处理](#知识点四文件上传处理)
- [身份验证与授权](#知识点五身份验证与授权)
- [错误处理与响应规范](#知识点六错误处理与响应规范)
- [完整项目实战](#完整项目实战)

---

## 快速开始

### 启动项目

```bash
# 确保已安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 访问页面

1. 打开浏览器访问：http://localhost:3000
2. 点击"图片分享应用"卡片
3. 使用测试账号登录：
   - 管理员：`admin` / `admin123`
   - 普通用户：`user` / `user123`
4. 上传图片，查看列表

---

## 知识点一：API Routes 基础

### 📚 概念讲解

#### 🔍 什么是 API Routes？

**API Routes** 是 Next.js 提供的后端 API 开发功能，让你可以在同一个项目中同时开发前端和后端。

```
传统开发模式：
前端项目（React） + 后端项目（Express/Nest.js）
├─ 需要两个项目
├─ 需要配置 CORS
└─ 部署复杂

Next.js 模式：
Next.js 项目（前端 + 后端）
├─ 一个项目搞定
├─ 无需 CORS 配置
└─ 部署简单
```

#### 🎯 核心特点

```
┌─────────────────────────────────────────┐
│         API Routes 核心特点              │
├─────────────────────────────────────────┤
│                                         │
│  1. 📁 文件系统路由                      │
│     └─ app/api/users/route.ts          │
│        → /api/users                    │
│                                         │
│  2. 🔌 完整的 HTTP 支持                  │
│     └─ GET, POST, PUT, DELETE...       │
│                                         │
│  3. 🔒 服务端执行                        │
│     └─ 安全，不暴露敏感信息              │
│                                         │
│  4. 🚀 自动优化                         │
│     └─ 按需加载，性能优秀                │
│                                         │
└─────────────────────────────────────────┘
```

#### 📊 文件系统路由规则

| 文件路径 | API 路径 | 说明 |
|---------|---------|------|
| `app/api/route.ts` | `/api` | 根路由 |
| `app/api/users/route.ts` | `/api/users` | 用户路由 |
| `app/api/users/[id]/route.ts` | `/api/users/123` | 动态路由 |
| `app/api/auth/login/route.ts` | `/api/auth/login` | 嵌套路由 |

#### 🔍 工作流程

```
浏览器发起请求
  ↓
fetch('/api/users')
  ↓
Next.js 路由匹配
  ↓
找到 app/api/users/route.ts
  ↓
执行对应的 HTTP 方法函数（GET/POST...）
  ↓
返回响应数据
  ↓
浏览器接收数据
```

### 💻 代码实现

#### 示例 1：最简单的 API

**场景**：创建一个返回 Hello World 的 API

```typescript
// app/api/hello/route.ts

import { NextResponse } from 'next/server';

/**
 * GET /api/hello
 * 最简单的 API 示例
 */
export async function GET() {
  return NextResponse.json({
    message: 'Hello World',
    timestamp: new Date().toISOString(),
  });
}
```

**测试：**

```bash
curl http://localhost:3000/api/hello
```

**响应：**

```json
{
  "message": "Hello World",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 示例 2：带参数的 API

**场景**：根据用户 ID 返回用户信息

```typescript
// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users/[id]
 * 动态路由参数
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 模拟数据库查询
  const user = {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
  };

  return NextResponse.json({
    success: true,
    data: user,
  });
}
```

**测试：**

```bash
curl http://localhost:3000/api/users/123
```

**响应：**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "User 123",
    "email": "user123@example.com"
  }
}
```

#### 示例 3：查询参数解析

**场景**：支持分页的用户列表

```typescript
// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users?page=1&pageSize=10
 * 查询参数解析
 */
export async function GET(request: NextRequest) {
  // 1. 解析 URL 查询参数
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  // 2. 模拟数据
  const users = Array.from({ length: pageSize }, (_, i) => ({
    id: (page - 1) * pageSize + i + 1,
    name: `User ${(page - 1) * pageSize + i + 1}`,
  }));

  // 3. 返回响应
  return NextResponse.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        pageSize,
        total: 100,
      },
    },
  });
}
```

**测试：**

```bash
curl "http://localhost:3000/api/users?page=2&pageSize=5"
```

### ⚠️ 注意事项

**❌ 错误示例：**

```typescript
// ❌ 错误：文件名不是 route.ts
// app/api/users/users.ts  <- 错误

// ✅ 正确：必须命名为 route.ts
// app/api/users/route.ts  <- 正确
```

**❌ 错误示例：**

```typescript
// ❌ 错误：函数名不匹配 HTTP 方法
export async function getUsers() { ... }

// ✅ 正确：函数名必须是 HTTP 方法
export async function GET() { ... }
```

---

## 知识点二：处理不同 HTTP 方法

### 📚 概念讲解

#### 🔑 HTTP 方法对应关系

API Routes 支持所有标准 HTTP 方法，通过导出同名函数实现。

| HTTP 方法 | Next.js 函数 | 用途 | 示例 |
|-----------|--------------|------|------|
| `GET` | `export async function GET()` | 获取数据 | 查询用户列表 |
| `POST` | `export async function POST()` | 创建数据 | 创建新用户 |
| `PUT` | `export async function PUT()` | 更新数据（完整） | 更新用户信息 |
| `PATCH` | `export async function PATCH()` | 更新数据（部分） | 修改用户名 |
| `DELETE` | `export async function DELETE()` | 删除数据 | 删除用户 |

#### 📊 RESTful API 设计规范

```
资源：用户（users）

GET    /api/users          获取用户列表
GET    /api/users/123      获取单个用户
POST   /api/users          创建新用户
PUT    /api/users/123      更新用户（完整）
PATCH  /api/users/123      更新用户（部分）
DELETE /api/users/123      删除用户
```

#### 🔍 方法选择原则

```
获取数据？
  └─ 使用 GET

创建新资源？
  └─ 使用 POST

完全替换资源？
  └─ 使用 PUT

部分修改资源？
  └─ 使用 PATCH

删除资源？
  └─ 使用 DELETE
```

### 💻 代码实现

#### 示例 1：完整的 CRUD API

**场景**：用户管理的完整 API

```typescript
// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

/**
 * GET /api/users
 * 获取用户列表
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: users,
  });
}

/**
 * POST /api/users
 * 创建新用户
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { name, email } = body;

    // 验证
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 创建用户
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
    };

    users.push(newUser);

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }  // 201 Created
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '创建失败' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

// 引用同一个数据
import { users } from '../route';

/**
 * GET /api/users/[id]
 * 获取单个用户
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = users.find(u => u.id === params.id);

  if (!user) {
    return NextResponse.json(
      { success: false, message: '用户不存在' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: user,
  });
}

/**
 * PUT /api/users/[id]
 * 完整更新用户
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email } = body;

    const index = users.findIndex(u => u.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 完整替换
    users[index] = {
      id: params.id,
      name,
      email,
    };

    return NextResponse.json({
      success: true,
      data: users[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * 部分更新用户
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const user = users.find(u => u.id === params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 部分更新
    Object.assign(user, body);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * 删除用户
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = users.findIndex(u => u.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { success: false, message: '用户不存在' },
      { status: 404 }
    );
  }

  users.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: '删除成功',
  });
}
```

**测试：**

```bash
# 获取列表
curl http://localhost:3000/api/users

# 创建用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie","email":"charlie@example.com"}'

# 获取单个用户
curl http://localhost:3000/api/users/1

# 完整更新
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated","email":"alice-new@example.com"}'

# 部分更新
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Modified"}'

# 删除用户
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 知识点三：请求体解析

### 📚 概念讲解

#### 🔑 常见请求体类型

API Routes 需要处理不同类型的请求体：

| Content-Type | 说明 | 使用场景 |
|--------------|------|----------|
| `application/json` | JSON 数据 | 大多数 API 请求 |
| `multipart/form-data` | 表单数据（含文件） | 文件上传 |
| `application/x-www-form-urlencoded` | 表单数据 | 传统表单提交 |
| `text/plain` | 纯文本 | 简单文本传输 |

#### 📊 解析方法对比

```typescript
// 1. JSON 解析
const body = await request.json();

// 2. FormData 解析
const formData = await request.formData();

// 3. 文本解析
const text = await request.text();

// 4. 二进制解析
const buffer = await request.arrayBuffer();
```

### 💻 代码实现

#### 示例 1：JSON 请求体解析

**实际应用**：本项目的登录 API

```typescript
// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. 解析 JSON 请求体
    const body = await request.json();
    const { username, password } = body;

    // 2. 参数验证
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 3. 业务逻辑（查找用户）
    const users = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'user123', role: 'user' },
    ];

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 4. 生成 Token（简化版）
    const token = Buffer.from(
      JSON.stringify({
        username: user.username,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
    ).toString('base64');

    // 5. 返回成功响应
    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        username: user.username,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '登录失败' },
      { status: 500 }
    );
  }
}
```

**前端调用：**

```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123',
  }),
});

const result = await response.json();
console.log(result);
// { success: true, data: { username: 'admin', token: '...' } }
```

#### 示例 2：FormData 请求体解析

**实际应用**：本项目的图片上传 API

```typescript
// app/api/images/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. 验证 Authorization Header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      );
    }

    // 2. 解析 FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择文件' },
        { status: 400 }
      );
    }

    // 3. 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: '不支持的文件类型' },
        { status: 400 }
      );
    }

    // 4. 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: '文件大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 5. 保存文件信息
    const imageData = {
      id: Date.now().toString(),
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadTime: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: '上传成功',
      data: imageData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '上传失败' },
      { status: 500 }
    );
  }
}
```

**前端调用：**

```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/images/upload', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,  // 注意：不要设置 Content-Type
});
```

---

## 知识点四：文件上传处理

### 📚 概念讲解

#### 🔑 文件上传流程

```
用户选择文件
  ↓
前端：创建 FormData
  ↓
前端：append 文件到 FormData
  ↓
前端：fetch 发送到 API
  ↓
后端：解析 FormData
  ↓
后端：验证文件类型和大小
  ↓
后端：保存文件
  ↓
后端：返回文件信息
  ↓
前端：显示上传结果
```

#### 📊 文件验证要点

| 验证项 | 原因 | 实现方式 |
|-------|------|----------|
| 文件类型 | 安全（防止上传恶意文件） | 检查 `file.type` |
| 文件大小 | 性能和存储 | 检查 `file.size` |
| 文件名 | 防止路径遍历攻击 | 过滤特殊字符 |
| 权限验证 | 防止未授权上传 | 验证 Token |

### 💻 代码实现

#### 示例 1：前端文件上传组件

**实际应用**：本项目的 UploadForm 组件

```typescript
// components/image-share/UploadForm.tsx
'use client';

import { useState } from 'react';

export default function UploadForm({ token, onUploadSuccess }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 1. 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // 生成预览图
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // 2. 上传处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('请选择图片');
      return;
    }

    setLoading(true);

    try {
      // 3. 创建 FormData
      const formData = new FormData();
      formData.append('file', file);

      // 4. 发送请求
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('上传成功！');
        onUploadSuccess();
        setFile(null);
        setPreview('');
      } else {
        alert(`上传失败：${result.message}`);
      }
    } catch (error) {
      alert('上传失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 文件选择 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* 预览 */}
      {preview && <img src={preview} alt="预览" />}

      {/* 上传按钮 */}
      <button type="submit" disabled={loading || !file}>
        {loading ? '上传中...' : '上传'}
      </button>
    </form>
  );
}
```

#### 示例 2：后端文件处理 API

**完整代码见**：[app/api/images/upload/route.ts](app/api/images/upload/route.ts:1-127)

**关键点：**

```typescript
// 1. 验证身份
const authHeader = request.headers.get('authorization');
const token = authHeader?.substring(7);  // 去掉 'Bearer '
const user = verifyToken(token);

// 2. 解析 FormData
const formData = await request.formData();
const file = formData.get('file') as File;

// 3. 验证文件类型
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 });
}

// 4. 验证文件大小
const maxSize = 5 * 1024 * 1024;  // 5MB
if (file.size > maxSize) {
  return NextResponse.json({ error: '文件过大' }, { status: 400 });
}

// 5. 保存文件信息（实际项目应保存到服务器或云存储）
const imageData = {
  id: Date.now().toString(),
  filename: file.name,
  size: file.size,
  type: file.type,
  uploadTime: new Date().toISOString(),
  uploader: user.username,
};

return NextResponse.json({ success: true, data: imageData });
```

---

## 知识点五：身份验证与授权

### 📚 概念讲解

#### 🔑 认证 vs 授权

```
认证（Authentication）：你是谁？
  └─ 登录验证
  └─ Token 验证

授权（Authorization）：你能做什么？
  └─ 权限检查
  └─ 角色判断
```

#### 📊 JWT Token 工作流程

```
1. 用户登录
   ↓
2. 服务器验证用户名密码
   ↓
3. 生成 JWT Token
   ↓
4. 返回 Token 给前端
   ↓
5. 前端保存 Token（localStorage）
   ↓
6. 后续请求携带 Token
   ↓
7. 服务器验证 Token
   ↓
8. 验证通过，执行业务逻辑
```

#### 🔍 Token 格式

```
Authorization: Bearer <token>

示例：
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 💻 代码实现

#### 示例 1：Token 生成

**实际应用**：[app/api/auth/login/route.ts](app/api/auth/login/route.ts:1-90)

```typescript
/**
 * 生成 Token（简化版）
 * 实际项目应使用 jsonwebtoken 库
 */
function generateToken(username: string, role: string): string {
  const payload = {
    username,
    role,
    exp: Date.now() + 24 * 60 * 60 * 1000,  // 24小时过期
  };

  // 简化版：Base64 编码
  // 实际项目：使用 jsonwebtoken 签名
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// 使用
const token = generateToken('admin', 'admin');
```

#### 示例 2：Token 验证

**实际应用**：[app/api/images/upload/route.ts](app/api/images/upload/route.ts:15-32)

```typescript
/**
 * 验证 Token
 */
function verifyToken(token: string): { username: string; role: string } | null {
  try {
    // 解码 Token
    const payload = JSON.parse(
      Buffer.from(token, 'base64').toString('utf-8')
    );

    // 检查是否过期
    if (payload.exp < Date.now()) {
      return null;
    }

    return {
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// 使用
const user = verifyToken(token);
if (!user) {
  return NextResponse.json({ error: 'Token 无效' }, { status: 401 });
}
```

#### 示例 3：权限中间件

**场景**：只允许管理员访问的 API

```typescript
// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';

function requireAdmin(token: string): boolean {
  const user = verifyToken(token);
  return user?.role === 'admin';
}

export async function GET(request: NextRequest) {
  // 1. 提取 Token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const token = authHeader.substring(7);

  // 2. 验证管理员权限
  if (!requireAdmin(token)) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 });
  }

  // 3. 执行业务逻辑
  return NextResponse.json({
    success: true,
    data: {
      users: [/* 用户列表 */],
    },
  });
}
```

---

## 知识点六：错误处理与响应规范

### 📚 概念讲解

#### 🔑 HTTP 状态码

| 状态码 | 含义 | 使用场景 |
|-------|------|----------|
| `200` | OK | 成功 |
| `201` | Created | 创建成功 |
| `400` | Bad Request | 参数错误 |
| `401` | Unauthorized | 未授权 |
| `403` | Forbidden | 权限不足 |
| `404` | Not Found | 资源不存在 |
| `500` | Internal Server Error | 服务器错误 |

#### 📊 统一响应格式

```typescript
// 成功响应
{
  success: true,
  message: '操作成功',
  data: { ... }
}

// 失败响应
{
  success: false,
  message: '错误信息',
  error: '详细错误（可选）'
}
```

### 💻 代码实现

#### 示例 1：统一错误处理

```typescript
// lib/api-error.ts

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 使用
if (!user) {
  throw new ApiError('用户不存在', 404);
}
```

#### 示例 2：Try-Catch 包装

```typescript
export async function POST(request: NextRequest) {
  try {
    // 业务逻辑
    const body = await request.json();
    // ...

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[API Error]', error);

    // 区分不同错误类型
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    // 未知错误
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
```

#### 示例 3：参数验证

```typescript
import { z } from 'zod';

// 定义验证规则
const LoginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证参数
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: '参数验证失败',
          errors: result.error.errors,
        },
        { status: 400 }
      );
    }

    // 使用验证后的数据
    const { username, password } = result.data;

    // 业务逻辑...
  } catch (error) {
    // 错误处理...
  }
}
```

---

## 完整项目实战

### 🎯 项目功能

本项目实现了一个**图片分享应用**，完整展示 Next.js API Routes 的实际应用。

**功能清单：**
- ✅ 用户登录（JWT Token）
- ✅ 图片上传（FormData）
- ✅ 图片列表（分页）
- ✅ 身份验证（Authorization Header）
- ✅ 文件类型和大小验证
- ✅ 统一错误处理
- ✅ RESTful API 设计

### 📁 项目结构

```
next-app/
├── app/
│   ├── image-share/
│   │   └── page.tsx                # 主页面
│   └── api/
│       ├── auth/
│       │   └── login/
│       │       └── route.ts        # 登录 API
│       └── images/
│           ├── upload/
│           │   └── route.ts        # 上传 API
│           └── list/
│               └── route.ts        # 列表 API
│
├── components/image-share/
│   ├── LoginForm.tsx               # 登录表单
│   ├── UploadForm.tsx              # 上传表单
│   └── ImageList.tsx               # 图片列表
│
├── data/image-mock/
│   └── images.ts                   # 模拟数据
│
└── styles/image-share/
    ├── LoginForm.module.css
    ├── UploadForm.module.css
    ├── ImageList.module.css
    └── Page.module.css
```

### 📝 核心代码解析

#### 1. 登录 API

**文件**：[app/api/auth/login/route.ts](app/api/auth/login/route.ts:1-90)

**知识点：**
- ✅ POST 请求处理
- ✅ JSON 请求体解析
- ✅ 参数验证
- ✅ Token 生成
- ✅ 错误处理

#### 2. 上传 API

**文件**：[app/api/images/upload/route.ts](app/api/images/upload/route.ts:1-127)

**知识点：**
- ✅ Authorization Header 验证
- ✅ FormData 解析
- ✅ 文件类型验证
- ✅ 文件大小验证
- ✅ Token 验证

#### 3. 列表 API

**文件**：[app/api/images/list/route.ts](app/api/images/list/route.ts:1-63)

**知识点：**
- ✅ GET 请求处理
- ✅ URL 查询参数解析
- ✅ 分页实现
- ✅ 数据排序

### 🧪 完整测试流程

#### 测试 1：登录获取 Token

```bash
# 1. 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 响应：
# {
#   "success": true,
#   "data": {
#     "username": "admin",
#     "token": "eyJ1c2VybmFtZSI6ImFkbWluIi..."
#   }
# }
```

#### 测试 2：上传图片

```bash
# 2. 上传图片（需要 Token）
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@/path/to/image.jpg"

# 响应：
# {
#   "success": true,
#   "data": {
#     "id": "1234567890",
#     "filename": "image.jpg",
#     "size": 102400
#   }
# }
```

#### 测试 3：获取图片列表

```bash
# 3. 获取列表
curl "http://localhost:3000/api/images/list?page=1&pageSize=10"

# 响应：
# {
#   "success": true,
#   "data": {
#     "images": [...],
#     "pagination": {
#       "page": 1,
#       "pageSize": 10,
#       "total": 2
#     }
#   }
# }
```

---

## 常见问题

### Q1: API Routes 和 Pages Router 的 API 有什么区别？

**App Router（新）：**
```typescript
// app/api/users/route.ts
export async function GET() { ... }
```

**Pages Router（旧）：**
```typescript
// pages/api/users.ts
export default function handler(req, res) { ... }
```

**建议**：新项目使用 App Router。

---

### Q2: 如何处理 CORS？

**方法 1：单个 API 设置**

```typescript
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ data: '...' });

  // 设置 CORS 头
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  return response;
}
```

**方法 2：全局中间件**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  return response;
}
```

---

### Q3: 如何连接真实数据库？

**示例：使用 Prisma**

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

```typescript
// app/api/users/route.ts
import prisma from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json({
    success: true,
    data: users,
  });
}
```

---

### Q4: 文件上传到哪里？

**开发环境**：本项目使用模拟数据

**生产环境建议：**
1. **云存储**：AWS S3、阿里云 OSS、腾讯云 COS
2. **CDN**：加速访问
3. **数据库**：存储文件元信息

**示例（AWS S3）：**

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'us-east-1' });

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // 读取文件
  const buffer = await file.arrayBuffer();

  // 上传到 S3
  await s3.send(new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: file.name,
    Body: Buffer.from(buffer),
  }));

  return NextResponse.json({ success: true });
}
```

---

### Q5: 如何限制 API 访问频率？

**简单实现：**

```typescript
// lib/rate-limiter.ts
const requests = new Map<string, number[]>();

export function rateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userRequests = requests.get(ip) || [];

  // 清除过期记录
  const validRequests = userRequests.filter(time => now - time < windowMs);

  if (validRequests.length >= maxRequests) {
    return false;  // 超过限制
  }

  validRequests.push(now);
  requests.set(ip, validRequests);

  return true;  // 允许请求
}
```

**使用：**

```typescript
export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown';

  if (!rateLimit(ip, 5, 60000)) {  // 每分钟最多5次
    return NextResponse.json(
      { error: '请求过于频繁' },
      { status: 429 }
    );
  }

  // 业务逻辑...
}
```

---

## 🎓 学习建议

### 第 1 天：理解 API Routes 基础（2 小时）

**上午（1 小时）：**
1. 阅读"知识点一：API Routes 基础"
2. 阅读"知识点二：处理不同 HTTP 方法"
3. 理解文件系统路由规则

**下午（1 小时）：**
1. 启动项目，访问 `/image-share`
2. 使用浏览器开发者工具观察网络请求
3. 对照代码理解 API 调用流程

### 第 2 天：掌握请求处理（3 小时）

**上午（1.5 小时）：**
1. 阅读"知识点三：请求体解析"
2. 阅读"知识点四：文件上传处理"
3. 理解 JSON 和 FormData 的区别

**下午（1.5 小时）：**
1. 打开 VS Code，阅读核心文件
2. 在登录和上传 API 中添加 `console.log`
3. 观察请求和响应数据

### 第 3 天：实战练习（3 小时）

**任务 1：添加注册 API（1 小时）**

创建 `app/api/auth/register/route.ts`：

```typescript
export async function POST(request: NextRequest) {
  const { username, password, email } = await request.json();

  // 验证参数
  // 创建用户
  // 返回成功
}
```

**任务 2：添加图片删除 API（1 小时）**

创建删除功能：

```typescript
// app/api/images/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 验证身份
  // 删除图片
  // 返回成功
}
```

**任务 3：实现图片搜索（1 小时）**

修改列表 API，支持关键词搜索：

```typescript
const keyword = searchParams.get('keyword');
const filteredImages = images.filter(img =>
  img.originalName.includes(keyword || '')
);
```

---

## 🎯 检查清单

学完后，检查你是否：

**概念理解：**
- [ ] 能解释什么是 API Routes
- [ ] 知道不同 HTTP 方法的用途
- [ ] 理解 JSON 和 FormData 的区别
- [ ] 理解 JWT Token 的工作原理

**代码理解：**
- [ ] 能看懂登录 API 的实现
- [ ] 能看懂上传 API 的实现
- [ ] 能看懂 Token 验证的逻辑
- [ ] 理解错误处理的方式

**动手能力：**
- [ ] 能成功运行项目
- [ ] 能登录并上传图片
- [ ] 能用 curl 测试 API
- [ ] 能修改 API 并观察效果

**进阶能力：**
- [ ] 能自己实现新的 API
- [ ] 能设计 RESTful API
- [ ] 知道如何调试 API

---

## 📚 更多学习资源

### 官方文档

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js 请求和响应](https://nextjs.org/docs/app/api-reference/functions/next-request)

### 本项目文档

- [SSR 教程](../README.md)
- [缓存策略教程](../README-CACHE.md)

---

## 💬 还有问题？

如果还是不明白，可能因为：

1. **没有动手实践** → 一定要自己运行代码，看效果
2. **跳过了某个知识点** → 建议按顺序阅读
3. **没有对照代码看** → 打开 VS Code，边看文档边看代码

**记住：**
> API Routes 是全栈开发的核心，掌握了 API Routes，你就能独立开发完整的 Web 应用！

**加油！你可以的！** 🚀
