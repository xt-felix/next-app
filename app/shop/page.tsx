/**
 * 商品列表页面
 * 路由：/shop
 * 知识点：
 * 1. 客户端数据获取
 * 2. 分页加载
 * 3. 搜索功能
 * 4. 响应式设计（移动端适配）
 * 5. 加载状态与错误处理
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
}

interface ApiResponse {
  code: number;
  message?: string;
  data?: {
    items: Product[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // 加载商品数据
  const fetchProducts = async (pageNum: number, search = '') => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '9',
        ...(search && { keyword: search }),
      });

      const res = await fetch(`/api/v1/products?${params}`);
      const json: ApiResponse = await res.json();

      if (json.code === 0 && json.data) {
        setProducts(json.data.items);
        setHasMore(json.data.hasMore);
      } else {
        setError(json.message || '加载失败');
      }
    } catch (e) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchProducts(page, keyword);
  }, [page, keyword]);

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchInput('');
    setKeyword('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">商品商城</h1>
              <div className="flex gap-2 sm:hidden">
                <Link
                  href="/admin"
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  管理
                </Link>
                <Link
                  href="/shop/login"
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  登录
                </Link>
              </div>
            </div>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="搜索商品..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                搜索
              </button>
              {keyword && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  重置
                </button>
              )}
            </form>

            {/* 桌面端按钮 */}
            <div className="hidden sm:flex gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                后台管理
              </Link>
              <Link
                href="/shop/login"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                登录
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 商品列表 */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">暂无商品</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* 商品图片 */}
                      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            暂无图片
                          </div>
                        )}
                      </div>

                      {/* 商品信息 */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                          {product.description || '暂无描述'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ¥{product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            库存: {product.stock || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 分页控制 */}
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    上一页
                  </button>
                  <span className="text-gray-700 dark:text-gray-300">第 {page} 页</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    下一页
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
