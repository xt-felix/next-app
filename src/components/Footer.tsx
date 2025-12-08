// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t mt-16" style={{ borderColor: 'var(--border)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 关于 */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#10b981' }}>
              关于项目
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              这是一个完整的 Next.js 16 组件化设计实战案例，演示了现代 Web 开发中的最佳实践。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#10b981' }}>
              快速链接
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  商品列表
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: '#10b981' }}>
              联系方式
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>📧 support@example.com</li>
              <li>📱 400-123-4567</li>
              <li>📍 中国·北京·朝阳区</li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="pt-6 border-t text-center text-sm text-gray-600 dark:text-gray-400" style={{ borderColor: 'var(--border)' }}>
          <p>© 2025 组件化设计案例. All rights reserved.</p>
          <p className="mt-2">
            作者：鲫小鱼 | 公众号：鲫小鱼不正经
          </p>
        </div>
      </div>
    </footer>
  );
}
