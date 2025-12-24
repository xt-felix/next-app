/**
 * 图片压缩工具函数
 * 支持：Canvas 压缩、质量调整、格式转换
 */

export interface CompressOptions {
  quality?: number; // 压缩质量 0-1，默认 0.7
  maxWidth?: number; // 最大宽度（像素）
  maxHeight?: number; // 最大高度（像素）
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'; // 输出格式
}

/**
 * 压缩图片
 * 
 * 原理：
 * 1. 使用 FileReader 读取文件
 * 2. 创建 Image 对象加载图片
 * 3. 使用 Canvas 绘制并压缩
 * 4. 转换为 Blob 返回
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<Blob> {
  const {
    quality = 0.7,
    maxWidth,
    maxHeight,
    outputFormat = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    // 1. 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // 2. 计算压缩后的尺寸
        let width = img.width;
        let height = img.height;

        if (maxWidth && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (maxHeight && height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // 3. 创建 Canvas 并绘制
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建 Canvas 上下文'));
          return;
        }

        // 设置图片质量（仅对 JPEG 有效）
        ctx.drawImage(img, 0, 0, width, height);

        // 4. 转换为 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('压缩失败'));
            }
          },
          outputFormat,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 获取压缩后的文件大小估算
 */
export async function getCompressedSize(
  file: File,
  options: CompressOptions = {}
): Promise<number> {
  const compressed = await compressImage(file, options);
  return compressed.size;
}

