import { inter, notoSansSC, notoSansJP } from '@/app/fonts';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/font-optimization/MultiLanguagePage.module.css';

export default function MultiLanguagePage() {
  return (
    <div className={styles.container}>
      <h1>多语言字体支持</h1>

      <Spacing flex direction="column" gap={32}>
        <section className={styles.section}>
          <h2>📖 概念讲解</h2>
          <p>
            国际化项目需要支持多种语言，不同语言的字体需求差异很大：
          </p>
          <ul>
            <li>英文字体通常体积小（50-200KB），加载快</li>
            <li>中文字体因字符数量庞大，往往有几 MB，需要特殊优化</li>
            <li>日文、韩文等东亚语言也有类似问题</li>
            <li>阿拉伯语、希伯来语等从右到左书写的语言需要特殊处理</li>
          </ul>
          <p>
            <code>next/font</code> 通过字体子集化（subsets）功能，
            可以只加载特定语言所需的字符，大幅优化性能。
          </p>
        </section>

        <section className={styles.section}>
          <h2>💻 代码示例</h2>
          
          <h3>1. 配置多语言字体</h3>
          <pre className={styles.code}>
{`// app/fonts.ts
import { Inter, Noto_Sans_SC, Noto_Sans_JP } from 'next/font/google';

// 英文字体
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// 中文字体（简体）
export const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
});

// 日文字体
export const notoSansJP = Noto_Sans_JP({
  subsets: ['japanese'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});`}
          </pre>

          <h3>2. 动态选择字体</h3>
          <pre className={styles.code}>
{`// 根据语言选择合适的字体
function getLocaleFont(locale: string) {
  switch (locale) {
    case 'zh':
    case 'zh-CN':
      return notoSansSC.className;
    case 'ja':
    case 'ja-JP':
      return notoSansJP.className;
    case 'en':
    default:
      return inter.className;
  }
}

export default function Page({ locale }) {
  const fontClass = getLocaleFont(locale);
  
  return (
    <div className={fontClass}>
      {/* 内容会使用对应语言的字体 */}
    </div>
  );
}`}
          </pre>
        </section>

        <section className={styles.section}>
          <h2>🌍 多语言效果展示</h2>
          
          <div className={styles.languageDemo}>
            <h3>English (Inter)</h3>
            <div className={`${inter.className} ${styles.textSample}`}>
              <p>
                The quick brown fox jumps over the lazy dog. 
                This text demonstrates the Inter font family, which is optimized 
                for digital interfaces and screen readability.
              </p>
              <p className={styles.meta}>
                Font: Inter | Subset: latin | Characters: A-Z, a-z, 0-9
              </p>
            </div>
          </div>

          <div className={styles.languageDemo}>
            <h3>简体中文（思源黑体简体）</h3>
            <div className={`${notoSansSC.className} ${styles.textSample}`}>
              <p>
                快速的棕色狐狸跳过懒狗。
                这段文字展示了思源黑体简体字体，它是 Google 和 Adobe 联合开发的开源字体，
                专为东亚语言优化，具有优秀的屏幕显示效果和可读性。
              </p>
              <p className={styles.meta}>
                字体：Noto Sans SC | 子集：chinese-simplified | 字符：常用简体汉字
              </p>
            </div>
          </div>

          <div className={styles.languageDemo}>
            <h3>日本語（Noto Sans JP）</h3>
            <div className={`${notoSansJP.className} ${styles.textSample}`}>
              <p>
                素早い茶色のキツネが怠け者の犬を飛び越えます。
                このテキストは Noto Sans JP フォントを使用しています。
                これは日本語のひらがな、カタカナ、漢字に最適化された
                オープンソースフォントです。
              </p>
              <p className={styles.meta}>
                フォント: Noto Sans JP | サブセット: japanese | 文字: ひらがな、カタカナ、漢字
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🎯 实际应用：多语言组件</h2>
          <pre className={styles.code}>
{`'use client';

import { useState } from 'react';
import { inter, notoSansSC, notoSansJP } from '@/app/fonts';

const content = {
  en: {
    title: 'Welcome',
    text: 'This is English content.',
    font: inter.className,
  },
  zh: {
    title: '欢迎',
    text: '这是中文内容。',
    font: notoSansSC.className,
  },
  ja: {
    title: 'ようこそ',
    text: 'これは日本語のコンテンツです。',
    font: notoSansJP.className,
  },
};

export default function MultiLangComponent() {
  const [locale, setLocale] = useState('en');
  const current = content[locale];
  
  return (
    <div>
      <div>
        <button onClick={() => setLocale('en')}>English</button>
        <button onClick={() => setLocale('zh')}>中文</button>
        <button onClick={() => setLocale('ja')}>日本語</button>
      </div>
      
      <div className={current.font}>
        <h2>{current.title}</h2>
        <p>{current.text}</p>
      </div>
    </div>
  );
}`}
          </pre>

          <div className={styles.interactive}>
            <MultiLangDemo />
          </div>
        </section>

        <section className={styles.section}>
          <h2>📊 字体子集大小对比</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>语言</th>
                <th>字体</th>
                <th>子集</th>
                <th>大约体积</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>英文</td>
                <td>Inter</td>
                <td>latin</td>
                <td>~100 KB</td>
              </tr>
              <tr>
                <td>简体中文</td>
                <td>Noto Sans SC</td>
                <td>chinese-simplified</td>
                <td>~1.5 MB</td>
              </tr>
              <tr>
                <td>日文</td>
                <td>Noto Sans JP</td>
                <td>japanese</td>
                <td>~1.8 MB</td>
              </tr>
              <tr>
                <td>韩文</td>
                <td>Noto Sans KR</td>
                <td>korean</td>
                <td>~1.2 MB</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.note}>
            注：使用字体子集后，体积比完整字体（10MB+）大幅减小
          </p>
        </section>

        <section className={styles.section}>
          <h2>💡 优化策略</h2>
          <Spacing flex direction="column" gap={12}>
            <div className={styles.tip}>
              <strong>1. 按需加载语言字体</strong>
              <p>
                只加载用户当前选择的语言字体，而不是一次性加载所有语言。
                可以使用动态导入（dynamic import）实现懒加载。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>2. 优先加载主要语言</strong>
              <p>
                对于多语言网站，优先加载主要语言（如英文）的字体，
                次要语言字体可以延迟加载。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>3. 使用 CDN 分发</strong>
              <p>
                将字体文件部署到 CDN，利用地理位置优势加速加载。
                next/font 会自动将字体文件放在 public 目录，方便 CDN 分发。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>4. 配置合适的 fallback</strong>
              <p>
                为每种语言配置合适的系统字体作为 fallback，
                确保在字体加载失败时仍有良好的显示效果。
              </p>
            </div>
          </Spacing>
        </section>

        <section className={styles.section}>
          <h2>🌐 fallback 字体配置建议</h2>
          <pre className={styles.code}>
{`/* 中文 fallback 链 */
font-family: 
  'Noto Sans SC',           /* Google 字体 */
  'PingFang SC',            /* macOS/iOS 默认中文字体 */
  'Microsoft YaHei',        /* Windows 默认中文字体 */
  'Hiragino Sans GB',       /* macOS 旧版中文字体 */
  'SimHei',                 /* Windows 备用字体 */
  sans-serif;               /* 最终备用 */

/* 日文 fallback 链 */
font-family: 
  'Noto Sans JP',
  'Hiragino Kaku Gothic Pro',
  'Yu Gothic',
  'Meiryo',
  sans-serif;

/* 韩文 fallback 链 */
font-family: 
  'Noto Sans KR',
  'Malgun Gothic',
  'Apple SD Gothic Neo',
  sans-serif;`}
          </pre>
        </section>
      </Spacing>
    </div>
  );
}

