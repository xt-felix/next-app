# 第19章：图像优化 - next/image 与企业级实践

> 本章节深入讲解 Next.js 图像优化的核心技术，包括 `next/image` 组件的使用、响应式图片、自定义加载器、性能监控等企业级实践。

## 📚 目录

- [为什么需要图像优化](#为什么需要图像优化)
- [核心知识点](#核心知识点)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [详细教程](#详细教程)
  - [1. 基础用法](#1-基础用法)
  - [2. 响应式图片](#2-响应式图片)
  - [3. 商品展示案例](#3-商品展示案例)
  - [4. 图片画廊](#4-图片画廊)
  - [5. 自定义加载器](#5-自定义加载器)
  - [6. 高级技巧](#6-高级技巧)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 为什么需要图像优化？

### 📊 关键数据

- **图片占比**：图片通常占网页体积的 **60% 以上**
- **性能影响**：图片优化可使页面加载速度提升 **50-70%**
- **用户体验**：加载速度每提升 0.1 秒，转化率提升 **8-10%**
- **SEO 影响**：页面速度是 Google 搜索排名的重要因素

### 🎯 优化收益

1. **性能提升**：减少首屏加载时间，提升 LCP（最大内容绘制）
2. **流量节省**：移动端流量节省 **60-80%**
3. **用户体验**：懒加载、占位符消除布局跳动
4. **SEO 优势**：更快的加载速度提升搜索排名
5. **自动化**：next/image 自动处理格式转换、尺寸生成

---

## 核心知识点

### 🚀 next/image 核心特性

#### 1. 自动图片优化

```tsx
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="商品图片"
  width={600}
  height={400}
  quality={85}
/>
```

**自动处理：**
- ✅ 自动生成 WebP/AVIF 格式（文件减小 30-50%）
- ✅ 根据设备生成多种尺寸（适配不同分辨率）
- ✅ 自动压缩和优化（平衡质量和大小）

#### 2. 懒加载（Lazy Loading）

```tsx
// 默认懒加载（非首屏图片）
<Image src="/feature.jpg" alt="功能图" width={400} height={300} />

// 禁用懒加载（首屏重要图片）
<Image 
  src="/hero-banner.jpg" 
  alt="首页横幅" 
  width={1200} 
  height={400}
  priority  // 优先加载
/>
```

**工作原理：**
- 图片进入视口附近时才开始加载
- 首屏重要图片设置 `priority` 优先加载
- 减少首屏资源，提升加载速度

#### 3. 响应式图片

```tsx
<Image
  src="/banner.jpg"
  alt="横幅"
  width={1200}
  height={400}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
  quality={85}
/>
```

**sizes 属性说明：**
- `(max-width: 640px) 100vw`：移动端占据 100% 视口宽度
- `(max-width: 1024px) 90vw`：平板占据 90% 视口宽度
- `80vw`：桌面端占据 80% 视口宽度

浏览器根据 `sizes` 和设备分辨率（DPR）自动选择最合适的图片尺寸。

#### 4. 占位符（Placeholder）

```tsx
// 模糊占位符
<Image
  src="/photo.jpg"
  alt="照片"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**占位符类型：**
- `blur`：模糊占位图（使用 base64 或低分辨率图）
- `empty`：空白占位（可配合 CSS 背景色）

**优势：**
- 消除加载时的布局跳动（CLS）
- 提升视觉体验，减少空白感
- 渐进式加载，用户感知更快

---

## 项目结构

```
next-app/
├── app/
│   └── 19-image-optimization/          # 图像优化主目录
│       ├── page.tsx                    # 主页（案例列表）
│       ├── basic/                      # 基础用法
│       │   └── page.tsx
│       ├── responsive/                 # 响应式图片
│       │   └── page.tsx
│       ├── product-showcase/           # 商品展示（电商案例）
│       │   └── page.tsx
│       ├── gallery/                    # 图片画廊
│       │   └── page.tsx
│       ├── custom-loader/              # 自定义加载器
│       │   └── page.tsx
│       └── advanced/                   # 高级技巧
│           └── page.tsx
├── components/
│   └── image-optimization/             # 图像优化组件
│       ├── OptimizedImage.tsx          # 优化图片组件（带加载状态）
│       ├── ResponsiveImage.tsx         # 响应式图片组件
│       ├── ProductCard.tsx             # 商品卡片
│       └── ImageGallery.tsx            # 图片画廊
├── utils/
│   └── image/                          # 图像工具函数
│       ├── imageLoader.ts              # 自定义加载器（阿里云/七牛云/腾讯云）
│       └── imageHelpers.ts             # 图像辅助函数
├── styles/
│   └── image-optimization/             # 样式文件
│       ├── OptimizedImage.module.css
│       ├── ProductCard.module.css
│       ├── ImageGallery.module.css
│       ├── Page.module.css
│       ├── BasicPage.module.css
│       ├── ResponsivePage.module.css
│       ├── ProductShowcasePage.module.css
│       ├── GalleryPage.module.css
│       ├── CustomLoaderPage.module.css
│       └── AdvancedPage.module.css
└── next.config.ts                      # Next.js 配置
```

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问示例

打开浏览器访问：[http://localhost:3000/19-image-optimization](http://localhost:3000/19-image-optimization)

---

## 详细教程

### 1. 基础用法

#### 1.1 本地图片

```tsx
import Image from 'next/image';

export default function ProductPage() {
  return (
    <Image
      src="/products/shoes.jpg"  // 图片放在 public 目录下
      alt="舒适运动鞋"
      width={600}
      height={400}
      quality={85}
      priority  // 首屏图片优先加载
    />
  );
}
```

**知识点：**
- `src`：本地图片路径，相对于 `public` 目录
- `alt`：替代文本，对 SEO 和无障碍访问很重要
- `width/height`：图片实际尺寸，防止布局跳动（CLS）
- `quality`：图片质量 1-100，建议 75-85，默认 75
- `priority`：首屏重要图片设为 `true`，禁用懒加载

#### 1.2 外部图片（需配置白名单）

```tsx
<Image
  src="https://cdn.example.com/banner.jpg"
  alt="横幅广告"
  width={1200}
  height={400}
  quality={80}
/>
```

**配置 next.config.ts：**

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',  // 示例图片服务
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

**安全说明：**
- 外部图片必须配置 `remotePatterns` 白名单
- 防止恶意图片源消耗服务器资源
- 支持通配符 `/**` 匹配所有路径

#### 1.3 Fill 模式（填充容器）

```tsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/hero-banner.jpg"
    alt="横幅"
    fill  // 填充父容器
    style={{ objectFit: 'cover' }}  // 裁剪适配
    quality={85}
  />
</div>
```

**知识点：**
- `fill`：图片填充父容器，不需要指定 `width` 和 `height`
- 父容器必须设置 `position: relative`（或 `absolute`/`fixed`）
- `objectFit` 控制图片如何适应容器：
  - `cover`：覆盖容器，可能裁剪（推荐）
  - `contain`：完整显示，可能留白
  - `fill`：拉伸填充，可能变形

---

### 2. 响应式图片

#### 2.1 理解 sizes 属性

**sizes 的作用：**

告诉浏览器图片在不同屏幕宽度下的**实际显示尺寸**，浏览器根据这个信息和设备分辨率（DPR），选择最合适的图片源。

**语法：**

```
sizes="(媒体查询) 显示宽度, (媒体查询) 显示宽度, 默认宽度"
```

#### 2.2 Banner 横幅图

```tsx
<Image
  src="/banner.jpg"
  alt="首页横幅"
  width={1920}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
  quality={85}
  priority
/>
```

**解释：**
- 移动端（≤640px）：100vw（占满屏幕）
- 平板（≤1024px）：90vw（占 90% 宽度）
- 桌面（>1024px）：80vw（占 80% 宽度）

#### 2.3 卡片网格

```tsx
// 网格布局：移动端 1 列，平板 2 列，桌面 3 列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Image
    src="/product1.jpg"
    alt="商品1"
    width={400}
    height={400}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    quality={80}
  />
  {/* 更多商品... */}
</div>
```

**优势：**
- 移动端加载小图（约 375px），节省流量
- 桌面端加载大图（约 600px），保证清晰
- 自动适配高分屏（2x、3x）

#### 2.4 浏览器选择图片的过程

**示例场景：**
- 视口宽度：375px（iPhone）
- 设备像素比（DPR）：2
- sizes 配置：`(max-width: 640px) 100vw`

**计算过程：**
1. 匹配媒体查询：`(max-width: 640px)` 匹配，显示宽度 = `100vw`
2. 计算实际宽度：375px × 1 = 375px
3. 乘以 DPR：375px × 2 = 750px
4. 选择图片：从 `deviceSizes` 中选择最接近 750px 的尺寸（如 828px）

**配置 deviceSizes：**

```ts
// next.config.ts
const nextConfig = {
  images: {
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
};
```

---

### 3. 商品展示案例

#### 3.1 商品卡片组件

```tsx
// components/image-optimization/ProductCard.tsx
'use client';

import Image from 'next/image';
import { generateBlurDataURL } from '@/utils/image/imageLoader';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export default function ProductCard({ name, price, image, description }: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="image-wrapper">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          quality={85}
          placeholder="blur"
          blurDataURL={generateBlurDataURL(image)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="content">
        <h3>{name}</h3>
        {description && <p>{description}</p>}
        <div className="footer">
          <span className="price">¥{price.toFixed(2)}</span>
          <button>加入购物车</button>
        </div>
      </div>
    </div>
  );
}
```

#### 3.2 电商图片优化要点

**1. 懒加载策略**
- 首屏商品（前 6-8 个）：不设置 `priority`，使用默认懒加载
- Banner 大图：设置 `priority={true}`
- 非首屏商品：自动懒加载

**2. 占位符方案**
```tsx
// 方案1：模糊占位符
placeholder="blur"
blurDataURL="/product-blur.jpg"  // 低分辨率图片

// 方案2：纯色占位
style={{ backgroundColor: '#f5f5f5' }}

// 方案3：骨架屏（CSS 动画）
<div className="skeleton-shimmer" />
```

**3. 图片尺寸规范**
- 商品主图：800×800（正方形）
- 缩略图：300×300
- 详情大图：1500×1500（点击放大）

**4. 性能优化**

| 优化前 | 优化后 |
|--------|--------|
| 所有图片一次性加载 | 懒加载，按需加载 |
| 原图 200-500KB | 压缩后 30-80KB |
| 不支持 WebP/AVIF | 自动使用 WebP/AVIF |
| 移动端加载桌面大图 | 响应式，加载合适尺寸 |
| 首屏加载 5-8 秒 | 首屏加载 1-2 秒 |

---

### 4. 图片画廊

#### 4.1 画廊组件

```tsx
// components/image-optimization/ImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="gallery">
      {/* 主图显示 */}
      <div className="main-image">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt}
          width={selectedImage.width}
          height={selectedImage.height}
          quality={90}
          priority
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      {/* 缩略图列表 */}
      <div className="thumbnail-list">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={index === selectedIndex ? 'active' : ''}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={100}
              height={100}
              quality={60}  // 缩略图降低质量
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### 4.2 优化技巧

**1. 主图与缩略图的差异**
- **主图**：`quality={90}`，`priority={true}`，高质量优先加载
- **缩略图**：`quality={60}`，懒加载，降低质量减小文件

**2. 预加载相邻图片**
```tsx
useEffect(() => {
  // 预加载前后相邻图片
  const preloadImages = [
    images[selectedIndex - 1],
    images[selectedIndex + 1],
  ].filter(Boolean);
  
  preloadImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img.src;
    document.head.appendChild(link);
  });
}, [selectedIndex]);
```

**3. 虚拟滚动（大量图片）**
- 画廊图片超过 100 张时，使用虚拟滚动
- 只渲染可见区域的缩略图
- 推荐库：`react-window`、`react-virtualized`

---

### 5. 自定义加载器

#### 5.1 为什么需要自定义 Loader？

**企业级场景：**
- 已有阿里云 OSS、七牛云、腾讯云 COS 等图片服务
- 需要使用云服务商的图片处理功能（缩放、水印、格式转换）
- 降低成本，利用现有 CDN 资源

#### 5.2 阿里云 OSS Loader

```ts
// utils/image/imageLoader.ts
export interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export function aliOssLoader({ src, width, quality = 80 }: ImageLoaderParams): string {
  const base = 'https://img.alicdn.com';
  // 阿里云 OSS 图片处理参数
  return `${base}/${src}?x-oss-process=image/resize,w_${width}/quality,q_${quality}`;
}
```

**使用：**
```tsx
<Image
  loader={aliOssLoader}
  src="products/demo-product.jpg"
  alt="商品图片"
  width={600}
  height={400}
  quality={80}
/>
```

**阿里云 OSS 常用参数：**
- `resize,w_宽度`：按宽度缩放
- `quality,q_质量`：调整质量（1-100）
- `format,webp`：转换为 WebP 格式
- `watermark`：添加水印

#### 5.3 七牛云 Loader

```ts
export function qiniuLoader({ src, width, quality = 80 }: ImageLoaderParams): string {
  const base = 'https://cdn.qiniu.com';
  return `${base}/${src}?imageView2/2/w/${width}/q/${quality}`;
}
```

**七牛云参数：**
- `imageView2/2/w/宽度`：限定宽度，高度自适应
- `q/质量`：图片质量
- `format/webp`：输出格式

#### 5.4 腾讯云 COS Loader

```ts
export function tencentCosLoader({ src, width, quality = 80 }: ImageLoaderParams): string {
  const base = 'https://example.cos.ap-guangzhou.myqcloud.com';
  return `${base}/${src}?imageMogr2/thumbnail/${width}x/quality/${quality}`;
}
```

**腾讯云参数：**
- `imageMogr2/thumbnail/宽度x`：缩略图
- `quality/质量`：图片质量
- `format/webp`：格式转换

#### 5.5 全局配置 Loader

```ts
// next.config.ts
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './utils/image/imageLoader.ts',
  },
};

// utils/image/imageLoader.ts
export default function customLoader({ src, width, quality }: ImageLoaderParams) {
  // 默认使用阿里云 OSS
  return aliOssLoader({ src, width, quality });
}
```

**使用：**
```tsx
// 不需要指定 loader，自动使用全局配置
<Image
  src="products/demo-product.jpg"
  alt="商品图片"
  width={600}
  height={400}
/>
```

---

### 6. 高级技巧

#### 6.1 关键性能指标

**LCP (Largest Contentful Paint)**
- **定义**：最大内容绘制时间
- **目标**：< 2.5 秒
- **优化**：首屏大图设置 `priority={true}`，使用 CDN

**CLS (Cumulative Layout Shift)**
- **定义**：累积布局偏移
- **目标**：< 0.1
- **优化**：始终指定 `width` 和 `height`，使用 `placeholder`

**FID (First Input Delay)**
- **定义**：首次输入延迟
- **目标**：< 100 毫秒
- **优化**：使用懒加载，避免大量图片同时加载

#### 6.2 性能监控工具

**1. Chrome DevTools**
```bash
1. 打开开发者工具（F12）
2. Network 面板 → 过滤 Img 类型
3. 查看：
   - 图片实际加载尺寸
   - 文件大小和加载时间
   - 格式（WebP/AVIF/JPEG）
   - 是否命中缓存
```

**2. Lighthouse**
```bash
1. Chrome DevTools → Lighthouse 面板
2. 选择 Performance 模式
3. 生成报告，查看：
   - Properly size images（图片尺寸是否合适）
   - Serve images in next-gen formats（是否使用现代格式）
   - Defer offscreen images（是否懒加载）
```

**3. WebPageTest**
- 访问：https://www.webpagetest.org/
- 输入 URL，选择测试地点和设备
- 分析 Waterfall 图和图片优化建议

#### 6.3 高级优化技巧

**1. 渐进式 JPEG**
```bash
# 使用 Sharp 库生成渐进式 JPEG
import sharp from 'sharp';

await sharp(input)
  .jpeg({ progressive: true, quality: 85 })
  .toFile(output);
```

**2. 图片预加载**
```tsx
// 在 <head> 中预加载
<link
  rel="preload"
  as="image"
  href="/hero-banner.jpg"
  imagesrcset="/hero-640.jpg 640w, /hero-1280.jpg 1280w"
  imagesizes="100vw"
/>
```

**3. 响应式图片艺术指导**
```tsx
// 移动端用竖图，桌面端用横图
import { useMediaQuery } from '@/hooks/useMediaQuery';

function ResponsiveImage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Image
      src={isMobile ? '/portrait.jpg' : '/landscape.jpg'}
      alt="响应式图片"
      width={isMobile ? 400 : 1200}
      height={isMobile ? 600 : 400}
    />
  );
}
```

**4. 调整懒加载阈值**
```ts
// next.config.ts
module.exports = {
  images: {
    // 图片进入视口前 500px 就开始加载
    lazyBoundary: '500px',
  },
};
```

---

## 最佳实践

### ✅ 基础配置

- [ ] 所有图片使用 `next/image`，禁用 `<img>` 标签
- [ ] 配置 `remotePatterns` 白名单
- [ ] 配置 `deviceSizes` 和 `imageSizes`
- [ ] 启用 WebP 和 AVIF 格式

### ✅ 图片属性

- [ ] 始终提供有意义的 `alt` 属性
- [ ] 指定 `width` 和 `height`，防止布局跳动
- [ ] 首屏图片设置 `priority={true}`
- [ ] 合理配置 `quality`（75-85）
- [ ] 精确配置 `sizes` 属性

### ✅ 加载优化

- [ ] 非首屏图片使用懒加载
- [ ] 使用 `placeholder` 占位符
- [ ] 长列表使用虚拟滚动
- [ ] 关键图片预加载

### ✅ 性能监控

- [ ] 定期运行 Lighthouse 检查
- [ ] 监控 LCP、CLS 指标
- [ ] 检查图片加载时间和大小
- [ ] 使用真实设备测试

### ✅ 电商场景

- [ ] 商品主图统一规格（正方形 800×800）
- [ ] 缩略图降低质量（quality=60-70）
- [ ] 详情页支持大图预览（1500×1500）
- [ ] CDN 加速，配置缓存策略

---

## 常见问题

### Q1: 图片加载很慢？

**排查步骤：**
1. ✅ 检查图片文件大小，是否超过 200KB
2. ✅ 检查 `quality` 设置，是否过高（建议 75-85）
3. ✅ 检查是否使用 CDN
4. ✅ 检查网络请求，是否被阻塞
5. ✅ 确认使用了 WebP/AVIF 格式

### Q2: 移动端图片模糊？

**原因：**
- 高分屏设备（DPR 2-3）需要 2-3 倍尺寸的图片
- `sizes` 配置不合理，加载了过小的图片

**解决：**
1. 检查 `sizes` 配置是否合理
2. 提高 `quality` 设置（85-90）
3. 检查 `deviceSizes` 配置
4. 使用 Chrome DevTools 检查实际加载的图片尺寸

### Q3: 页面布局跳动（CLS 高）？

**原因：**
- 图片加载时未指定尺寸，导致布局重排

**解决：**
1. 必须指定 `width` 和 `height`
2. 使用 `placeholder="blur"` 占位符
3. CSS 设置 `aspect-ratio` 保持宽高比
4. 避免动态改变图片尺寸

### Q4: 外部图片无法显示？

**原因：**
- 未配置 `remotePatterns` 白名单
- 图片 URL 错误或服务器不可用
- CORS 跨域问题

**解决：**
1. 检查 `next.config.ts` 的 `remotePatterns` 配置
2. 检查图片 URL 是否正确
3. 检查图片服务器 CORS 设置
4. 使用浏览器开发者工具查看错误信息

### Q5: 如何批量优化历史图片？

**方案：**

使用 Node.js 脚本 + Sharp 库批量处理：

```js
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images';
const outputDir = './public/images-optimized';

async function optimizeImage(filePath) {
  const filename = path.basename(filePath);
  const outputPath = path.join(outputDir, filename);
  
  await sharp(filePath)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath.replace(/\.\w+$/, '.webp'));
    
  console.log(`Optimized: ${filename}`);
}

// 递归处理所有图片
async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      await optimizeImage(filePath);
    }
  }
}

processDirectory(inputDir);
```

运行：
```bash
node scripts/optimize-images.js
```

### Q6: 如何防止图片盗链？

**方案1：Referer 白名单（云服务商设置）**
- 阿里云 OSS/七牛云/腾讯云 COS 都支持
- 只允许指定域名访问图片

**方案2：签名 URL**
```ts
// 生成带签名的临时 URL
import crypto from 'crypto';

function generateSignedUrl(imagePath: string, expiresIn: number = 3600) {
  const secret = process.env.IMAGE_SECRET;
  const expires = Date.now() + expiresIn * 1000;
  const sign = crypto
    .createHmac('sha256', secret)
    .update(`${imagePath}${expires}`)
    .digest('hex');
    
  return `${imagePath}?expires=${expires}&sign=${sign}`;
}
```

**方案3：Next.js Middleware**
```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const referer = request.headers.get('referer');
  const allowedDomains = ['yoursite.com'];
  
  if (!referer || !allowedDomains.some(domain => referer.includes(domain))) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/images/:path*',
};
```

---

## 📚 学习资源

### 官方文档

- [Next.js Image 组件文档](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Image 配置](https://nextjs.org/docs/app/api-reference/config/next-config-js/images)
- [Web.dev - 图片优化指南](https://web.dev/fast/#optimize-your-images)

### 工具与库

- [Sharp](https://sharp.pixelplumbing.com/) - 高性能图片处理库
- [ImageOptim](https://imageoptim.com/) - Mac 图片压缩工具
- [Squoosh](https://squoosh.app/) - 在线图片优化工具

### 云服务商文档

- [阿里云 OSS 图片处理](https://help.aliyun.com/document_detail/44688.html)
- [七牛云图片处理](https://developer.qiniu.com/dora/1279/basic-processing-images-imageview2)
- [腾讯云数据万象](https://cloud.tencent.com/document/product/460/6924)

---

## 🚀 总结

### 核心要点

1. **优先使用 next/image**：自动优化、懒加载、响应式
2. **精确配置 sizes**：根据布局设计，节省流量
3. **首屏图片优先加载**：设置 `priority={true}`
4. **使用占位符**：消除布局跳动，提升体验
5. **对接企业图片服务**：阿里云/七牛云/腾讯云，降低成本
6. **性能监控**：定期检查 LCP、CLS 指标

### 性能收益

通过本章学习的图像优化技术，你可以实现：

- 📉 图片体积减小 **60-80%**
- ⚡ 首屏加载速度提升 **50-70%**
- 📱 移动端流量节省 **60-80%**
- 🎯 LCP 指标优化到 **< 2.5 秒**
- 🔍 SEO 排名提升 **10-20%**

### 下一步

- 实践电商项目图片优化
- 集成云服务商图片处理
- 搭建图片 CDN 分发系统
- 实现自动化图片优化流程

---

## 📞 反馈与支持

如有问题或建议，欢迎提交 Issue 或 Pull Request！

**Happy Coding! 🎉**
