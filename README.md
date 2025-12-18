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

Server Actions 是 Next.js 13+ 引入的革命性全栈能力，允许开发者**直接在 React 组件中声明服务端函数**，实现"前端即后端"的开发体验。

#### 🤔 什么是 Server Actions？

**传统开发模式的痛点：**
```
前端组件 → fetch('/api/todo') → API Route → 数据库
           ↓                      ↓
        需要写               需要写
     - fetch 请求代码        - 路由处理
     - 错误处理             - 参数解析
     - Loading 状态         - 返回 JSON
```

**Server Actions 的解决方案：**
```
前端组件 → 直接调用 addTodo(formData) → 数据库
           ↓
        只需要写
     - 表单/按钮绑定
     - 自动处理一切
```

**核心理念：** 将服务端逻辑写在 `.ts` 文件中，前端直接调用，就像调用普通函数一样！

### 🎯 学习目标

- ✅ 理解 Server Actions 的核心概念和优势
- ✅ 掌握表单无刷新提交和数据变更
- ✅ 学会实现乐观 UI 和错误处理
- ✅ 掌握复杂表单处理和文件上传
- ✅ 理解与 RSC 的深度集成
- ✅ 掌握权限校验和安全实践

### 📚 核心知识点详解

#### 1. Server Actions 基础原理

##### 🔍 工作流程

```
┌─────────────────────────────────────────────────────┐
│                Server Actions 工作流程               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1️⃣ 用户操作                                        │
│     └─ 提交表单 / 点击按钮                          │
│                                                     │
│  2️⃣ 调用 Server Action                             │
│     └─ 前端直接调用，就像调用普通函数               │
│                                                     │
│  3️⃣ Next.js 自动处理                                │
│     ├─ 序列化参数                                   │
│     ├─ 发送 POST 请求到服务器                       │
│     └─ 验证 CSRF Token                             │
│                                                     │
│  4️⃣ 服务端执行                                      │
│     ├─ 权限校验                                     │
│     ├─ 参数验证                                     │
│     ├─ 数据库操作                                   │
│     └─ 刷新缓存（revalidatePath）                  │
│                                                     │
│  5️⃣ 自动刷新 UI                                     │
│     └─ RSC 重新渲染，显示最新数据                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

##### 📊 与 API Routes 的详细对比

| 维度 | API Routes | Server Actions | 说明 |
|------|-----------|----------------|------|
| **代码位置** | `app/api/xxx/route.ts` | `actions.ts`（与组件同目录） | Server Actions 更内聚 |
| **调用方式** | `fetch('/api/xxx')` | `addTodo(formData)` | Server Actions 更简洁 |
| **类型安全** | 需手动定义接口类型 | TypeScript 自动推断 | Server Actions 更安全 |
| **错误处理** | `try/catch` + 状态码 | 直接 `throw Error` | Server Actions 更直观 |
| **Loading 状态** | 手动管理 `loading` | `useTransition` 自动 | Server Actions 更优雅 |
| **缓存刷新** | 手动 `mutate` | `revalidatePath` 自动 | Server Actions 更智能 |
| **表单提交** | 需要 `preventDefault` | 直接绑定 `action` | Server Actions 原生支持 |
| **适用场景** | 复杂接口、第三方调用 | 表单、数据变更 | 各有所长 |

**示例对比：**

**传统 API Routes 方式：**
```typescript
// app/api/todos/route.ts (后端)
export async function POST(request: Request) {
  const body = await request.json();
  const todo = await db.todo.create({ data: body });
  return NextResponse.json(todo);
}

// TodoForm.tsx (前端)
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input })
    });
    const data = await res.json();
    router.refresh(); // 手动刷新
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};
```
需要写 **30+ 行代码**

**Server Actions 方式：**
```typescript
// actions.ts (服务端)
'use server';
export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { title: formData.get('title') } });
  revalidatePath('/todos');
}

// TodoForm.tsx (客户端)
<form action={addTodo}>
  <input name="title" required />
  <button type="submit">添加</button>
