# 第十四章：NextAuth.js 身份认证与授权

本章介绍 Next.js 生态中最流行的认证解决方案 NextAuth.js，包括多种认证方式、Session 管理、权限控制、多因子认证、审计日志等企业级功能。

## 目录

1. [认证与授权基础](#认证与授权基础)
2. [NextAuth.js 核心概念](#nextauthjs-核心概念)
3. [项目结构](#项目结构)
4. [快速开始](#快速开始)
5. [核心功能详解](#核心功能详解)
6. [高级特性](#高级特性)
7. [最佳实践](#最佳实践)
8. [常见问题](#常见问题)

## 认证与授权基础

### 认证 (Authentication)

**定义**：确认用户身份的过程，回答"你是谁？"的问题。

**常见方式**：
- 账号密码登录
- OAuth2/OpenID Connect（GitHub、Google 等）
- 邮箱验证码/短信验证码
- 扫码登录
- 生物识别（指纹、面部识别）

### 授权 (Authorization)

**定义**：确认用户是否有权限访问某资源或操作某功能，回答"你能做什么？"的问题。

**常见模型**：
- **RBAC (Role-Based Access Control)**：基于角色的访问控制
  - 例如：admin、user、guest
- **ABAC (Attribute-Based Access Control)**：基于属性的访问控制
  - 例如：结合用户属性、资源属性、环境属性

### 关系

```
认证 → 授权 → 访问资源
   ↓       ↓        ↓
 登录   检查权限   返回数据
```

## NextAuth.js 核心概念

### 1. Providers（认证提供者）

NextAuth.js 支持多种认证提供者：

- **OAuth Providers**：GitHub、Google、Facebook、微信等
- **Email Provider**：邮箱验证码登录
- **Credentials Provider**：自定义凭证登录（账号密码）

### 2. Session（会话）

两种存储策略：

#### JWT Strategy（推荐）
- **优点**：无状态、水平扩展性好、无需数据库
- **缺点**：无法即时撤销、Token 体积较大
- **适用场景**：大部分应用、微服务架构

```typescript
session: {
  strategy: 'jwt',
  maxAge: 60 * 60 * 24 * 7, // 7 天
}
```

#### Database Strategy
- **优点**：可即时撤销、支持并发登录管理
- **缺点**：需要数据库、每次请求都查询
- **适用场景**：对安全性要求极高的应用

```typescript
session: {
  strategy: 'database',
  maxAge: 60 * 60 * 24 * 7,
}
```

### 3. Callbacks（回调函数）

NextAuth.js 提供多个回调函数，用于自定义认证流程：

- **signIn**：登录前回调，可用于权限检查
- **redirect**：重定向回调，自定义跳转逻辑
- **jwt**：JWT 回调，添加自定义字段
- **session**：Session 回调，扩展 session 信息

### 4. Events（事件钩子）

记录认证相关事件：

- **signIn**：用户登录事件
- **signOut**：用户登出事件
- **createUser**：创建用户事件
- **linkAccount**：关联账号事件

## 项目结构

```
next-app/
├── app/
│   ├── (auth)/                    # 认证相关页面（路由组）
│   │   ├── signin/                # 登录页
│   │   │   └── page.tsx
│   │   ├── register/              # 注册页
│   │   │   └── page.tsx
│   │   └── error/                 # 错误页
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth API 路由
│   │   │   │   └── route.ts
│   │   │   ├── register/          # 注册 API
│   │   │   │   └── route.ts
│   │   │   └── send-code/         # 发送验证码 API
│   │   │       └── route.ts
│   │   ├── protected/             # 受保护的 API（需登录）
│   │   │   └── route.ts
│   │   └── admin/                 # 管理员 API（需管理员权限）
│   │       └── users/
│   │           └── route.ts
│   ├── dashboard/                 # 用户仪表板（需登录）
│   │   └── page.tsx
│   └── admin/                     # 管理后台（需管理员权限）
│       └── auth/
│           └── page.tsx
├── components/
│   ├── SessionProvider.tsx        # Session 提供者
│   └── UserNav.tsx                # 用户导航组件
├── lib/
│   └── auth/
│       ├── config.ts              # NextAuth 配置
│       ├── db.ts                  # 模拟数据库
│       └── email.ts               # 邮件服务
├── types/
│   └── next-auth.d.ts             # NextAuth 类型扩展
└── .env.example                   # 环境变量示例
```

## 快速开始

### 1. 安装依赖

```bash
npm install next-auth bcryptjs nodemailer
npm install -D @types/bcryptjs @types/nodemailer
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# NextAuth 密钥（必须）
NEXTAUTH_SECRET=your-secret-key-change-in-production

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth（可选）
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

生成密钥：

```bash
openssl rand -base64 32
```

### 3. 配置 NextAuth

创建 `lib/auth/config.ts`：

```typescript
import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: '账号密码',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        // 验证用户凭证
        // 返回用户对象或 null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 4. 创建 API Route

创建 `app/api/auth/[...nextauth]/route.ts`：

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 5. 使用 Session

#### 在 Server Component 中

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <div>欢迎，{session.user.name}</div>;
}
```

#### 在 Client Component 中

```typescript
'use client';

import { useSession, signOut } from 'next-auth/react';

export default function UserNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>加载中...</div>;
  if (!session) return <a href="/auth/signin">登录</a>;

  return (
    <div>
      <span>{session.user.name}</span>
      <button onClick={() => signOut()}>退出</button>
    </div>
  );
}
```

#### 在 API Route 中

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: '未认证' }, { status: 401 });
  }

  return NextResponse.json({ data: '受保护的数据' });
}
```

## 核心功能详解

### 1. 多种登录方式

#### OAuth 登录（GitHub）

```typescript
import { signIn } from 'next-auth/react';

<button onClick={() => signIn('github')}>
  使用 GitHub 登录
</button>
```

#### 账号密码登录

```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    alert(result.error);
  } else {
    router.push('/dashboard');
  }
};
```

#### 邮箱验证码登录

```typescript
// 1. 发送验证码
const handleSendCode = async () => {
  await fetch('/api/auth/send-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// 2. 验证登录
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await signIn('email-code', {
    email,
    code,
    redirect: false,
  });
};
```

### 2. Session 管理

#### 获取 Session

```typescript
// Server Component
const session = await getServerSession(authOptions);

// Client Component
const { data: session } = useSession();
```

#### 更新 Session

```typescript
import { useSession } from 'next-auth/react';

const { data: session, update } = useSession();

// 触发 session 更新
await update();
```

#### 退出登录

```typescript
import { signOut } from 'next-auth/react';

// 退出并重定向
signOut({ callbackUrl: '/auth/signin' });
```

### 3. 权限控制（RBAC）

#### 页面级权限

```typescript
export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'admin') {
    redirect('/dashboard'); // 无权限，重定向
  }

  return <div>管理后台</div>;
}
```

#### API 级权限

```typescript
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: '未认证' }, { status: 401 });
  }

  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  return NextResponse.json({ data: '管理员数据' });
}
```

#### 组件级权限

```typescript
'use client';

export default function UserNav() {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user.role === 'admin' && (
        <Link href="/admin">管理后台</Link>
      )}
    </div>
  );
}
```

### 4. 邮箱验证码

#### 发送验证码

```typescript
// lib/auth/email.ts
import nodemailer from 'nodemailer';

export const sendEmailVerificationCode = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分钟

  // 保存验证码到数据库或 Redis
  await db.verificationCode.create({ email, code, expiresAt });

  // 发送邮件
  const transporter = nodemailer.createTransport({...});
  await transporter.sendMail({
    to: email,
    subject: '登录验证码',
    text: `您的验证码是：${code}`,
  });

  return { success: true };
};
```

#### 验证验证码

```typescript
export const verifyEmailCode = async (email: string, code: string) => {
  const record = await db.verificationCode.find({ email, code });

  if (!record || record.expiresAt < new Date()) {
    return false;
  }

  await db.verificationCode.delete({ email, code });
  return true;
};
```

### 5. 审计日志

```typescript
// 记录登录日志
callbacks: {
  async signIn({ user }) {
    await db.auditLog.create({
      userId: user.id,
      action: 'login',
      details: '用户登录',
      timestamp: new Date(),
    });
    return true;
  },
  async signOut({ token }) {
    await db.auditLog.create({
      userId: token.id,
      action: 'logout',
      details: '用户登出',
      timestamp: new Date(),
    });
  },
}
```

## 高级特性

### 1. 多因子认证 (MFA)

```typescript
// 启用 MFA 后，登录需要二次验证
async authorize(credentials) {
  const user = await verifyCredentials(credentials);

  if (user.mfaEnabled) {
    // 发送 MFA 验证码
    await sendMfaCode(user.email);
    return { ...user, requireMfa: true };
  }

  return user;
}
```

### 2. Token 刷新

```typescript
callbacks: {
  async jwt({ token, account }) {
    if (account?.refresh_token) {
      token.refreshToken = account.refresh_token;
    }

    // 检查 Token 是否过期，自动刷新
    if (token.exp < Date.now() / 1000) {
      return await refreshAccessToken(token);
    }

    return token;
  },
}
```

### 3. 多 Provider 联合登录

```typescript
providers: [
  GitHubProvider({...}),
  GoogleProvider({...}),
  WechatProvider({...}),
  CredentialsProvider({...}),
]
```

### 4. 自定义登录页面

```typescript
pages: {
  signIn: '/auth/signin',  // 自定义登录页
  error: '/auth/error',    // 自定义错误页
  signOut: '/auth/signout', // 自定义登出页
}
```

## 最佳实践

### 1. 安全性

- ✅ **使用 HTTPS**：生产环境必须使用 HTTPS
- ✅ **强密钥**：使用 `openssl rand -base64 32` 生成强密钥
- ✅ **HttpOnly Cookie**：防止 XSS 攻击
- ✅ **CSRF 防护**：NextAuth 内置 CSRF Token
- ✅ **密码加密**：使用 bcrypt 加密密码
- ✅ **验证码限流**：防止暴力破解

### 2. 性能

- ✅ **使用 JWT**：无状态，减少数据库查询
- ✅ **Session 缓存**：使用 Redis 缓存 Session
- ✅ **异步日志**：审计日志异步写入
- ✅ **CDN 加速**：静态资源使用 CDN

### 3. 用户体验

- ✅ **自动跳转**：登录后自动跳转到原页面
- ✅ **友好提示**：错误信息清晰明了
- ✅ **记住登录**：支持"记住我"功能
- ✅ **多端同步**：支持多设备登录

### 4. 开发规范

- ✅ **类型安全**：使用 TypeScript 扩展 Session 类型
- ✅ **环境变量**：敏感信息使用环境变量
- ✅ **错误处理**：统一错误处理机制
- ✅ **日志记录**：记录所有认证相关操作

## 常见问题

### Q1: Session 丢失或频繁登出？

**原因**：
- JWT 密钥不一致
- Cookie 域名配置错误
- Session 过期时间过短

**解决方案**：
```typescript
session: {
  maxAge: 60 * 60 * 24 * 7, // 增加过期时间
  updateAge: 60 * 60 * 2,   // 自动刷新间隔
}
```

### Q2: OAuth 回调失败？

**原因**：
- 回调 URL 配置错误
- Client ID/Secret 错误
- 域名未加入白名单

**解决方案**：
- 检查 `NEXTAUTH_URL` 是否正确
- 确认 OAuth 应用配置
- 查看 NextAuth 调试日志

### Q3: 如何实现单点登录 (SSO)？

**方案**：
1. 使用 OAuth2/OpenID Connect
2. 集成企业 LDAP/AD
3. 使用 SAML 2.0

### Q4: 如何防止并发登录？

**方案**：
```typescript
// 使用 Database Session
session: {
  strategy: 'database',
}

// 登录时删除旧 Session
await db.session.deleteMany({ userId: user.id });
```

### Q5: 如何实现权限细粒度控制？

**方案**：
```typescript
// 扩展 Session 添加权限数组
session.user.permissions = ['read:users', 'write:posts'];

// 检查权限
const hasPermission = session.user.permissions.includes('write:posts');
```

### Q6: 如何处理 Token 过期？

**方案**：
```typescript
// 前端拦截 401 响应，自动刷新 Token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/auth/signin' });
    }
    return Promise.reject(error);
  }
);
```

## 总结

NextAuth.js 是 Next.js 生态中最成熟的认证解决方案，具有以下优势：

- ✅ **易用性**：开箱即用，配置简单
- ✅ **灵活性**：支持多种认证方式和自定义扩展
- ✅ **安全性**：内置多种安全机制
- ✅ **可扩展性**：支持水平扩展，适合大型应用

通过本章学习，你应该掌握：

1. NextAuth.js 的核心概念和配置
2. 多种登录方式的实现
3. Session 管理和权限控制
4. 邮箱验证码和多因子认证
5. 审计日志和安全最佳实践

## 参考资源

- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [OAuth 2.0 规范](https://oauth.net/2/)
- [OpenID Connect 规范](https://openid.net/connect/)
- [JWT 规范](https://jwt.io/)
