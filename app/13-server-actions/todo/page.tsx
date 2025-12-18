import { Suspense } from 'react';
import TodoList from './components/TodoList';
import { AddTodoForm } from './components/AddTodoForm';

/**
 * 第十三章：Server Actions 实战 - 待办事项管理系统
 *
 * 本示例演示：
 * 1. Server Actions 基础用法（表单提交、事件驱动）
 * 2. 与 RSC 的深度集成（自动刷新）
 * 3. 权限校验与安全处理
 * 4. 乐观 UI 更新
 * 5. 错误处理与用户反馈
 * 6. 移动端响应式设计
 */
export default function TodoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            待办事项管理系统
          </h1>
          <p className="text-gray-600">
            使用 Server Actions 实现的全栈待办事项系统
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Server Actions 演示
          </div>
        </div>

        {/* 核心功能展示区 */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* 添加待办事项表单 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              添加新任务
            </h2>
            <AddTodoForm />
          </section>

          {/* 待办事项列表 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              我的任务列表
            </h2>
            <Suspense
              fallback={
                <div className="text-center text-gray-500 py-8">
                  加载中...
                </div>
              }
            >
              <TodoList />
            </Suspense>
          </section>
        </div>

        {/* 技术说明 */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            技术亮点
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <strong>表单无刷新提交：</strong>
                使用 Server Actions 实现表单直接提交，无需手动 fetch
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <strong>乐观 UI 更新：</strong>
                切换完成状态时立即更新 UI，提供更好的用户体验
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <strong>自动刷新：</strong>
                数据变更后自动调用 revalidatePath 刷新页面
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <strong>权限校验：</strong>
                所有操作都验证用户登录状态和数据所有权
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <strong>错误处理：</strong>
                完善的错误捕获和用户提示机制
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <div>
                <strong>移动端适配：</strong>
                响应式设计，支持各种设备尺寸
              </div>
            </li>
          </ul>
        </div>

        {/* 代码参考 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            查看源码：
            <code className="mx-1 px-2 py-1 bg-gray-100 rounded">
              app/13-server-actions/todo/
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