</form>
```
只需要 **10 行代码**，省略了 67% 的代码！

##### 🎁 核心优势详解

1. **零配置，开箱即用**
   - 无需配置路由
   - 无需处理 CORS
   - 无需手动序列化

2. **类型安全**
   ```typescript
   // Server Action 自动类型推断
   export async function addTodo(formData: FormData) {
     const title = formData.get('title') as string; // 明确类型
   }

   // 前端自动提示
   <form action={addTodo}> {/* TypeScript 自动检查 */}
   ```

3. **自动 CSRF 防护**
   - Next.js 自动生成和验证 CSRF Token
   - 防止跨站请求伪造攻击

4. **Session 自动透传**
   ```typescript
   'use server';
   export async function addTodo(formData: FormData) {
     const session = await getSession(); // 自动获取用户 session
     // 无需手动解析 Cookie
   }
   ```

#### 2. 声明与调用 Server Actions

##### 📝 三种声明方式

**方式一：独立文件声明（推荐）**
```typescript
// app/todo/actions.ts
'use server';

export async function addTodo(formData: FormData) {
  // 服务端逻辑
}

export async function deleteTodo(id: string) {
  // 服务端逻辑
}
```

**方式二：在服务端组件中声明**
```typescript
// app/todo/page.tsx
export default async function TodoPage() {
  async function addTodo(formData: FormData) {
    'use server'; // 函数级别声明
    // 服务端逻辑
  }

  return <form action={addTodo}>...</form>;
}
```

**方式三：在 API Route 中使用（不推荐）**
```typescript
// app/api/todo/route.ts
import { addTodo } from '@/actions/todo';

export async function POST(request: Request) {
  const formData = await request.formData();
  return addTodo(formData);
}
```

##### 🎯 四种调用方式

**方式一：表单 action 绑定（最常用）**
```tsx
<form action={addTodo}>
  <input name="title" />
  <button type="submit">添加</button>
</form>
```

**方式二：事件驱动调用**
```tsx
<button onClick={() => deleteTodo(id)}>
  删除
</button>
```

**方式三：表单 + startTransition（推荐）**
```tsx
'use client';

export function TodoForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={(formData) => {
      startTransition(async () => {
        await addTodo(formData);
      });
    }}>
      <input name="title" />
      <button disabled={isPending}>
        {isPending ? '添加中...' : '添加'}
      </button>
    </form>
  );
}
```

**方式四：编程式调用**
```tsx
'use client';

export function TodoButton() {
  const handleClick = async () => {
    const formData = new FormData();
    formData.append('title', 'New Todo');
    await addTodo(formData);
  };

  return <button onClick={handleClick}>添加</button>;
}
```

##### 🔒 参数类型与校验

**基础参数：**
```typescript
'use server';

// 接收 FormData
export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string;
}

// 接收普通参数
export async function deleteTodo(id: string) {
  await db.todo.delete({ where: { id } });
}

// 接收对象参数
export async function updateTodo(data: { id: string; title: string }) {
  await db.todo.update({ where: { id: data.id }, data });
}
```

**使用 Zod 校验（推荐）：**
```typescript
'use server';
import { z } from 'zod';

const TodoSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题过长'),
});

export async function addTodo(formData: FormData) {
  // 校验参数
  const result = TodoSchema.safeParse({
    title: formData.get('title'),
  });

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  // 使用校验后的数据
  await db.todo.create({ data: result.data });
}
```

#### 3. 乐观 UI 更新（Optimistic UI）

##### 🎯 什么是乐观 UI？

**传统方式（等待服务器）：**
```
用户点击 → Loading... → 等待 500ms → 服务器响应 → 更新 UI
                        ⏱️ 卡顿
```

**乐观 UI（立即更新）：**
```
用户点击 → 立即更新 UI → 后台请求 → 成功：保持 / 失败：回滚
           ⚡ 流畅
```

##### 💻 实现乐观 UI

**完整示例：切换待办事项完成状态**
```tsx
'use client';

import { toggleTodo } from './actions';
import { useState, useTransition } from 'react';

