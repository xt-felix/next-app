import Link from 'next/link';
import Spacing from '@/components/common/Spacing';
import styles from '@/styles/font-optimization/Page.module.css';

export default function FontOptimizationPage() {
  return (
    <div className={styles.container}>
      <h1>第二十章：字体优化 - next/font 与自定义字体</h1>
      
      <Spacing flex direction="column" gap={32}>
        <section className={styles.section}>
          <h2>📚 核心概念</h2>
          <p>
            Next.js 13+ 引入的 <code>next/font</code> 模块提供了强大的字体优化能力：
          </p>
          <ul>
            <li>🚀 自动字体优化，避免布局偏移（CLS）</li>
            <li>📦 字体子集化，只加载需要的字符</li>
            <li>⚡ 内置预加载和预连接</li>
            <li>🎨 支持 Google Fonts 和本地字体</li>
            <li>🌍 多语言字体支持</li>
            <li>🎭 字体变量和动态切换</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>🎯 示例导航</h2>
          <Spacing flex direction="column" gap={12}>
            <Link href="/20-font-optimization/basic">
              <button>1. 基础字体加载</button>
            </Link>
            <Link href="/20-font-optimization/google-fonts">
              <button>2. Google Fonts 使用</button>
            </Link>
            <Link href="/20-font-optimization/local-fonts">
              <button>3. 本地自定义字体</button>
            </Link>
            <Link href="/20-font-optimization/multi-language">
              <button>4. 多语言字体支持</button>
            </Link>
            <Link href="/20-font-optimization/theme-switcher">
              <button>5. 动态字体切换与主题</button>
            </Link>
          </Spacing>
        </section>

        <section className={styles.section}>
          <h2>💡 最佳实践</h2>
          <ol>
            <li>优先使用 <code>next/font</code> 管理所有字体</li>
            <li>设置 <code>display: 'swap'</code> 避免字体闪烁</li>
            <li>使用字体子集化减少文件体积</li>
            <li>配置多级字体回退保证兼容性</li>
            <li>通过 CSS 变量实现灵活的字体切换</li>
            <li>预连接字体 CDN 减少加载延迟</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>⚠️ 常见问题</h2>
          <Spacing flex direction="column" gap={12}>
            <div>
              <strong>Q: 为什么字体加载慢？</strong>
              <p>A: 检查字体文件大小、是否配置子集化、CDN 是否正确配置</p>
            </div>
            <div>
              <strong>Q: 出现布局偏移怎么办？</strong>
              <p>A: 使用 <code>next/font</code> 自动生成的 CSS 类名，设置正确的 fallback 字体</p>
            </div>
            <div>
              <strong>Q: 如何支持多语言？</strong>
              <p>A: 为不同语言配置对应的字体子集，如 chinese-simplified、japanese 等</p>
            </div>
          </Spacing>
        </section>
      </Spacing>
    </div>
  );
}

