# 项目样式系统说明

## 样式问题已修复 ✅

### 问题原因
项目使用 **Tailwind CSS v4**，需要在 `globals.css` 中导入 Tailwind 才能使所有工具类生效。

### 解决方案
在 `app/globals.css` 文件顶部添加：
```css
@import "tailwindcss";
```

## 完整样式系统

### 1. 全局样式文件
**文件**: `app/globals.css`

包含以下内容：
- Tailwind CSS 导入
- CSS 变量系统（颜色、阴影、边框等）
- 自定义组件样式（按钮、表单、卡片等）
- 响应式工具类
- 暗黑模式支持

### 2. CSS 变量系统

#### 颜色变量
```css
--primary-color: #3b82f6;      /* 主色调 - 蓝色 */
--success-color: #10b981;      /* 成功 - 绿色 */
--warning-color: #f59e0b;      /* 警告 - 黄色 */
--danger-color: #ef4444;       /* 危险 - 红色 */
--gray-50 到 --gray-900        /* 中性色系列 */
```

#### 阴影变量
```css
--shadow-sm: 小阴影
--shadow: 标准阴影
--shadow-md: 中等阴影
--shadow-lg: 大阴影
--shadow-xl: 超大阴影
```

### 3. 自定义组件样式

#### 按钮（.btn）
```html
<button class="btn btn-primary">主按钮</button>
<button class="btn btn-secondary">次按钮</button>
<button class="btn btn-success">成功按钮</button>
<button class="btn btn-danger">危险按钮</button>

<!-- 尺寸变体 -->
<button class="btn btn-primary btn-sm">小按钮</button>
<button class="btn btn-primary btn-lg">大按钮</button>
```

#### 表单（.form-*）
```html
<div class="form-group">
  <label class="form-label">标签</label>
  <input type="text" class="form-input" />
  <p class="form-error">错误提示</p>
</div>
```

#### 卡片（.card）
```html
<div class="card">
  <div class="card-header">标题</div>
  <div class="card-body">内容</div>
  <div class="card-footer">底部</div>
</div>
```

#### 网格布局（.grid）
```html
<div class="grid grid-cols-3 gap-6">
  <div>项目1</div>
  <div>项目2</div>
  <div>项目3</div>
</div>
```

#### 徽章（.badge）
```html
<span class="badge badge-primary">主徽章</span>
<span class="badge badge-success">成功</span>
<span class="badge badge-warning">警告</span>
<span class="badge badge-danger">危险</span>
```

#### 提示框（.alert）
```html
<div class="alert alert-success">成功提示</div>
<div class="alert alert-error">错误提示</div>
<div class="alert alert-warning">警告提示</div>
<div class="alert alert-info">信息提示</div>
```

### 4. 响应式设计

#### 断点
- **移动端**: < 768px （单列布局）
- **平板**: 769px - 1024px （两列布局）
- **桌面**: > 1024px （三/四列布局）

#### 响应式示例
```css
/* 移动端 */
@media (max-width: 768px) {
  .grid-cols-2, .grid-cols-3, .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid-cols-3, .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

## 项目页面样式

### 1. 首页（/）
- 渐变背景
- 功能卡片展示
- 核心知识点列表
- 测试账号信息
- 完全响应式

### 2. 商城页面（/shop）
- 固定顶部导航
- 搜索框
- 商品卡片网格
- 分页控制
- 加载/错误状态

### 3. 登录页面（/shop/login）
- 居中表单设计
- 渐变背景
- 切换登录/注册
- 快速登录按钮
- 表单验证提示

### 4. 后台管理（/admin）
- 顶部导航栏
- 添加商品表单
- 商品列表表格
- 图片预览
- CRUD 操作按钮

## 暗黑模式

所有页面都支持暗黑模式，使用 Tailwind 的 `dark:` 前缀：

```html
<!-- 自动适配暗黑模式 -->
<div class="bg-white dark:bg-gray-800">
  <h1 class="text-gray-900 dark:text-white">标题</h1>
  <p class="text-gray-600 dark:text-gray-400">文本</p>
</div>
```

## 如何使用

### 1. 使用 Tailwind 工具类（推荐）
```html
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  按钮
</button>
```

### 2. 使用自定义样式类
```html
<button class="btn btn-primary">按钮</button>
```

### 3. 混合使用
```html
<div class="card mt-6">
  <div class="card-body">
    <h2 class="text-2xl font-bold mb-4">标题</h2>
    <p class="text-gray-600">内容</p>
  </div>
</div>
```

## 性能优化

1. **Tailwind CSS v4**: 使用最新版本，编译速度更快
2. **按需加载**: 只包含使用的工具类
3. **CSS 压缩**: 生产环境自动压缩
4. **自定义样式**: 仅添加必要的自定义样式

## 验证样式是否生效

### 方法1：检查浏览器
1. 打开 http://localhost:3000
2. 按 F12 打开开发者工具
3. 查看 Elements 标签页
4. 检查元素是否有正确的样式

### 方法2：检查网络请求
1. 打开开发者工具的 Network 标签
2. 刷新页面
3. 查找 `globals_*.css` 文件
4. 确认文件已加载且状态为 200

### 方法3：检查编译
```bash
npm run build
```
如果构建成功且没有 CSS 相关错误，说明样式配置正确。

## 常见问题

### Q: 样式不生效？
**A**: 确保 `app/globals.css` 第一行是 `@import "tailwindcss";`

### Q: 暗黑模式不工作？
**A**: 确保使用了 `dark:` 前缀，例如 `dark:bg-gray-900`

### Q: 自定义样式覆盖 Tailwind？
**A**: 将自定义样式写在 `@import "tailwindcss";` 之后

### Q: 响应式不生效？
**A**: 检查是否使用了正确的断点前缀：`sm:`、`md:`、`lg:`

## 总结

项目现在拥有：
- ✅ 完整的样式系统
- ✅ Tailwind CSS v4 支持
- ✅ 自定义组件样式
- ✅ 响应式设计
- ✅ 暗黑模式支持
- ✅ 性能优化

所有页面都已应用统一的设计风格，提供了良好的用户体验！