export function ToggleButton({
  id,
  completed
}: {
  id: string;
  completed: boolean;
}) {
  // 1. 乐观状态（用于显示）
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);

  // 2. Transition 状态（是否正在处理）
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // 步骤1：立即更新 UI（乐观更新）
    setOptimisticCompleted(!optimisticCompleted);

    // 步骤2：在后台执行 Server Action
    startTransition(async () => {
      try {
        await toggleTodo(id);
        // 成功：不需要做任何事，UI 已经更新
      } catch (e) {
        // 步骤3：失败时回滚
        setOptimisticCompleted(completed);
        alert(e.message);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={
        optimisticCompleted
          ? 'bg-green-500'  // 已完成样式
          : 'bg-gray-300'   // 未完成样式
      }
    >
      {optimisticCompleted ? '✓' : '○'}
    </button>
  );
}
```

**关键点解析：**

1. **`useState(completed)`**：维护乐观状态
2. **`useTransition()`**：标记非紧急更新
3. **立即更新**：`setOptimisticCompleted(!optimisticCompleted)`
4. **后台调用**：`await toggleTodo(id)`
5. **失败回滚**：`setOptimisticCompleted(completed)`

##### 🎨 适用场景

**✅ 适合乐观 UI：**
- 点赞/取消点赞
- 关注/取关
- 标记已读/未读
- 切换开关状态
- 简单的增删改操作

**❌ 不适合乐观 UI：**
- 支付操作（必须等待确认）
- 删除重要数据（需要二次确认）
- 复杂业务逻辑（成功率不确定）

#### 4. 数据刷新策略

##### 🔄 revalidatePath - 刷新路径

```typescript
'use server';
import { revalidatePath } from 'next/cache';

export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { ... } });

  // 刷新待办事项页面
  revalidatePath('/todos');

  // 刷新多个页面
  revalidatePath('/todos');
  revalidatePath('/dashboard');

  // 刷新动态路由
  revalidatePath('/todos/[id]', 'page');

  // 刷新布局
  revalidatePath('/todos', 'layout');
}
```

##### 🏷️ revalidateTag - 刷新标签

```typescript
'use server';
import { revalidateTag } from 'next/cache';

// 数据获取时添加标签
export async function getTodos() {
  const res = await fetch('https://api.example.com/todos', {
    next: { tags: ['todos'] }  // 添加标签
  });
  return res.json();
}

// Server Action 中刷新标签
export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { ... } });
  revalidateTag('todos');  // 刷新所有带 'todos' 标签的数据
}
```

##### ⚡ 对比与选择

| 方法 | 用途 | 示例 | 优势 |
|------|------|------|------|
| `revalidatePath` | 刷新特定路径 | `/todos` | 简单直接 |
| `revalidateTag` | 刷新带标签的数据 | `todos` | 精细控制 |
| `router.refresh()` | 客户端强制刷新 | - | 兼容旧代码 |

**推荐实践：**
```typescript
// ✅ 好的做法：使用 revalidatePath
export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { ... } });
  revalidatePath('/todos');  // 自动刷新该路径
}

// ❌ 不推荐：手动刷新
export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { ... } });
  // 前端需要手动调用 router.refresh()
}
```

### 💻 实战项目

#### 项目一：待办事项管理系统

**访问路径：** `/13-server-actions/todo`

**🎯 项目简介：**

这是一个完整的待办事项管理系统，展示了 Server Actions 的核心功能：表单提交、乐观 UI、权限校验、错误处理等。

**功能特性：**
- ✅ 添加待办事项（表单无刷新提交）
- ✅ 删除待办事项（二次确认）
- ✅ 切换完成状态（乐观 UI，立即响应）
- ✅ 批量删除（事务处理）
- ✅ 权限校验（验证用户身份）
- ✅ 错误处理（友好提示）
- ✅ 自动刷新（数据变更后自动更新）

**技术亮点：**
- 🚀 表单无刷新提交 - 用户体验极佳
- ⚡ `useTransition` 实现乐观 UI - 立即响应
- 🔄 `revalidatePath` 自动刷新 - 数据同步
- 🔒 完善的权限校验 - 安全可靠
- 📱 移动端响应式设计 - 全设备支持

**核心代码示例：**

**1. Server Actions（服务端逻辑）**
```typescript
// app/13-server-actions/todo/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

// 模拟用户 Session
async function getSession() {
  return { user: { id: 'demo-user', name: 'Demo User' } };
}

/**
 * 添加待办事项
 * 知识点：
 * - FormData 参数接收
 * - 参数校验
 * - 权限验证
 * - revalidatePath 刷新
 */
export async function addTodo(formData: FormData) {
  // 1. 权限校验
  const session = await getSession();
  if (!session) {
    throw new Error('未登录，无法添加待办事项');
  }

  // 2. 参数获取与校验
  const title = formData.get('title') as string;
  if (!title || title.trim().length === 0) {
    throw new Error('标题不能为空');
  }
  if (title.length > 100) {
    throw new Error('标题不能超过 100 个字符');
  }

  // 3. 数据库操作（这里是模拟）
  const newTodo = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    userId: session.user.id,
  };
  todos.push(newTodo);

  // 4. 刷新页面数据（触发 RSC 重新渲染）
  revalidatePath('/13-server-actions/todo');

  return { success: true, todo: newTodo };
}

