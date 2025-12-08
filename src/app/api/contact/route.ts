// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // 基础验证
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    // 这里可以添加实际的业务逻辑：
    // 1. 发送邮件通知
    // 2. 保存到数据库
    // 3. 发送到第三方服务（如 SendGrid、Mailgun）

    // 模拟处理延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 记录日志（生产环境应该用专业的日志服务）
    console.log('收到联系表单提交:', {
      name,
      email,
      phone: phone || '未提供',
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: true,
        message: '表单提交成功，我们会尽快与您联系！'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API 错误:', error);
    return NextResponse.json({ error: '服务器错误，请稍后重试' }, { status: 500 });
  }
}
