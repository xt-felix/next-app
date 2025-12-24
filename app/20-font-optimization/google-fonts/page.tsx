import { inter, roboto, notoSansSC } from '@/app/fonts';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/font-optimization/GoogleFontsPage.module.css';

export default function GoogleFontsPage() {
  return (
    <div className={styles.container}>
      <h1>Google Fonts 使用</h1>

      <Spacing flex direction="column" gap={32}>
        <section className={styles.section}>
          <h2>📖 概念讲解</h2>
          <p>
            Google Fonts 提供了丰富的免费字体库，<code>next/font/google</code> 
            能够自动优化这些字体的加载和性能：
          </p>
          <ul>
            <li>自动将字体文件下载到项目中，避免运行时请求 Google CDN</li>
            <li>支持字体子集化，按需加载</li>
            <li>零配置实现最佳性能</li>
            <li>完全符合 GDPR 等隐私规范</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>💻 代码示例</h2>
          <pre className={styles.code}>
{`// app/fonts.ts
import { Inter, Roboto, Noto_Sans_SC } from 'next/font/google';

// 英文字体 - Inter
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// 英文字体 - Roboto
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

// 中文字体 - 思源黑体简体
export const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
});`}
          </pre>
        </section>

        <section className={styles.section}>
          <h2>🎨 字体效果展示</h2>
          
          <div className={styles.fontDemo}>
            <h3>Inter 字体</h3>
            <div className={inter.className}>
              <p className={styles.sampleText}>
                The quick brown fox jumps over the lazy dog.
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
              </p>
              <p className={styles.weights}>
                <span style={{ fontWeight: 400 }}>Regular 400</span>
                <span style={{ fontWeight: 500 }}>Medium 500</span>
                <span style={{ fontWeight: 600 }}>SemiBold 600</span>
                <span style={{ fontWeight: 700 }}>Bold 700</span>
              </p>
            </div>
          </div>

          <div className={styles.fontDemo}>
            <h3>Roboto 字体</h3>
            <div className={roboto.className}>
              <p className={styles.sampleText}>
                The quick brown fox jumps over the lazy dog.
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
              </p>
              <p className={styles.weights}>
                <span style={{ fontWeight: 400 }}>Regular 400</span>
                <span style={{ fontWeight: 700 }}>Bold 700</span>
              </p>
            </div>
          </div>

          <div className={styles.fontDemo}>
            <h3>思源黑体简体（Noto Sans SC）</h3>
            <div className={notoSansSC.className}>
              <p className={styles.sampleText}>
                快速的棕色狐狸跳过懒狗。
                中文字体展示：优雅、清晰、易读。
              </p>
              <p className={styles.weights}>
                <span style={{ fontWeight: 400 }}>常规 400</span>
                <span style={{ fontWeight: 500 }}>中等 500</span>
                <span style={{ fontWeight: 700 }}>粗体 700</span>
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🌍 多语言场景使用</h2>
          <p>在多语言项目中，可以根据内容语言选择合适的字体：</p>
          <pre className={styles.code}>
{`export default function MultiLangContent({ lang, children }) {
  const fontClass = lang === 'zh' 
    ? notoSansSC.className 
    : inter.className;
    
  return (
    <div className={fontClass}>
      {children}
    </div>
  );
}`}
          </pre>

          <div className={styles.example}>
            <div className={inter.className}>
              <p><strong>English:</strong> This is English content using Inter font.</p>
            </div>
            <div className={notoSansSC.className}>
              <p><strong>中文：</strong>这是使用思源黑体的中文内容。</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>💡 使用技巧</h2>
          <Spacing flex direction="column" gap={12}>
            <div className={styles.tip}>
              <strong>1. 选择合适的字体子集</strong>
              <p>
                英文内容使用 'latin' 子集，中文使用 'chinese-simplified'，
                日文使用 'japanese'。子集化能大幅减少字体文件体积。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>2. 避免加载过多字重</strong>
              <p>
                只加载实际使用的字重，如 ['400', '700']。
                如果需要更多变化，可以使用可变字体。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>3. 使用 CSS 变量方便管理</strong>
              <p>
                通过 variable 参数定义 CSS 变量，可以在全局样式中灵活使用。
              </p>
            </div>
          </Spacing>
        </section>

        <section className={styles.section}>
          <h2>📊 性能对比</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>加载方式</th>
                <th>优点</th>
                <th>缺点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>传统 @font-face</td>
                <td>兼容性好</td>
                <td>手动优化困难，易出现 FOIT/CLS</td>
              </tr>
              <tr>
                <td>Google Fonts CDN</td>
                <td>简单快速</td>
                <td>外部请求，隐私问题，依赖网络</td>
              </tr>
              <tr>
                <td>next/font/google</td>
                <td>自动优化、零配置、无隐私问题</td>
                <td>需要 Next.js 13+</td>
              </tr>
            </tbody>
          </table>
        </section>
      </Spacing>
    </div>
  );
}