/**
 * 切换完成状态
 * 知识点：
 * - 乐观 UI 支持
 * - 简单参数传递
 */
export async function toggleTodo(id: string) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const todo = todos.find(t => t.id === id && t.userId === session.user.id);
  if (!todo) throw new Error('待办事项不存在');

  // 切换状态
  todo.completed = !todo.completed;
  revalidatePath('/13-server-actions/todo');

  return { success: true, completed: todo.completed };
}

/**
 * 删除待办事项
 * 知识点：
 * - 事件驱动调用
 * - 权限校验
 */
export async function deleteTodo(id: string) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const index = todos.findIndex(t => t.id === id && t.userId === session.user.id);
  if (index === -1) throw new Error('待办事项不存在或无权删除');

  todos.splice(index, 1);
  revalidatePath('/13-server-actions/todo');

  return { success: true };
}
```

**2. 客户端组件（用户交互）**
```tsx
// app/13-server-actions/todo/components/AddTodoForm.tsx
'use client';

import { addTodo } from '../actions';
import { useState, useTransition } from 'react';

export function AddTodoForm() {
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      try {
        await addTodo(formData);
        setInput(''); // 清空输入框
      } catch (e) {
        setError(e instanceof Error ? e.message : '添加失败');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          name="title"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入待办事项..."
          className="flex-1 border rounded-lg px-4 py-2"
          required
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          {isPending ? '添加中...' : '添加'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </form>
  );
}
```

**3. 乐观 UI 组件**
```tsx
// app/13-server-actions/todo/components/ToggleButton.tsx
'use client';

import { toggleTodo } from '../actions';
import { useState, useTransition } from 'react';

export function ToggleButton({ id, completed }: {
  id: string;
  completed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);

  const handleToggle = () => {
    // 乐观更新：立即更新 UI
    setOptimisticCompleted(!optimisticCompleted);

    startTransition(async () => {
      try {
        await toggleTodo(id);
      } catch (e) {
        // 失败时回滚
        setOptimisticCompleted(completed);
        alert(e instanceof Error ? e.message : '操作失败');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`w-5 h-5 rounded border-2 ${
        optimisticCompleted
          ? 'bg-blue-500 border-blue-500'
          : 'border-gray-300'
      }`}
    >
      {optimisticCompleted && <CheckIcon />}
    </button>
  );
}
```

**🔍 学习重点：**

1. **表单处理流程：**
   - 用户输入 → 提交表单 → 调用 Server Action
   - → 参数校验 → 数据库操作 → 刷新页面

2. **乐观 UI 实现：**
   - 立即更新 UI → 后台请求 → 成功保持/失败回滚

3. **错误处理：**
   - Server Action 中 `throw Error`
   - 前端用 `try/catch` 捕获
   - 显示友好的错误提示

4. **权限校验：**
   - 每个操作都验证用户身份
   - 防止未授权访问

#### 项目二：审批流系统

**访问路径：** `/13-server-actions/approval`

**🎯 项目简介：**

企业级审批流管理系统，展示如何处理复杂表单、嵌套数据、业务逻辑校验等高级场景。

**功能特性：**
- ✅ 动态表单字段（可添加/删除字段）
- ✅ 嵌套数据处理（FormData 复杂解析）
- ✅ 审批状态管理（待审批/通过/驳回）
- ✅ 撤回功能（仅待审批状态可撤回）
- ✅ 业务逻辑校验（状态转换规则）
- ✅ 审批记录查看
- ✅ 响应式布局（移动端友好）

**技术亮点：**
- 🎨 动态表单（React 状态管理）
- 🔀 复杂数据解析（FormData 嵌套字段）
- 🏢 企业级业务场景（审批流程）
- 🔐 状态流转管理（有限状态机思想）
- 📋 表单校验（多字段联合验证）

**核心代码示例：**

**1. 动态表单组件**
```tsx
// app/13-server-actions/approval/components/ApprovalForm.tsx
'use client';

import { submitApproval } from '../actions';
import { useState, useTransition } from 'react';

interface Field {
  name: string;
  value: string;
}

export function ApprovalForm() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([{ name: '', value: '' }]);
  const [isPending, startTransition] = useTransition();

  // 添加字段
  const addField = () => {
    setFields([...fields, { name: '', value: '' }]);
  };

  // 删除字段
  const removeField = (index: number) => {
    if (fields.length === 1) return;
    setFields(fields.filter((_, i) => i !== index));
  };

  // 更新字段
  const updateField = (index: number, type: 'name' | 'value', value: string) => {
    const newFields = [...fields];
    newFields[index][type] = value;
    setFields(newFields);
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await submitApproval(formData);
        // 重置表单
        setTitle('');
        setFields([{ name: '', value: '' }]);
      } catch (e) {
        alert(e instanceof Error ? e.message : '提交失败');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* 审批标题 */}
      <input
        name="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="例如：出差申请、报销申请等"
        className="w-full border rounded-lg px-4 py-2"
        required
      />

      {/* 动态字段 */}
      <div>
        <div className="flex justify-between mb-3">
          <label>审批字段</label>
          <button type="button" onClick={addField}>
            + 添加字段
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              name={`fields[${index}][name]`}
              value={field.name}
              onChange={e => updateField(index, 'name', e.target.value)}
              placeholder="字段名（如：目的地）"
              required
            />
            <input
              name={`fields[${index}][value]`}
              value={field.value}
              onChange={e => updateField(index, 'value', e.target.value)}
              placeholder="字段值（如：北京）"
              required
            />
            {fields.length > 1 && (
              <button type="button" onClick={() => removeField(index)}>
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? '提交中...' : '提交审批'}
      </button>
    </form>
  );
}
```

**2. 嵌套数据解析（Server Action）**
```typescript
// app/13-server-actions/approval/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function submitApproval(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const title = formData.get('title') as string;
  if (!title.trim()) throw new Error('审批标题不能为空');

  // 解析嵌套字段 - 核心技术点
  const fields: { name: string; value: string }[] = [];
  const fieldMap = new Map<number, { name?: string; value?: string }>();

  // 遍历所有表单字段
  for (const [key, value] of formData.entries()) {
    // 匹配 fields[0][name]、fields[0][value] 格式
    if (key.startsWith('fields[')) {
      const match = key.match(/fields\[(\d+)\]\[(name|value)\]/);
      if (match) {
        const idx = Number(match[1]);      // 获取索引
        const type = match[2] as 'name' | 'value';  // 获取类型

        if (!fieldMap.has(idx)) {
          fieldMap.set(idx, {});
        }
        fieldMap.get(idx)![type] = value as string;
      }
    }
  }

  // 转换为数组并校验
  for (const [, field] of Array.from(fieldMap.entries()).sort(([a], [b]) => a - b)) {
    if (!field.name || !field.value) {
      throw new Error('所有字段的名称和值都必须填写');
    }
    fields.push({
      name: field.name.trim(),
      value: field.value.trim()
    });
  }

  if (fields.length === 0) {
    throw new Error('至少需要添加一个字段');
  }

  // 创建审批记录
  const newApproval = {
    id: Date.now().toString(),
    title: title.trim(),
    fields,
    status: 'pending',
    submitterId: session.user.id,
    submitTime: new Date().toISOString(),
  };

  approvals.push(newApproval);
  revalidatePath('/13-server-actions/approval');

  return { success: true, approval: newApproval };
}

/**
 * 撤回审批
 * 知识点：业务逻辑校验、状态管理
 */
export async function withdrawApproval(id: string) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const approval = approvals.find(
    a => a.id === id && a.submitterId === session.user.id
  );

  if (!approval) throw new Error('审批记录不存在');

  // 业务规则：只有待审批状态才能撤回
  if (approval.status !== 'pending') {
    throw new Error('只能撤回待审批的申请');
  }

  approvals = approvals.filter(a => a.id !== id);
  revalidatePath('/13-server-actions/approval');

  return { success: true };
}
```

**🔍 学习重点：**

1. **动态表单实现：**
   - 使用 `useState` 管理字段数组
   - 添加/删除/更新字段
   - 表单域命名：`fields[index][type]`

2. **嵌套数据解析：**
   ```typescript
   // FormData 中的数据：
   fields[0][name] = "目的地"
   fields[0][value] = "北京"
   fields[1][name] = "天数"
   fields[1][value] = "3天"

   // 解析为：
   [
     { name: "目的地", value: "北京" },
     { name: "天数", value: "3天" }
   ]
   ```

3. **业务逻辑校验：**
   - 状态转换规则
   - 权限检查
   - 数据完整性验证

4. **企业级实践：**
   - 审批流程设计
   - 状态管理
   - 用户权限控制

#### 项目三：文件上传系统

**访问路径：** `/13-server-actions/upload`

**🎯 项目简介：**

完整的文件管理系统，展示 Server Actions 如何处理文件上传、预览、管理等功能。

**功能特性：**
- ✅ 文件上传与实时预览
- ✅ 文件大小校验（5MB 限制）
- ✅ 文件类型校验（仅图片）
- ✅ 图片优化展示（Next.js Image）
- ✅ 文件列表管理
- ✅ 文件删除功能
- ✅ 响应式网格布局

**技术亮点：**
- 📁 FormData 文件处理
- 🖼️ 客户端实时预览（FileReader）
- 🚀 Next.js Image 组件优化
- 📐 响应式网格布局
- 🔒 文件安全校验

**核心代码示例：**

**1. 文件上传表单**
```tsx
// app/13-server-actions/upload/components/UploadForm.tsx
'use client';

