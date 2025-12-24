import Image from 'next/image';
import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/image-optimization/BasicPage.module.css';

/**
 * 基础用法示例页面
 */
export default function BasicImagePage() {
  return (
    <div className={styles.container}>
      <Link href="/19-image-optimization" className={styles.backLink}>
        ← 返回主页
      </Link>

      <h1 className={styles.title}>基础用法</h1>
      <p className={styles.description}>
        学习 next/image 的基本使用方法和核心属性
      </p>

      <Spacing height={32} />

      {/* 示例1：本地图片 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. 本地图片（推荐）</h2>
        <div className={styles.demoCard}>
          <div className={styles.imageBox}>
            <Image
              src="/images/example1.jpg"
              alt="示例图片1"
              width={600}
              height={400}
              quality={85}
              priority
            />
          </div>
          <div className={styles.codeBox}>
            <pre className={styles.code}>
{`<Image
  src="/images/example1.jpg"
  alt="示例图片1"
  width={600}
  height={400}
  quality={85}
  priority
/>`}
            </pre>
          </div>
        </div>
        <div className={styles.explanation}>
          <h3 className={styles.explanationTitle}>知识点：</h3>
          <ul className={styles.explanationList}>
            <li><strong>src:</strong> 图片路径，本地图片放在 public 目录下</li>
            <li><strong>alt:</strong> 替代文本，对 SEO 和无障碍访问很重要</li>
            <li><strong>width/height:</strong> 图片的实际尺寸（像素），防止布局跳动</li>
            <li><strong>quality:</strong> 图片质量 1-100，默认 75，建议 80-85</li>
            <li><strong>priority:</strong> 首屏重要图片设为 true，禁用懒加载</li>
          </ul>
        </div>
      </section>

      <Spacing height={48} />

      {/* 示例2：外部图片 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 外部图片（需配置白名单）</h2>
        <div className={styles.demoCard}>
          <div className={styles.imageBox}>
            <Image
              src="https://picsum.photos/seed/demo1/600/400"
              alt="随机图片"
              width={600}
              height={400}
              quality={80}
            />
          </div>
          <div className={styles.codeBox}>
            <pre className={styles.code}>
{`<Image
  src="https://picsum.photos/seed/demo1/600/400"
  alt="随机图片"
  width={600}
  height={400}
  quality={80}
/>`}
            </pre>
          </div>
        </div>
        <div className={styles.explanation}>
          <h3 className={styles.explanationTitle}>配置要求：</h3>
          <p className={styles.explanationText}>
            外部图片必须在 next.config.ts 中配置 remotePatterns：
          </p>
          <pre className={styles.code}>
{`// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};`}
          </pre>
        </div>
      </section>

      <Spacing height={48} />

      {/* 示例3：fill 模式 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Fill 模式（填充容器）</h2>
        <div className={styles.demoCard}>
          <div className={styles.fillContainer}>
            <Image
              src="https://picsum.photos/seed/demo2/800/600"
              alt="填充示例"
              fill
              style={{ objectFit: 'cover' }}
              quality={80}
            />
          </div>
          <div className={styles.codeBox}>
            <pre className={styles.code}>
{`<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="https://picsum.photos/seed/demo2/800/600"
    alt="填充示例"
    fill
    style={{ objectFit: 'cover' }}
    quality={80}
  />
</div>`}
            </pre>
          </div>
        </div>
        <div className={styles.explanation}>
          <h3 className={styles.explanationTitle}>知识点：</h3>
          <ul className={styles.explanationList}>
            <li><strong>fill:</strong> 图片填充父容器，不需要指定 width/height</li>
            <li><strong>父容器必须设置：</strong> position: relative（或 absolute/fixed）</li>
            <li><strong>objectFit:</strong> 控制图片如何适应容器
              <ul>
                <li>cover: 覆盖整个容器，可能裁剪</li>
                <li>contain: 完整显示图片，可能留白</li>
                <li>fill: 拉伸填充，可能变形</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <Spacing height={48} />

      {/* 对比说明 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>next/image 与普通 img 的区别</h2>
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonColumn}>
            <h3 className={styles.comparisonTitle}>普通 img 标签</h3>
            <ul className={styles.comparisonList}>
              <li>❌ 不会自动优化图片</li>
              <li>❌ 不支持懒加载</li>
              <li>❌ 不会自动生成多种尺寸</li>
              <li>❌ 不支持现代图片格式</li>
              <li>❌ 可能造成布局跳动</li>
              <li>❌ 需要手动处理响应式</li>
            </ul>
          </div>
          <div className={styles.comparisonColumn}>
            <h3 className={styles.comparisonTitle}>next/image 组件</h3>
            <ul className={styles.comparisonList}>
              <li>✅ 自动优化图片大小和质量</li>
              <li>✅ 默认开启懒加载</li>
              <li>✅ 自动生成多种尺寸</li>
              <li>✅ 自动使用 WebP/AVIF</li>
              <li>✅ 防止布局跳动（CLS）</li>
              <li>✅ 自动响应式适配</li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 最佳实践 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>最佳实践</h2>
        <div className={styles.tipsCard}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>始终提供 alt 属性</h4>
              <p className={styles.tipText}>
                有助于 SEO 和无障碍访问，描述图片内容，空图片用 alt=""
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>首屏图片使用 priority</h4>
              <p className={styles.tipText}>
                Banner、Logo 等首屏图片设置 priority={true}，提升 LCP
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>合理设置 quality</h4>
              <p className={styles.tipText}>
                一般图片 75-85，重要图片 85-90，背景图可以更低
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>明确指定尺寸</h4>
              <p className={styles.tipText}>
                避免布局跳动，使用 width/height 或 fill + 父容器尺寸
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

