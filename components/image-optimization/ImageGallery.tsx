'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/image-optimization/ImageGallery.module.css';

/**
 * 图片数据接口
 */
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * 图片画廊组件属性
 */
interface ImageGalleryProps {
  images: GalleryImage[];
}

/**
 * 图片画廊组件
 * 功能：缩略图列表、大图预览、懒加载
 */
export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <p>暂无图片</p>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className={styles.gallery}>
      {/* 主图显示区 */}
      <div className={styles.mainImageWrapper}>
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt}
          width={selectedImage.width}
          height={selectedImage.height}
          quality={90}
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className={styles.mainImage}
        />
      </div>

      {/* 缩略图列表 */}
      <div className={styles.thumbnailList}>
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`${styles.thumbnailButton} ${index === selectedIndex ? styles.active : ''}`}
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={100}
              height={100}
              quality={60}
              sizes="100px"
              className={styles.thumbnail}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