import { uploadFile } from '../actions';
import { useState, useTransition, useRef } from 'react';

export function UploadForm() {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择 - 生成预览
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }

    // 使用 FileReader 生成预览图
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await uploadFile(formData);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : '上传失败');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* 文件选择区域 */}
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          required
        />

        <label htmlFor="file-upload" className="cursor-pointer">
          {preview ? (
            <img
              src={preview}
              alt="预览"
              className="max-w-full max-h-48 rounded-lg mx-auto"
            />
          ) : (
            <div>
              <UploadIcon />
              <span>点击选择文件</span>
              <span className="text-sm text-gray-500">
                支持 JPEG, PNG, GIF, WebP（最大 5MB）
              </span>
            </div>
          )}
        </label>
      </div>

      {preview && (
        <button type="submit" disabled={isPending}>
          {isPending ? '上传中...' : '上传文件'}
        </button>
      )}
    </form>
  );
}
```

**2. 文件处理（Server Action）**
```typescript
// app/13-server-actions/upload/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const file = formData.get('file') as File;
  if (!file) throw new Error('请选择要上传的文件');

  // 1. 文件大小校验（5MB）
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('文件大小不能超过 5MB');
  }

  // 2. 文件类型校验（仅允许图片）
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('仅支持上传图片文件（JPEG, PNG, GIF, WebP）');
  }

  try {
    // 3. 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${ext}`;

    // 5. 保存文件到 public/uploads
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // 6. 创建文件记录
    const fileRecord = {
      id: timestamp.toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadTime: new Date().toISOString(),
      userId: session.user.id,
      path: `/uploads/${fileName}`,
    };

    files.push(fileRecord);
    revalidatePath('/13-server-actions/upload');

    return { success: true, file: fileRecord };
  } catch (error) {
    console.error('文件上传失败:', error);
    throw new Error('文件上传失败，请重试');
  }
}

