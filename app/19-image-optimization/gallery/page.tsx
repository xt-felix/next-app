import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import ImageGallery from '@/components/image-optimization/ImageGallery';
import styles from '@/styles/image-optimization/GalleryPage.module.css';

/**
 * 图片画廊页面
 */
export default function GalleryPage() {
  // 模拟画廊图片数据
  const galleryImages = [
    {
      id: '1',
      src: 'https://picsum.photos/seed/gallery1/800/600',
      alt: '风景照片1',
      width: 800,
      height: 600,
    },
    {
      id: '2',
      src: 'https://picsum.photos/seed/gallery2/800/600',
      alt: '风景照片2',
      width: 800,
      height: 600,
    },
    {
      id: '3',
      src: 'https://picsum.photos/seed/gallery3/800/600',
      alt: '风景照片3',
      width: 800,
      height: 600,
    },
    {
      id: '4',
      src: 'https://picsum.photos/seed/gallery4/800/600',
      alt: '风景照片4',
      width: 800,
      height: 600,
    },
    {
      id: '5',
      src: 'https://picsum.photos/seed/gallery5/800/600',
      alt: '风景照片5',
      width: 800,
      height: 600,
    },
  ];

  return (
    <div className={styles.container}>
      <Link href="/19-image-optimization" className={styles.backLink}>
        ← 返回主页
      </Link>

      <h1 className={styles.title}>图片画廊</h1>
      <p className={styles.description}>
        缩略图、大图预览、用户交互
      </p>

      <Spacing height={32} />

      {/* 画廊展示 */}
      <section className={styles.section}>
        <ImageGallery images={galleryImages} />
      </section>

      <Spacing height={48} />

      {/* 实现说明 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>实现要点</h2>
        <div className={styles.card}>
          <div className={styles.point}>
            <h3 className={styles.pointTitle}>1. 主图优化</h3>
            <pre className={styles.code}>
{`<Image
  src={selectedImage.src}
  alt={selectedImage.alt}
  width={800}
  height={600}
  quality={90}
  priority  // 主图优先加载
  sizes="(max-width: 768px) 100vw, 800px"
/>

特点：
- 使用 priority 优先加载，提升用户体验
- 高 quality (90) 保证清晰度
- 明确的 sizes 配置`}
            </pre>
          </div>

          <div className={styles.point}>
            <h3 className={styles.pointTitle}>2. 缩略图优化</h3>
            <pre className={styles.code}>
{`<Image
  src={image.src}
  alt={image.alt}
  width={100}
  height={100}
  quality={60}  // 缩略图降低质量
  sizes="100px"  // 固定尺寸
/>

特点：
- 降低 quality (60) 减小文件大小
- 固定 sizes，不需要响应式
- 懒加载，滚动时加载`}
            </pre>
          </div>

          <div className={styles.point}>
            <h3 className={styles.pointTitle}>3. 交互逻辑</h3>
            <pre className={styles.code}>
{`const [selectedIndex, setSelectedIndex] = useState(0);

// 点击缩略图切换主图
<button onClick={() => setSelectedIndex(index)}>
  <Image src={thumbnail} ... />
</button>

// 预加载相邻图片
useEffect(() => {
  const preloadImages = [
    images[selectedIndex - 1],
    images[selectedIndex + 1],
  ].filter(Boolean);
  
  preloadImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img.src;
    document.head.appendChild(link);
  });
}, [selectedIndex]);`}
            </pre>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 进阶优化 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>进阶优化</h2>
        <div className={styles.tipsCard}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🚀</span>
            <div>
              <h4 className={styles.tipTitle}>预加载策略</h4>
              <p className={styles.tipText}>
                当用户查看某张图片时，预加载前后相邻的图片，
                实现快速切换，提升浏览体验
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💾</span>
            <div>
              <h4 className={styles.tipTitle}>渐进式加载</h4>
              <p className={styles.tipText}>
                先加载低分辨率占位图，再逐步加载高清图，
                用户感知加载速度更快
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🎯</span>
            <div>
              <h4 className={styles.tipTitle}>虚拟滚动</h4>
              <p className={styles.tipText}>
                画廊图片很多时（100+），使用虚拟滚动，
                只渲染可见区域的缩略图，提升性能
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🔍</span>
            <div>
              <h4 className={styles.tipTitle}>图片缩放</h4>
              <p className={styles.tipText}>
                添加放大镜或缩放功能，点击主图时加载超大图（1500x1500），
                使用 loading="lazy" 按需加载
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

