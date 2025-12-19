/**
 * 批量导入示例
 * 知识点：Excel/CSV 数据导入与批量验证
 */

'use client';

import { useState } from 'react';

export default function BatchImportPage() {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    // 模拟导入处理
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResults({
      total: 50,
      success: 48,
      failed: 2,
      errors: [
        { row: 5, error: '邮箱格式错误' },
        { row: 12, error: '用户名已存在' },
      ],
    });
    setImporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">批量导入用户</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择 Excel/CSV 文件</label>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          {importing && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">正在导入数据...</p>
            </div>
          )}

          {results && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-2xl font-bold text-blue-600">{results.total}</div>
                  <div className="text-sm text-gray-600">总数</div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-2xl font-bold text-green-600">{results.success}</div>
                  <div className="text-sm text-gray-600">成功</div>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                  <div className="text-sm text-gray-600">失败</div>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="border border-red-200 bg-red-50 rounded p-4">
                  <h3 className="font-semibold text-red-800 mb-2">错误详情</h3>
                  <ul className="space-y-1 text-sm text-red-700">
                    {results.errors.map((err: any, i: number) => (
                      <li key={i}>第 {err.row} 行：{err.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900 mb-2">知识点说明</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ 使用 xlsx 库解析 Excel 文件</li>
              <li>✓ 逐行验证数据，收集错误信息</li>
              <li>✓ 显示导入进度和结果统计</li>
              <li>✓ 支持错误数据下载和修正</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
