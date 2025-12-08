# API Routes 与全栈开发基础案例

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问页面
- 商城首页：http://localhost:3000/shop
- 后台管理：http://localhost:3000/admin
- 登录页面：http://localhost:3000/shop/login

### 4. 测试账号
| 用户名 | 密码      | 角色     |
|--------|-----------|----------|
| admin  | admin123  | 管理员   |
| user   | user123   | 普通用户 |

## 项目结构

```
next-app/
├── app/                      # 前端页面（App Router）
│   ├── shop/                 # 商城前端
│   ├── admin/                # 后台管理
│   └── layout.tsx            # 根布局
├── pages/api/v1/             # API 接口（Pages Router）
│   ├── products/             # 商品相关接口
│   ├── auth/                 # 认证相关接口
│   └── upload/               # 文件上传接口
├── lib/api/                  # API 工具库
│   ├── response.ts           # 统一响应格式
│   ├── rateLimit.ts          # 接口限流
│   ├── validate.ts           # 数据校验
│   ├── auth.ts               # JWT 认证
│   ├── idempotency.ts        # 幂等性控制
│   └── database.ts           # 数据库（内存模拟）
├── docs/                     # 详细文档
│   └── 06-api-routes-fullstack.md
└── public/uploads/           # 上传文件目录
```

## 核心功能

### 后端 API
- ✅ 商品 CRUD（增删改查）
- ✅ 用户认证（登录/注册）
- ✅ JWT 权限控制
- ✅ 图片上传
- ✅ 接口限流
- ✅ 数据校验
- ✅ 幂等性防重复提交
- ✅ 统一响应格式
- ✅ 错误处理

### 前端页面
- ✅ 商品列表（分页、搜索）
- ✅ 后台管理（商品管理、图片上传）
- ✅ 用户登录/注册
- ✅ 响应式设计
- ✅ 暗黑模式

## 技术栈

- **框架**: Next.js 16 (App Router + Pages Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **认证**: JWT (jsonwebtoken)
- **校验**: Zod
- **数据**: 内存存储（可替换为 Prisma/TypeORM）

## API 接口文档

详见 [docs/06-api-routes-fullstack.md](./docs/06-api-routes-fullstack.md)

### 主要接口

#### 商品相关
- `GET /api/v1/products` - 获取商品列表
- `GET /api/v1/products/[id]` - 获取商品详情
- `POST /api/v1/products/manage` - 创建商品（需管理员权限）
- `PUT /api/v1/products/manage` - 更新商品（需管理员权限）
- `DELETE /api/v1/products/manage` - 删除商品（需管理员权限）

#### 认证相关
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/register` - 用户注册
- `GET /api/v1/auth/me` - 获取当前用户信息（需登录）

#### 文件上传
- `POST /api/v1/upload/image` - 上传图片（需登录）

## 学习建议

1. **初学者**：先从 [docs/06-api-routes-fullstack.md](./docs/06-api-routes-fullstack.md) 开始阅读，了解基本概念
2. **进阶开发者**：研究 `lib/api/` 目录下的工具库实现
3. **高级开发者**：尝试替换为真实数据库、添加更多企业级特性

## 下一步扩展

- [ ] 集成真实数据库（Prisma）
- [ ] 添加购物车与订单系统
- [ ] 集成支付接口
- [ ] 添加邮件通知
- [ ] 实现数据导出（Excel）
- [ ] 添加单元测试和集成测试
- [ ] 接入 Sentry 错误监控
- [ ] 部署到 Vercel

## 常见问题

### 如何修改 JWT 密钥？

在项目根目录创建 `.env.local` 文件：
```
JWT_SECRET=your_custom_secret_key
```

### 如何切换到真实数据库？

参考文档中的"如何切换到真实数据库"章节。

## 许可证

MIT
