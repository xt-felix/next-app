/**
 * NextAuth 配置
 * 支持 GitHub OAuth 和自定义凭证登录
 * 包含 Session 管理、JWT 处理、权限控制等
 */

import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  // 配置认证提供者
  providers: [
    // GitHub OAuth 登录
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      // 如果未配置 GitHub OAuth，将被忽略
      ...((!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) && {
        authorization: { params: { scope: '' } },
        token: { url: '' },
        userinfo: { url: '' },
      }),
    }),

    // 自定义凭证登录（用户名密码）
    CredentialsProvider({
      id: 'credentials',
      name: '账号密码',
      credentials: {
        email: { label: '邮箱', type: 'email', placeholder: 'user@example.com' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码');
        }

        // 验证用户凭证
        const user = await db.user.verifyPassword(credentials.email, credentials.password);

        if (!user) {
          throw new Error('邮箱或密码错误');
        }

        // 记录登录日志
        await db.auditLog.create({
          userId: user.id,
          action: 'login',
          details: '用户通过账号密码登录',
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          mfaEnabled: user.mfaEnabled,
        };
      },
    }),

    // 邮箱验证码登录
    CredentialsProvider({
      id: 'email-code',
      name: '邮箱验证码',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        code: { label: '验证码', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          throw new Error('请输入邮箱和验证码');
        }

        // 验证验证码
        const isValid = await db.verificationCode.verify(
          credentials.email,
          credentials.code,
          'email-login'
        );

        if (!isValid) {
          throw new Error('验证码错误或已过期');
        }

        // 查找或创建用户
        let user = await db.user.findByEmail(credentials.email);
        if (!user) {
          user = await db.user.create({
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'user',
            emailVerified: true,
            mfaEnabled: false,
          });
        }

        // 记录登录日志
        await db.auditLog.create({
          userId: user.id,
          action: 'login',
          details: '用户通过邮箱验证码登录',
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          mfaEnabled: user.mfaEnabled,
        };
      },
    }),
  ],

  // Session 配置
  session: {
    strategy: 'jwt', // 使用 JWT（无状态），也可使用 'database'（有状态）
    maxAge: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 2, // 2 小时自动刷新
  },

  // JWT 配置
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 天
  },

  // 回调函数
  callbacks: {
    /**
     * JWT 回调：在创建或更新 JWT 时调用
     * 用于添加自定义字段到 token
     */
    async jwt({ token, user, account, trigger }) {
      // 首次登录时，将用户信息添加到 token
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.emailVerified = user.emailVerified || false;
        token.mfaEnabled = user.mfaEnabled || false;
      }

      // 处理 update 触发（用于更新 session）
      if (trigger === 'update' && token.email) {
        const dbUser = await db.user.findByEmail(token.email);
        if (dbUser) {
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.emailVerified = dbUser.emailVerified;
          token.mfaEnabled = dbUser.mfaEnabled;
        }
      }

      return token;
    },

    /**
     * Session 回调：在检查 session 时调用
     * 用于添加自定义字段到 session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
        session.user.mfaEnabled = token.mfaEnabled;
      }
      return session;
    },

    /**
     * SignIn 回调：在用户登录时调用
     * 可用于额外的权限检查或拒绝登录
     */
    async signIn({ user, account, profile }) {
      // 记录登录日志
      if (account?.provider === 'github') {
        const dbUser = await db.user.findByEmail(user.email || '');
        const userId = dbUser?.id || 'unknown';
        await db.auditLog.create({
          userId,
          action: 'login',
          details: `用户通过 GitHub OAuth 登录`,
        });
      }
      return true;
    },

    /**
     * Redirect 回调：在重定向时调用
     * 用于自定义登录/登出后的跳转
     */
    async redirect({ url, baseUrl }) {
      // 允许相对路径或同域名跳转
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // 自定义页面
  pages: {
    signIn: '/auth/signin', // 登录页
    error: '/auth/error', // 错误页
    // signOut: '/auth/signout', // 登出页（可选）
    // verifyRequest: '/auth/verify', // 验证请求页（可选）
  },

  // 事件钩子
  events: {
    async signIn({ user }) {
      console.log(`✅ 用户登录：${user.email}`);
    },
    async signOut({ token }) {
      console.log(`👋 用户登出：${token?.email}`);
      // 记录登出日志
      if (token?.id) {
        await db.auditLog.create({
          userId: token.id as string,
          action: 'logout',
          details: '用户登出',
        });
      }
    },
  },

  // 安全配置
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',

  // 调试模式（生产环境应关闭）
  debug: process.env.NODE_ENV === 'development',
};
