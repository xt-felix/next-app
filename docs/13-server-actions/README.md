# 第十三章：Server Actions - 新一代全栈能力

## 目录
- [理论基础](#理论基础)
- [核心概念](#核心概念)
- [实战项目](#实战项目)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 理论基础

### 1. Server Actions 的诞生与定位

Server Actions 是 Next.js 13+ 在 App Router 体系下引入的一项革命性全栈能力。它允许开发者直接在 React 组件中声明服务端函数,并通过表单或事件驱动的方式无缝调用这些服务端逻辑,实现"前端即后端"的开发体验。

#### 核心优势

- **彻底消除传统 API Route 的冗余胶水代码**,前后端逻辑合一
- **支持表单无刷新提交**,极致提升用户体验
- **与 React Server Components (RSC) 深度集成**,天然支持服务端数据变更与渲染
- **自动处理请求体解析、CSRF 防护、Session 传递等安全细节**
- 适合表单、数据变更、权限校验等场景,极大简化全栈开发

#### 与 API Routes 的对比

| 特性 | API Routes | Server Actions |
|------|-----------|----------------|
| 代码分布 | 前后端分离 | 组件内声明服务端逻辑 |
| 调用方式 | fetch/AJAX | 直接调用/表单 action |
| 适用场景 | 复杂接口、第三方集成 | 表单、数据变更、轻量接口 |
| 错误处理 | 手动 try/catch | 自动捕获并传递到组件 |
| Session/认证 | 需手动处理 | 自动透传 |
| 性能优化 | 需手动缓存 | 支持 RSC 缓存、自动优化 |

### 2. Server Actions 的底层机制

- **仅在 App Router (`app/`) 下可用**,需启用 React Server Components
- 通过 `"use server"` 指令声明服务端函数,Next.js 自动将其编译为服务端可调用的 API
- 支持表单 `<form action={serverAction}>` 直接提交,也可通过事件驱动(如按钮点击)调用
- 支持异步、参数校验、错误处理、Session 访问等
- 自动与 RSC 结合,数据变更后可自动刷新相关组件

### 3. 适用场景与最佳实践

**适用场景:**
- 表单提交(如评论、反馈、注册、登录等)
- 数据变更(如增删改操作)
- 权限校验与安全操作
- 轻量级后端逻辑(如发送邮件、写日志等)

**与 API Routes 协作:**
- 复杂接口仍建议用 API Routes
- Server Actions 适合页面内轻量逻辑

## 核心概念

### 1. 声明 Server Action

```typescript
'use server';

export async function addTodo(formData: FormData) {
  // 服务端逻辑
  const title = formData.get('title');
  // 数据库操作...
  revalidatePath('/todos'); // 刷新页面
}
```

### 2. 表单集成

```tsx
<form action={addTodo}>
  <input name="title" required />
  <button type="submit">添加</button>
</form>
```

### 3. 事件驱动调用

```tsx
'use client';

export function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    await deleteTodo(id);
  };
  return <button onClick={handleDelete}>删除</button>;
}
```

### 4. 乐观 UI 更新

```tsx
'use client';

export function ToggleButton({ id, completed }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);

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

### 5. 数据刷新策略

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';

// 刷新特定路径
revalidatePath('/todos');

// 刷新特定标签
revalidateTag('todos');
```

## 实战项目

### 项目一: 待办事项管理系统

**功能特性:**
- 添加、删除、切换完成状态
- 乐观 UI 更新
- 自动数据刷新
- 权限校验
- 错误处理

**技术亮点:**
- 表单无刷新提交
- `useTransition` 实现乐观 UI
- `revalidatePath` 自动刷新
- 完善的错误边界

**访问路径:** `/13-server-actions/todo`

**关键代码:**

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

### 项目二: 审批流系统

**功能特性:**
- 动态表单字段
- 嵌套数据处理
- 审批状态管理
- 撤回功能
- 业务逻辑校验

**技术亮点:**
- 复杂表单数据解析
- 状态管理(待审批/通过/驳回)
- FormData 嵌套字段处理
- 企业级业务场景

**访问路径:** `/13-server-actions/approval`

**关键代码:**

```typescript
// 解析嵌套字段
const fields: { name: string; value: string }[] = [];
for (const [key, value] of formData.entries()) {
  if (key.startsWith('fields[')) {
    const match = key.match(/fields\[(\d+)\]\[(name|value)\]/);
    // 解析逻辑...
  }
}
```

### 项目三: 文件上传系统

**功能特性:**
- 文件上传与预览
- 文件大小和类型校验
- 图片优化展示
- 文件管理(列表、删除)

**技术亮点:**
- FormData 文件处理
- 客户端实时预览
- Next.js Image 组件优化
- 响应式网格布局

**访问路径:** `/13-server-actions/upload`

**关键代码:**

```typescript
export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  // 文件校验
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('文件大小不能超过 5MB');
  }

  // 保存文件
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  revalidatePath('/13-server-actions/upload');
}
```

## 最佳实践

### 1. 安全性

```typescript
// ✅ 好的做法: 权限校验
export async function deletePost(id: string) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  const post = await db.post.findUnique({ where: { id } });
  if (post.authorId !== session.user.id) {
    throw new Error('无权删除');
  }

  await db.post.delete({ where: { id } });
}

// ❌ 坏的做法: 缺少权限校验
export async function deletePost(id: string) {
  await db.post.delete({ where: { id } }); // 任何人都能删除!
}
```

### 2. 参数校验

```typescript
import { z } from 'zod';

const TodoSchema = z.object({
  title: z.string().min(1).max(100),
});

export async function addTodo(formData: FormData) {
  const parsed = TodoSchema.safeParse({
    title: formData.get('title'),
  });

  if (!parsed.success) {
    throw new Error('参数校验失败');
  }

  // 使用 parsed.data...
}
```

### 3. 错误处理

```tsx
'use client';

export function TodoForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await addTodo(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : '操作失败');
      }
    });
  };

  return (
    <form action={handleSubmit}>
      {/* 表单字段 */}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### 4. 性能优化

```typescript
// 使用 revalidateTag 精细控制缓存
export async function addTodo(formData: FormData) {
  await db.todo.create({ data: { ... } });

  // 只刷新特定标签的缓存
  revalidateTag('todos');
}

// 在数据获取时标记
export async function getTodos() {
  return fetch('...', {
    next: { tags: ['todos'] }
  });
}
```

### 5. 批量操作

```typescript
export async function batchDelete(ids: string[]) {
  const session = await getSession();
  if (!session) throw new Error('未登录');

  // 使用事务确保数据一致性
  await db.$transaction(async (tx) => {
    for (const id of ids) {
      await tx.item.delete({
        where: { id, userId: session.user.id }
      });
    }
  });

  revalidatePath('/items');
}
```

### 6. 团队协作

**目录结构建议:**
```
app/
  feature/
    page.tsx          # 页面组件
    actions.ts        # Server Actions (与组件同目录)
    components/       # 相关组件
      Form.tsx
      List.tsx
```

**命名规范:**
- Server Actions: 使用动词开头 (`addTodo`, `deleteTodo`)
- 组件: 使用名词或名词短语 (`TodoForm`, `TodoList`)
- 文件: 小写 + 连字符 (`actions.ts`, `todo-form.tsx`)

## 常见问题

### Q1: Server Actions 和 API Routes 如何选择?

**使用 Server Actions:**
- 页面内表单提交
- 简单数据变更
- 与 RSC 紧密配合的场景

**使用 API Routes:**
- 复杂业务逻辑
- 需要被多个页面/第三方调用
- RESTful API 设计
- Webhook 处理

### Q2: 如何调试 Server Actions?

```typescript
export async function addTodo(formData: FormData) {
  console.log('Server Action 被调用', formData); // 在服务端控制台输出

  try {
    // 业务逻辑
  } catch (error) {
    console.error('Server Action 错误:', error);
    throw error;
  }
}
```

### Q3: Server Actions 支持文件上传吗?

支持! 使用 FormData 传递文件:

```tsx
// 客户端
<form action={uploadFile} encType="multipart/form-data">
  <input type="file" name="file" />
  <button type="submit">上传</button>
</form>

// 服务端
export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  const bytes = await file.arrayBuffer();
  // 处理文件...
}
```

### Q4: 如何实现乐观 UI?

```tsx
'use client';

export function OptimisticComponent() {
  const [optimisticState, setOptimisticState] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const handleAction = async () => {
    // 1. 立即更新 UI
    setOptimisticState(newState);

    // 2. 执行 Server Action
    startTransition(async () => {
      try {
        await serverAction();
      } catch (e) {
        // 3. 失败时回滚
        setOptimisticState(initialState);
      }
    });
  };

  return <button onClick={handleAction}>...</button>;
}
```

### Q5: Server Actions 如何处理认证?

```typescript
import { getServerSession } from 'next-auth';

export async function protectedAction(formData: FormData) {
  // 获取 Session
  const session = await getServerSession();

  if (!session) {
    throw new Error('未登录');
  }

  // 使用 session.user 进行权限校验
  if (session.user.role !== 'admin') {
    throw new Error('权限不足');
  }

  // 执行操作...
}
```

### Q6: 如何做移动端适配?

使用 Tailwind CSS 响应式类:

```tsx
<form className="space-y-4 md:space-y-6">
  <input className="w-full px-4 py-2 md:px-6 md:py-3" />
  <button className="w-full md:w-auto">提交</button>
</form>
```

### Q7: 如何实现国际化?

```typescript
import { useTranslations } from 'next-intl';

export function TodoForm() {
  const t = useTranslations('todo');

  return (
    <form>
      <input placeholder={t('placeholder')} />
      <button>{t('submit')}</button>
    </form>
  );
}
```

### Q8: Server Actions 的性能如何?

**优势:**
- 自动代码分割
- 与 RSC 集成,减少客户端 JavaScript
- 支持缓存优化

**注意事项:**
- 避免在 Server Action 中执行耗时操作
- 使用 `revalidateTag` 代替 `revalidatePath` 实现精细缓存控制
- 批量操作使用事务

### Q9: 如何测试 Server Actions?

```typescript
// actions.test.ts
import { addTodo } from './actions';

describe('addTodo', () => {
  it('should add todo', async () => {
    const formData = new FormData();
    formData.append('title', 'Test Todo');

    const result = await addTodo(formData);

    expect(result.success).toBe(true);
  });

  it('should throw error for empty title', async () => {
    const formData = new FormData();
    formData.append('title', '');

    await expect(addTodo(formData)).rejects.toThrow('标题不能为空');
  });
});
```

### Q10: 如何实现进度反馈?

使用 `useTransition`:

```tsx
'use client';

export function UploadForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={(formData) => {
      startTransition(async () => {
        await uploadFile(formData);
      });
    }}>
      <button disabled={isPending}>
        {isPending ? '上传中...' : '上传'}
      </button>
    </form>
  );
}
```

## 学习资源

- [Next.js 官方文档 - Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React 文档 - useTransition](https://react.dev/reference/react/useTransition)
- [表单最佳实践](https://web.dev/learn/forms/)

## 总结

Server Actions 是 Next.js 全栈开发的重要里程碑,它:

1. **简化开发流程** - 消除传统前后端分离的冗余代码
2. **提升用户体验** - 表单无刷新、乐观 UI、自动刷新
3. **增强安全性** - 自动 CSRF 防护、Session 透传
4. **优化性能** - 与 RSC 深度集成、自动缓存优化

通过本章的三个实战项目,您已经掌握了:
- 基础 Server Actions 用法(待办事项系统)
- 复杂表单处理(审批流系统)
- 文件上传与管理(文件系统)

**下一步建议:**
1. 实践项目中的所有示例
2. 尝试结合数据库(Prisma, Drizzle)
3. 集成认证系统(NextAuth.js)
4. 添加单元测试和端到端测试
5. 探索 Server Actions 与其他 Next.js 特性的结合

祝您学习愉快!
