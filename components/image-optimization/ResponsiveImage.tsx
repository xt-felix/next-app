'use client';

import Image from 'next/image';
import { getResponsiveSizes } from '@/utils/image/imageLoader';

/**
 * 响应式图片组件属性
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: number; // 宽高比，例如 16/9
  type?: 'banner' | 'card' | 'thumbnail' | 'full';
  priority?: boolean;
  quality?: number;
  className?: string;
}

/**
 * 响应式图片组件
 * 自动适配不同屏幕尺寸，优化加载性能
 */
export default function ResponsiveImage({
  src,
  alt,
  aspectRatio = 16 / 9,
  type = 'card',
  priority = false,
  quality = 80,
  className = '',
}: ResponsiveImageProps) {
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / aspectRatio) * 100}%`,
        overflow: 'hidden',
        borderRadius: '8px',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={getResponsiveSizes(type)}
        quality={quality}
        priority={priority}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

