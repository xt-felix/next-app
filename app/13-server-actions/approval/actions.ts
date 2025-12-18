'use server';

import { revalidatePath } from 'next/cache';

/**
 * 审批状态枚举
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * 审批记录类型
 */
interface ApprovalRecord {
  id: string;
  title: string;
  fields: { name: string; value: string }[];
  status: ApprovalStatus;
  submitterId: string;
  submitterName: string;
  submitTime: string;
  approverComment?: string;
  approveTime?: string;
}

// 模拟数据库存储
let approvals: ApprovalRecord[] = [
  {
    id: '1',
    title: '出差申请',
    fields: [
      { name: '目的地', value: '北京' },
      { name: '出差天数', value: '3天' },
      { name: '预算', value: '5000元' },
    ],
    status: ApprovalStatus.PENDING,
    submitterId: 'demo-user',
    submitterName: 'Demo User',
    submitTime: new Date().toISOString(),
  },
];

// 模拟获取用户 session
async function getSession() {
  return {
    user: { id: 'demo-user', name: 'Demo User', role: 'user' },
  };
}

/**
 * 获取审批列表
 */
export async function getApprovals() {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  // 返回用户提交的审批
  return approvals
    .filter(a => a.submitterId === session.user.id)
    .sort((a, b) => b.submitTime.localeCompare(a.submitTime));
}

/**
 * 提交审批申请
 * 演示：复杂表单处理 + 嵌套数据 + 参数校验
 */
export async function submitApproval(formData: FormData) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录，无法提交审批');
  }

  const title = formData.get('title') as string;

  // 校验标题
  if (!title || title.trim().length === 0) {
    throw new Error('审批标题不能为空');
  }

  // 解析嵌套字段
  const fields: { name: string; value: string }[] = [];
  const fieldMap = new Map<number, { name?: string; value?: string }>();

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('fields[')) {
      const match = key.match(/fields\[(\d+)\]\[(name|value)\]/);
      if (match) {
        const idx = Number(match[1]);
        const type = match[2] as 'name' | 'value';

        if (!fieldMap.has(idx)) {
          fieldMap.set(idx, {});
        }

        fieldMap.get(idx)![type] = value as string;
      }
    }
  }

  // 转换为数组并校验
  for (const [, field] of Array.from(fieldMap.entries()).sort(
    ([a], [b]) => a - b
  )) {
    if (!field.name || !field.value) {
      throw new Error('所有字段的名称和值都必须填写');
    }
    fields.push({ name: field.name.trim(), value: field.value.trim() });
  }

  if (fields.length === 0) {
    throw new Error('至少需要添加一个字段');
  }

  // 创建审批记录
  const newApproval: ApprovalRecord = {
    id: Date.now().toString(),
    title: title.trim(),
    fields,
    status: ApprovalStatus.PENDING,
    submitterId: session.user.id,
    submitterName: session.user.name,
    submitTime: new Date().toISOString(),
  };

  approvals.push(newApproval);

  // 刷新页面
  revalidatePath('/13-server-actions/approval');

  return { success: true, approval: newApproval };
}

/**
 * 撤回审批
 * 演示：状态校验 + 业务逻辑
 */
export async function withdrawApproval(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  const approval = approvals.find(
    a => a.id === id && a.submitterId === session.user.id
  );

  if (!approval) {
    throw new Error('审批记录不存在');
  }

  // 只有待审批状态才能撤回
  if (approval.status !== ApprovalStatus.PENDING) {
    throw new Error('只能撤回待审批的申请');
  }

  // 删除审批记录
  approvals = approvals.filter(a => a.id !== id);

  revalidatePath('/13-server-actions/approval');

  return { success: true };
}

/**
 * 模拟审批操作（实际项目中应该由审批人执行）
 * 演示：复杂业务逻辑 + 状态变更
 */
export async function approveApproval(
  id: string,
  action: 'approve' | 'reject',
  comment: string
) {
  const session = await getSession();
  if (!session) {
    throw new Error('未登录');
  }

  const approval = approvals.find(a => a.id === id);

  if (!approval) {
    throw new Error('审批记录不存在');
  }

  if (approval.status !== ApprovalStatus.PENDING) {
    throw new Error('该审批已处理');
  }

  // 更新审批状态
  approval.status =
    action === 'approve' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
  approval.approverComment = comment;
  approval.approveTime = new Date().toISOString();

  revalidatePath('/13-server-actions/approval');

  return { success: true };
}
