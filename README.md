# 第五章：组件化设计模式与样式管理进阶

## 项目简介

本项目是一个完整的 Next.js 16 组件化设计实战案例，演示了现代 Web 开发中的最佳实践，包括：

- ✅ **响应式设计**：移动优先，适配所有屏幕尺寸
- ✅ **暗黑模式**：支持手动切换和系统自动跟随
- ✅ **动画效果**：基于 Framer Motion 的流畅交互
- ✅ **组件化架构**：高度可复用的组件设计
- ✅ **表单验证**：React Hook Form + Zod 强类型验证
- ✅ **无障碍访问**：完整的 a11y 支持
- ✅ **CSS 模块化**：Tailwind CSS + CSS Modules 混合使用
- ✅ **TypeScript**：完整的类型安全

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4 + CSS Modules
- **动画**: Framer Motion
- **表单**: React Hook Form + Zod
- **构建工具**: Turbopack

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/                      # Next.js App Router 页面
│   ├── api/                  # API 路由
│   │   └── contact/          # 联系表单 API
│   ├── products/             # 商品列表页面
│   ├── contact/              # 联系页面
│   ├── layout.tsx            # 根布局（包含导航栏）
│   ├── page.tsx              # 首页
│   └── globals.css           # 全局样式（Tailwind + CSS 变量）
└── components/               # 可复用组件
    ├── Navbar.tsx            # 响应式导航栏
    ├── ProductCard.tsx       # 商品卡片组件
    ├── ProductCard.module.css # CSS Modules 样式
    ├── AnimatedButton.tsx    # 动画按钮组件
    └── ContactForm.tsx       # 联系表单组件
```

## 核心功能详解

### 1. 响应式导航栏（Navbar）

**位置**: [src/components/Navbar.tsx](src/components/Navbar.tsx)

**特性**:
- 桌面端显示完整菜单
- 移动端显示汉堡菜单，点击后弹出抽屉式菜单
- 支持暗黑模式切换按钮
- 使用 Framer Motion 实现流畅动画
- 粘性定位（sticky）+ 毛玻璃效果

**关键技术**:
```tsx
// 主题切换逻辑
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.className = newTheme;
  localStorage.setItem('theme', newTheme);
};
```

**响应式断点**:
- `hidden md:flex`: 移动端隐藏，桌面端显示
- `md:hidden`: 移动端显示，桌面端隐藏

### 2. 商品卡片组件（ProductCard）

**位置**: [src/components/ProductCard.tsx](src/components/ProductCard.tsx)

**特性**:
- 使用 CSS Modules + Tailwind 混合样式
- 图片懒加载（Next.js Image 组件）
- 悬浮效果和交互动画
- 无障碍支持（keyboard 导航、ARIA 属性）
- 响应式图片尺寸

**关键代码**:
```tsx
<Image
  src={image}
  alt={title}
  width={320}
  height={200}
  loading="lazy"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

**CSS Modules 样式**:
```css
/* ProductCard.module.css */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

### 3. 动画按钮（AnimatedButton）

**位置**: [src/components/AnimatedButton.tsx](src/components/AnimatedButton.tsx)

**特性**:
- 基于 Framer Motion
- 三种变体：primary、secondary、outline
- 弹簧动画效果
- 支持所有原生 button 属性

**动画配置**:
```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
```

### 4. 联系表单（ContactForm）

**位置**: [src/components/ContactForm.tsx](src/components/ContactForm.tsx)

**特性**:
- React Hook Form 管理表单状态
- Zod schema 验证
- 实时错误提示
- 提交状态反馈（成功/失败）
- 无障碍表单设计

**验证规则**:
```tsx
const contactSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').optional(),
  subject: z.string().min(2, '主题至少需要2个字符'),
  message: z.string().min(10, '留言至少需要10个字符')
});
```

### 5. API 路由（Contact API）

**位置**: [src/app/api/contact/route.ts](src/app/api/contact/route.ts)

**特性**:
- Next.js App Router API 路由
- POST 请求处理
- 数据验证
- 错误处理
- 可扩展（集成邮件服务、数据库等）

### 6. 暗黑模式实现

**全局样式**: [src/app/globals.css](src/app/globals.css)

**实现方式**:
1. **CSS 变量**: 定义明/暗主题颜色
2. **系统自动跟随**: 使用 `prefers-color-scheme` 媒体查询
3. **手动切换**: JavaScript 动态切换 `document.documentElement.className`

```css
/* 明亮模式 */
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #10b981;
}

/* 暗黑模式 */
:root.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

### 7. 响应式布局

