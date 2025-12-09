# Next.js 全栈开发实战教程

这是一个完整的 Next.js 全栈开发教程项目，包含多个章节的实战案例，从组件化设计到 API Routes 开发。

## 📚 教程目录

### [第五章：组件化设计模式与样式管理进阶](./docs/05-component-design-patterns.md)
学习现代 Web 开发中的组件化设计、响应式布局、暗黑模式、动画效果等。

### [第六章：API Routes 与全栈开发基础](./docs/06-api-routes-fullstack.md) ⭐ 最新
完整的全栈商品管理系统，涵盖 API Routes、JWT 认证、数据校验、限流、文件上传等企业级开发知识点。

---

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问项目
- **商城首页**: http://localhost:3000/shop
- **后台管理**: http://localhost:3000/admin
- **登录页面**: http://localhost:3000/shop/login

### 4. 测试账号
| 用户名 | 密码      | 角色     |
|--------|-----------|----------|
| admin  | admin123  | 管理员   |
| user   | user123   | 普通用户 |

---

## 📦 项目结构

```
next-app/
├── app/                          # 前端页面（App Router）
│   ├── shop/                     # 商城前端
│   │   ├── page.tsx              # 商品列表页
│   │   └── login/
│   │       └── page.tsx          # 登录/注册页
│   ├── admin/
│   │   └── page.tsx              # 后台管理页
│   └── layout.tsx                # 根布局
├── pages/api/v1/                 # API 接口（Pages Router）
│   ├── products/                 # 商品相关接口
│   │   ├── index.ts              # 获取商品列表
│   │   ├── [id].ts               # 获取单个商品
│   │   └── manage.ts             # 管理商品（需管理员权限）
│   ├── auth/                     # 认证相关接口
│   │   ├── login.ts              # 用户登录
│   │   ├── register.ts           # 用户注册
│   │   └── me.ts                 # 获取当前用户信息
│   └── upload/
│       └── image.ts              # 图片上传
├── lib/api/                      # API 工具库
│   ├── response.ts               # 统一响应格式
│   ├── rateLimit.ts              # 接口限流
│   ├── validate.ts               # 数据校验（Zod）
│   ├── auth.ts                   # JWT 认证
│   ├── idempotency.ts            # 幂等性控制
│   └── database.ts               # 数据库（内存模拟）
├── docs/                         # 详细教程文档
│   ├── 05-component-design-patterns.md
│   └── 06-api-routes-fullstack.md
└── public/uploads/               # 上传文件目录
```

---

## ✨ 核心功能

### 后端 API（第六章）
- ✅ **商品 CRUD** - 增删改查，支持分页、搜索
- ✅ **用户认证** - 登录/注册，JWT Token
- ✅ **权限控制** - 管理员/普通用户权限
- ✅ **图片上传** - Base64 方式上传
- ✅ **接口限流** - 防止恶意刷接口
- ✅ **数据校验** - Zod 类型安全校验
- ✅ **幂等性** - 防止重复提交
- ✅ **统一响应** - 规范的 API 响应格式
- ✅ **错误处理** - 完善的错误处理机制

### 前端页面（第六章）
- ✅ **商品商城** - 列表展示、分页、搜索
- ✅ **后台管理** - 商品管理、图片上传
- ✅ **用户登录** - 登录/注册切换
- ✅ **响应式设计** - 完美适配移动端
- ✅ **暗黑模式** - 自动适配系统主题

### 组件化设计（第五章）
- ✅ **响应式导航栏** - 移动端汉堡菜单
- ✅ **商品卡片** - CSS Modules + Tailwind
- ✅ **动画按钮** - Framer Motion 动画
- ✅ **联系表单** - React Hook Form + Zod
- ✅ **暗黑模式** - CSS 变量 + localStorage

---

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router + Pages Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **认证**: JWT (jsonwebtoken)
- **校验**: Zod
- **动画**: Framer Motion
- **表单**: React Hook Form
- **数据**: 内存存储（可替换为 Prisma/TypeORM）

---

## 📖 API 接口文档

### 商品相关
```
GET    /api/v1/products           # 获取商品列表（支持分页、搜索）
GET    /api/v1/products/[id]      # 获取商品详情
POST   /api/v1/products/manage    # 创建商品（需管理员）
PUT    /api/v1/products/manage    # 更新商品（需管理员）
DELETE /api/v1/products/manage    # 删除商品（需管理员）
```

### 认证相关
```
POST   /api/v1/auth/login         # 用户登录
POST   /api/v1/auth/register      # 用户注册
GET    /api/v1/auth/me            # 获取当前用户信息（需登录）
```

