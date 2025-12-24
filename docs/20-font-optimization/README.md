# 第二十章：字体优化 - next/font 与自定义字体

## 📚 章节概述

本章全面讲解 Next.js 13+ 的字体优化方案，通过 5 个完整示例，从基础到高级逐步深入，帮助你掌握企业级字体优化技术。

## 🎯 学习目标

完成本章学习后，你将掌握：

- ✅ next/font 的核心原理和使用方法
- ✅ Google Fonts 的最佳实践
- ✅ 本地自定义字体的配置和优化
- ✅ 多语言字体支持策略
- ✅ 动态字体切换和主题管理
- ✅ 字体性能优化技巧
- ✅ 常见问题的解决方案

## 📂 项目结构

```
app/
  fonts.ts                          # 字体配置文件
  20-font-optimization/
    page.tsx                        # 章节首页
    basic/
      page.tsx                      # 示例1：基础字体加载
    google-fonts/
      page.tsx                      # 示例2：Google Fonts 使用
    local-fonts/
      page.tsx                      # 示例3：本地自定义字体
    multi-language/
      page.tsx                      # 示例4：多语言字体支持
    theme-switcher/
      page.tsx                      # 示例5：动态字体切换与主题

styles/
  font-optimization/
    Page.module.css                 # 首页样式
    BasicPage.module.css            # 基础示例样式
    GoogleFontsPage.module.css      # Google Fonts 样式
    LocalFontsPage.module.css       # 本地字体样式
    MultiLanguagePage.module.css    # 多语言样式
    ThemeSwitcherPage.module.css    # 主题切换样式

public/
  fonts/
    README.md                       # 字体文件说明

docs/
  20-font-optimization/
    README.md                       # 本文档
```

## 🚀 快速开始

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问示例

打开浏览器访问：http://localhost:3000/20-font-optimization

### 3. 按顺序学习示例

1. **基础字体加载** - 理解 next/font 基本概念
2. **Google Fonts 使用** - 掌握最常用场景
3. **本地自定义字体** - 企业级应用需求
4. **多语言字体支持** - 国际化场景
5. **动态字体切换与主题** - 高级交互

## 💡 核心知识点

### 1. next/font 的优势

相比传统 `@font-face` 方式：

| 特性 | 传统方式 | next/font |
|------|---------|-----------|
| 自动优化 | ❌ 需手动配置 | ✅ 自动优化 |
| 布局偏移 | ⚠️ 易出现 CLS | ✅ 零 CLS |
| 字体子集化 | ❌ 手动处理 | ✅ 自动处理 |
| 预加载 | ❌ 需手动配置 | ✅ 内置支持 |
| 类型安全 | ❌ 无类型 | ✅ TypeScript |

### 2. 字体配置参数

```typescript
const font = Inter({
  subsets: ['latin'],       // 字体子集，减少体积
  weight: ['400', '700'],   // 字重选择
  display: 'swap',          // 显示策略，推荐 swap
  variable: '--font-inter', // CSS 变量名
  fallback: ['sans-serif'], // 备用字体
});
```

### 3. display 参数详解

| 值 | 行为 | 适用场景 |
|----|------|---------|
| `swap` | 立即显示 fallback，字体加载后切换 | **推荐**，大多数场景 |
| `optional` | 字体加载超时则放弃 | 弱网环境 |
| `block` | 阻塞渲染直到字体加载 | 品牌要求极高 |
| `fallback` | 短暂阻塞后显示 fallback | 平衡性能和品牌 |

### 4. 字体子集化

**为什么需要子集化？**

- 完整中文字体：10-15 MB
- 子集化后：500 KB - 1.5 MB
- 性能提升：10-20 倍

**如何配置：**

```typescript
// 英文字体
const inter = Inter({ subsets: ['latin'] });

// 中文字体
const notoSansSC = Noto_Sans_SC({ 
  subsets: ['chinese-simplified'] 
});

// 日文字体
const notoSansJP = Noto_Sans_JP({ 
  subsets: ['japanese'] 
});
```

## 🎓 示例详解

### 示例 1：基础字体加载

**学习重点：**
- next/font 基本使用流程
- className vs variable 的区别
- 字体配置参数详解

**核心代码：**

