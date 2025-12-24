import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import ResponsiveImage from '@/components/image-optimization/ResponsiveImage';
import styles from '@/styles/image-optimization/ResponsivePage.module.css';

/**
 * 响应式图片示例页面
 */
export default function ResponsiveImagePage() {
  return (
    <div className={styles.container}>
      <Link href="/19-image-optimization" className={styles.backLink}>
        ← 返回主页
      </Link>

      <h1 className={styles.title}>响应式图片</h1>
      <p className={styles.description}>
        多终端适配、sizes 属性和自动尺寸选择
      </p>

      <Spacing height={32} />

      {/* 示例1：Banner 图 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Banner 横幅图</h2>
        <div className={styles.demoCard}>
          <ResponsiveImage
            src="https://picsum.photos/seed/banner1/1920/600"
            alt="横幅广告"
            aspectRatio={16 / 5}
            type="banner"
            priority
            quality={85}
          />
        </div>
        <div className={styles.explanation}>
          <h3 className={styles.explanationTitle}>sizes 配置：</h3>
          <pre className={styles.code}>
{`sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"

解释：
- 移动端（≤640px）：占据 100% 视口宽度
- 平板（≤1024px）：占据 90% 视口宽度
- 桌面（>1024px）：占据 80% 视口宽度

Next.js 会自动根据设备分辨率和 sizes 配置，
选择最合适的图片尺寸进行加载。`}
          </pre>
        </div>
      </section>

      <Spacing height={48} />

      {/* 示例2：卡片图 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 卡片列表（网格布局）</h2>
        <div className={styles.cardGrid}>
          <ResponsiveImage
            src="https://picsum.photos/seed/card1/600/400"
            alt="卡片图片1"
            aspectRatio={3 / 2}
            type="card"
            quality={80}
          />
          <ResponsiveImage
            src="https://picsum.photos/seed/card2/600/400"
            alt="卡片图片2"
            aspectRatio={3 / 2}
            type="card"
            quality={80}
          />
          <ResponsiveImage
            src="https://picsum.photos/seed/card3/600/400"
            alt="卡片图片3"
            aspectRatio={3 / 2}
            type="card"
            quality={80}
          />
        </div>
        <div className={styles.explanation}>
          <h3 className={styles.explanationTitle}>sizes 配置：</h3>
          <pre className={styles.code}>
{`sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

解释：
- 移动端：每行 1 个，占 100% 宽度
- 平板：每行 2 个，占 50% 宽度
- 桌面：每行 3 个，占 33% 宽度

这样可以节省大量流量，移动端不会加载过大的图片。`}
          </pre>
        </div>
      </section>

      <Spacing height={48} />

      {/* 示例3：缩略图 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 缩略图列表</h2>
        <div className={styles.thumbnailGrid}>
          <ResponsiveImage
            src="https://picsum.photos/seed/thumb1/200/200"
            alt="缩略图1"
            aspectRatio={1}
            type="thumbnail"
            quality={70}
          />
          <ResponsiveImage
            src="https://picsum.photos/seed/thumb2/200/200"
            alt="缩略图2"
            aspectRatio={1}
            type="thumbnail"
            quality={70}
          />
          <ResponsiveImage
            src="https://picsum.photos/seed/thumb3/200/200"
            alt="缩略图3"
            aspectRatio={1}
            type="thumbnail"
            quality={70}
          />
          <ResponsiveImage
            src="https://picsum.photos/seed/thumb4/200/200"
            alt="缩略图4"
            aspectRatio={1}
            type="thumbnail"
            quality={70}
          />
        </div>
        <div className={styles.explanation}>
          <h3 className={styles.explanationTitle}>sizes 配置：</h3>
          <pre className={styles.code}>
{`sizes="(max-width: 640px) 80px, (max-width: 1024px) 120px, 150px"

解释：
- 移动端：固定 80px
- 平板：固定 120px
- 桌面：固定 150px

缩略图尺寸固定，使用固定像素值更精确。`}
          </pre>
        </div>
      </section>

      <Spacing height={48} />

      {/* 知识讲解 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>深入理解 sizes 属性</h2>
        <div className={styles.knowledgeCard}>
          <div className={styles.knowledgeSection}>
            <h3 className={styles.knowledgeTitle}>什么是 sizes？</h3>
            <p className={styles.knowledgeText}>
              sizes 属性告诉浏览器图片在不同屏幕宽度下的实际显示尺寸。
              浏览器根据这个信息，结合设备分辨率（DPR），选择最合适的图片源。
            </p>
          </div>

          <div className={styles.knowledgeSection}>
            <h3 className={styles.knowledgeTitle}>语法格式</h3>
            <pre className={styles.code}>
{`sizes="(媒体查询) 显示宽度, (媒体查询) 显示宽度, 默认宽度"

示例：
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"

单位：
- vw: 视口宽度百分比（1vw = 1% 视口宽度）
- px: 固定像素
- calc(): 计算值，如 calc(100vw - 80px)`}
            </pre>
          </div>

          <div className={styles.knowledgeSection}>
            <h3 className={styles.knowledgeTitle}>浏览器如何选择图片？</h3>
            <ol className={styles.knowledgeList}>
              <li>
                <strong>第一步：</strong>根据当前视口宽度，匹配 sizes 属性中的媒体查询
              </li>
              <li>
                <strong>第二步：</strong>获取图片的显示宽度（如 50vw）
              </li>
              <li>
                <strong>第三步：</strong>乘以设备像素比（DPR）
                <br />
                例如：视口 375px，DPR=2，显示宽度 100vw
                <br />
                实际需要图片宽度 = 375 * 1 * 2 = 750px
              </li>
              <li>
                <strong>第四步：</strong>从 deviceSizes 和 imageSizes 配置中，选择最接近的尺寸
              </li>
            </ol>
          </div>

          <div className={styles.knowledgeSection}>
            <h3 className={styles.knowledgeTitle}>为什么要配置 sizes？</h3>
            <ul className={styles.knowledgeList}>
              <li>
                <strong>节省流量：</strong>移动端不会加载桌面端的大图
              </li>
              <li>
                <strong>提升性能：</strong>更快的加载速度，更好的用户体验
              </li>
              <li>
                <strong>精确控制：</strong>精确告诉浏览器图片的实际尺寸
              </li>
              <li>
                <strong>避免浪费：</strong>不配置 sizes，默认为 100vw，可能加载过大图片
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 配置说明 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>next.config.ts 配置</h2>
        <div className={styles.configCard}>
          <pre className={styles.code}>
{`// next.config.ts
const nextConfig = {
  images: {
    // 设备屏幕宽度断点（用于响应式图片）
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048],
    
    // 图片尺寸选项（用于小尺寸图片）
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 支持的图片格式
    formats: ['image/webp', 'image/avif'],
  },
};

说明：
- deviceSizes: 用于响应式图片，根据视口宽度选择
- imageSizes: 用于固定尺寸图片（如图标、缩略图）
- Next.js 会自动从这些尺寸中选择最接近的一个`}
          </pre>
        </div>
      </section>

      <Spacing height={48} />

      {/* 实战建议 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>实战建议</h2>
        <div className={styles.tipsCard}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>根据布局设计 sizes</h4>
              <p className={styles.tipText}>
                分析页面布局，精确计算图片在不同屏幕下的实际宽度，避免使用默认的 100vw
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>使用 Chrome DevTools 检查</h4>
              <p className={styles.tipText}>
                打开 Network 面板，查看实际加载的图片尺寸，确认是否符合预期
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>考虑高分辨率屏幕</h4>
              <p className={styles.tipText}>
                iPhone 等设备的 DPR 为 2-3，实际加载的图片是显示宽度的 2-3 倍
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <h4 className={styles.tipTitle}>使用封装组件</h4>
              <p className={styles.tipText}>
                根据常见场景（banner、card、thumbnail）封装组件，统一管理 sizes 配置
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

