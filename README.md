# 第十八章：国际化 (i18n) 与多语言支持

## 📚 理论讲解

### 1. 国际化与本地化的区别

- **国际化（i18n）**：为应用支持多语言、多地区、多文化的能力，通常在开发阶段实现。它不仅仅是翻译文本，还包括日期、货币、数字、时区、图片、富文本等多方面的适配。
- **本地化（l10n）**：针对特定地区/语言进行内容、格式、UI、法律等适配，通常在运营阶段实现。比如中国区的法律声明、欧洲区的 GDPR 合规、阿拉伯区的 RTL 布局等。

**企业级项目关注点**：
- 多语言内容管理与同步
- 界面文案与业务内容分离
- URL 国际化策略（路径前缀 vs 域名）
- SEO 优化（hreflang、sitemap）
- 时区、货币、日期格式本地化
- 法律合规与隐私政策
- 团队协作与翻译审核流程
- 移动端适配与无障碍支持
- 性能优化（分包、懒加载、CDN）

### 2. Next.js 国际化方案

Next.js 内置了 i18n 路由与本地化 URL 支持。在本章中，我们使用企业级推荐方案：**next-i18next**。

**为什么选择 next-i18next？**
- 基于著名的 i18next 生态，功能强大且成熟
- 与 Next.js 深度集成，完美支持 SSR/SSG
- 支持命名空间（namespace），便于大型项目按模块拆分翻译文件
- 支持复数、性别、日期、货币等复杂格式化
- 社区活跃，文档完善，适合团队协作

### 3. 核心策略与体验优化

**URL 策略**：
- **路径前缀**（推荐）：`/en/blog`、`/zh/blog`，SEO 友好，易于管理
- **域名/子域名**：`en.example.com`、`fr.example.com`，适合大型/多品牌项目

**用户体验优化**：
- **自动检测**：根据浏览器 `Accept-Language` 自动切换
- **回退机制**：翻译缺失时自动回退到默认语言
- **语言切换**：提供明显的语言切换按钮，支持键盘导航

**SEO 优化**：
- 使用 `hreflang` 标签告知搜索引擎页面的其他语言版本
- 为每个语言版本生成独立的 sitemap
- 确保 URL 结构清晰且一致

---

## 💻 完整代码案例

### 第一步：安装依赖

```bash
npm install next-i18next react-i18next i18next
```

### 第二步：配置文件

#### 1. next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  i18n: {
    locales: ['zh', 'en', 'fr'],      // 支持的语言列表
    defaultLocale: 'zh',               // 默认语言
    localeDetection: true,             // 自动检测用户语言
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

**配置说明**：
- `locales`：定义支持的所有语言代码
- `defaultLocale`：当无法检测用户语言时使用的默认语言
- `localeDetection`：启用后会根据浏览器的 `Accept-Language` 自动跳转

#### 2. next-i18next.config.js

```javascript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'fr'],
  },
  localePath: typeof window === 'undefined' 
    ? require('path').resolve('./public/locales') 
    : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
```

**配置说明**：
- `localePath`：翻译文件存放路径
- `reloadOnPrerender`：开发环境下自动重载翻译文件

### 第三步：创建翻译资源文件

#### 目录结构

```
public/
  locales/
    zh/
      common.json
    en/
      common.json
    fr/
      common.json
```

#### public/locales/zh/common.json

```json
{
  "welcome": "欢迎，{{name}}！",
  "logout": "退出登录",
  "cart": "购物车({{count}})",
  "username": "用户名",
  "login": "登录",
  "error_required": "请输入{{field}}",
  "date_format": "YYYY年MM月DD日",
  "change_language": "切换语言",
  "home": "首页",
  "blog": "博客"
}
```

#### public/locales/en/common.json

```json
{
  "welcome": "Welcome, {{name}}!",
  "logout": "Logout",
  "cart": "Cart ({{count}})",
  "username": "Username",
  "login": "Login",
  "error_required": "Please enter {{field}}",
  "date_format": "YYYY-MM-DD",
  "change_language": "Change Language",
  "home": "Home",
  "blog": "Blog"
}
```

#### public/locales/fr/common.json

```json
{
  "welcome": "Bienvenue, {{name}}!",
  "logout": "Déconnexion",
  "cart": "Panier ({{count}})",
  "username": "Nom d'utilisateur",
  "login": "Connexion",
  "error_required": "Veuillez saisir {{field}}",
  "date_format": "DD/MM/YYYY",
  "change_language": "Changer de langue",
  "home": "Accueil",
  "blog": "Blog"
}
```

**翻译文件说明**：
- 使用 `{{变量名}}` 进行插值，支持动态内容
- 按功能模块拆分文件（如 `common.json`、`auth.json`、`product.json`）
- 保持所有语言的 key 一致，便于维护

### 第四步：创建通用组件

