import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/image-optimization/Page.module.css';

/**
 * 第19章：图像优化主页
 */
export default function ImageOptimizationPage() {
  const examples = [
    {
      id: 'basic',
      title: '基础用法',
      description: '学习 next/image 的基本使用方法和核心属性',
      path: '/19-image-optimization/basic',
    },
    {
      id: 'responsive',
      title: '响应式图片',
      description: '多终端适配、sizes 属性和自动尺寸选择',
      path: '/19-image-optimization/responsive',
    },
    {
      id: 'product-showcase',
      title: '商品展示',
      description: '电商场景：商品卡片、占位符、懒加载',
      path: '/19-image-optimization/product-showcase',
    },
    {
      id: 'gallery',
      title: '图片画廊',
      description: '缩略图、大图预览、用户交互',
      path: '/19-image-optimization/gallery',
    },
    {
      id: 'custom-loader',
      title: '自定义加载器',
      description: '对接阿里云、七牛云等企业图片服务',
      path: '/19-image-optimization/custom-loader',
    },
    {
      id: 'advanced',
      title: '高级技巧',
      description: '性能监控、优化建议、最佳实践',
      path: '/19-image-optimization/advanced',
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>第19章：图像优化</h1>
        <p className={styles.subtitle}>
          next/image 与企业级图片优化方案
        </p>
      </header>

      <section className={styles.intro}>
        <h2 className={styles.sectionTitle}>为什么需要图像优化？</h2>
        <div className={styles.card}>
          <ul className={styles.list}>
            <li><strong>性能提升：</strong>图片通常占网页体积的 60% 以上，优化可显著提升加载速度</li>
            <li><strong>用户体验：</strong>懒加载、占位符让页面更流畅，减少空白和抖动</li>
            <li><strong>SEO 优势：</strong>快速加载和正确的 alt 属性提升搜索排名</li>
            <li><strong>流量节省：</strong>响应式图片和现代格式节省移动端流量</li>
            <li><strong>自动化：</strong>next/image 自动处理格式转换、尺寸生成、CDN 分发</li>
          </ul>
        </div>
      </section>

      <Spacing height={32} />

      <section className={styles.examples}>
        <h2 className={styles.sectionTitle}>示例列表</h2>
        <div className={styles.grid}>
          {examples.map((example) => (
            <Link
              key={example.id}
              href={example.path}
              className={styles.exampleCard}
            >
              <h3 className={styles.exampleTitle}>{example.title}</h3>
              <p className={styles.exampleDescription}>{example.description}</p>
              <span className={styles.exampleArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      <Spacing height={32} />

      <section className={styles.tips}>
        <h2 className={styles.sectionTitle}>核心特性</h2>
        <div className={styles.tipGrid}>
          <div className={styles.tipCard}>
            <h3 className={styles.tipTitle}>🚀 自动优化</h3>
            <p className={styles.tipText}>
              自动生成 WebP/AVIF 格式，根据设备分辨率提供最佳尺寸
            </p>
          </div>
          <div className={styles.tipCard}>
            <h3 className={styles.tipTitle}>⚡ 懒加载</h3>
            <p className={styles.tipText}>
              默认开启图片懒加载，视口内图片优先加载，提升首屏速度
            </p>
          </div>
          <div className={styles.tipCard}>
            <h3 className={styles.tipTitle}>🎨 占位符</h3>
            <p className={styles.tipText}>
              支持模糊占位符、自定义占位图，消除加载时的布局跳动
            </p>
          </div>
          <div className={styles.tipCard}>
            <h3 className={styles.tipTitle}>🌍 CDN 集成</h3>
            <p className={styles.tipText}>
              无缝对接 Vercel、阿里云、七牛云等主流 CDN 服务
            </p>
          </div>
        </div>
      </section>

      <Spacing height={32} />

      <section className={styles.resources}>
        <h2 className={styles.sectionTitle}>学习资源</h2>
        <div className={styles.card}>
          <ul className={styles.linkList}>
            <li>
              <a
                href="https://nextjs.org/docs/app/api-reference/components/image"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Next.js 官方文档 - Image Component
              </a>
            </li>
            <li>
              <a
                href="https://web.dev/fast/#optimize-your-images"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Web.dev - 图片优化指南
              </a>
            </li>
            <li>
              <a
                href="https://github.com/vercel/next.js/tree/canary/examples/image-component"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Next.js Image 组件示例
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

