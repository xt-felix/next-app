'use client';

import { useState } from 'react';
import { inter, roboto, notoSansSC } from '@/app/fonts';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/font-optimization/ThemeSwitcherPage.module.css';

type FontTheme = 'inter' | 'roboto' | 'noto';

export default function ThemeSwitcherPage() {
  const [fontTheme, setFontTheme] = useState<FontTheme>('inter');
  const [darkMode, setDarkMode] = useState(false);

  const fontClasses = {
    inter: inter.className,
    roboto: roboto.className,
    noto: notoSansSC.className,
  };

  const currentFontClass = fontClasses[fontTheme];

  return (
    <div className={darkMode ? styles.dark : styles.light}>
      <div className={styles.container}>
        <h1>动态字体切换与主题</h1>

        <Spacing flex direction="column" gap={32}>
          <section className={styles.section}>
            <h2>📖 概念讲解</h2>
            <p>
              现代 Web 应用常需要支持动态主题切换，包括暗黑模式、品牌主题、
              个性化设置等。字体作为视觉设计的重要组成部分，
              也需要支持动态切换能力。
            </p>
            <ul>
              <li>通过 CSS 变量实现灵活的字体切换</li>
              <li>支持暗黑模式下的字体优化</li>
              <li>结合状态管理实现全局字体主题</li>
              <li>保存用户偏好设置</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>🎮 交互式演示</h2>
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <h3>字体主题</h3>
                <Spacing flex direction="row" gap={12}>
                  <button
                    className={fontTheme === 'inter' ? styles.active : ''}
                    onClick={() => setFontTheme('inter')}
                  >
                    Inter
                  </button>
                  <button
                    className={fontTheme === 'roboto' ? styles.active : ''}
                    onClick={() => setFontTheme('roboto')}
                  >
                    Roboto
                  </button>
                  <button
                    className={fontTheme === 'noto' ? styles.active : ''}
                    onClick={() => setFontTheme('noto')}
                  >
                    思源黑体
                  </button>
                </Spacing>
              </div>

              <div className={styles.controlGroup}>
                <h3>颜色主题</h3>
                <Spacing flex direction="row" gap={12}>
                  <button
                    className={!darkMode ? styles.active : ''}
                    onClick={() => setDarkMode(false)}
                  >
                    ☀️ 浅色模式
                  </button>
                  <button
                    className={darkMode ? styles.active : ''}
                    onClick={() => setDarkMode(true)}
                  >
                    🌙 暗黑模式
                  </button>
                </Spacing>
              </div>
            </div>

            <div className={`${currentFontClass} ${styles.preview}`}>
              <h2>效果预览</h2>
              <p>
                The quick brown fox jumps over the lazy dog.
                快速的棕色狐狸跳过懒狗。
                这段文字会根据你选择的字体主题和颜色模式动态变化。
              </p>
              <p>
                当前字体：<strong>{fontTheme}</strong> | 
                当前模式：<strong>{darkMode ? '暗黑' : '浅色'}</strong>
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>💻 代码实现</h2>

            <h3>1. 使用 React State 切换字体</h3>
            <pre className={styles.code}>
{`'use client';

import { useState } from 'react';
import { inter, roboto, notoSansSC } from '@/app/fonts';

export default function ThemeSwitcher() {
  const [fontTheme, setFontTheme] = useState('inter');
  
  const fontClasses = {
    inter: inter.className,
    roboto: roboto.className,
    noto: notoSansSC.className,
  };
  
  return (
    <div className={fontClasses[fontTheme]}>
      <button onClick={() => setFontTheme('inter')}>Inter</button>
      <button onClick={() => setFontTheme('roboto')}>Roboto</button>
      <button onClick={() => setFontTheme('noto')}>思源黑体</button>
      
      <div>
        这段文字使用 {fontTheme} 字体
      </div>
    </div>
  );
}`}
            </pre>

            <h3>2. 使用 CSS 变量切换字体</h3>
            <pre className={styles.code}>
{`// app/layout.tsx
import { inter, roboto, notoSansSC } from './fonts';

export default function RootLayout({ children }) {
  return (
    <html 
      className={\`
        \${inter.variable} 
        \${roboto.variable} 
        \${notoSansSC.variable}
      \`}
    >
      <body>{children}</body>
    </html>
  );
}

// styles/globals.css
:root {
  --font-primary: var(--font-inter);
  --font-secondary: var(--font-roboto);
  --font-chinese: var(--font-noto-sans-sc);
}

.theme-modern {
  --font-primary: var(--font-inter);
}

.theme-classic {
  --font-primary: var(--font-roboto);
}

.theme-chinese {
  --font-primary: var(--font-noto-sans-sc);
}

body {
  font-family: var(--font-primary), sans-serif;
}`}
            </pre>

            <h3>3. 结合主题 Context</h3>
            <pre className={styles.code}>
{`// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FontTheme = 'inter' | 'roboto' | 'noto';

interface ThemeContextValue {
  fontTheme: FontTheme;
  setFontTheme: (theme: FontTheme) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [fontTheme, setFontTheme] = useState<FontTheme>('inter');
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <ThemeContext.Provider 
      value={{ fontTheme, setFontTheme, darkMode, setDarkMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 使用示例
export default function Page() {
  const { fontTheme, setFontTheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => setFontTheme('inter')}>Inter</button>
      <button onClick={() => setFontTheme('roboto')}>Roboto</button>
    </div>
  );
}`}
            </pre>

            <h3>4. 持久化用户偏好</h3>
            <pre className={styles.code}>
{`'use client';

import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const [fontTheme, setFontTheme] = useState('inter');
  
  // 从 localStorage 读取用户偏好
  useEffect(() => {
    const saved = localStorage.getItem('fontTheme');
    if (saved) {
      setFontTheme(saved);
    }
  }, []);
  
  // 保存用户偏好
  const handleFontChange = (theme: string) => {
    setFontTheme(theme);
    localStorage.setItem('fontTheme', theme);
  };
  
  return (
    <div>
      <button onClick={() => handleFontChange('inter')}>Inter</button>
      <button onClick={() => handleFontChange('roboto')}>Roboto</button>
    </div>
  );
}`}
            </pre>
          </section>

          <section className={styles.section}>
            <h2>🎨 暗黑模式字体优化</h2>
            <p>
              在暗黑模式下，字体的渲染效果会有所不同，
              可能需要调整字重或字间距来保证可读性。
            </p>
            <pre className={styles.code}>
{`/* styles/globals.css */

/* 浅色模式 */
.light {
  background: #ffffff;
  color: #000000;
}

.light body {
  font-weight: 400;
  letter-spacing: 0;
}

/* 暗黑模式 */
.dark {
  background: #1a1a1a;
  color: #ffffff;
}

.dark body {
  /* 暗黑模式下稍微增加字重，提升可读性 */
  font-weight: 450;
  letter-spacing: 0.01em;
}

/* 暗黑模式下的标题优化 */
.dark h1, .dark h2, .dark h3 {
  font-weight: 600;
  letter-spacing: -0.02em;
}`}
            </pre>
          </section>

          <section className={styles.section}>
          <h2>💡 最佳实践</h2>
          <Spacing flex direction="column" gap={12}>
            <div className={styles.tip}>
              <strong>1. 提供合理的默认值</strong>
              <p>
                根据用户的系统偏好（如 prefers-color-scheme）
                自动设置初始主题，而不是硬编码默认值。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>2. 平滑过渡动画</strong>
              <p>
                字体切换时添加过渡动画，提升用户体验。
                但要注意性能，避免动画导致的重排。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>3. 预加载所有主题字体</strong>
              <p>
                如果应用支持多个字体主题，最好在 layout 中预加载所有字体，
                避免切换时的加载延迟。
              </p>
            </div>
            <div className={styles.tip}>
              <strong>4. 无障碍考虑</strong>
              <p>
                确保所有字体主题都有足够的对比度，
                支持屏幕阅读器和键盘操作。
              </p>
            </div>
          </Spacing>
        </section>

          <section className={styles.section}>
            <h2>🔧 高级技巧</h2>
            
            <h3>1. 根据内容语言自动切换字体</h3>
            <pre className={styles.code}>
{`function getOptimalFont(text: string) {
  // 检测是否包含中文字符
  if (/[\u4e00-\u9fa5]/.test(text)) {
    return notoSansSC.className;
  }
  // 检测是否包含日文字符
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return notoSansJP.className;
  }
  // 默认英文字体
  return inter.className;
}

export default function SmartText({ children }: { children: string }) {
  const fontClass = getOptimalFont(children);
  return <span className={fontClass}>{children}</span>;
}`}
            </pre>

            <h3>2. 响应式字体大小</h3>
            <pre className={styles.code}>
{`/* 使用 CSS clamp 实现响应式字体 */
.responsive-text {
  font-size: clamp(1rem, 2vw + 0.5rem, 2rem);
}

/* 或使用 CSS 变量配合媒体查询 */
:root {
  --font-size-base: 16px;
  --font-size-lg: 18px;
}

@media (min-width: 768px) {
  :root {
    --font-size-base: 18px;
    --font-size-lg: 20px;
  }
}

body {
  font-size: var(--font-size-base);
}`}
            </pre>

            <h3>3. 字体加载状态显示</h3>
            <pre className={styles.code}>
{`'use client';

import { useState, useEffect } from 'react';

export default function FontLoader() {
  const [fontLoaded, setFontLoaded] = useState(false);
  
  useEffect(() => {
    // 检测字体是否加载完成
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    });
  }, []);
  
  return (
    <div>
      {!fontLoaded && <div>加载字体中...</div>}
      <div className={fontLoaded ? 'font-loaded' : ''}>
        内容
      </div>
    </div>
  );
}`}
            </pre>
          </section>

          <section className={styles.section}>
            <h2>📊 性能监控</h2>
            <p>使用 Web Font Loading API 监控字体加载性能：</p>
            <pre className={styles.code}>
{`// 监控字体加载时间
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    console.log('所有字体已加载');
  });
  
  // 监控特定字体
  const font = new FontFace(
    'Inter',
    'url(/fonts/inter.woff2)',
    { weight: '400' }
  );
  
  font.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
    console.log('Inter 字体已加载');
  }).catch((error) => {
    console.error('字体加载失败:', error);
  });
}`}
            </pre>
          </section>
        </Spacing>
      </Spacing>
    </div>
  );
}