#### 1. Spacing 组件（布局容器）

```typescript
// components/common/Spacing.tsx
import React from 'react';

interface SpacingProps {
  size?: number | string;
  flex?: boolean;
  direction?: 'row' | 'column';
  gap?: number | string;
  children?: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const Spacing: React.FC<SpacingProps> = ({
  size,
  flex = false,
  direction = 'column',
  gap,
  children,
  className = '',
  align = 'stretch',
  justify = 'start',
}) => {
  const style: React.CSSProperties = {};

  if (size) {
    if (direction === 'row') style.width = size;
    else style.height = size;
  }

  if (flex) {
    style.display = 'flex';
    style.flexDirection = direction;
    if (gap) style.gap = typeof gap === 'number' ? `${gap}px` : gap;
    
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      baseline: 'baseline',
      stretch: 'stretch',
    };
    
    const justifyMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };

    style.alignItems = alignMap[align];
    style.justifyContent = justifyMap[justify];
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default Spacing;
```

**组件说明**：
- 替代手写 flex CSS，统一管理布局逻辑
- 支持方向、间距、对齐等常用布局属性
- 类型安全，避免使用 any

#### 2. LanguageSwitcher 组件（语言切换器）

```typescript
// components/LanguageSwitcher.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Spacing from './common/Spacing';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locales, locale: currentLocale, asPath } = router;

  const toggleLanguage = (newLocale: string) => {
    // 切换语言并保留当前路径
    router.push(asPath, asPath, { locale: newLocale });
  };

  if (!locales) return null;

  return (
    <Spacing flex direction="row" gap={10} align="center">
      {locales.map((lng) => (
        <button
          key={lng}
          className={`btn ${lng === currentLocale ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          disabled={lng === currentLocale}
          onClick={() => toggleLanguage(lng)}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </Spacing>
  );
}
```

**组件说明**：
- 使用 `router.push` 的第三个参数切换语言
- 保留当前路径，用户体验更好
- 当前语言按钮禁用并高亮显示

#### 3. LocalizedImage 组件（国际化图片）

```typescript
// components/LocalizedImage.tsx
import React from 'react';
import { useRouter } from 'next/router';

interface LocalizedImageProps {
  srcs: { [key: string]: string };
  alt: string;
  className?: string;
}

export default function LocalizedImage({ srcs, alt, className }: LocalizedImageProps) {
  const { locale = 'zh' } = useRouter();
  
  // 优先使用当前语言的图片，否则使用默认语言(zh)或第一个可用的
  const src = srcs[locale] || srcs['zh'] || Object.values(srcs)[0];

  return <img src={src} alt={alt} className={className} />;
}
```

**组件说明**：
- 根据当前语言自动选择对应的图片资源
- 支持回退机制，避免图片加载失败
- 适用于 banner、海报等需要多语言版本的图片

### 第五步：配置 Pages Router

#### pages/_app.tsx

```typescript
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
```

**关键点**：
- 必须使用 `appWithTranslation` 包裹 App 组件
- 这是 next-i18next 的核心集成步骤

### 第六步：创建演示页面

#### 1. 基础演示页面

```typescript
// pages/18-i18n/demo.tsx
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Spacing from '../../components/common/Spacing';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import LocalizedImage from '../../components/LocalizedImage';

export default function I18nDemoPage() {
  const { t } = useTranslation('common');
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError(t('error_required', { field: t('username') }));
    } else {
      setError('');
      alert(t('welcome', { name: username }));
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Spacing flex direction="column" gap={32}>
        {/* 顶部导航 */}
        <Spacing flex direction="row" justify="between" align="center">
          <h1 className="text-3xl font-bold">{t('home')}</h1>
          <LanguageSwitcher />
        </Spacing>

        {/* 欢迎卡片 */}
        <div className="card">
          <div className="card-header">{t('welcome', { name: 'Guest' })}</div>
          <div className="card-body">
            <Spacing flex direction="column" gap={16}>
              <p>{t('date_format')}</p>
              
              {/* 购物车计数器 */}
              <Spacing flex direction="row" gap={12} align="center">
                <span>{t('cart', { count: cartCount })}</span>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => setCartCount(prev => prev + 1)}
                >
                  +1
                </button>
              </Spacing>

              {/* 国际化图片 */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Localized Image:</h3>
                <LocalizedImage 
                  srcs={{
                    zh: 'https://picsum.photos/seed/zh/400/200',
                    en: 'https://picsum.photos/seed/en/400/200'
                  }}
                  alt="Banner"
                  className="rounded-lg shadow-md"
                />
              </div>
            </Spacing>
          </div>
        </div>

        {/* 登录表单 */}
        <div className="card">
          <div className="card-header">{t('login')}</div>
          <div className="card-body">
            <form onSubmit={handleLogin}>
              <Spacing flex direction="column" gap={16}>
                <div className="form-group">
                  <label className="form-label">{t('username')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('username')}
                  />
                  {error && <p className="form-error">{error}</p>}
                </div>
                <button type="submit" className="btn btn-success w-full">
                  {t('login')}
                </button>
              </Spacing>
            </form>
          </div>
        </div>
      </Spacing>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};
