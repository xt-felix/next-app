/**
 * 第十五章：复杂表单处理与数据校验
 * 主导航页面
 */

import Link from 'next/link';

const formExamples = [
  {
    title: '基础表单',
    description: 'React Hook Form + Zod 基础用法，表单验证、错误处理',
    href: '/15-complex-forms/basic',
    icon: '📝',
    difficulty: '入门',
  },
  {
    title: '多步骤表单',
    description: '分步骤完成表单，数据暂存、进度条、步骤验证',
    href: '/15-complex-forms/multi-step',
    icon: '📊',
    difficulty: '中级',
  },
  {
    title: '动态字段表单',
    description: 'useFieldArray 动态添加/删除字段，数组验证',
    href: '/15-complex-forms/dynamic',
    icon: '➕',
    difficulty: '中级',
  },
  {
    title: '文件上传',
    description: '文件选择、大小校验、类型验证、预览',
    href: '/15-complex-forms/upload',
    icon: '📁',
    difficulty: '中级',
  },
  {
    title: '审批流表单',
    description: '请假申请、附件上传、紧急程度选择',
    href: '/15-complex-forms/approval',
    icon: '✅',
    difficulty: '高级',
  },
  {
    title: '批量导入',
    description: 'Excel/CSV 导入、数据校验、错误提示',
    href: '/15-complex-forms/batch-import',
    icon: '📥',
    difficulty: '高级',
  },
  {
    title: '自动保存',
    description: '草稿自动保存、离线存储、恢复数据',
    href: '/15-complex-forms/auto-save',
    icon: '💾',
    difficulty: '高级',
  },
];

export default function ComplexFormsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            第十五章：复杂表单处理与数据校验
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            深入学习 React Hook Form + Zod，掌握企业级表单开发技能
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              入门
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              中级
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              高级
            </span>
          </div>
        </div>

        {/* 表单示例卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {formExamples.map(example => (
            <Link
              key={example.href}
              href={example.href}
              className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{example.icon}</span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      example.difficulty === '入门'
                        ? 'bg-green-100 text-green-800'
                        : example.difficulty === '中级'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {example.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {example.title}
                </h3>
                <p className="text-sm text-gray-600">{example.description}</p>
              </div>
              <div className="px-6 py-3 bg-gray-50 group-hover:bg-blue-50 transition">
                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  查看示例 →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 核心知识点 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">核心知识点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">React Hook Form</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>useForm - 表单状态管理</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>register - 注册表单字段</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>handleSubmit - 处理表单提交</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>formState - 获取表单状态</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>useFieldArray - 动态字段数组</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>watch - 监听字段变化</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Zod 验证</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Schema 定义 - 类型安全的验证规则</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>基础验证 - string, number, boolean</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>复杂验证 - 正则、自定义规则</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>数组验证 - min, max, 嵌套验证</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>联合验证 - refine 跨字段验证</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>类型推断 - z.infer 自动生成 TS 类型</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 学习路径 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">建议学习路径</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">基础表单（30分钟）</h4>
                <p className="text-sm text-gray-600">
                  学习 React Hook Form 基础用法和 Zod Schema 验证
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">多步骤表单（45分钟）</h4>
                <p className="text-sm text-gray-600">掌握复杂表单的状态管理和分步验证</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">动态字段（45分钟）</h4>
                <p className="text-sm text-gray-600">
                  学习 useFieldArray 管理动态数组字段
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">文件上传 & 审批流（1小时）</h4>
                <p className="text-sm text-gray-600">掌握文件处理和企业级审批流程</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                5
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">批量导入 & 自动保存（1.5小时）</h4>
                <p className="text-sm text-gray-600">学习高级功能实现和性能优化</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
