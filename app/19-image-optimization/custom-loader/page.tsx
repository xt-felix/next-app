'use client';

import Image from 'next/image';
import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import { aliOssLoader, qiniuLoader, tencentCosLoader } from '@/utils/image/imageLoader';
import styles from '@/styles/image-optimization/CustomLoaderPage.module.css';

/**
 * 自定义加载器页面
 */
export default function CustomLoaderPage() {
  return (
    <div className={styles.container}>
      <Link href="/19-image-optimization" className={styles.backLink}>
        ← 返回主页
      </Link>

      <h1 className={styles.title}>自定义加载器</h1>
      <p className={styles.description}>
        对接阿里云、七牛云等企业图片服务
      </p>

      <Spacing height={32} />

      {/* 为什么需要自定义 Loader */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>为什么需要自定义 Loader？</h2>
        <div className={styles.card}>
          <ul className={styles.list}>
            <li>
              <strong>企业图片服务：</strong>
              阿里云OSS、七牛云、腾讯云COS等提供专业的图片处理服务
            </li>
            <li>
              <strong>成本优化：</strong>
              使用云服务商的图片处理，比自建服务更便宜、更稳定
            </li>
            <li>
              <strong>功能丰富：</strong>
              支持水印、格式转换、智能裁剪、内容审核等高级功能
            </li>
            <li>
              <strong>全球加速：</strong>
              CDN 分发，全球用户都能快速访问
            </li>
          </ul>
        </div>
      </section>

      <Spacing height={48} />

      {/* 阿里云 OSS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. 阿里云 OSS Loader</h2>
        <div className={styles.demoCard}>
          <div className={styles.imageBox}>
            <Image
              loader={aliOssLoader}
              src="products/demo-product.jpg"
              alt="阿里云 OSS 示例"
              width={600}
              height={400}
              quality={80}
            />
          </div>
          <div className={styles.explanation}>
            <h3 className={styles.explanationTitle}>实现代码：</h3>
            <pre className={styles.code}>
{`// utils/image/imageLoader.ts
export function aliOssLoader({ src, width, quality = 80 }) {
  const base = 'https://img.alicdn.com';
  return \`\${base}/\${src}?x-oss-process=image/resize,w_\${width}/quality,q_\${quality}\`;
}

// 使用
<Image
  loader={aliOssLoader}
  src="products/demo-product.jpg"
  alt="商品图片"
  width={600}
  height={400}
  quality={80}
/>`}
            </pre>
            <p className={styles.explanationText}>
              <strong>阿里云 OSS 图片处理参数：</strong>
            </p>
            <ul className={styles.explanationList}>
              <li><code>resize,w_宽度</code> - 按宽度缩放</li>
              <li><code>quality,q_质量</code> - 调整质量（1-100）</li>
              <li><code>format,webp</code> - 转换格式</li>
              <li><code>watermark</code> - 添加水印</li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 七牛云 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 七牛云 Loader</h2>
        <div className={styles.demoCard}>
          <div className={styles.explanation}>
            <h3 className={styles.explanationTitle}>实现代码：</h3>
            <pre className={styles.code}>
{`// utils/image/imageLoader.ts
export function qiniuLoader({ src, width, quality = 80 }) {
  const base = 'https://cdn.qiniu.com';
  return \`\${base}/\${src}?imageView2/2/w/\${width}/q/\${quality}\`;
}

// 使用
<Image
  loader={qiniuLoader}
  src="products/demo-product.jpg"
  alt="商品图片"
  width={600}
  height={400}
  quality={80}
/>`}
            </pre>
            <p className={styles.explanationText}>
              <strong>七牛云图片处理参数：</strong>
            </p>
            <ul className={styles.explanationList}>
              <li><code>imageView2/2/w/宽度</code> - 限定宽度，高度自适应</li>
              <li><code>q/质量</code> - 图片质量（1-100）</li>
              <li><code>format/webp</code> - 输出格式</li>
              <li><code>watermark</code> - 图片水印</li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 腾讯云 COS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 腾讯云 COS Loader</h2>
        <div className={styles.demoCard}>
          <div className={styles.explanation}>
            <h3 className={styles.explanationTitle}>实现代码：</h3>
            <pre className={styles.code}>
{`// utils/image/imageLoader.ts
export function tencentCosLoader({ src, width, quality = 80 }) {
  const base = 'https://example.cos.ap-guangzhou.myqcloud.com';
  return \`\${base}/\${src}?imageMogr2/thumbnail/\${width}x/quality/\${quality}\`;
}

// 使用
<Image
  loader={tencentCosLoader}
  src="products/demo-product.jpg"
  alt="商品图片"
  width={600}
  height={400}
  quality={80}
/>`}
            </pre>
            <p className={styles.explanationText}>
              <strong>腾讯云数据万象参数：</strong>
            </p>
            <ul className={styles.explanationList}>
              <li><code>imageMogr2/thumbnail/宽度x</code> - 缩略图</li>
              <li><code>quality/质量</code> - 图片质量</li>
              <li><code>format/webp</code> - 格式转换</li>
              <li><code>watermark</code> - 盲水印、文字水印</li>
            </ul>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 全局配置 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>全局配置 Loader</h2>
        <div className={styles.configCard}>
          <p className={styles.configText}>
            如果整个项目都使用同一个图片服务，可以在 next.config.ts 中全局配置：
          </p>
          <pre className={styles.code}>
{`// next.config.ts
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './utils/image/imageLoader.ts',
  },
};

// utils/image/imageLoader.ts
export default function customLoader({ src, width, quality }) {
  // 默认使用阿里云 OSS
  return aliOssLoader({ src, width, quality });
}

// 使用时不需要指定 loader
<Image
  src="products/demo-product.jpg"
  alt="商品图片"
  width={600}
  height={400}
/>`}
          </pre>
        </div>
      </section>

      <Spacing height={48} />

      {/* 高级功能 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>高级功能</h2>
        <div className={styles.advancedCard}>
          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>🎨 智能裁剪</h3>
            <p className={styles.featureText}>
              基于 AI 识别主体，自动裁剪到合适尺寸，保留重要内容
            </p>
            <pre className={styles.code}>
{`// 阿里云 OSS 智能裁剪
?x-oss-process=image/crop,w_300,h_300,g_auto`}
            </pre>
          </div>

          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>💧 水印保护</h3>
            <p className={styles.featureText}>
              添加文字或图片水印，保护版权
            </p>
            <pre className={styles.code}>
{`// 阿里云 OSS 文字水印
?x-oss-process=image/watermark,text_版权所有,color_FFFFFF,
  size_30,g_se,x_10,y_10`}
            </pre>
          </div>

          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>🔍 内容审核</h3>
            <p className={styles.featureText}>
              自动检测违规内容，保证平台安全
            </p>
            <pre className={styles.code}>
{`// 使用云服务 API 进行内容审核
const result = await imageAudit(imageUrl);
if (result.pass) {
  // 允许上传
}`}
            </pre>
          </div>

          <div className={styles.feature}>
            <h3 className={styles.featureTitle}>📊 数据统计</h3>
            <p className={styles.featureText}>
              追踪图片访问量、流量消耗，优化成本
            </p>
            <pre className={styles.code}>
{`// 云服务商控制台查看
- 访问次数
- 流量统计
- 热门图片排行`}
            </pre>
          </div>
        </div>
      </section>

      <Spacing height={48} />

      {/* 最佳实践 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>最佳实践</h2>
        <div className={styles.tipsCard}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🔐</span>
            <div>
              <h4 className={styles.tipTitle}>私有图片鉴权</h4>
              <p className={styles.tipText}>
                用户上传的私密图片，使用签名 URL，设置过期时间，防止盗链
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>⚡</span>
            <div>
              <h4 className={styles.tipTitle}>CDN 加速</h4>
              <p className={styles.tipText}>
                配置 CDN 域名，开启全球加速，降低延迟，提升访问速度
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💰</span>
            <div>
              <h4 className={styles.tipTitle}>成本优化</h4>
              <p className={styles.tipText}>
                合理设置缓存策略，减少回源请求，降低流量和处理费用
              </p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🛡️</span>
            <div>
              <h4 className={styles.tipTitle}>防盗链设置</h4>
              <p className={styles.tipText}>
                配置 Referer 白名单，防止其他网站盗用图片，浪费流量
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

