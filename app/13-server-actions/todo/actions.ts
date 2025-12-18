'use server';

import { revalidatePath } from 'next/cache';

// 模拟数据库存储
let todos: { id: string; title: string; completed: boolean; userId: string }[] = [
  { id: '1', title: '学习 Server Actions', completed: false, userId: 'demo-user' },
  { id: '2', title: '完成项目实战', completed: false, userId: 'demo-user' },
];

// 模拟获取用户 session（实际项目中应使用 next-auth 或其他认证方案）
async function getSession() {
  // 模拟用户登录状态
  return { user: { id: 'demo-user', name: 'Demo User' } };
}

/**
 * 获取所有待办事项
 */
export async function getTodos() {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  // 过滤当前用户的待办事项
  return todos.filter(todo => todo.userId === session.user.id);
}

/**
 * 添加待办事项
 * 演示：基础 Server Action + 表单无刷新提交 + 参数校验
 */
export async function addTodo(formData: FormData) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录，无法添加待办事项');
  }

  const title = formData.get('title') as string;

  // 参数校验
  if (!title || title.trim().length === 0) {
    throw new Error('标题不能为空');
  }

  if (title.length > 100) {
    throw new Error('标题不能超过 100 个字符');
  }

  // 创建新待办事项
  const newTodo = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    userId: session.user.id,
  };

  todos.push(newTodo);

  // 刷新页面数据（触发 RSC 重新渲染）
  revalidatePath('/13-server-actions/todo');

  return { success: true, todo: newTodo };
}

/**
 * 删除待办事项
 * 演示：事件驱动 Server Action + 权限校验
 */
export async function deleteTodo(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  // 查找待办事项
  const todoIndex = todos.findIndex(
    t => t.id === id && t.userId === session.user.id
  );

  if (todoIndex === -1) {
    throw new Error('待办事项不存在或无权删除');
  }

  // 删除
  todos.splice(todoIndex, 1);

  // 刷新页面
  revalidatePath('/13-server-actions/todo');

  return { success: true };
}

/**
 * 切换待办事项完成状态
 * 演示：状态更新 + 乐观 UI 支持
 */
export async function toggleTodo(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  const todo = todos.find(
    t => t.id === id && t.userId === session.user.id
  );

  if (!todo) {
    throw new Error('待办事项不存在');
  }

  // 切换状态
  todo.completed = !todo.completed;

  revalidatePath('/13-server-actions/todo');

  return { success: true, completed: todo.completed };
}

/**
 * 批量删除待办事项
 * 演示：批量操作 + 事务处理思想
 */
export async function batchDeleteTodos(ids: string[]) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  if (!ids || ids.length === 0) {
    throw new Error('请选择要删除的待办事项');
  }

  // 模拟事务处理：要么全部删除，要么全部保留
  const todosToDelete = ids.filter(id =>
    todos.some(t => t.id === id && t.userId === session.user.id)
  );

  if (todosToDelete.length !== ids.length) {
    throw new Error('部分待办事项不存在或无权删除');
  }

  // 批量删除
  todos = todos.filter(
    t => !ids.includes(t.id) || t.userId !== session.user.id
  );

  revalidatePath('/13-server-actions/todo');

  return { success: true, deletedCount: todosToDelete.length };
}
