'use client';

import Image from 'next/image';
import { generateBlurDataURL } from '@/utils/image/imageLoader';
import styles from '@/styles/image-optimization/ProductCard.module.css';

/**
 * 商品卡片属性
 */
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

/**
 * 商品卡片组件
 * 展示图像优化在电商场景的应用
 */
export default function ProductCard({ name, price, image, description }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          quality={85}
          placeholder="blur"
          blurDataURL={generateBlurDataURL(image)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
        <div className={styles.badge}>优惠</div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.footer}>
          <span className={styles.price}>¥{price.toFixed(2)}</span>
          <button className={styles.button}>加入购物车</button>
        </div>
      </div>
    </div>
  );
}