/**
 * 删除文件
 * 知识点：文件系统操作、权限校验
 */
export async function deleteFile(id: string) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const fileIndex = files.findIndex(
    f => f.id === id && f.userId === session.user.id
  );

  if (fileIndex === -1) {
    throw new Error('文件不存在或无权删除');
  }

  files.splice(fileIndex, 1);
  revalidatePath('/13-server-actions/upload');

  return { success: true };
}
```

**3. 文件列表展示**
```tsx
// app/13-server-actions/upload/components/FileList.tsx
import { getFiles } from '../actions';
import { DeleteFileButton } from './DeleteFileButton';
import Image from 'next/image';

export default async function FileList() {
  const files = await getFiles();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map(file => (
        <div key={file.id} className="border rounded-lg overflow-hidden">
          {/* 图片预览 - 使用 Next.js Image 优化 */}
          <div className="relative aspect-video bg-gray-100">
            <Image
              src={file.path}
              alt={file.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* 文件信息 */}
          <div className="p-4">
            <h3 className="font-medium truncate" title={file.name}>
              {file.name}
            </h3>
            <div className="text-xs text-gray-500">
              <p>大小：{formatFileSize(file.size)}</p>
              <p>上传时间：{formatTime(file.uploadTime)}</p>
            </div>
            <DeleteFileButton id={file.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**🔍 学习重点：**

1. **文件上传流程：**
   - 前端选择文件 → FileReader 生成预览
   - → FormData 发送 → Server Action 处理
   - → 文件校验 → 保存到服务器 → 返回结果

2. **文件安全校验：**
   ```typescript
   // 大小校验
   if (file.size > maxSize) throw new Error();

   // 类型校验
   if (!allowedTypes.includes(file.type)) throw new Error();

   // 文件名安全处理
   const fileName = `${timestamp}-${randomStr}.${ext}`;
   ```

3. **Next.js Image 优化：**
   - 自动图片优化
   - 响应式加载
   - 懒加载支持

4. **文件系统操作：**
   - `writeFile` 保存文件
   - 目录管理
   - 文件路径处理

### 📖 详细文档

查看完整文档：[docs/13-server-actions/README.md](docs/13-server-actions/README.md)

内容包括：
- ✅ 理论基础详解（Server Actions 的诞生与定位）
- ✅ 核心概念深入（声明、调用、乐观 UI、数据刷新）
- ✅ 完整代码示例（三个实战项目）
- ✅ 最佳实践指南（安全性、性能优化、团队协作）
- ✅ 常见问题解答（10个常见问题及解决方案）
- ✅ 企业级场景应用（审批流、评论系统、文件管理）

### 🎓 学习建议

#### 第 1 天：理解概念（2-3 小时）

**上午（1.5 小时）：阅读理论**
1. 阅读本文档的"核心知识点详解"部分
2. 理解 Server Actions 与 API Routes 的区别
3. 掌握工作流程和核心优势

**下午（1.5 小时）：运行项目**
1. 启动开发服务器：`npm run dev`
2. 访问主导航页：http://localhost:3000/13-server-actions
3. 依次体验三个实战项目
4. 观察浏览器开发者工具的网络请求

#### 第 2 天：阅读代码（3-4 小时）

**上午（2 小时）：待办事项系统**
1. 打开 `app/13-server-actions/todo/actions.ts`
2. 理解每个 Server Action 的实现
3. 观察 `revalidatePath` 的使用
4. 阅读客户端组件的乐观 UI 实现

**下午（2 小时）：审批流和文件上传**
1. 研究审批流系统的嵌套数据解析
2. 理解文件上传的 FormData 处理
3. 对比三个项目的不同场景
4. 总结 Server Actions 的使用模式

#### 第 3 天：动手实践（4-5 小时）

**任务 1：扩展待办事项（1.5 小时）**
```typescript
// 添加"编辑"功能
export async function updateTodo(id: string, title: string) {
  'use server';
  // 实现编辑逻辑
}

// 添加"优先级"字段
// 添加"截止日期"字段
```

**任务 2：完善审批流（1.5 小时）**
```typescript
// 添加审批人角色
export async function approveApproval(id: string, action: 'approve' | 'reject', comment: string) {
  'use server';
  // 实现审批逻辑
}

// 添加审批历史记录
```

**任务 3：优化文件上传（1.5 小时）**
```typescript
// 添加上传进度显示
// 支持多文件上传
// 添加拖拽上传功能
```

### 💡 最佳实践总结

#### 1. 安全性第一

```typescript
'use server';

export async function sensitiveAction(formData: FormData) {
  // ✅ 好的做法：每次都验证
  const session = await getSession();
  if (!session) throw new Error('未登录');

  // ✅ 验证数据所有权
  const item = await db.item.findUnique({ where: { id } });
  if (item.userId !== session.user.id) {
    throw new Error('无权操作');
  }

  // ✅ 参数校验
  const schema = z.object({ title: z.string().min(1) });
  const result = schema.safeParse({ title: formData.get('title') });
  if (!result.success) throw new Error('参数错误');

  // 执行操作
}
```

#### 2. 错误处理要友好

```tsx
'use client';

export function ActionForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      try {
        await serverAction(formData);
      } catch (e) {
        // ✅ 好的做法：显示具体错误信息
        setError(e instanceof Error ? e.message : '操作失败，请重试');
      }
    });
  };

  return (
    <form action={handleSubmit}>
      {/* 表单字段 */}

      {/* ✅ 友好的错误提示 */}
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </form>
  );
}
```

#### 3. 性能优化技巧

```typescript
'use server';

// ✅ 使用 revalidateTag 精细控制缓存
export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { ... } });

  // 只刷新待办事项标签的数据
  revalidateTag('todos');
}

// ✅ 批量操作使用事务
export async function batchDelete(ids: string[]) {
  await db.$transaction(async (tx) => {
    for (const id of ids) {
      await tx.item.delete({ where: { id } });
    }
  });

  revalidatePath('/items');
}

// ❌ 避免：不必要的全局刷新
export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { ... } });
  revalidatePath('/'); // 刷新整个网站！
}
```

#### 4. 代码组织建议

```
app/
  feature/
    page.tsx              # 页面组件
    actions.ts            # Server Actions（与页面同目录）
    components/           # 相关组件
      Form.tsx           # 客户端组件
      List.tsx           # 服务端组件
    types.ts              # 类型定义
```

**命名规范：**
- Server Actions：动词开头（`addTodo`, `deleteTodo`）
- 组件：名词或名词短语（`TodoForm`, `TodoList`）
- 文件：kebab-case（`actions.ts`, `todo-form.tsx`）

#### 5. 类型安全

```typescript
// types.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

// actions.ts
'use server';

export async function getTodos(): Promise<Todo[]> {
  return await db.todo.findMany();
}

export async function addTodo(formData: FormData): Promise<Todo> {
  const title = formData.get('title') as string;
  return await db.todo.create({ data: { title } });
}

// 前端自动获得类型提示
const todos = await getTodos(); // todos: Todo[]
```

### 🎯 快速检查清单

学完本章后，检查你是否能：

**概念理解：**
- [ ] 能解释什么是 Server Actions
- [ ] 理解与 API Routes 的区别和适用场景
- [ ] 掌握 `'use server'` 的作用
- [ ] 理解 FormData 的使用
- [ ] 明白乐观 UI 的原理和实现

**代码能力：**
- [ ] 能创建基础 Server Action
- [ ] 能处理表单提交
- [ ] 能实现乐观 UI 更新
- [ ] 能做参数校验和权限验证
- [ ] 能处理文件上传
- [ ] 能解析嵌套 FormData

**调试能力：**
- [ ] 知道如何查看 Server Action 的执行结果
- [ ] 能使用浏览器开发者工具调试
- [ ] 理解错误信息并能解决

**最佳实践：**
- [ ] 所有操作都做权限校验
- [ ] 使用 revalidatePath 刷新数据
- [ ] 用 useTransition 管理 pending 状态
- [ ] 实现友好的错误处理
- [ ] 代码组织清晰、类型安全

### 🚀 进阶方向

#### 1. 集成真实数据库

```typescript
// prisma/schema.prisma
model Todo {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// actions.ts
'use server';
import { prisma } from '@/lib/prisma';

export async function addTodo(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const title = formData.get('title') as string;

  const todo = await prisma.todo.create({
    data: {
      title,
      userId: session.user.id,
    },
  });

  revalidatePath('/todos');
  return todo;
}
```

#### 2. 添加认证系统

```typescript
// 使用 NextAuth.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function protectedAction(formData: FormData) {
  'use server';

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('未登录');
  }

  // 使用 session.user 进行权限控制
}
```

#### 3. 添加单元测试

```typescript
// actions.test.ts
import { addTodo } from './actions';

describe('addTodo', () => {
  it('should create a new todo', async () => {
    const formData = new FormData();
    formData.append('title', 'Test Todo');

    const result = await addTodo(formData);

    expect(result.success).toBe(true);
    expect(result.todo.title).toBe('Test Todo');
  });

  it('should throw error for empty title', async () => {
    const formData = new FormData();
    formData.append('title', '');

    await expect(addTodo(formData)).rejects.toThrow('标题不能为空');
  });
});
```

#### 4. 实现实时功能

```typescript
// 结合 WebSocket 或 Server-Sent Events
export async function addTodo(formData: FormData) {
  'use server';

  const todo = await db.todo.create({ data: { ... } });

  // 推送实时更新
  await pusher.trigger('todos', 'new-todo', todo);

  revalidatePath('/todos');
  return todo;
}
```

### 📚 额外资源

- [Next.js 官方文档 - Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React 文档 - useTransition](https://react.dev/reference/react/useTransition)
- [Zod 文档 - 参数校验](https://zod.dev/)
- [Prisma 文档 - 数据库操作](https://www.prisma.io/docs)

### 🎉 总结

Server Actions 是 Next.js 全栈开发的重要里程碑：

1. **简化开发** - 告别繁琐的 API Route 胶水代码
2. **提升体验** - 表单无刷新、乐观 UI、自动刷新
3. **增强安全** - 自动 CSRF 防护、Session 透传
4. **优化性能** - 与 RSC 深度集成、自动缓存优化

通过本章的三个实战项目，你已经掌握：
- ✅ Server Actions 的核心概念和用法
- ✅ 表单处理和数据变更
- ✅ 乐观 UI 和错误处理
- ✅ 复杂表单和文件上传
- ✅ 权限校验和安全实践

**下一步：**
1. 完成三个练习任务
2. 尝试集成真实数据库
3. 添加认证和权限管理
4. 探索更多企业级场景

**记住：** Server Actions 适合轻量级数据变更和表单提交，复杂接口仍然建议使用 API Routes。两者配合使用，才能发挥最大价值！

Happy Coding! 🚀

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
