/**
 * 邮件服务
 * 用于发送验证码、密码重置链接等
 * 生产环境建议使用 SendGrid、AWS SES 等专业服务
 */

import nodemailer from 'nodemailer';
import { db } from './db';

// 创建邮件传输器（开发环境使用 Ethereal Email 测试）
const createTransporter = async () => {
  // 开发环境：使用 Ethereal Email（自动生成测试账号）
  if (process.env.NODE_ENV === 'development') {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // 生产环境：使用真实 SMTP 配置
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * 生成 6 位数字验证码
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * 发送邮箱验证码
 */
export const sendEmailVerificationCode = async (
  email: string,
  type: 'email-login' | 'mfa' | 'password-reset' = 'email-login'
): Promise<{ success: boolean; message: string }> => {
  try {
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分钟有效期

    // 保存验证码到数据库
    await db.verificationCode.create({
      email,
      code,
      expiresAt,
      type,
    });

    // 发送邮件
    const transporter = await createTransporter();
    const typeText = {
      'email-login': '登录验证',
      mfa: '多因子认证',
      'password-reset': '密码重置',
    }[type];

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Next Auth Demo" <noreply@example.com>',
      to: email,
      subject: `${typeText}验证码 - ${code}`,
      text: `您的${typeText}验证码是：${code}\n\n该验证码将在 10 分钟后过期。\n\n如果这不是您本人操作，请忽略此邮件。`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${typeText}验证码</h2>
          <p style="font-size: 16px; color: #555;">您的验证码是：</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p style="font-size: 14px; color: #777;">该验证码将在 10 分钟后过期。</p>
          <p style="font-size: 14px; color: #777;">如果这不是您本人操作，请忽略此邮件。</p>
        </div>
      `,
    });

    // 开发环境打印测试邮件预览链接
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 邮件预览链接：', nodemailer.getTestMessageUrl(info));
      console.log('📋 验证码：', code);
    }

    return { success: true, message: '验证码已发送' };
  } catch (error) {
    console.error('发送邮件失败：', error);
    return { success: false, message: '发送验证码失败' };
  }
};

/**
 * 验证邮箱验证码
 */
export const verifyEmailCode = async (
  email: string,
  code: string,
  type: 'email-login' | 'mfa' | 'password-reset' = 'email-login'
): Promise<boolean> => {
  return await db.verificationCode.verify(email, code, type);
};

/**
 * 发送密码重置邮件
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const transporter = await createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Next Auth Demo" <noreply@example.com>',
      to: email,
      subject: '重置您的密码',
      text: `请点击以下链接重置您的密码：\n\n${resetUrl}\n\n该链接将在 1 小时后过期。\n\n如果这不是您本人操作，请忽略此邮件。`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">重置您的密码</h2>
          <p style="font-size: 16px; color: #555;">我们收到了您的密码重置请求。</p>
          <p style="font-size: 16px; color: #555;">请点击下面的按钮重置您的密码：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #2563eb; color: white; padding: 12px 30px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              重置密码
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">或复制以下链接到浏览器：</p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
          <p style="font-size: 14px; color: #777;">该链接将在 1 小时后过期。</p>
          <p style="font-size: 14px; color: #777;">如果这不是您本人操作，请忽略此邮件。</p>
        </div>
      `,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('📧 邮件预览链接：', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, message: '重置密码邮件已发送' };
  } catch (error) {
    console.error('发送邮件失败：', error);
    return { success: false, message: '发送重置密码邮件失败' };
  }
};
