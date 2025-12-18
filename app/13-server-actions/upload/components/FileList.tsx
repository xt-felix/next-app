import { getFiles, formatFileSize } from '../actions';
import { DeleteFileButton } from './DeleteFileButton';
import Image from 'next/image';

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
 * 文件列表组件（服务端组件）
 */
export default async function FileList() {
  const files = await getFiles();

  if (files.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        暂无上传文件
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map(file => (
        <div
          key={file.id}
          className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
        >
          {/* 图片预览 */}
          <div className="relative aspect-video bg-gray-100">
            <Image
              src={file.path}
              alt={file.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* 文件信息 */}
          <div className="p-4">
            <h3
              className="font-medium text-gray-900 truncate mb-2"
              title={file.name}
            >
              {file.name}
            </h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>大小：{formatFileSize(file.size)}</p>
              <p>上传时间：{formatTime(file.uploadTime)}</p>
            </div>

            {/* 删除按钮 */}
            <div className="mt-4 pt-4 border-t">
              <DeleteFileButton id={file.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
