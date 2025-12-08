// app/contact/page.tsx
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '联系我们 - 电商商城',
  description: '有任何问题或建议？欢迎联系我们，我们会尽快回复您',
  openGraph: {
    title: '联系我们 - 电商商城',
    description: '有任何问题或建议？欢迎联系我们'
  }
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            联系我们
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            有任何问题或建议？请填写下方表单，我们会尽快回复您
          </p>
        </header>

        {/* 联系方式卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-semibold mb-2">邮箱</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">support@example.com</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">电话</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">400-123-4567</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-semibold mb-2">地址</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">中国·北京·朝阳区</p>
          </div>
        </div>

        {/* 联系表单 */}
        <div className="card max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">发送消息</h2>
          <ContactForm />
        </div>

        {/* FAQ 部分 */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">常见问题</h2>
          <div className="space-y-4">
            <details className="card cursor-pointer" open>
              <summary className="font-semibold cursor-pointer">配送需要多长时间？</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                一般情况下，订单会在 1-2
                个工作日内发货，配送时间根据地区不同为
                2-5 个工作日。偏远地区可能需要更长时间。
              </p>
            </details>

            <details className="card cursor-pointer">
              <summary className="font-semibold cursor-pointer">支持哪些支付方式？</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                我们支持支付宝、微信支付、银联卡、信用卡等多种支付方式。
              </p>
            </details>

            <details className="card cursor-pointer">
              <summary className="font-semibold cursor-pointer">可以退货吗？</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                支持 7 天无理由退货（商品需保持全新未使用状态）。具体退货政策请查看用户协议。
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
