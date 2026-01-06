---
title: Hero 组件
description: 创建一个带背景图片的 Hero 横幅组件
---

## 创建 Hero 组件

在 `src/components` 目录下创建 `hero.tsx` 文件：

```tsx
// src/components/hero.tsx
import type { StaticImageData } from "next/image";
import Image from "next/image";

interface HeroProps {
  imgData: StaticImageData;
  imgAlt: string;
  title: string;
}

export default function Hero(props: HeroProps) {
  return (
    <div className="relative h-screen">
      <div className="absolute -z-10 inset-0">
        <Image
          src={props.imgData}
          alt={props.imgAlt}
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900"></div>
      </div>
      <div className="pt-48 flex justify-center">
        <h1 className="text-white text-6xl">{props.title}</h1>
      </div>
    </div>
  );
}
```

## 代码解析

### Props 类型定义

```tsx
interface HeroProps {
  imgData: StaticImageData;  // 静态导入的图片数据
  imgAlt: string;            // 图片 alt 文本
  title: string;             // 标题文字
}
```

`StaticImageData` 是 Next.js 提供的类型，用于静态导入图片时的类型定义。

### 样式说明

| 类名 | 作用 |
|------|------|
| `relative` | 相对定位，作为子元素的定位参考 |
| `h-screen` | 高度 100vh，占满整个视口 |
| `absolute` | 绝对定位 |
| `-z-10` | z-index: -10，置于底层 |
| `inset-0` | top/right/bottom/left 都为 0，铺满父元素 |
| `fill` | Image 组件属性，填满父容器 |
| `bg-gradient-to-r` | 从左到右的渐变背景 |
| `from-slate-900` | 渐变起始颜色（深灰色） |
| `pt-48` | padding-top: 12rem |

### Next.js Image 组件

```tsx
<Image
  src={props.imgData}
  alt={props.imgAlt}
  fill                        // 填满父容器
  style={{ objectFit: "cover" }}  // 保持比例裁剪
/>
```

`fill` 属性让图片填满父容器，配合 `objectFit: "cover"` 保持图片比例。

:::note[注意]
使用 `fill` 属性时，父元素必须设置 `position: relative`、`absolute` 或 `fixed`。
:::

## 使用示例

```tsx
// src/app/page.tsx
import Hero from "@/components/hero";
import homeImg from "@/assets/home.jpg";  // 静态导入图片

export default function Home() {
  return (
    <main>
      <Hero
        imgData={homeImg}
        imgAlt="首页背景"
        title="欢迎来到我的网站"
      />
    </main>
  );
}
```

### 静态导入图片

Next.js 支持静态导入图片，会自动优化：

```tsx
import homeImg from "@/assets/home.jpg";

// homeImg 的类型是 StaticImageData
// 包含 src, width, height 等信息
```

好处：
- 自动获取图片宽高，避免布局偏移
- 自动生成多种尺寸，响应式加载
- 支持模糊占位符

## 渐变遮罩效果

```tsx
<div className="absolute inset-0 bg-gradient-to-r from-slate-900"></div>
```

这行代码创建了一个从左到右的渐变遮罩：
- 左侧是 `slate-900`（深色）
- 右侧渐变到透明

让标题文字在深色背景上更清晰可读。

## 完整页面效果

```tsx
// src/app/page.tsx
import Header from "@/components/header";
import Hero from "@/components/hero";
import homeImg from "@/assets/home.jpg";

export default function Home() {
  return (
    <>
      <Header />
      <Hero
        imgData={homeImg}
        imgAlt="首页背景"
        title="欢迎来到我的网站"
      />
    </>
  );
}
```

Header 使用 `absolute` 定位覆盖在 Hero 上方，形成导航栏叠加在背景图上的效果。
