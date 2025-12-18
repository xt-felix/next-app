'use client';

import { submitApproval } from '../actions';
import { useState, useTransition } from 'react';

/**
 * 动态字段类型
 */
interface Field {
  name: string;
  value: string;
}

/**
 * 审批申请表单组件
 * 演示：动态表单 + 嵌套数据处理
 */
export function ApprovalForm() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([
    { name: '', value: '' },
  ]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 添加字段
  const addField = () => {
    setFields([...fields, { name: '', value: '' }]);
  };

  // 删除字段
  const removeField = (index: number) => {
    if (fields.length === 1) {
      return; // 至少保留一个字段
    }
    setFields(fields.filter((_, i) => i !== index));
  };

  // 更新字段
  const updateField = (
    index: number,
    type: 'name' | 'value',
    value: string
  ) => {
    const newFields = [...fields];
    newFields[index][type] = value;
    setFields(newFields);
  };

  // 提交表单
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await submitApproval(formData);
        setSuccess(true);
        // 重置表单
        setTitle('');
        setFields([{ name: '', value: '' }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : '提交失败');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* 审批标题 */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          审批标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="例如：出差申请、报销申请等"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isPending}
        />
      </div>

      {/* 动态字段 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            审批字段 <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={addField}
            disabled={isPending}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            + 添加字段
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <input
                name={`fields[${index}][name]`}
                type="text"
                value={field.name}
                onChange={e => updateField(index, 'name', e.target.value)}
                placeholder="字段名（如：目的地）"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isPending}
              />
              <input
                name={`fields[${index}][value]`}
                type="text"
                value={field.value}
                onChange={e => updateField(index, 'value', e.target.value)}
                placeholder="字段值（如：北京）"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isPending}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-700 px-3 disabled:opacity-50"
                  aria-label="删除字段"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending ? '提交中...' : '提交审批'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div
          className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3"
          role="status"
        >
          审批提交成功！
        </div>
      )}
    </form>
  );
}