```typescript
// app/fonts.ts
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// app/layout.tsx
import { inter } from './fonts';

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

### 示例 2：Google Fonts 使用

**学习重点：**
- 加载多个 Google Fonts
- 中英文字体组合
- 字体效果对比

**亮点：**
- 展示 Inter、Roboto、Noto Sans SC 三种字体
- 多语言场景下的字体选择
- 性能对比分析

---

### 示例 3：本地自定义字体

**学习重点：**
- localFont 的使用
- 多字重配置
- 字体文件格式选择
- 字体授权与合规

**实际应用：**
- 企业品牌字体
- 特殊设计字体
- 自定义图标字体

**注意事项：**
1. 优先使用 woff2 格式
2. 确认字体授权
3. 配置 fallback 字体
4. 中文字体需子集化

---

### 示例 4：多语言字体支持

**学习重点：**
- 多语言字体配置策略
- 动态字体切换
- fallback 字体配置

**支持语言：**
- 🇺🇸 英文（Inter）
- 🇨🇳 简体中文（Noto Sans SC）
- 🇯🇵 日文（Noto Sans JP）

**优化策略：**
1. 按需加载语言字体
2. 优先加载主要语言
3. CDN 分发加速
4. 配置合适的 fallback

---

### 示例 5：动态字体切换与主题

**学习重点：**
- React State 控制字体切换
- CSS 变量实现字体主题
- 暗黑模式字体优化
- 用户偏好持久化

**交互功能：**
- 实时切换字体主题
- 切换颜色模式
- 查看不同组合效果

**高级技巧：**
- 根据内容语言自动切换字体
- 响应式字体大小
- 字体加载状态管理
- 性能监控

## ✅ 最佳实践清单

### 字体选择

- ✅ 优先使用 next/font 管理所有字体
- ✅ 英文字体选择 Inter、Roboto 等现代字体
- ✅ 中文字体选择思源黑体系列
- ✅ 设置 `display: 'swap'` 避免 FOIT
- ❌ 避免直接使用 `@font-face`

### 性能优化

- ✅ 使用字体子集化（subsets）
- ✅ 只加载需要的字重
- ✅ 配置多级 fallback 字体
- ✅ 预连接字体 CDN
- ❌ 避免加载过多字体

### 代码组织

- ✅ 在 `app/fonts.ts` 集中管理字体
- ✅ 使用 CSS 变量方便管理
- ✅ 为不同语言配置对应字体
- ✅ 保持代码结构清晰

### 授权合规

- ✅ Google Fonts 完全免费
- ✅ 商业字体需购买授权
- ✅ 保留授权证明文件
- ❌ 避免使用盗版字体

## 🐛 常见问题

### Q1: 字体加载慢？

**解决方案：**
1. 检查字体文件大小
2. 使用字体子集化
3. 配置 CDN 预连接
4. 只加载需要的字重

### Q2: 出现布局偏移？

**解决方案：**
1. 使用 next/font 自动优化
2. 设置 `display: 'swap'`
3. 配置相似的 fallback 字体

### Q3: 中文字体体积大？

**解决方案：**
1. 使用 Google Fonts 子集
2. 手动字体子集化
3. 动态加载字体

### Q4: 如何支持多语言？

**解决方案：**
1. 为不同语言配置对应字体
2. 动态切换字体
3. 使用 CSS 变量

## 📊 性能指标

优化后的字体加载应达到：

- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **字体加载时间**: < 1s

## 🔗 相关资源

### 官方文档
- [Next.js - Optimizing Fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Google Fonts](https://fonts.google.com/)

### 字体资源
- [Google Fonts](https://fonts.google.com/) - 免费开源字体
- [思源黑体](https://github.com/adobe-fonts/source-han-sans) - 开源中文字体

### 工具
- [fonttools](https://github.com/fonttools/fonttools) - 字体子集化
- [Transfonter](https://transfonter.org/) - 字体格式转换

### 性能测试
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

## 🎯 学习路径

### 初学者
1. 从基础字体加载开始
2. 学习 Google Fonts 使用
3. 实践：为项目添加一个字体

### 进阶开发者
1. 学习本地自定义字体
2. 掌握多语言字体支持
3. 实践：配置多语言字体方案

### 高级开发者
1. 研究动态字体切换
2. 深入字体性能优化
3. 实践：构建字体管理系统

## 📝 总结

通过本章学习，你应该掌握：

1. **理论知识**
   - 字体优化的重要性
   - next/font 的工作原理
   - 字体子集化技术

2. **实践技能**
   - 配置和使用 next/font
   - 加载 Google Fonts 和本地字体
   - 实现多语言字体支持
   - 动态字体切换

3. **最佳实践**
   - 性能优化策略
   - 代码组织方式
   - 授权合规要求

4. **问题解决**
   - 常见问题诊断
   - 性能优化方法
   - 兼容性处理

## 🚀 下一步

- 将字体优化应用到实际项目
- 尝试更多 Google Fonts
- 研究字体子集化工具
- 监控字体加载性能
- 探索可变字体（Variable Fonts）

---

**Happy Coding! 🎨**

