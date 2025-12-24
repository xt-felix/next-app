import React from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Spacing from '../../components/common/Spacing';
import LanguageSwitcher from '../../components/LanguageSwitcher';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
}

interface DynamicRoutePageProps {
  post: BlogPost;
}

/**
 * 动态路由国际化示例
 * 展示如何在动态路由中根据 locale 获取对应语言的内容
 */
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
      content: '这是一篇关于 Next.js 国际化的详细教程...',
      slug: params?.slug as string,
    },
    en: {
      id: 1,
      title: 'How to Implement i18n in Next.js',
      content: 'This is a detailed tutorial about Next.js internationalization...',
      slug: params?.slug as string,
    },
    fr: {
      id: 1,
      title: 'Comment implémenter l\'i18n dans Next.js',
      content: 'Ceci est un tutoriel détaillé sur l\'internationalisation de Next.js...',
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

