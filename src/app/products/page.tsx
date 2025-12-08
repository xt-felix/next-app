// app/products/page.tsx
'use client';
import ProductCard from '@/components/ProductCard';

// 模拟商品数据
const products = [
  {
    id: 1,
    title: 'iPhone 15 Pro',
    price: 7999,
    image: 'https://picsum.photos/seed/iphone15/400/300',
    description: '全新 A17 Pro 芯片，钛金属边框，更轻更强'
  },
  {
    id: 2,
    title: 'MacBook Pro 14"',
    price: 15999,
    image: 'https://picsum.photos/seed/macbook/400/300',
    description: 'M3 芯片，Liquid Retina XDR 显示屏'
  },
  {
    id: 3,
    title: 'AirPods Pro 2',
    price: 1899,
    image: 'https://picsum.photos/seed/airpods/400/300',
    description: '自适应降噪，空间音频，USB-C 充电'
  },
  {
    id: 4,
    title: 'iPad Air',
    price: 4799,
    image: 'https://picsum.photos/seed/ipad/400/300',
    description: 'M1 芯片，10.9 英寸 Liquid 视网膜显示屏'
  },
  {
    id: 5,
    title: 'Apple Watch Series 9',
    price: 2999,
    image: 'https://picsum.photos/seed/watch/400/300',
    description: 'S9 芯片，全天候视网膜显示屏'
  },
  {
    id: 6,
    title: 'Magic Keyboard',
    price: 799,
    image: 'https://picsum.photos/seed/keyboard/400/300',
    description: '妙控键盘，支持触控 ID，无线充电'
  },
  {
    id: 7,
    title: 'Studio Display',
    price: 11499,
    image: 'https://picsum.photos/seed/display/400/300',
    description: '27 英寸 5K 视网膜显示屏，内置扬声器'
  },
  {
    id: 8,
    title: 'HomePod mini',
    price: 749,
    image: 'https://picsum.photos/seed/homepod/400/300',
    description: '智能音箱，360° 音效，支持 Siri'
  },
  {
    id: 9,
    title: 'AirTag',
    price: 229,
    image: 'https://picsum.photos/seed/airtag/400/300',
    description: '物品追踪器，精确查找，隐私保护'
  }
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            精选商品
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            探索我们精心挑选的优质产品，享受极致购物体验
          </p>
        </header>

        {/* 商品网格 - 响应式布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              description={product.description}
              onClick={() => {
                console.log('点击商品:', product.title);
                // 这里可以跳转到商品详情页
                // router.push(`/products/${product.id}`);
              }}
            />
          ))}
        </div>

        {/* 分页或加载更多按钮可以放在这里 */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            加载更多
          </button>
        </div>
      </div>
    </main>
  );
}
