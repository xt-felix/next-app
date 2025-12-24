'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from '@/styles/image-optimization/OptimizedImage.module.css';

/**
 * 优化图片组件属性
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  onLoadingComplete?: () => void;
}

/**
 * 优化图片组件
 * 功能：懒加载、占位符、加载状态、错误处理
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 80,
  sizes,
  className = '',
  onLoadingComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={styles.errorContainer} style={{ width, height }}>
        <div className={styles.errorContent}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorText}>图片加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {isLoading && (
        <div className={styles.skeleton} style={{ width, height }}>
          <div className={styles.skeletonShimmer} />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${isLoading ? styles.loading : styles.loaded}`}
      />
    </div>
  );
}

