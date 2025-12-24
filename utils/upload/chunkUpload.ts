/**
 * 分块上传工具函数
 * 支持：大文件分块、断点续传、进度反馈
 */

export interface ChunkUploadOptions {
  file: File;
  chunkSize?: number; // 每块大小（字节），默认 2MB
  onProgress?: (progress: number) => void; // 进度回调 (0-100)
  onChunkComplete?: (chunkIndex: number, total: number) => void; // 每块完成回调
  uploadUrl?: string; // 上传接口地址
  fileId?: string; // 文件唯一标识（用于断点续传）
}

export interface ChunkUploadResult {
  success: boolean;
  fileId?: string;
  url?: string;
  message?: string;
}

/**
 * 分块上传主函数
 * 
 * 流程：
 * 1. 将文件切分成多个块
 * 2. 逐块上传到服务器
 * 3. 上传完成后通知服务器合并
 * 4. 返回最终文件 URL
 */
export async function chunkUpload(
  options: ChunkUploadOptions
): Promise<ChunkUploadResult> {
  const {
    file,
    chunkSize = 2 * 1024 * 1024, // 默认 2MB
    onProgress,
    onChunkComplete,
    uploadUrl = '/api/file-upload/chunk',
    fileId,
  } = options;

  try {
    // 1. 计算分块信息
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileIdentifier = fileId || `${Date.now()}-${file.name}`;

    // 2. 检查已上传的分块（断点续传）
    const uploadedChunks = await checkUploadedChunks(fileIdentifier, totalChunks);

    // 3. 逐块上传
    for (let i = 0; i < totalChunks; i++) {
      // 跳过已上传的分块
      if (uploadedChunks.includes(i)) {
        onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
        onChunkComplete?.(i, totalChunks);
        continue;
      }

      // 切分文件块
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      // 上传分块
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileName', file.name);
      formData.append('fileId', fileIdentifier);
      formData.append('fileSize', file.size.toString());
      formData.append('fileType', file.type);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`上传分块 ${i + 1}/${totalChunks} 失败`);
      }

      // 更新进度
      const progress = Math.round(((i + 1) / totalChunks) * 100);
      onProgress?.(progress);
      onChunkComplete?.(i, totalChunks);
    }

    // 4. 通知服务器合并分块
    const mergeResult = await mergeChunks(fileIdentifier, file.name, file.type);

    return {
      success: true,
      fileId: fileIdentifier,
      url: mergeResult.url,
      message: '上传成功',
    };
  } catch (error) {
    console.error('[分块上传失败]', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '上传失败',
    };
  }
}

/**
 * 检查已上传的分块（断点续传）
 */
async function checkUploadedChunks(
  fileId: string,
  totalChunks: number
): Promise<number[]> {
  try {
    const response = await fetch('/api/file-upload/check-chunks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId, totalChunks }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.uploadedChunks || [];
  } catch (error) {
    console.error('[检查分块失败]', error);
    return [];
  }
}

/**
 * 通知服务器合并分块
 */
async function mergeChunks(
  fileId: string,
  fileName: string,
  fileType: string
): Promise<{ url: string }> {
  const response = await fetch('/api/file-upload/merge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId, fileName, fileType }),
  });

  if (!response.ok) {
    throw new Error('合并分块失败');
  }

  return await response.json();
}

