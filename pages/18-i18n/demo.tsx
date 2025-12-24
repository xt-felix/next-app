import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Spacing from '../../components/common/Spacing';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import LocalizedImage from '../../components/LocalizedImage';

/**
 * 国际化演示页面
 * 展示了：
 * 1. 服务端加载翻译 (serverSideTranslations)
 * 2. 客户端使用翻译 (useTranslation)
 * 3. 变量插值与格式化
 * 4. 语言切换
 * 5. 国际化图片
 */
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
        <Spacing flex direction="row" justify="between" align="center">
          <h1 className="text-3xl font-bold">{t('home')}</h1>
          <LanguageSwitcher />
        </Spacing>

        <div className="card">
          <div className="card-header">{t('welcome', { name: 'Guest' })}</div>
          <div className="card-body">
            <Spacing flex direction="column" gap={16}>
              <p>{t('date_format')}</p>
              
              <Spacing flex direction="row" gap={12} align="center">
                <span>{t('cart', { count: cartCount })}</span>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => setCartCount(prev => prev + 1)}
                >
                  +1
                </button>
              </Spacing>

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

