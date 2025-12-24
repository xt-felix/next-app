# 第十八章：国际化 (i18n) 与多语言支持

## 理论讲解

### 1. 国际化与本地化的区别

- **国际化（i18n）**：为应用支持多语言、多地区、多文化的能力，通常在开发阶段实现。它不仅仅是翻译文本，还包括日期、货币、数字、时区、图片、富文本等多方面的适配。
- **本地化（l10n）**：针对特定地区/语言进行内容、格式、UI、法律等适配，通常在运营阶段实现。比如中国区的法律声明、欧洲区的 GDPR 合规、阿拉伯区的 RTL 布局等。

**企业级项目关注点**：多语言内容、界面、URL、SEO、时区、货币、合规、团队协作、内容同步、翻译审核、移动端适配、性能优化。

### 2. Next.js 国际化方案

Next.js 内置了 i18n 路由与本地化 URL 支持。在本章中，我们使用企业级推荐方案：**next-i18next**。

- **next-i18next**：基于著名的 i18next，与 Next.js 深度集成，完美支持 SSR（服务端渲染）、SSG（静态生成）以及 App Router 的过渡，非常适合团队协作。

### 3. 核心策略与体验优化

- **URL 策略**：推荐使用路径前缀（如 `/en`、`/zh`），这对 SEO 友好且易于管理。
- **自动检测**：根据浏览器 `Accept-Language` 自动切换，提升用户首访体验。
- **回退机制**：如果某个词条缺失翻译，自动回退到默认语言（如中文），避免界面出现空白或源码。

---

## 代码案例讲解

### 1. 基础配置

首先需要配置 `next.config.ts` 以启用 Next.js 的 i18n 路由功能。

```typescript:next.config.ts
const nextConfig: NextConfig = {
  // ...
  i18n: {
    locales: ['zh', 'en', 'fr'],
    defaultLocale: 'zh',
    localeDetection: true,
  },
};
```

接着创建 `next-i18next.config.js`，这是 `next-i18next` 的核心配置文件。

```javascript:next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'fr'],
  },
  localePath: require('path').resolve('./public/locales'),
};
```

### 2. 国际化资源文件

翻译内容存储在 `public/locales` 目录下，按语言分文件夹存储 JSON。

```json:public/locales/zh/common.json
{
  "welcome": "欢迎，{{name}}！",
  "login": "登录",
  "error_required": "请输入{{field}}",
  "cart": "购物车({{count}})"
}
```

```json:public/locales/en/common.json
{
  "welcome": "Welcome, {{name}}!",
  "login": "Login",
  "error_required": "Please enter {{field}}",
  "cart": "Cart ({{count}})"
}
```

### 3. 语言切换组件 (LanguageSwitcher)

利用 `next/router` 提供的 `locales` 和 `push` 方法，我们可以轻松实现语言切换。

```tsx:components/LanguageSwitcher.tsx
import { useRouter } from 'next/router';
import Spacing from './common/Spacing';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locales, locale: currentLocale, asPath } = router;

  return (
    <Spacing flex direction="row" gap={10} align="center">
      {locales?.map((lng) => (
        <button
          key={lng}
          className={`btn ${lng === currentLocale ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => router.push(asPath, asPath, { locale: lng })}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </Spacing>
  );
}
```

### 4. 页面集成 (SSR 方式)

在 Pages Router 中，我们需要通过 `serverSideTranslations` 在服务端加载翻译资源。

```tsx:pages/18-i18n/demo.tsx
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function I18nDemoPage() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome', { name: 'Admin' })}</h1>
      <p>{t('cart', { count: 5 })}</p>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
```

---

## 最佳实践与建议

1. **内容与界面分离**：界面文案（按钮、提示）使用 JSON 管理，业务内容（文章、产品描述）推荐存储在支持多语言的数据库或 CMS 中。
2. **变量与插值**：利用 `{{name}}` 这样的插值语法，避免硬编码，支持灵活的文案拼接。
3. **SEO 优化**：确保页面 head 中包含 `hreflang` 标签，告知搜索引擎该页面的其他语言版本。
4. **性能监控**：多语言包可能很大，建议按页面/模块拆分 namespace，实现按需加载。

---

## 实战练习

1. 在 `public/locales/fr` 下添加法语支持。
2. 实现一个根据 `locale` 自动切换图片路径的 `LocalizedImage` 组件。
3. 尝试在服务端 API 中根据 `req.query.lang` 返回不同语言的错误提示。
