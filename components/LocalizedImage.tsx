import React from 'react';
import { useRouter } from 'next/router';

interface LocalizedImageProps {
  srcs: { [key: string]: string };
  alt: string;
  className?: string;
}

/**
 * 国际化图片组件
 * 根据当前语言环境自动切换图片资源
 */
export default function LocalizedImage({ srcs, alt, className }: LocalizedImageProps) {
  const { locale = 'zh' } = useRouter();
  
  // 优先使用当前语言的图片，否则使用默认语言(zh)或第一个可用的
  const src = srcs[locale] || srcs['zh'] || Object.values(srcs)[0];

  return <img src={src} alt={alt} className={className} />;
}

