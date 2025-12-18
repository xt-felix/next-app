import { getApprovals, ApprovalStatus } from '../actions';
import { WithdrawButton } from './WithdrawButton';

/**
 * 获取状态显示信息
 */
function getStatusInfo(status: ApprovalStatus) {
  switch (status) {
    case ApprovalStatus.PENDING:
      return {
        text: '待审批',
        className: 'bg-yellow-100 text-yellow-800',
      };
    case ApprovalStatus.APPROVED:
      return {
        text: '已通过',
        className: 'bg-green-100 text-green-800',
      };
    case ApprovalStatus.REJECTED:
      return {
        text: '已驳回',
        className: 'bg-red-100 text-red-800',
      };
  }
}

/**
 * 格式化时间
 */
function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 审批列表组件（服务端组件）
 */
export default async function ApprovalList() {
  const approvals = await getApprovals();

  if (approvals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        暂无审批记录
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvals.map(approval => {
        const statusInfo = getStatusInfo(approval.status);

        return (
          <div
            key={approval.id}
            className="border rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
          >
            {/* 头部 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {approval.title}
                </h3>
                <p className="text-sm text-gray-500">
                  提交时间：{formatTime(approval.submitTime)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
              >
                {statusInfo.text}
              </span>
            </div>

            {/* 审批字段 */}
            <div className="space-y-2 mb-4">
              {approval.fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-start bg-gray-50 rounded-lg p-3"
                >
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                    {field.name}：
                  </span>
                  <span className="text-sm text-gray-900">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>

            {/* 审批意见 */}
            {approval.approverComment && (
              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-gray-700 mb-1">
                  <strong>审批意见：</strong>
                </p>
                <p className="text-sm text-gray-600">
                  {approval.approverComment}
                </p>
                {approval.approveTime && (
                  <p className="text-xs text-gray-500 mt-2">
                    审批时间：{formatTime(approval.approveTime)}
                  </p>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            {approval.status === ApprovalStatus.PENDING && (
              <div className="border-t pt-4">
                <WithdrawButton id={approval.id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
