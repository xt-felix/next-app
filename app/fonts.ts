import { Inter, Roboto, Noto_Sans_SC, Noto_Sans_JP } from 'next/font/google';
import localFont from 'next/font/local';

// Google Fonts - Inter (英文)
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// Google Fonts - Roboto (英文)
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

// Google Fonts - 思源黑体简体 (中文)
export const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
});

// Google Fonts - 思源黑体日文 (日文)
export const notoSansJP = Noto_Sans_JP({
  subsets: ['japanese'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

// 本地自定义品牌字体示例
// 注意：实际使用时需要将字体文件放在 public/fonts/ 目录下
// 由于这是示例项目，暂时注释掉本地字体配置
// 如需使用，请取消注释并确保字体文件存在
/*
export const brandFont = localFont({
  src: [
    {
      path: '../public/fonts/Brand-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Brand-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-brand',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});
*/

