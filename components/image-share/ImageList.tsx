/**
 * 图片列表组件
 */
'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/image-share/ImageList.module.css';

interface ImageData {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadTime: string;
  url: string;
  uploader: string;
}

interface ImageListProps {
  refreshTrigger: number;
}

export default function ImageList({ refreshTrigger }: ImageListProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchImages = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/images/list?page=1&pageSize=20');
      const result = await response.json();

      if (result.success) {
        setImages(result.data.images);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [refreshTrigger]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>🖼️ 图片列表</h2>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>🖼️ 图片列表</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>🖼️ 图片列表</h2>
        <div className={styles.empty}>暂无图片，快去上传吧！</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🖼️ 图片列表</h2>

      <div className={styles.grid}>
        {images.map((image) => (
          <div key={image.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <div className={styles.imagePlaceholder}>
                📷
                <div className={styles.imageInfo}>
                  {image.originalName}
                </div>
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.row}>
                <span className={styles.label}>文件名：</span>
                <span className={styles.value}>{image.originalName}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>大小：</span>
                <span className={styles.value}>{formatFileSize(image.size)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>上传者：</span>
                <span className={styles.value}>{image.uploader}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>上传时间：</span>
                <span className={styles.value}>{formatDate(image.uploadTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
