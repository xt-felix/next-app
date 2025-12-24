/**
 * 预签名 URL 上传工具函数
 * 支持：获取预签名 URL、直传云存储、进度反馈
 */

export interface PresignedUploadOptions {
  file: File;
  onProgress?: (progress: number) => void;
}

export interface PresignedUploadResult {
  success: boolean;
  url?: string;
  message?: string;
}

/**
 * 使用预签名 URL 上传文件到云存储
 * 
 * 流程：
 * 1. 前端请求后端获取预签名 URL
 * 2. 前端直接 PUT/POST 文件到云存储
 * 3. 上传完成后通知后端（可选）
 * 
 * 优势：
 * - 减轻后端压力
 * - 支持大文件上传
 * - 提升上传速度
 */
export async function uploadToPresignedURL(
  options: PresignedUploadOptions
): Promise<PresignedUploadResult> {
  const { file, onProgress } = options;

  try {
    // 1. 获取预签名 URL
    const presignResponse = await fetch('/api/file-upload/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    if (!presignResponse.ok) {
      throw new Error('获取预签名 URL 失败');
    }

    const { url, fileId } = await presignResponse.json();

    // 2. 使用预签名 URL 直接上传到云存储
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // 监听上传进度
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress?.(progress);
        }
      });

      // 上传完成
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // 3. 通知后端上传完成（可选）
          notifyUploadComplete(fileId, file.name).catch(console.error);

          resolve({
            success: true,
            url: `${url.split('?')[0]}`, // 返回文件 URL（去掉查询参数）
            message: '上传成功',
          });
        } else {
          reject(new Error(`上传失败: ${xhr.statusText}`));
        }
      });

      // 上传错误
      xhr.addEventListener('error', () => {
        reject(new Error('上传失败：网络错误'));
      });

      // 开始上传
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  } catch (error) {
    console.error('[预签名上传失败]', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '上传失败',
    };
  }
}

/**
 * 通知后端上传完成（可选）
 */
async function notifyUploadComplete(
  fileId: string,
  fileName: string
): Promise<void> {
  try {
    await fetch('/api/file-upload/upload-presigned', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        fileName,
      }),
    });
  } catch (error) {
    console.error('[通知上传完成失败]', error);
  }
}

