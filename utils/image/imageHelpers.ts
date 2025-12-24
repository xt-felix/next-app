/**
 * 图像辅助工具函数
 */

/**
 * 图片类型定义
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * 计算图片的宽高比
 */
export function getAspectRatio(dimensions: ImageDimensions): number {
  return dimensions.width / dimensions.height;
}

/**
 * 根据宽度计算高度（保持宽高比）
 */
export function calculateHeight(width: number, aspectRatio: number): number {
  return Math.round(width / aspectRatio);
}

/**
 * 根据高度计算宽度（保持宽高比）
 */
export function calculateWidth(height: number, aspectRatio: number): number {
  return Math.round(height * aspectRatio);
}

/**
 * 检查是否支持 WebP 格式
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * 检查是否支持 AVIF 格式
 */
export async function supportsAVIF(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const avifImage = new Image();
  avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMgkQAAAAB8dSLfI=';
  
  return new Promise<boolean>((resolve) => {
    avifImage.onload = () => resolve(true);
    avifImage.onerror = () => resolve(false);
  });
}

/**
 * 获取图片的实际尺寸
 */
export function getImageSize(src: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 预加载多张图片
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(src => preloadImage(src)));
}

/**
 * 获取图片优化建议
 */
export interface ImageOptimizationSuggestion {
  shouldCompress: boolean;
  shouldResize: boolean;
  suggestedWidth: number;
  suggestedHeight: number;
  suggestedQuality: number;
  estimatedSaving: string;
}

export function getOptimizationSuggestion(
  dimensions: ImageDimensions,
  fileSize: number,
  targetWidth?: number
): ImageOptimizationSuggestion {
  const { width, height } = dimensions;
  const aspectRatio = getAspectRatio(dimensions);
  
  // 如果没有指定目标宽度，根据常见设备尺寸推荐
  const suggestedWidth = targetWidth || (width > 1920 ? 1920 : width);
  const suggestedHeight = calculateHeight(suggestedWidth, aspectRatio);
  
  // 判断是否需要压缩（文件大于 500KB）
  const shouldCompress = fileSize > 500 * 1024;
  
  // 判断是否需要调整尺寸（宽度大于建议宽度）
  const shouldResize = width > suggestedWidth;
  
  // 推荐质量：大图降低质量，小图保持高质量
  const suggestedQuality = width > 1920 ? 75 : width > 1200 ? 80 : 85;
  
  // 估算节省的空间
  const savingRatio = shouldResize ? (suggestedWidth / width) ** 2 : 1;
  const qualityRatio = suggestedQuality / 100;
  const estimatedSize = fileSize * savingRatio * qualityRatio;
  const saving = fileSize - estimatedSize;
  const savingPercent = Math.round((saving / fileSize) * 100);
  
  return {
    shouldCompress,
    shouldResize,
    suggestedWidth,
    suggestedHeight,
    suggestedQuality,
    estimatedSaving: `约 ${savingPercent}% (${Math.round(saving / 1024)}KB)`,
  };
}

