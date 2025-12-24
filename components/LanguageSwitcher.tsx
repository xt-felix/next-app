import React from 'react';
import { useRouter } from 'next/router';
import Spacing from './common/Spacing';

/**
 * 语言切换组件
 * 展示如何通过 useRouter 切换 locale
 */
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

