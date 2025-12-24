import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../app/globals.css';

/**
 * Pages Router 的全局 App 组件
 * 必须使用 appWithTranslation 高阶组件包裹以支持国际化
 */
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);

