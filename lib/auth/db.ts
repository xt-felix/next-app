/**
 * 模拟数据库操作
 * 在生产环境中应替换为真实数据库（Prisma、MongoDB 等）
 */

import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'guest';
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface VerificationCode {
  email: string;
  code: string;
  expiresAt: Date;
  type: 'email-login' | 'mfa' | 'password-reset';
}

// 模拟用户数据库
const users: User[] = [
  {
    id: '1',
    name: '超级管理员',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: '普通用户',
    email: 'user@example.com',
    password: bcrypt.hashSync('user123', 10),
    role: 'user',
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 模拟审计日志数据库
const auditLogs: AuditLog[] = [];

// 模拟验证码存储（生产环境应使用 Redis）
const verificationCodes: VerificationCode[] = [];

// 用户操作
export const db = {
  user: {
    findByEmail: async (email: string): Promise<User | null> => {
      return users.find(u => u.email === email) || null;
    },

    findById: async (id: string): Promise<User | null> => {
      return users.find(u => u.id === id) || null;
    },

    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      const newUser: User = {
        ...data,
        id: String(users.length + 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    },

    update: async (id: string, data: Partial<User>): Promise<User | null> => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return null;
      users[index] = { ...users[index], ...data, updatedAt: new Date() };
      return users[index];
    },

    delete: async (id: string): Promise<boolean> => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    },

    findAll: async (): Promise<User[]> => {
      return users;
    },

    verifyPassword: async (email: string, password: string): Promise<User | null> => {
      const user = await db.user.findByEmail(email);
      if (!user || !user.password) return null;
      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    },
  },

  // 审计日志操作
  auditLog: {
    create: async (data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> => {
      const log: AuditLog = {
        ...data,
        id: String(auditLogs.length + 1),
        timestamp: new Date(),
      };
      auditLogs.push(log);
      return log;
    },

    findByUserId: async (userId: string, limit = 50): Promise<AuditLog[]> => {
      return auditLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    },

    findAll: async (limit = 100): Promise<AuditLog[]> => {
      return auditLogs
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    },
  },

  // 验证码操作
  verificationCode: {
    create: async (data: VerificationCode): Promise<void> => {
      // 删除旧的验证码
      const index = verificationCodes.findIndex(
        v => v.email === data.email && v.type === data.type
      );
      if (index !== -1) {
        verificationCodes.splice(index, 1);
      }
      verificationCodes.push(data);
    },

    verify: async (email: string, code: string, type: VerificationCode['type']): Promise<boolean> => {
      const index = verificationCodes.findIndex(
        v => v.email === email && v.code === code && v.type === type
      );
      if (index === -1) return false;

      const verification = verificationCodes[index];
      if (verification.expiresAt < new Date()) {
        verificationCodes.splice(index, 1);
        return false;
      }

      verificationCodes.splice(index, 1);
      return true;
    },
  },
};
