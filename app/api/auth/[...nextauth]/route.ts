/**
 * NextAuth API Route Handler
 * 处理所有认证相关请求：/api/auth/*
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
