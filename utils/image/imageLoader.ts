/**
 * 图像加载器工具
 * 用于不同图片服务的自定义加载逻辑
 */

export interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * 阿里云 OSS 图片加载器
 * 支持自动压缩、格式转换、尺寸调整
 */
export function aliOssLoader({ src, width, quality = 80 }: ImageLoaderParams): string {
  const base = 'https://img.alicdn.com';
  // 阿里云 OSS 图片处理参数
  return `${base}/${src}?x-oss-process=image/resize,w_${width}/quality,q_${quality}`;
}

/**
 * 七牛云图片加载器
 * 支持智能图片处理和 CDN 加速
 */
export function qiniuLoader({ src, width, quality = 80 }: ImageLoaderParams): string {
  const base = 'https://cdn.qiniu.com';
  // 七牛云图片处理参数：imageView2/2/w/宽度/q/质量
  return `${base}/${src}?imageView2/2/w/${width}/q/${quality}`;
}

/**
 * 腾讯云 COS 图片加载器
 * 支持数据万象图片处理
 */
export function tencentCosLoader({ src, width, quality = 80 }: ImageLoaderParams): string {
  const base = 'https://example-1234567890.cos.ap-guangzhou.myqcloud.com';
  // 腾讯云数据万象图片处理参数
  return `${base}/${src}?imageMogr2/thumbnail/${width}x/quality/${quality}`;
}

/**
 * 默认加载器（用于演示）
 * 根据环境选择合适的图片服务
 */
export function defaultLoader({ src, width, quality = 80 }: ImageLoaderParams): string {
  // 如果是相对路径，使用默认 Next.js 优化
  if (src.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  }
  
  // 如果是完整 URL，直接返回
  if (src.startsWith('http')) {
    return src;
  }
  
  // 其他情况，使用阿里云 OSS
  return aliOssLoader({ src, width, quality });
}

/**
 * 生成低分辨率占位图（模糊效果）
 * 用于提升图片加载体验
 */
export function generateBlurDataURL(src: string): string {
  // 实际项目中，可以在构建时生成真实的模糊占位图
  // 这里使用 base64 小图或 SVG 作为示例
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#ccc" font-size="20">
        加载中...
      </text>
    </svg>
  `).toString('base64')}`;
}

/**
 * 获取响应式图片尺寸配置
 * 根据屏幕尺寸返回合适的 sizes 属性值
 */
export function getResponsiveSizes(type: 'banner' | 'card' | 'thumbnail' | 'full'): string {
  switch (type) {
    case 'banner':
      // 横幅图：移动端全宽，平板 90%，桌面 80%
      return '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw';
    
    case 'card':
      // 卡片图：移动端全宽，平板 50%，桌面 33%
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    
    case 'thumbnail':
      // 缩略图：固定小尺寸
      return '(max-width: 640px) 80px, (max-width: 1024px) 120px, 150px';
    
    case 'full':
      // 全屏图：始终 100% 视口宽度
      return '100vw';
    
    default:
      return '100vw';
  }
}

