// components/ProductCard.tsx
'use client';
import styles from './ProductCard.module.css';
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  description?: string;
  onClick?: () => void;
}

export default function ProductCard({
  title,
  price,
  image,
  description,
  onClick
}: ProductCardProps) {
  return (
    <div
      className={`rounded-lg shadow-md p-4 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 cursor-pointer ${styles.card}`}
      tabIndex={0}
      role="button"
      aria-label={`查看商品 ${title}`}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={title}
          width={320}
          height={200}
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xl font-semibold" style={{ color: 'var(--primary)' }}>
            ¥{price.toLocaleString()}
          </p>
          <button
            className="px-4 py-1.5 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            aria-label={`添加 ${title} 到购物车`}
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>
  );
}
