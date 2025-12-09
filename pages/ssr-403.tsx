import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Error.module.css';

/**
 * 403 禁止访问页面
 */
export default function Forbidden() {
  return (
    <>
      <Head>
        <title>403 - 禁止访问</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.errorBox}>
          <h1 className={styles.errorCode}>403</h1>
          <h2 className={styles.errorTitle}>禁止访问</h2>
          <p className={styles.errorMessage}>
            抱歉，您没有权限访问此页面。
          </p>
          <p className={styles.errorHint}>
            这可能是因为：
          </p>
          <ul className={styles.errorList}>
            <li>您的账户角色权限不足</li>
            <li>该页面仅限特定用户访问</li>
            <li>您需要更高级别的权限</li>
          </ul>
          <div className={styles.actions}>
            <Link href="/ssr-login" className={styles.button}>
              重新登录
            </Link>
            <Link href="/" className={styles.buttonSecondary}>
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
