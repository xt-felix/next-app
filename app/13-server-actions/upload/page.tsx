import { Suspense } from 'react';
import { UploadForm } from './components/UploadForm';
import FileList from './components/FileList';

/**
 * 第十三章：Server Actions 实战 - 文件上传系统
 *
 * 本示例演示：
 * 1. 文件上传处理（FormData、文件校验）
 * 2. 图片预览功能
 * 3. 文件管理（列表展示、删除）
 */
export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            文件上传系统
          </h1>
          <p className="text-gray-600">
            使用 Server Actions 实现的文件管理系统
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            文件上传 + 预览演示
          </div>
        </div>

        {/* 上传表单 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            上传文件
          </h2>
          <UploadForm />
        </div>

        {/* 文件列表 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            我的文件
          </h2>
          <Suspense
            fallback={
              <div className="text-center text-gray-500 py-12">
                加载中...
              </div>
            }
          >
            <FileList />
          </Suspense>
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
                <span>Server Actions 处理文件上传</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>文件大小和类型校验</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>客户端实时预览</span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Next.js Image 组件优化</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>响应式网格布局</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>完善的错误处理机制</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 代码参考 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            查看源码：
            <code className="mx-1 px-2 py-1 bg-gray-100 rounded">
              app/13-server-actions/upload/
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
