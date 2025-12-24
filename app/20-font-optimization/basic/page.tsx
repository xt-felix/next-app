import { inter } from '@/app/fonts';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/font-optimization/BasicPage.module.css';

export default function BasicFontPage() {
  return (
    <div className={styles.container}>
      <h1>基础字体加载</h1>

      <Spacing flex direction="column" gap={32}>
        <section className={styles.section}>
          <h2>📖 概念讲解</h2>
          <p>
            <code>next/font</code> 是 Next.js 13+ 提供的字体优化模块，它能够：
          </p>
          <ul>
            <li>自动下载字体文件到本地，避免外部请求</li>
            <li>生成优化的 CSS，避免布局偏移（CLS）</li>
            <li>内置预加载，提升首屏渲染速度</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>💻 代码示例</h2>
          <p>在 <code>app/fonts.ts</code> 中定义字体：</p>
          <pre className={styles.code}>
{`import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],       // 字体子集
  weight: ['400', '700'],   // 字体粗细
  display: 'swap',          // 字体显示策略
  variable: '--font-inter', // CSS 变量名
});`}
          </pre>

          <p>在组件中使用字体：</p>
          <pre className={styles.code}>
{`import { inter } from '@/app/fonts';

export default function Page() {
  return (
    <div className={inter.className}>
      这段文字使用 Inter 字体
    </div>
  );
}`}
          </pre>
        </section>

        <section className={styles.section}>
          <h2>🎨 效果展示</h2>
          <div className={inter.className}>
            <p className={styles.demo}>
              This text uses the Inter font family. 
              Inter is a carefully crafted variable font designed for computer screens.
            </p>
            <p className={styles.demo}>
              这段文字也使用了 Inter 字体（但中文显示为 fallback 字体）
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🔑 关键参数说明</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>参数</th>
                <th>说明</th>
                <th>推荐值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>subsets</code></td>
                <td>字体子集，只加载需要的字符</td>
                <td>latin, chinese-simplified 等</td>
              </tr>
              <tr>
                <td><code>weight</code></td>
                <td>字体粗细</td>
                <td>['400', '700'] 或 'variable'</td>
              </tr>
              <tr>
                <td><code>display</code></td>
                <td>字体显示策略</td>
                <td>'swap'（避免 FOIT）</td>
              </tr>
              <tr>
                <td><code>variable</code></td>
                <td>CSS 变量名</td>
                <td>--font-{'{'}name{'}'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <h2>⚡ 性能优化要点</h2>
          <Spacing flex direction="column" gap={12}>
            <div className={styles.tip}>
              <strong>1. 使用 display: 'swap'</strong>
              <p>避免 FOIT（Flash of Invisible Text），让文字立即显示</p>
            </div>
            <div className={styles.tip}>
              <strong>2. 配置正确的 subsets</strong>
              <p>只加载需要的字符集，大幅减少字体文件体积</p>
            </div>
            <div className={styles.tip}>
              <strong>3. 选择合适的 weight</strong>
              <p>只加载实际使用的字重，避免加载全部字重</p>
            </div>
          </Spacing>
        </section>
      </Spacing>
    </div>
  );
}

