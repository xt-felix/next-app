// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  // 关闭菜单
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
          >
            电商商城
          </Link>

          {/* 桌面端菜单 */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                首页
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                商品列表
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                联系我们
              </Link>
            </li>
          </ul>

          {/* 右侧按钮组 */}
          <div className="flex items-center gap-4">
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="切换主题"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="展开菜单"
              aria-expanded={isOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端抽屉菜单 */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 遮罩层 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                style={{ top: '64px' }}
                onClick={closeMenu}
              />

              {/* 菜单面板 */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl md:hidden overflow-y-auto"
              >
                <ul className="p-4 space-y-2">
                  <li>
                    <Link
                      href="/"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      首页
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      商品列表
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      联系我们
                    </Link>
                  </li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
