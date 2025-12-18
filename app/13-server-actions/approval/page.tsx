import { Suspense } from 'react';
import { ApprovalForm } from './components/ApprovalForm';
import ApprovalList from './components/ApprovalList';

/**
 * 第十三章：Server Actions 实战 - 审批流系统
 *
 * 本示例演示：
 * 1. 复杂表单处理（动态字段、嵌套数据）
 * 2. 业务逻辑校验（状态管理、权限控制）
 * 3. 企业级场景应用
 */
export default function ApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            审批流系统
          </h1>
          <p className="text-gray-600">
            使用 Server Actions 实现的企业级审批管理系统
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            复杂表单 + 业务逻辑演示
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 左侧：提交审批 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              提交审批申请
            </h2>
            <ApprovalForm />
          </div>

          {/* 右侧：审批列表 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              我的审批记录
            </h2>
            <Suspense
              fallback={
                <div className="text-center text-gray-500 py-12">
                  加载中...
                </div>
              }
            >
              <ApprovalList />
            </Suspense>
          </div>
        </div>

        {/* 技术说明 */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            技术亮点
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>动态表单字段，支持添加/删除</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>嵌套数据结构的解析与校验</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>审批状态管理（待审批/通过/驳回）</span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>业务逻辑校验（撤回限制等）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>完善的错误处理和用户反馈</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>响应式布局，适配移动端</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 代码参考 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            查看源码：
            <code className="mx-1 px-2 py-1 bg-gray-100 rounded">
              app/13-server-actions/approval/
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
