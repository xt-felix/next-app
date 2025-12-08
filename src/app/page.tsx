import Link from 'next/link';
import AnimatedButton from '@/components/AnimatedButton';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32" style={{ background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.1), transparent)' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{
            background: 'linear-gradient(to right, #10b981, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            组件化设计模式与样式管理
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            探索 Next.js 中的组件化开发、响应式设计、主题切换、动画效果和表单管理的最佳实践
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <AnimatedButton variant="primary">浏览商品列表</AnimatedButton>
            </Link>
            <Link href="/contact">
              <AnimatedButton variant="outline">联系我们</AnimatedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            案例特性
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎨"
              title="响应式设计"
              description="移动优先的设计理念，支持所有主流设备和屏幕尺寸，从手机到桌面完美适配"
            />
            <FeatureCard
              icon="🌓"
              title="暗黑模式"
              description="完整的暗黑模式支持，自动跟随系统偏好或手动切换，保护用户视力"
            />
            <FeatureCard
              icon="✨"
              title="动画效果"
              description="基于 Framer Motion 的流畅动画，提升用户体验和交互感"
            />
            <FeatureCard
              icon="📦"
              title="组件化架构"
              description="高度可复用的组件设计，符合单一职责原则，易于维护和扩展"
            />
            <FeatureCard
              icon="🎯"
              title="表单验证"
              description="使用 react-hook-form 和 zod 实现强类型表单验证，提供实时错误反馈"
            />
            <FeatureCard
              icon="♿"
              title="无障碍访问"
              description="遵循 WCAG 标准，支持键盘导航、屏幕阅读器和 ARIA 属性"
            />
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            技术栈
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <TechCard name="Next.js 16" />
            <TechCard name="React 19" />
            <TechCard name="TypeScript" />
            <TechCard name="Tailwind CSS" />
            <TechCard name="Framer Motion" />
            <TechCard name="React Hook Form" />
            <TechCard name="Zod" />
            <TechCard name="CSS Modules" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="card max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              开始探索
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              查看完整的组件示例和源代码，学习如何构建现代化的 Web 应用
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <AnimatedButton variant="primary">查看商品列表</AnimatedButton>
              </Link>
              <Link href="/contact">
                <AnimatedButton variant="secondary">测试表单</AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function TechCard({ name }: { name: string }) {
  return (
    <div className="card text-center hover:shadow-md transition-shadow">
      <p className="font-semibold">{name}</p>
    </div>
  );
}