```

**页面功能**：
- ✅ 多语言界面切换
- ✅ 变量插值（欢迎语、购物车计数）
- ✅ 表单验证国际化
- ✅ 国际化图片展示
- ✅ 服务端渲染（SSR）

#### 2. 动态路由国际化

```typescript
// pages/18-i18n/blog/[slug].tsx
import React from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Spacing from '../../../components/common/Spacing';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
}

interface DynamicRoutePageProps {
  post: BlogPost;
}

export default function DynamicRoutePage({ post }: DynamicRoutePageProps) {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto p-8">
      <Spacing flex direction="column" gap={24}>
        <Spacing flex direction="row" justify="between" align="center">
          <h1 className="text-3xl font-bold">{t('blog')}</h1>
          <LanguageSwitcher />
        </Spacing>

        <div className="card">
          <div className="card-header">
            <h2 className="text-2xl font-bold">{post.title}</h2>
          </div>
          <div className="card-body">
            <p className="text-gray-700">{post.content}</p>
          </div>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => window.history.back()}
        >
          ← {t('home')}
        </button>
      </Spacing>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  // 模拟从数据库/API 获取多语言内容
  const mockPosts: Record<string, BlogPost> = {
    zh: {
      id: 1,
      title: '如何使用 Next.js 实现国际化',
      content: '这是一篇关于 Next.js 国际化的详细教程，涵盖了从配置到实战的完整流程...',
      slug: params?.slug as string,
    },
    en: {
      id: 1,
      title: 'How to Implement i18n in Next.js',
      content: 'This is a detailed tutorial about Next.js internationalization, covering the complete process from configuration to practice...',
      slug: params?.slug as string,
    },
    fr: {
      id: 1,
      title: 'Comment implémenter l\'i18n dans Next.js',
      content: 'Ceci est un tutoriel détaillé sur l\'internationalisation de Next.js, couvrant le processus complet de la configuration à la pratique...',
      slug: params?.slug as string,
    },
  };

  const post = mockPosts[locale || 'zh'];

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
      post,
    },
  };
};
```

**动态路由说明**：
- 根据 `locale` 参数从数据库/API 获取对应语言的内容
- 实际项目中应该查询数据库的多语言字段
- 支持 SEO 友好的 URL 结构

#### 3. API 国际化

```typescript
// pages/api/i18n-demo.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lang = 'zh' } = req.query;

  // 定义多语言错误消息
  const messages: Record<string, Record<string, string>> = {
    zh: {
      success: '操作成功',
      error: '操作失败',
      unauthorized: '未授权',
      notFound: '未找到资源',
    },
    en: {
      success: 'Operation successful',
      error: 'Operation failed',
      unauthorized: 'Unauthorized',
      notFound: 'Resource not found',
    },
    fr: {
      success: 'Opération réussie',
      error: 'Opération échouée',
      unauthorized: 'Non autorisé',
      notFound: 'Ressource introuvable',
    },
  };

  const langMessages = messages[lang as string] || messages.zh;

  // 模拟业务逻辑
  const { action } = req.query;

  if (action === 'success') {
    return res.status(200).json({ message: langMessages.success });
  }

  if (action === 'notfound') {
    return res.status(404).json({ error: langMessages.notFound });
  }

  return res.status(200).json({ message: langMessages.success });
}
```

**API 国际化说明**：
- 通过 query 参数 `lang` 指定语言
- 返回对应语言的错误消息和提示
- 实际项目中可以从数据库或配置文件读取

---

## 🚀 运行与测试

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问演示页面

- 中文：http://localhost:3000/18-i18n/demo
- 英文：http://localhost:3000/en/18-i18n/demo
- 法语：http://localhost:3000/fr/18-i18n/demo

### 3. 测试动态路由

- 中文博客：http://localhost:3000/18-i18n/blog/first-post
- 英文博客：http://localhost:3000/en/18-i18n/blog/first-post

### 4. 测试 API

```bash
# 中文响应
curl http://localhost:3000/api/i18n-demo?lang=zh&action=success

# 英文响应
curl http://localhost:3000/api/i18n-demo?lang=en&action=notfound
```

---

## 🎯 核心知识点总结

### 1. 服务端翻译加载

```typescript
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh', ['common'])),
    },
  };
};
```

**为什么需要服务端加载？**
- 支持 SSR，首屏直接渲染翻译后的内容
- 避免客户端闪烁（先显示 key，再显示翻译）
- 对 SEO 友好，搜索引擎能抓取到翻译后的内容

### 2. 客户端使用翻译

```typescript
const { t } = useTranslation('common');

