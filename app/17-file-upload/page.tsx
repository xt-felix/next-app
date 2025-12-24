/**
 * 文件上传与云存储服务集成 - 主导航页
 * 路由：/17-file-upload
 */
'use client';

import Link from 'next/link';

export default function FileUploadPage() {
  const examples = [
    {
      title: '基础文件上传',
      description: '文件选择、拖拽、拍照上传，进度反馈',
      path: '/17-file-upload/basic',
      features: ['文件选择', '拖拽上传', '拍照上传', '进度反馈'],
    },
    {
      title: '分块上传与断点续传',
      description: '大文件分块上传，支持断点续传',
      path: '/17-file-upload/chunk',
      features: ['分块上传', '断点续传', '进度精确', '自动重试'],
    },
    {
      title: '预签名 URL 直传',
      description: '获取预签名 URL，直接上传到云存储',
      path: '/17-file-upload/presigned',
      features: ['预签名 URL', '直传云存储', '减轻后端压力', '支持大文件'],
    },
    {
      title: '多文件批量上传',
      description: '支持多文件选择，批量上传，独立进度',
      path: '/17-file-upload/multi',
      features: ['多文件选择', '批量上传', '独立进度', '错误重试'],
    },
    {
      title: '图片压缩',
      description: '前端图片压缩，减少上传时间',
      path: '/17-file-upload/compress',
      features: ['前端压缩', '质量调整', '尺寸调整', '格式转换'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">第十七章：文件上传与云存储服务集成</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          学习文件上传的原理、分块上传、预签名 URL、云存储集成等企业级功能
        </p>
      </div>

      {/* 功能列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {examples.map((example) => (
          <Link
            key={example.path}
            href={example.path}
            className="block border rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">{example.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {example.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {example.features.map((feature) => (
                <span
                  key={feature}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* 快速导航 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📚 学习路径</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>从基础文件上传开始，了解文件选择、拖拽、拍照等基本功能</li>
          <li>学习分块上传，掌握大文件上传和断点续传技术</li>
          <li>了解预签名 URL，实现云存储直传，减轻后端压力</li>
          <li>掌握多文件批量上传，提升用户体验</li>
          <li>学习图片压缩，优化上传性能</li>
        </ol>
      </div>
    </div>
  );
}

