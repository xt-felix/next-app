import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Error.module.css';

/**
 * SSR 错误页面
 */
export default function SSRError() {
  const router = useRouter();
  const message = router.query.message as string || '服务器处理请求时发生错误';

  return (
    <>
      <Head>
        <title>错误 - SSR 示例</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.errorBox}>
          <h1 className={styles.errorCode}>⚠️</h1>
          <h2 className={styles.errorTitle}>服务器错误</h2>
          <p className={styles.errorMessage}>{message}</p>
          <p className={styles.errorHint}>
            可能的原因：
          </p>
          <ul className={styles.errorList}>
            <li>服务器暂时无法响应</li>
            <li>数据获取失败</li>
            <li>网络连接异常</li>
          </ul>
          <div className={styles.actions}>
            <button
              onClick={() => router.back()}
              className={styles.button}
            >
              返回上一页
            </button>
            <Link href="/" className={styles.buttonSecondary}>
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
