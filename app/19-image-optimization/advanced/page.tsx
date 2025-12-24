import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/image-optimization/AdvancedPage.module.css';

/**
 * 高级技巧页面
 */
export default function AdvancedImagePage() {
  return (
    <div className={styles.container}>
      <Link href="/19-image-optimization" className={styles.backLink}>
        ← 返回主页
      </Link>

      <h1 className={styles.title}>高级技巧</h1>
      <p className={styles.description}>
        性能监控、优化建议、最佳实践
      </p>

      <Spacing height={32} />

      {/* 性能指标 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>关键性能指标</h2>
        <div className={styles.metricsCard}>
          <div className={styles.metric}>
            <h3 className={styles.metricTitle}>LCP (Largest Contentful Paint)</h3>
            <p className={styles.metricText}>
              最大内容绘制时间，衡量首屏大图加载速度
            </p>
            <ul className={styles.metricList}>
              <li><strong>目标：</strong>&lt; 2.5 秒</li>
              <li><strong>优化：</strong>首屏大图设置 priority={'{true}'}</li>
              <li><strong>优化：</strong>使用 CDN 加速图片加载</li>
              <li><strong>优化：</strong>合理压缩，quality 85-90</li>
            </ul>
          </div>

          <div className={styles.metric}>
            <h3 className={styles.metricTitle}>CLS (Cumulative Layout Shift)</h3>
            <p className={styles.metricText}>
              累积布局偏移，衡量页面稳定性
            </p>
            <ul className={styles.metricList}>
              <li><strong>目标：</strong>&lt; 0.1</li>
              <li><strong>优化：</strong>始终指定图片 width 和 height</li>
              <li><strong>优化：</strong>使用 placeholder 占位符</li>
              <li><strong>优化：</strong>避免动态调整图片尺寸</li>
            </ul>
          </div>

          <div className={styles.metric}>
            <h3 className={styles.metricTitle}>First Input Delay (FID)</h3>
            <p className={styles.metricText}>
              首次输入延迟，衡量交互响应速度
            </p>
            <ul className={styles.metricList}>
              <li><strong>目标：</strong>&lt; 100 毫秒</li>
              <li><strong>优化：</strong>使用懒加载减少首屏资源</li>
              <li><strong>优化：</strong>避免大量图片同时加载</li>
              <li><strong>优化：</strong>使用虚拟滚动优化长列表</li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 性能监控 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>性能监控工具</h2>
        <div className={styles.toolsCard}>
          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>Chrome DevTools</h3>
            <pre className={styles.code}>
{`1. 打开开发者工具（F12）
2. 切换到 Network 面板
3. 过滤 Img 类型请求
4. 查看：
   - 图片实际加载尺寸
   - 文件大小和加载时间
   - 格式（WebP/AVIF/JPEG）
   - 是否命中缓存`}
            </pre>
          </div>

          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>Lighthouse</h3>
            <pre className={styles.code}>
{`1. 打开 Chrome DevTools
2. 切换到 Lighthouse 面板
3. 选择 Performance 模式
4. 生成报告，查看：
   - Properly size images（图片尺寸是否合适）
   - Serve images in next-gen formats（是否使用现代格式）
   - Defer offscreen images（是否懒加载）
   - Avoid enormous network payloads（避免巨大网络负载）`}
            </pre>
          </div>

          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>WebPageTest</h3>
            <pre className={styles.code}>
{`访问 https://www.webpagetest.org/
输入网站 URL，选择测试地点和设备
分析报告：
- Waterfall 图：查看图片加载时序
- Image Analysis：图片优化建议
- Filmstrip View：可视化加载过程`}
            </pre>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 高级优化技巧 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>高级优化技巧</h2>
        <div className={styles.techniquesCard}>
          <div className={styles.technique}>
            <h3 className={styles.techniqueTitle}>1. 渐进式 JPEG</h3>
            <p className={styles.techniqueText}>
              渐进式 JPEG 先加载模糊图像，逐步清晰，用户感知加载更快
            </p>
            <pre className={styles.code}>
{`// 使用 Sharp 库生成渐进式 JPEG
import sharp from 'sharp';

await sharp(input)
  .jpeg({ progressive: true, quality: 85 })
  .toFile(output);`}
            </pre>
          </div>

          <div className={styles.technique}>
            <h3 className={styles.techniqueTitle}>2. 图片预加载</h3>
            <p className={styles.techniqueText}>
              关键图片提前预加载，提升用户体验
            </p>
            <pre className={styles.code}>
{`// 在 <head> 中预加载
<link
  rel="preload"
  as="image"
  href="/hero-banner.jpg"
  imagesrcset="
    /hero-640.jpg 640w,
    /hero-1280.jpg 1280w,
    /hero-1920.jpg 1920w
  "
  imagesizes="100vw"
/>

// 或者用 JavaScript
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'image';
link.href = imageUrl;
document.head.appendChild(link);`}
            </pre>
          </div>

          <div className={styles.technique}>
            <h3 className={styles.techniqueTitle}>3. 图片分组加载</h3>
            <p className={styles.techniqueText}>
              按优先级分组加载，优先加载首屏和重要图片
            </p>
            <pre className={styles.code}>
{`// 首屏图片：priority={true}
<Image src="/hero.jpg" priority />

// 次要图片：默认懒加载
<Image src="/feature1.jpg" />

// 非关键图片：延迟加载
<Image 
  src="/decoration.jpg"
  loading="lazy"
  onLoad={() => console.log('装饰图加载完成')}
/>`}
            </pre>
          </div>

          <div className={styles.technique}>
            <h3 className={styles.techniqueTitle}>4. 响应式图片艺术指导</h3>
            <p className={styles.techniqueText}>
              不同屏幕尺寸使用不同裁剪的图片（Art Direction）
            </p>
            <pre className={styles.code}>
{`// 移动端用竖图，桌面端用横图
import { useMediaQuery } from '@/hooks/useMediaQuery';

function ResponsiveImage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Image
      src={isMobile ? '/portrait.jpg' : '/landscape.jpg'}
      alt="响应式图片"
      width={isMobile ? 400 : 1200}
      height={isMobile ? 600 : 400}
    />
  );
}`}
            </pre>
          </div>

          <div className={styles.technique}>
            <h3 className={styles.techniqueTitle}>5. 图片懒加载阈值调整</h3>
            <p className={styles.techniqueText}>
              自定义 IntersectionObserver 阈值，控制提前加载时机
            </p>
            <pre className={styles.code}>
{`// next.config.ts
module.exports = {
  images: {
    // 设置懒加载的阈值（像素）
    // 图片进入视口前 500px 就开始加载
    lazyBoundary: '500px',
  },
};`}
            </pre>
          </div>

          <div className={styles.technique}>
            <h3 className={styles.techniqueTitle}>6. 使用 Suspense 优化加载体验</h3>
            <p className={styles.techniqueText}>
              结合 React Suspense 实现优雅的加载状态
            </p>
            <pre className={styles.code}>
{`import { Suspense } from 'react';

function ImageWithSuspense() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AsyncImage src="/large-image.jpg" />
    </Suspense>
  );
}

function Skeleton() {
  return <div className="skeleton-shimmer" />;
}`}
            </pre>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 常见问题排查 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>常见问题排查</h2>
        <div className={styles.troubleshootCard}>
          <div className={styles.issue}>
            <h3 className={styles.issueTitle}>Q: 图片加载很慢？</h3>
            <ul className={styles.issueList}>
              <li>✅ 检查图片文件大小，是否超过 200KB</li>
              <li>✅ 检查 quality 设置，是否过高（建议 75-85）</li>
              <li>✅ 检查是否使用 CDN</li>
              <li>✅ 检查网络请求，是否被阻塞</li>
              <li>✅ 使用 WebP/AVIF 格式</li>
            </ul>
          </div>

          <div className={styles.issue}>
            <h3 className={styles.issueTitle}>Q: 移动端图片模糊？</h3>
            <ul className={styles.issueList}>
              <li>✅ 检查 sizes 配置，是否合理</li>
              <li>✅ 考虑高分屏（DPR 2-3），图片尺寸需要 2-3 倍</li>
              <li>✅ 检查 deviceSizes 配置</li>
              <li>✅ 提高 quality 设置</li>
            </ul>
          </div>

          <div className={styles.issue}>
            <h3 className={styles.issueTitle}>Q: 页面布局跳动？</h3>
            <ul className={styles.issueList}>
              <li>✅ 必须指定 width 和 height</li>
              <li>✅ 使用 placeholder 占位符</li>
              <li>✅ CSS 设置 aspect-ratio 保持宽高比</li>
              <li>✅ 避免动态改变图片尺寸</li>
            </ul>
          </div>

          <div className={styles.issue}>
            <h3 className={styles.issueTitle}>Q: 外部图片无法显示？</h3>
            <ul className={styles.issueList}>
              <li>✅ 检查 next.config.ts 的 remotePatterns 配置</li>
              <li>✅ 检查图片 URL 是否正确</li>
              <li>✅ 检查 CORS 跨域问题</li>
              <li>✅ 检查图片服务器是否正常</li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 最佳实践清单 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>最佳实践清单</h2>
        <div className={styles.checklistCard}>
          <div className={styles.checklistGroup}>
            <h3 className={styles.checklistTitle}>基础配置</h3>
            <ul className={styles.checklist}>
              <li>✅ 所有图片使用 next/image，禁用 img 标签</li>
              <li>✅ 配置 remotePatterns 白名单</li>
              <li>✅ 配置 deviceSizes 和 imageSizes</li>
              <li>✅ 启用 WebP 和 AVIF 格式</li>
            </ul>
          </div>

          <div className={styles.checklistGroup}>
            <h3 className={styles.checklistTitle}>图片属性</h3>
            <ul className={styles.checklist}>
              <li>✅ 始终提供有意义的 alt 属性</li>
              <li>✅ 指定 width 和 height，防止布局跳动</li>
              <li>✅ 首屏图片设置 priority</li>
              <li>✅ 合理配置 quality（75-85）</li>
              <li>✅ 精确配置 sizes 属性</li>
            </ul>
          </div>

          <div className={styles.checklistGroup}>
            <h3 className={styles.checklistTitle}>加载优化</h3>
            <ul className={styles.checklist}>
              <li>✅ 非首屏图片使用懒加载</li>
              <li>✅ 使用 placeholder 占位符</li>
              <li>✅ 长列表使用虚拟滚动</li>
              <li>✅ 关键图片预加载</li>
            </ul>
          </div>

          <div className={styles.checklistGroup}>
            <h3 className={styles.checklistTitle}>性能监控</h3>
            <ul className={styles.checklist}>
              <li>✅ 定期运行 Lighthouse 检查</li>
              <li>✅ 监控 LCP、CLS 指标</li>
              <li>✅ 检查图片加载时间和大小</li>
              <li>✅ 使用真实设备测试</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