### 文件上传
```
POST   /api/v1/upload/image       # 上传图片（需登录）
```

**详细文档**: 查看 [docs/06-api-routes-fullstack.md](./docs/06-api-routes-fullstack.md)

---

## 🎓 学习路径

### 初学者
1. 先阅读 [第六章文档](./docs/06-api-routes-fullstack.md) 了解基本概念
2. 运行项目，使用测试账号体验功能
3. 查看 API 接口实现（`pages/api/v1/`）
4. 查看前端页面实现（`app/shop/`, `app/admin/`）

### 进阶开发者
1. 深入研究工具库实现（`lib/api/`）
2. 学习 JWT 认证流程
3. 掌握数据校验和限流
4. 理解幂等性和防重复提交

### 高级开发者
1. 替换为真实数据库（Prisma）
2. 添加更多企业级特性
3. 实现复杂权限控制（RBAC）
4. 接口性能优化和监控

---

## 🌟 核心知识点

### 1. API Routes 基础
- RESTful API 设计规范
- HTTP 方法处理（GET、POST、PUT、DELETE）
- 动态路由参数
- 接口版本管理（/api/v1）

### 2. 统一响应格式
```typescript
{
  code: 0,           // 0 表示成功，非 0 表示错误
  message: "操作成功",
  data: { ... },     // 响应数据
  timestamp: 1234567890
}
```

### 3. JWT 认证流程
1. 用户登录 → 服务端生成 Token
2. 前端存储 Token（localStorage）
3. 每次请求携带 Token（Authorization 头）
4. 服务端验证 Token 有效性

### 4. 数据校验（Zod）
```typescript
const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
});
```

### 5. 接口限流
```typescript
// 每个 IP 每分钟最多 10 次请求
if (checkRateLimit(ip, 10, 60_000)) {
  return res.status(429).json(error('请求过于频繁'));
}
```

### 6. 幂等性控制
```typescript
// 通过唯一 ID 防止重复提交
const key = req.headers['x-idempotency-key'];
if (isDuplicateRequest(key)) {
  return res.status(409).json(error('重复提交'));
}
```

---

## 🔒 安全最佳实践

1. **环境变量管理** - 敏感信息存储在 `.env.local`
2. **密码加密** - 生产环境使用 bcrypt
3. **HTTPS** - 生产环境必须使用 HTTPS
4. **输入校验** - 所有用户输入必须校验
5. **接口限流** - 防止暴力破解
6. **JWT 过期** - 设置合理的过期时间

---

## 🚧 常见问题

### Q: 如何切换到真实数据库？
A: 安装 Prisma，定义数据模型，替换 `lib/api/database.ts` 中的内存存储。详见文档。

### Q: 如何部署到 Vercel？
A: 直接推送到 GitHub，在 Vercel 导入项目，配置环境变量 `JWT_SECRET`。

### Q: 如何修改 JWT 密钥？
A: 创建 `.env.local` 文件，添加 `JWT_SECRET=your_custom_key`。

### Q: 图片上传保存在哪里？
A: 当前保存在 `public/uploads/` 目录。生产环境建议使用 OSS/CDN。

---

## 📚 详细文档

- [第五章：组件化设计模式](./docs/05-component-design-patterns.md)
- [第六章：API Routes 全栈开发](./docs/06-api-routes-fullstack.md)（20+ 页详细教程）

---

## 🎯 下一步扩展

- [ ] 集成真实数据库（Prisma + PostgreSQL）
- [ ] 添加购物车与订单系统
- [ ] 集成支付接口（微信、支付宝）
- [ ] 添加邮件通知
- [ ] 实现数据导出（Excel）
- [ ] 添加单元测试和集成测试
- [ ] 接入 Sentry 错误监控
- [ ] WebSocket 实时消息推送
- [ ] 多租户系统设计
- [ ] 国际化支持（i18n）

---

## 📝 学习资源

- **Next.js 官方文档**: https://nextjs.org/docs
- **React 官方文档**: https://react.dev
- **Tailwind CSS 文档**: https://tailwindcss.com/docs
- **JWT 官网**: https://jwt.io/
- **Zod 文档**: https://zod.dev/
- **Prisma 文档**: https://www.prisma.io/docs

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

**鲫小鱼**
- 公众号: 鲫小鱼不正经
- 座右铭: 不写前端代码的前端工程师，热衷于分享非前端的知识

---

**最后更新**: 2025-12-09
**当前版本**: v2.0（新增第六章 API Routes 完整案例）