// 交互式演示组件
function MultiLangDemo() {
  const [locale, setLocale] = useState<'en' | 'zh' | 'ja'>('en');
  
  const content = {
    en: {
      title: 'Welcome',
      text: 'This is English content using Inter font.',
      font: inter.className,
    },
    zh: {
      title: '欢迎',
      text: '这是使用思源黑体的中文内容。',
      font: notoSansSC.className,
    },
    ja: {
      title: 'ようこそ',
      text: 'これは Noto Sans JP を使用した日本語のコンテンツです。',
      font: notoSansJP.className,
    },
  };
  
  const current = content[locale];
  
  return (
    <Spacing flex direction="column" gap={12}>
      <Spacing flex direction="row" gap={12}>
        <button 
          className={locale === 'en' ? styles.active : ''}
          onClick={() => setLocale('en')}
        >
          English
        </button>
        <button 
          className={locale === 'zh' ? styles.active : ''}
          onClick={() => setLocale('zh')}
        >
          中文
        </button>
        <button 
          className={locale === 'ja' ? styles.active : ''}
          onClick={() => setLocale('ja')}
        >
          日本語
        </button>
      </Spacing>
      
      <div className={`${current.font} ${styles.demoContent}`}>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
      </div>
    </Spacing>
  );
}

'use client';
import { useState } from 'react';

