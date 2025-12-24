import Spacing from '@/components/common/Spacing';
import styles from '@/styles/font-optimization/LocalFontsPage.module.css';

export default function LocalFontsPage() {
  return (
    <div className={styles.container}>
      <h1>本地自定义字体</h1>

      <Spacing flex direction="column" gap={32}>
        <section className={styles.section}>
          <h2>📖 概念讲解</h2>
          <p>
            对于企业品牌字体或特殊设计需求，可以使用 <code>next/font/local</code> 
            加载本地字体文件。这种方式同样享受 next/font 的所有优化特性。
          </p>
          <ul>
            <li>支持多种字体格式：woff2（推荐）、woff、ttf、otf</li>
            <li>支持多字重、多样式配置</li>
            <li>自动生成优化的 CSS</li>
            <li>完全控制字体文件和授权</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>📁 目录结构</h2>
          <pre className={styles.code}>
{`public/
  fonts/
    Brand-Regular.woff2
    Brand-Bold.woff2
    Brand-Italic.woff2
app/
  fonts.ts
  layout.tsx`}
          </pre>
        </section>

        <section className={styles.section}>
          <h2>💻 代码示例</h2>
          
          <h3>1. 基础配置（单一字重）</h3>
          <pre className={styles.code}>
{`// app/fonts.ts
import localFont from 'next/font/local';

export const brandFont = localFont({
  src: './fonts/Brand-Regular.woff2',
  display: 'swap',
  variable: '--font-brand',
});`}
          </pre>

          <h3>2. 多字重配置</h3>
          <pre className={styles.code}>
{`// app/fonts.ts
import localFont from 'next/font/local';

export const brandFont = localFont({
  src: [
    {
      path: '../public/fonts/Brand-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Brand-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Brand-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-brand',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});`}
          </pre>

          <h3>3. 在页面中使用</h3>
          <pre className={styles.code}>
{`// app/layout.tsx
import { brandFont } from './fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="zh" className={brandFont.variable}>
      <body>{children}</body>
    </html>
  );
}

// 在组件中使用
export default function Page() {
  return (
    <div className={brandFont.className}>
      这段文字使用品牌字体
    </div>
  );
}`}
          </pre>

          <h3>4. 通过 CSS 变量使用</h3>
          <pre className={styles.code}>
{`/* styles/globals.css */
:root {
  --font-brand: var(--font-brand);
}

.heading {
  font-family: var(--font-brand), sans-serif;
}

.body-text {
  font-family: system-ui, -apple-system, sans-serif;
}`}
          </pre>
        </section>

        <section className={styles.section}>
          <h2>🎯 实际应用场景</h2>
          
          <div className={styles.useCase}>
            <h3>场景 1：企业品牌字体</h3>
            <p>
              企业官网、品牌宣传页需要使用特定的品牌字体，
              通过本地字体加载可以确保字体授权合规，并完全控制字体文件。
            </p>
            <div className={styles.example}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '24px', fontWeight: 700 }}>
                Company Brand Headline
              </p>
              <p style={{ fontFamily: 'var(--font-inter)' }}>
                This is body text using brand font for consistent brand identity.
              </p>
            </div>
          </div>

          <div className={styles.useCase}>
            <h3>场景 2：特殊设计字体</h3>
            <p>
              设计师定制的艺术字体、手写字体等，用于特殊页面或组件。
            </p>
            <div className={styles.example}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontStyle: 'italic' }}>
                "Elegant design requires elegant typography."
              </p>
            </div>
          </div>

          <div className={styles.useCase}>
            <h3>场景 3：图标字体</h3>
            <p>
              自定义图标字体，用于项目中的图标展示。
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>⚠️ 注意事项</h2>
          <Spacing flex direction="column" gap={12}>
            <div className={styles.warning}>
              <strong>1. 字体文件格式选择</strong>
              <p>
                优先使用 <code>woff2</code> 格式，它的压缩率最高，浏览器支持度也很好。
                避免使用 ttf、otf 等未压缩格式，文件体积会非常大。
              </p>
            </div>
            <div className={styles.warning}>
              <strong>2. 字体授权与版权</strong>
              <p>
                使用自定义字体前务必确认字体授权范围，
                商业项目必须购买商业授权，避免侵权风险。
              </p>
            </div>
            <div className={styles.warning}>
              <strong>3. 配置 fallback 字体</strong>
              <p>
                必须配置 fallback 字体，确保在字体加载失败时有合适的备用方案。
              </p>
            </div>
            <div className={styles.warning}>
              <strong>4. 字体文件体积控制</strong>
              <p>
                中文字体文件通常很大（几 MB），考虑使用字体子集化工具（如 fonttools）
                只提取需要的字符，减小文件体积。
              </p>
            </div>
          </Spacing>
        </section>

        <section className={styles.section}>
          <h2>🛠️ 字体优化工具</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>工具</th>
                <th>功能</th>
                <th>使用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>fonttools</td>
                <td>字体子集化、格式转换</td>
                <td>提取中文字体需要的字符</td>
              </tr>
              <tr>
                <td>glyphhanger</td>
                <td>分析网页用到的字符</td>
                <td>自动生成字体子集</td>
              </tr>
              <tr>
                <td>transfonter</td>
                <td>在线字体格式转换</td>
                <td>将 ttf/otf 转为 woff2</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <h2>📦 字体子集化示例</h2>
          <p>使用 fonttools 对中文字体进行子集化：</p>
          <pre className={styles.code}>
{`# 安装 fonttools
pip install fonttools brotli

# 提取常用汉字（3500 个）
pyftsubset Brand-SC.ttf \\
  --text-file=common-chars.txt \\
  --output-file=Brand-SC-subset.woff2 \\
  --flavor=woff2

# common-chars.txt 包含需要的所有字符
# 字体文件体积可以从 10MB 减少到 500KB`}
          </pre>
        </section>

        <section className={styles.section}>
          <h2>✅ 最佳实践清单</h2>
          <ul className={styles.checklist}>
            <li>✓ 使用 woff2 格式</li>
            <li>✓ 配置 display: 'swap'</li>
            <li>✓ 设置 fallback 字体</li>
            <li>✓ 确认字体授权</li>
            <li>✓ 中文字体进行子集化</li>
            <li>✓ 使用 CSS 变量方便管理</li>
            <li>✓ 测试各种浏览器兼容性</li>
            <li>✓ 监控字体加载性能</li>
          </ul>
        </section>
      </Spacing>
    </div>
  );
}

