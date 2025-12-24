import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import ProductCard from '@/components/image-optimization/ProductCard';
import styles from '@/styles/image-optimization/ProductShowcasePage.module.css';

/**
 * 商品展示页面
 * 演示电商场景下的图片优化实践
 */
export default function ProductShowcasePage() {
  // 模拟商品数据
  const products = [
    {
      id: '1',
      name: '舒适运动鞋',
      price: 299.00,
      image: 'https://picsum.photos/seed/product1/400/400',
      description: '透气网面，轻盈舒适，适合跑步和健身',
    },
    {
      id: '2',
      name: '时尚背包',
      price: 199.00,
      image: 'https://picsum.photos/seed/product2/400/400',
      description: '大容量设计，多层收纳，商务休闲两用',
    },
    {
      id: '3',
      name: '智能手表',
      price: 999.00,
      image: 'https://picsum.photos/seed/product3/400/400',
      description: '健康监测，运动追踪，续航持久',
    },
    {
      id: '4',
      name: '无线耳机',
      price: 499.00,
      image: 'https://picsum.photos/seed/product4/400/400',
      description: '主动降噪，HiFi音质，长续航',
    },
    {
      id: '5',
      name: '保温杯',
      price: 89.00,
      image: 'https://picsum.photos/seed/product5/400/400',
      description: '316不锈钢，24小时保温，防漏设计',
    },
    {
      id: '6',
      name: '笔记本电脑',
      price: 5999.00,
      image: 'https://picsum.photos/seed/product6/400/400',
      description: '轻薄便携，高性能处理器，全天续航',
    },
  ];

  return (
    <div className={styles.container}>
      <Link href="/19-image-optimization" className={styles.backLink}>
        ← 返回主页
      </Link>

      <h1 className={styles.title}>商品展示</h1>
      <p className={styles.description}>
        电商场景：商品卡片、占位符、懒加载
      </p>

      <Spacing height={32} />

      {/* 商品列表 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>商品列表</h2>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <Spacing height={48} />

      {/* 技术要点 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>电商图片优化要点</h2>
        <div className={styles.pointsCard}>
          <div className={styles.point}>
            <h3 className={styles.pointTitle}>1. 商品主图优化</h3>
            <pre className={styles.code}>
{`<Image
  src={productImage}
  alt={productName}
  width={300}
  height={300}
  quality={85}
  placeholder="blur"
  blurDataURL={generateBlurDataURL(productImage)}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

关键点：
✅ 使用占位符（placeholder="blur"）提升加载体验
✅ 设置合适的 quality（85），平衡清晰度和文件大小
✅ 配置 sizes，根据屏幕尺寸加载合适图片
✅ 首屏商品图片不需要 priority，使用懒加载节省资源`}
            </pre>
          </div>

          <div className={styles.point}>
            <h3 className={styles.pointTitle}>2. 懒加载策略</h3>
            <div className={styles.pointContent}>
              <p className={styles.pointText}>
                <strong>默认懒加载：</strong>next/image 默认开启懒加载，
                只有当图片进入视口（viewport）附近时才开始加载。
              </p>
              <p className={styles.pointText}>
                <strong>首屏图片：</strong>Banner、首屏商品设置 priority={'{true}'}，
                禁用懒加载，优先加载。
              </p>
              <p className={styles.pointText}>
                <strong>滚动加载：</strong>列表页商品图片使用懒加载，
                用户滚动时逐步加载，提升首屏速度。
              </p>
            </div>
          </div>

          <div className={styles.point}>
            <h3 className={styles.pointTitle}>3. 占位符方案</h3>
            <div className={styles.pointContent}>
              <p className={styles.pointText}>
                <strong>方案1：模糊占位符</strong>
              </p>
              <pre className={styles.code}>
{`placeholder="blur"
blurDataURL={lowQualityImageBase64}

// 使用低分辨率图片作为占位
// 构建时生成，或者使用 SVG/Base64 小图`}
              </pre>

              <p className={styles.pointText}>
                <strong>方案2：骨架屏</strong>
              </p>
              <pre className={styles.code}>
{`// CSS 实现加载动画
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}`}
              </pre>

              <p className={styles.pointText}>
                <strong>方案3：颜色占位</strong>
              </p>
              <pre className={styles.code}>
{`placeholder="empty"
style={{ backgroundColor: '#f5f5f5' }}

// 简单的纯色背景
// 适合统一风格的商品图`}
              </pre>
            </div>
          </div>

          <div className={styles.point}>
            <h3 className={styles.pointTitle}>4. 多图场景优化</h3>
            <div className={styles.pointContent}>
              <p className={styles.pointText}>
                <strong>商品详情页：</strong>主图 + 多张副图
              </p>
              <ul className={styles.pointList}>
                <li>主图：priority={'{true}'}，quality=90，优先加载</li>
                <li>副图缩略图：quality=70，sizes 设置小尺寸</li>
                <li>大图预览：按需加载，用户点击时才加载</li>
              </ul>

              <p className={styles.pointText}>
                <strong>图片画廊：</strong>缩略图 + 大图预览
              </p>
              <ul className={styles.pointList}>
                <li>缩略图先加载，使用较低 quality</li>
                <li>大图懒加载，或者预加载相邻图片</li>
                <li>使用 IntersectionObserver 监听滚动</li>
              </ul>
            </div>
          </div>

          <div className={styles.point}>
            <h3 className={styles.pointTitle}>5. CDN 与缓存策略</h3>
            <div className={styles.pointContent}>
              <p className={styles.pointText}>
                <strong>CDN 配置：</strong>
              </p>
              <pre className={styles.code}>
{`// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.yourshop.com',
      pathname: '/products/**',
    },
  ],
  minimumCacheTTL: 60, // 缓存时间（秒）
}`}
              </pre>

              <p className={styles.pointText}>
                <strong>缓存策略：</strong>
              </p>
              <ul className={styles.pointList}>
                <li>商品主图：长期缓存（7-30天），使用 CDN</li>
                <li>促销图片：短期缓存（1-7天），方便更新</li>
                <li>使用文件名哈希或查询参数控制缓存版本</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 性能对比 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>性能优化效果</h2>
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonColumn}>
            <h3 className={styles.comparisonTitle}>优化前</h3>
            <ul className={styles.comparisonList}>
              <li>❌ 所有图片一次性加载</li>
              <li>❌ 使用原图，文件大（200-500KB）</li>
              <li>❌ 不支持 WebP/AVIF</li>
              <li>❌ 移动端加载桌面端大图</li>
              <li>❌ 无占位符，布局跳动</li>
              <li>❌ 首屏加载时间：5-8秒</li>
            </ul>
          </div>
          <div className={styles.comparisonColumn}>
            <h3 className={styles.comparisonTitle}>优化后</h3>
            <ul className={styles.comparisonList}>
              <li>✅ 懒加载，按需加载</li>
              <li>✅ 自动压缩，文件小（30-80KB）</li>
              <li>✅ 自动使用 WebP/AVIF</li>
              <li>✅ 响应式，加载合适尺寸</li>
              <li>✅ 模糊占位符，体验好</li>
              <li>✅ 首屏加载时间：1-2秒</li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 最佳实践 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>电商图片最佳实践</h2>
        <div className={styles.tipsCard}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>📸</span>
            <div>
              <h4 className={styles.tipTitle}>统一图片规格</h4>
              <p className={styles.tipText}>
                商品主图统一为正方形（1:1），尺寸 800x800 或 1000x1000，
                方便展示和布局
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🎨</span>
            <div>
              <h4 className={styles.tipTitle}>白色背景优化</h4>
              <p className={styles.tipText}>
                白色背景商品图压缩率更高，文件更小，建议统一使用白色背景
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>⚡</span>
            <div>
              <h4 className={styles.tipTitle}>预加载策略</h4>
              <p className={styles.tipText}>
                列表页加载缩略图（300x300），详情页按需加载大图（800x800），
                点击放大时加载超大图（1500x1500）
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🔍</span>
            <div>
              <h4 className={styles.tipTitle}>SEO 优化</h4>
              <p className={styles.tipText}>
                alt 属性包含商品名称和关键词，如 "舒适运动鞋 跑步鞋 男女通用"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

