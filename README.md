# 第二十章：字体优化 - next/font 与自定义字体

> 全面掌握 Next.js 13+ 的字体优化方案，实现极致的加载性能和用户体验

## 📚 目录

- [核心概念](#核心概念)
- [快速开始](#快速开始)
- [示例导航](#示例导航)
- [详细教程](#详细教程)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 🎯 核心概念

### 为什么需要字体优化？

字体文件是影响网页性能的重要因素：

- **体积大**：英文字体 50-200KB，中文字体可达数 MB
- **加载慢**：字体下载会阻塞渲染，影响首屏速度
- **用户体验差**：可能出现 FOIT（闪烁不可见文本）或 FOUT（闪烁无样式文本）
- **布局偏移**：字体加载后可能导致 CLS（累积布局偏移）

### Next.js 字体优化方案

**传统方式的问题：**
```css
/* 传统 @font-face 方式 */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/font.woff2') format('woff2');
}
```
❌ 需要手动优化  
❌ 容易出现 FOIT/CLS  
❌ 难以管理多字体  
❌ 无自动子集化  

**next/font 的优势：**

✅ 自动优化字体加载  
✅ 零布局偏移（Zero CLS）  
✅ 自动字体子集化  
✅ 内置预加载  
✅ 支持 Google Fonts 和本地字体  
✅ 类型安全  

---

## 🚀 快速开始

### 1. 配置字体

创建 `app/fonts.ts` 文件：

```typescript
import { Inter, Noto_Sans_SC } from 'next/font/google';

// 配置英文字体
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// 配置中文字体
export const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
});
```

### 2. 在 Layout 中使用

```typescript
// app/layout.tsx
import { inter, notoSansSC } from './fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="zh" className={`${inter.variable} ${notoSansSC.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 3. 在组件中使用

```typescript
import { notoSansSC } from '@/app/fonts';

export default function Page() {
  return (
    <div className={notoSansSC.className}>
      这段文字使用思源黑体
    </div>
  );
}
```

---

## 📖 示例导航

本章包含 5 个完整示例，从基础到高级逐步深入：

### 1️⃣ [基础字体加载](app/20-font-optimization/basic)
**学习内容：**
- next/font 基本使用
- 字体配置参数详解
- className 和 variable 的区别
- 字体显示策略（display）

**关键代码：**
```typescript
const inter = Inter({
  subsets: ['latin'],       // 字体子集
  weight: ['400', '700'],   // 字体粗细
  display: 'swap',          // 显示策略
  variable: '--font-inter', // CSS 变量
});
```

**适用场景：** 新项目接入 next/font，基础字体配置

---

### 2️⃣ [Google Fonts 使用](app/20-font-optimization/google-fonts)
**学习内容：**
- 加载多个 Google Fonts
- 多字重配置
- 中英文字体组合
- 字体效果对比展示

**关键代码：**
```typescript
// 英文字体
const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ subsets: ['latin'] });

// 中文字体
const notoSansSC = Noto_Sans_SC({ 
  subsets: ['chinese-simplified'] 
});
```

**亮点：**
- ✨ 展示 Inter、Roboto、Noto Sans SC 三种字体效果
- ✨ 多语言场景下的字体选择策略
- ✨ 性能对比：传统方式 vs next/font

**适用场景：** 多语言网站、需要多种字体风格的项目

---

### 3️⃣ [本地自定义字体](app/20-font-optimization/local-fonts)
**学习内容：**
- 使用 localFont 加载本地字体
- 多字重、多样式配置
- 字体文件格式选择（woff2）
- 字体授权与合规
- 字体子集化技术

**目录结构：**
```
public/
  fonts/
    Brand-Regular.woff2
    Brand-Bold.woff2
    Brand-Italic.woff2
```

**关键代码：**
```typescript
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
  ],
  display: 'swap',
  variable: '--font-brand',
  fallback: ['system-ui', 'sans-serif'],
});
```

**实际应用场景：**
- 🎨 企业品牌字体统一
- 🎨 特殊设计字体（手写体、艺术字）
- 🎨 自定义图标字体

**字体优化工具：**
- **fonttools**：字体子集化、格式转换
- **glyphhanger**：自动分析网页用到的字符
- **transfonter**：在线字体格式转换

**适用场景：** 企业官网、品牌推广页、需要特殊设计字体的项目

---

### 4️⃣ [多语言字体支持](app/20-font-optimization/multi-language)
**学习内容：**
- 多语言字体配置策略
- 字体子集化原理
- 动态字体切换
- 不同语言的字体大小对比
- fallback 字体配置

**支持语言：**
- 🇺🇸 英文（Inter）
- 🇨🇳 简体中文（Noto Sans SC）
- 🇯🇵 日文（Noto Sans JP）

**关键代码：**
```typescript
// 根据语言动态选择字体
function getLocaleFont(locale: string) {
  switch (locale) {
    case 'zh':
      return notoSansSC.className;
    case 'ja':
      return notoSansJP.className;
    default:
      return inter.className;
  }
}
```

**字体子集大小对比：**
| 语言 | 字体 | 子集 | 大约体积 |
|------|------|------|----------|
| 英文 | Inter | latin | ~100 KB |
| 简体中文 | Noto Sans SC | chinese-simplified | ~1.5 MB |
| 日文 | Noto Sans JP | japanese | ~1.8 MB |

**优化策略：**
1. 按需加载语言字体（懒加载）
2. 优先加载主要语言
3. CDN 分发加速
4. 配置合适的 fallback

**fallback 配置建议：**
```css
/* 中文 fallback 链 */
font-family: 
  'Noto Sans SC',       /* Google 字体 */
  'PingFang SC',        /* macOS/iOS */
  'Microsoft YaHei',    /* Windows */
  'Hiragino Sans GB',   /* macOS 旧版 */
  sans-serif;
```

**适用场景：** 国际化项目、多语言网站、跨地区应用

---

### 5️⃣ [动态字体切换与主题](app/20-font-optimization/theme-switcher)
**学习内容：**
- React State 控制字体切换
- CSS 变量实现字体主题
- 暗黑模式字体优化
- 用户偏好持久化
- 字体加载状态管理

**交互式演示：**
- 🎮 实时切换字体主题（Inter / Roboto / 思源黑体）
- 🎮 切换颜色模式（浅色 / 暗黑）
- 🎮 查看不同组合的效果

**关键代码：**

**1. 使用 State 切换：**
```typescript
const [fontTheme, setFontTheme] = useState('inter');

const fontClasses = {
  inter: inter.className,
  roboto: roboto.className,
  noto: notoSansSC.className,
};

<div className={fontClasses[fontTheme]}>
  内容
</div>
```

**2. 使用 CSS 变量：**
```css
:root {
  --font-primary: var(--font-inter);
}

.theme-modern { --font-primary: var(--font-inter); }
.theme-classic { --font-primary: var(--font-roboto); }

body {
  font-family: var(--font-primary), sans-serif;
}
```

**3. 持久化用户偏好：**
```typescript
// 保存到 localStorage
const handleFontChange = (theme: string) => {
  setFontTheme(theme);
  localStorage.setItem('fontTheme', theme);
};

// 读取用户偏好
useEffect(() => {
  const saved = localStorage.getItem('fontTheme');
  if (saved) setFontTheme(saved);
}, []);
```

**暗黑模式优化：**
```css
.dark body {
  /* 暗黑模式下增加字重，提升可读性 */
  font-weight: 450;
  letter-spacing: 0.01em;
}
```

**高级技巧：**
- 根据内容语言自动切换字体
- 响应式字体大小（clamp）
- 字体加载状态显示
- 性能监控（Font Loading API）

**适用场景：** 需要主题切换的应用、个性化设置、多品牌系统

---

## 💡 最佳实践

### 1. 字体选择原则

✅ **DO - 推荐做法：**
- 使用 `next/font` 管理所有字体
- 优先使用 Google Fonts（免费、优质）
- 英文字体选择 Inter、Roboto 等现代字体
- 中文字体选择思源黑体系列
- 设置 `display: 'swap'` 避免 FOIT

❌ **DON'T - 避免做法：**
- 直接使用 `@font-face`（失去自动优化）
- 加载过多字体（影响性能）
- 使用未授权的商业字体
- 忽略字体子集化

### 2. 性能优化策略

**字体子集化：**
```typescript
// 只加载拉丁字符
const inter = Inter({ subsets: ['latin'] });

// 只加载简体中文字符
const notoSansSC = Noto_Sans_SC({ 
  subsets: ['chinese-simplified'] 
});
```

**字重选择：**
```typescript
// ❌ 加载所有字重（影响性能）
weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']

// ✅ 只加载需要的字重
weight: ['400', '700']  // 常规 + 粗体

// ✅ 或使用可变字体
weight: 'variable'
```

**预加载关键字体：**
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. 字体回退配置

**多级 fallback：**
```typescript
export const brandFont = localFont({
  src: './fonts/Brand.woff2',
  fallback: [
    'system-ui',           // 系统默认
    '-apple-system',       // macOS/iOS
    'BlinkMacSystemFont',  // macOS Chrome
    'Segoe UI',            // Windows
    'Roboto',              // Android
    'sans-serif',          // 最终备用
  ],
});
```

### 4. 代码组织

**推荐的目录结构：**
```
app/
  fonts.ts              ← 集中管理所有字体
  layout.tsx            ← 全局字体配置
  20-font-optimization/
    basic/
      page.tsx
    google-fonts/
      page.tsx
    local-fonts/
      page.tsx
    multi-language/
      page.tsx
    theme-switcher/
      page.tsx
public/
  fonts/                ← 本地字体文件
    Brand-Regular.woff2
    Brand-Bold.woff2
styles/
  font-optimization/    ← 字体相关样式
    BasicPage.module.css
    ...
```

### 5. 字体授权与合规

**Google Fonts：**
- ✅ 完全免费，可用于商业项目
- ✅ 开源授权（SIL Open Font License）
- ✅ 无需额外授权费用

**商业字体：**
- ⚠️ 需购买授权（如方正、汉仪等）
- ⚠️ 注意授权范围（网页端、app 端等）
- ⚠️ 保留授权证明文件

**字体子集化合规：**
- ✅ 多数字体授权允许子集化
- ⚠️ 部分字体禁止修改，需仔细阅读授权条款

### 6. 测试与监控

**性能测试工具：**
- **Lighthouse**：检查字体加载性能和 CLS
- **WebPageTest**：详细分析字体加载时间线
- **Chrome DevTools**：Network 面板查看字体加载

**关键指标：**
- **FCP (First Contentful Paint)**：首次内容绘制
- **LCP (Largest Contentful Paint)**：最大内容绘制
- **CLS (Cumulative Layout Shift)**：累积布局偏移
- **字体加载时间**：应控制在 1 秒内

---

## 🔧 技术细节

### 字体加载流程

```mermaid
graph LR
    A[页面请求] --> B[Next.js 服务器]
    B --> C[next/font 生成字体 CSS]
    C --> D[浏览器解析 CSS]
    D --> E[下载字体文件]
    E --> F[应用字体样式]
    F --> G[渲染页面]
    
    style C fill:#10b981
    style F fill:#10b981
```

### display 参数详解

| 值 | 行为 | 适用场景 |
|----|------|---------|
| `swap` | 立即显示 fallback，字体加载后切换 | **推荐**，适合大多数场景 |
| `optional` | 字体加载超时则放弃 | 弱网环境 |
| `block` | 阻塞渲染直到字体加载 | 品牌要求极高的场景 |
| `fallback` | 短暂阻塞后显示 fallback | 平衡性能和品牌 |
| `auto` | 浏览器默认行为 | 不推荐 |

**推荐配置：**
```typescript
{
  display: 'swap',  // 99% 的场景都应该用 swap
}
```

### 字体子集化原理

**完整字体 vs 子集字体：**

```
完整 Noto Sans SC：
- 包含所有汉字（20000+ 字符）
- 文件大小：10-15 MB
- 加载时间：3-10 秒（3G 网络）

子集化后：
- 只包含常用汉字（3500 字符）
- 文件大小：500 KB - 1.5 MB
- 加载时间：<1 秒
```

**手动子集化工具：**

```bash
# 安装 fonttools
pip install fonttools brotli

# 提取常用汉字
pyftsubset Font.ttf \
  --text-file=common-3500.txt \
  --output-file=Font-subset.woff2 \
  --flavor=woff2 \
  --layout-features="*"

# 转换格式
fonttools ttLib.woff2 compress Font.ttf
```

---

## ❓ 常见问题

### Q1: 为什么字体加载很慢？

**可能原因：**
1. 字体文件过大（未子集化）
2. 网络问题（CDN 配置不当）
3. 加载了过多字体或字重
4. 未配置预连接

**解决方案：**
```typescript
// 1. 使用子集化
const font = Noto_Sans_SC({ 
  subsets: ['chinese-simplified']  // 而不是完整字体
});

// 2. 只加载需要的字重
weight: ['400', '700']  // 而不是全部字重

// 3. 预连接 CDN
<link rel="preconnect" href="https://fonts.gstatic.com" />
```

---

### Q2: 出现字体闪烁（FOIT/FOUT）怎么办？

**FOIT（Flash of Invisible Text）：**
- 现象：文字先不可见，字体加载后才显示
- 原因：`display: 'block'`

**FOUT（Flash of Unstyled Text）：**
- 现象：先显示 fallback 字体，加载后切换
- 原因：`display: 'swap'`

**推荐方案：**
```typescript
{
  display: 'swap',  // 使用 swap，确保文字立即可见
  fallback: ['system-ui', 'sans-serif'],  // 配置相似的 fallback
}
```

---

### Q3: 如何处理布局偏移（CLS）？

**原因：**
字体加载后，文字大小、行高变化导致布局跳动。

**解决方案：**

使用 `next/font` 自动处理（推荐）：
```typescript
// next/font 会自动生成优化的 CSS
const inter = Inter({ subsets: ['latin'] });
// 应用 inter.className 后，自动避免 CLS
```

手动调整 fallback 字体：
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2');
  /* 调整 fallback 字体的 size-adjust */
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

---

### Q4: 中文字体体积太大怎么办？

**问题：**
完整中文字体 10MB+，严重影响性能。

**解决方案：**

**1. 使用 Google Fonts 子集（推荐）：**
```typescript
const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified'],  // 自动子集化到 1.5MB
});
```

**2. 手动子集化：**
```bash
# 只保留常用字
pyftsubset font.ttf \
  --text="常用的3500个汉字" \
  --output-file=font-subset.woff2 \
  --flavor=woff2
```

**3. 动态加载：**
```typescript
// 只在需要时加载中文字体
const ChineseFont = dynamic(() => import('@/app/fonts').then(m => m.notoSansSC));
```

---

### Q5: 如何支持多语言字体？

**策略 1：动态切换（推荐）**
```typescript
function getLocaleFont(locale: string) {
  switch (locale) {
    case 'zh': return notoSansSC.className;
    case 'ja': return notoSansJP.className;
    default: return inter.className;
  }
}
```

**策略 2：CSS 变量**
```typescript
// layout.tsx
<html className={`${inter.variable} ${notoSansSC.variable}`}>

// CSS
.lang-en { font-family: var(--font-inter); }
.lang-zh { font-family: var(--font-noto-sans-sc); }
```

---

### Q6: 本地字体和 Google Fonts 如何选择?

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 英文网站 | Google Fonts | 免费、优质、自动优化 |
| 中文网站 | Google Fonts（思源黑体） | 开源、免费、优化好 |
| 企业品牌 | 本地字体 | 品牌统一、授权可控 |
| 特殊设计 | 本地字体 | Google Fonts 可能没有 |

**混合使用：**
```typescript
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] });
const brandFont = localFont({ src: './Brand.woff2' });

// 英文用 Google Fonts，标题用品牌字体
<body className={inter.className}>
  <h1 className={brandFont.className}>品牌标题</h1>
  <p>正文内容</p>
</body>
```

---

### Q7: 如何在暗黑模式下优化字体？

**问题：**
暗黑模式下，相同字重的字体看起来更细。

**解决方案：**

```css
/* 浅色模式 */
.light {
  --font-weight-normal: 400;
  --font-weight-bold: 700;
}

/* 暗黑模式 - 增加字重 */
.dark {
  --font-weight-normal: 450;
  --font-weight-bold: 750;
  letter-spacing: 0.01em;  /* 稍微增加字间距 */
}

body {
  font-weight: var(--font-weight-normal);
}
```

---

### Q8: 如何监控字体加载性能？

**方法 1：Chrome DevTools**
```
1. 打开 DevTools
2. Network 面板，筛选 "Font"
3. 查看每个字体的加载时间
```

**方法 2：Font Loading API**
```typescript
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    console.log('所有字体已加载');
  });
  
  // 监控特定字体
  document.fonts.load('16px Inter').then(() => {
    console.log('Inter 已加载');
  });
}
```

**方法 3：Performance Observer**
```typescript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('font')) {
      console.log('字体加载时间:', entry.duration);
    }
  }
});
observer.observe({ entryTypes: ['resource'] });
```

---

### Q9: 字体文件应该放在哪里？

**Google Fonts：**
- ✅ 自动处理，无需手动放置

**本地字体：**
```
推荐：public/fonts/
- 优点：可直接访问，CDN 友好
- 路径：/fonts/font.woff2

不推荐：app/fonts/ 或 src/fonts/
- 原因：需要额外配置，不利于 CDN
```

**配置示例：**
```typescript
// ✅ 推荐
const font = localFont({
  src: '../public/fonts/font.woff2',
});

// ❌ 不推荐
const font = localFont({
  src: './fonts/font.woff2',
});
```

---

### Q10: 可以在 CSS 中使用字体变量吗？

**可以！推荐使用 CSS 变量方式：**

```typescript
// app/fonts.ts
export const inter = Inter({
  variable: '--font-inter',  // 定义 CSS 变量
  subsets: ['latin'],
});

// app/layout.tsx
<html className={inter.variable}>
  <body>{children}</body>
</html>

// styles/globals.css
body {
  font-family: var(--font-inter), sans-serif;
}

.heading {
  font-family: var(--font-inter);
  font-weight: 700;
}
```

**优势：**
- ✅ 更灵活，可在任何 CSS 中使用
- ✅ 更容易实现主题切换
- ✅ 支持 CSS-in-JS

---

## 🎓 学习路径建议

### 初学者
1. 从 **基础字体加载** 开始，理解 next/font 的基本概念
2. 学习 **Google Fonts 使用**，掌握最常用的场景
3. 实践：为自己的项目添加一个 Google Font

### 进阶开发者
1. 学习 **本地自定义字体**，了解企业级应用需求
2. 掌握 **多语言字体支持**，理解国际化场景
3. 实践：为多语言项目配置合适的字体方案

### 高级开发者
1. 研究 **动态字体切换与主题**，实现复杂交互
2. 深入字体子集化、性能优化
3. 实践：构建一个完整的字体管理系统

---

## 📦 项目运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 http://localhost:3000/20-font-optimization 查看所有示例

### 生产构建
```bash
npm run build
npm start
```

---

## 🔗 相关资源

### 官方文档
- [Next.js - Optimizing Fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Google Fonts](https://fonts.google.com/)

### 字体资源
- [Google Fonts](https://fonts.google.com/) - 免费开源字体
- [Adobe Fonts](https://fonts.adobe.com/) - Adobe 订阅用户免费
- [思源黑体](https://github.com/adobe-fonts/source-han-sans) - 开源中文字体

### 工具
- [fonttools](https://github.com/fonttools/fonttools) - 字体子集化工具
- [glyphhanger](https://github.com/filamentgroup/glyphhanger) - 字符分析工具
- [Transfonter](https://transfonter.org/) - 在线字体转换

### 性能测试
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

## 📝 总结

通过本章学习，你应该掌握：

✅ Next.js 字体优化的核心原理  
✅ next/font 的完整使用方法  
✅ Google Fonts 和本地字体的配置  
✅ 多语言字体支持策略  
✅ 动态字体切换与主题管理  
✅ 字体性能优化最佳实践  
✅ 常见问题的解决方案  

**关键要点：**
1. 始终使用 `next/font`，避免手动 `@font-face`
2. 设置 `display: 'swap'` 确保文字可见
3. 使用字体子集化减少文件体积
4. 配置合适的 fallback 字体
5. 注意字体授权与合规
6. 持续监控字体加载性能

---

## 📧 反馈与贡献

如有问题或建议，欢迎提 Issue 或 Pull Request！

---

**Happy Coding! 🚀**