**断点配置**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**示例**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* 移动端单列，平板双列，桌面三列/四列 */}
</div>
```

## 页面功能

### 首页 (`/`)
- Hero 区域：介绍项目
- 特性展示：6 个核心特性卡片
- 技术栈：展示使用的技术
- CTA 区域：引导用户探索

### 商品列表 (`/products`)
- 9 个示例商品
- 响应式网格布局
- 图片懒加载
- 点击交互

### 联系页面 (`/contact`)
- 联系方式卡片
- 完整表单
- FAQ 折叠面板

## 最佳实践

### 1. 组件设计原则

✅ **单一职责**: 每个组件只负责一个功能
✅ **可复用性**: 通过 props 配置不同场景
✅ **类型安全**: 使用 TypeScript 定义 Props 接口
✅ **无障碍**: 添加 ARIA 属性和键盘导航支持

### 2. 样式管理

✅ **Tailwind CSS**: 用于快速构建和响应式设计
✅ **CSS Modules**: 用于复杂动画和特殊样式
✅ **CSS 变量**: 用于主题切换和全局颜色管理
✅ **避免内联样式**: 除非动态计算的值

### 3. 性能优化

✅ **图片优化**: 使用 `next/image` 自动优化
✅ **懒加载**: 图片设置 `loading="lazy"`
✅ **代码分割**: 使用 `next/dynamic` 动态导入大组件
✅ **客户端组件**: 只在需要交互的地方使用 `'use client'`

### 4. 无障碍访问

✅ **语义化标签**: 使用 `<nav>`, `<main>`, `<section>`
✅ **ARIA 属性**: `aria-label`, `aria-expanded`, `aria-describedby`
✅ **键盘导航**: 支持 Tab、Enter、Esc
✅ **焦点管理**: 合理的 `tabIndex` 和焦点样式

### 5. 表单最佳实践

✅ **受控组件**: 使用 React Hook Form 管理状态
✅ **实时验证**: Zod schema + 即时错误提示
✅ **用户反馈**: 提交中、成功、失败状态
✅ **无障碍**: label 关联、错误描述

## 常见问题

### Q: 如何切换主题？

A: 点击导航栏右上角的月亮/太阳图标。主题会保存到 `localStorage`，下次访问自动恢复。

### Q: 如何添加新的商品？

A: 编辑 `src/app/products/page.tsx`，在 `products` 数组中添加新对象：

```tsx
{
  id: 10,
  title: '新商品',
  price: 999,
  image: 'https://picsum.photos/seed/new/400/300',
  description: '商品描述'
}
```

### Q: 如何自定义主题颜色？

A: 编辑 `src/app/globals.css`，修改 CSS 变量：

```css
:root {
  --primary: #your-color;
  --primary-hover: #your-hover-color;
}
```

### Q: 如何集成真实的邮件服务？

A: 在 `src/app/api/contact/route.ts` 中集成邮件服务（如 SendGrid、Resend）：

```tsx
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'user@example.com',
  subject: subject,
  html: `<p>${message}</p>`
});
```

### Q: 移动端菜单没有动画？

A: 确保安装了 `framer-motion`：

```bash
npm install framer-motion
```

### Q: 图片加载失败？

A: 本项目使用 `picsum.photos` 作为示例图片服务。如果无法访问，可以替换为本地图片：

```tsx
// 将图片放到 public/ 目录
image: '/images/product.jpg'
```

## 扩展功能建议

### 1. 添加购物车功能
- 使用 React Context 管理购物车状态
- 本地存储购物车数据
- 购物车浮层或页面

### 2. 商品详情页
- 创建 `app/products/[id]/page.tsx`
- 图片轮播
- 商品规格选择

### 3. 用户认证
- 集成 NextAuth.js
- 登录/注册表单
- 受保护路由

### 4. 国际化
- 使用 `next-intl`
- 多语言切换
- RTL 布局支持

### 5. 数据持久化
- 集成 Prisma + PostgreSQL
- 商品数据库
- 用户数据存储

### 6. Storybook 组件文档
- 安装 Storybook
- 为每个组件编写 stories
- 团队协作文档

## 学习资源

- **Next.js 官方文档**: https://nextjs.org/docs
- **React 官方文档**: https://react.dev
- **Tailwind CSS 文档**: https://tailwindcss.com/docs
- **Framer Motion 文档**: https://www.framer.com/motion
- **React Hook Form 文档**: https://react-hook-form.com
- **Zod 文档**: https://zod.dev

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

**作者**: 鲫小鱼
**公众号**: 鲫小鱼不正经
**座右铭**: 不写前端代码的前端工程师，热衷于分享非前端的知识
