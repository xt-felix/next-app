/**
 * NextAuth 类型扩展
 * 扩展 session 和 token 类型，添加自定义字段
 */

import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'user' | 'guest';
      emailVerified?: boolean;
      mfaEnabled?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'admin' | 'user' | 'guest';
    emailVerified?: boolean;
    mfaEnabled?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'user' | 'guest';
    emailVerified?: boolean;
    mfaEnabled?: boolean;
  }
}