// 基础用法
<h1>{t('welcome')}</h1>

// 变量插值
<p>{t('welcome', { name: 'John' })}</p>

// 嵌套翻译
<p>{t('error_required', { field: t('username') })}</p>
```

### 3. 语言切换

```typescript
router.push(asPath, asPath, { locale: newLocale });
```

**参数说明**：
- 第一个参数：目标路径
- 第二个参数：浏览器显示的 URL
- 第三个参数：选项对象，包含 `locale`

### 4. 多语言内容管理策略

**界面文案**：
- 存储在 JSON 文件中
- 按模块拆分（common、auth、product 等）
- 版本控制，便于团队协作

**业务内容**：
- 存储在数据库中，使用多语言字段
- 例如：`title_zh`、`title_en`、`title_fr`
- 或使用 JSON 字段：`{ "zh": "标题", "en": "Title" }`

---

## 📊 最佳实践

### 1. 性能优化

**按需加载翻译文件**：
```typescript
// 只加载需要的 namespace
await serverSideTranslations(locale, ['common', 'auth'])
```

**分包策略**：
- `common.json`：全局通用文案
- `auth.json`：登录注册相关
- `product.json`：商品相关
- `checkout.json`：结账相关

### 2. SEO 优化

**添加 hreflang 标签**：
```typescript
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  
  return (
    <>
      <Head>
        {router.locales?.map(locale => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`https://example.com/${locale}${router.asPath}`}
          />
        ))}
      </Head>
      {/* 页面内容 */}
    </>
  );
}
```

### 3. 团队协作

**翻译流程**：
1. 开发人员在代码中添加 key
2. 导出所有 key 到翻译平台（如 Crowdin、Lokalise）
3. 翻译人员在线翻译
4. 自动同步回代码仓库

**推荐工具**：
- Crowdin：支持自动化工作流
- Lokalise：强大的团队协作功能
- Transifex：适合开源项目

### 4. 测试策略

**单元测试**：
```typescript
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'next-i18next';

test('translation works', () => {
  const { result } = renderHook(() => useTranslation('common'));
  expect(result.current.t('welcome', { name: 'Test' })).toBe('欢迎，Test！');
});
```

---

## ⚠️ 常见问题

### Q1: 翻译不生效？

**检查清单**：
1. 是否在 `_app.tsx` 中使用了 `appWithTranslation`？
2. 是否在 `getServerSideProps` 中加载了翻译？
3. JSON 文件路径是否正确？
4. namespace 是否匹配？

### Q2: 语言切换后页面没有刷新？

**解决方案**：
```typescript
router.push(asPath, asPath, { locale: newLocale });
```
确保使用 `router.push` 的第三个参数。

### Q3: 如何处理复数形式？

**使用 i18next 的复数规则**：
```json
{
  "item_one": "{{count}} 个商品",
  "item_other": "{{count}} 个商品"
}
```

```typescript
t('item', { count: 1 })  // "1 个商品"
t('item', { count: 5 })  // "5 个商品"
```

### Q4: 如何处理日期和货币？

**使用 Intl API**：
```typescript
// 日期格式化
new Intl.DateTimeFormat(locale).format(new Date())

// 货币格式化
new Intl.NumberFormat(locale, { 
  style: 'currency', 
  currency: 'USD' 
}).format(100)
```

---

## 🎓 实战练习

1. **添加第四种语言**（如日语 `ja`）
   - 修改 `next.config.ts`
   - 创建 `public/locales/ja/common.json`
   - 测试语言切换

2. **实现多语言表单验证**
   - 使用 `zod` 或 `yup` 配合 i18next
   - 错误消息国际化

3. **实现多语言 SEO**
   - 添加 `hreflang` 标签
   - 生成多语言 sitemap

4. **集成翻译平台**
   - 注册 Crowdin 账号
   - 配置 GitHub 集成
   - 实现自动同步

---

## 📚 参考资源

- [Next.js i18n 官方文档](https://nextjs.org/docs/advanced-features/i18n-routing)
- [next-i18next 文档](https://github.com/i18next/next-i18next)
- [i18next 文档](https://www.i18next.com/)
- [Crowdin 文档](https://support.crowdin.com/)

---

## 🎉 总结

本章完整实现了企业级国际化方案，涵盖：

✅ **配置**：Next.js + next-i18next 完整配置  
✅ **组件**：语言切换器、国际化图片  
✅ **页面**：SSR 页面、动态路由、API 国际化  
✅ **实践**：性能优化、SEO、团队协作  
✅ **规范**：无 any 类型、无 as 断言、使用 Spacing 组件

通过本章学习，你已经掌握了在 Next.js 中实现完整国际化功能的能力！
