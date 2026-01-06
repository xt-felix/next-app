---
title: 集成 Ant Design
description: 在 Next.js 项目中集成 Ant Design 组件库
---

## 安装依赖

```bash
npm install antd @ant-design/nextjs-registry
```

| 包名 | 说明 |
|------|------|
| `antd` | Ant Design 组件库 |
| `@ant-design/nextjs-registry` | Next.js App Router 专用的样式注册器 |

## 配置 AntdRegistry

在根布局中配置 `AntdRegistry`，确保 Ant Design 样式在服务端渲染时正确注入：

```tsx
// app/layout.tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
```

## 使用组件

配置完成后，可以直接在组件中使用 Ant Design：

```tsx
// app/page.tsx
import { Button, Space } from "antd";

export default function Home() {
  return (
    <Space>
      <Button type="primary">主要按钮</Button>
      <Button>默认按钮</Button>
      <Button type="dashed">虚线按钮</Button>
      <Button type="link">链接按钮</Button>
    </Space>
  );
}
```

## 配置主题

### 全局主题配置

使用 `ConfigProvider` 配置全局主题：

```tsx
// app/layout.tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1890ff",
                borderRadius: 6,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

### 常用主题配置项

```tsx
<ConfigProvider
  theme={{
    token: {
      // 品牌色
      colorPrimary: "#1890ff",
      // 成功色
      colorSuccess: "#52c41a",
      // 警告色
      colorWarning: "#faad14",
      // 错误色
      colorError: "#ff4d4f",
      // 圆角
      borderRadius: 6,
      // 字体
      fontFamily: "Inter, sans-serif",
    },
    components: {
      Button: {
        colorPrimary: "#00b96b",
        algorithm: true,
      },
    },
  }}
>
  {children}
</ConfigProvider>
```

## 配置中文语言

Ant Design 默认是英文，配置中文需要导入语言包：

```tsx
// app/layout.tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider locale={zhCN}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

## 在客户端组件中使用

某些 Ant Design 组件需要交互，必须在客户端组件中使用：

```tsx
// components/counter.tsx
"use client";

import { useState } from "react";
import { Button, InputNumber, Space } from "antd";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Space>
      <Button onClick={() => setCount(count - 1)}>-</Button>
      <InputNumber value={count} onChange={(v) => setCount(v || 0)} />
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </Space>
  );
}
```

## 表单示例

```tsx
"use client";

import { Button, Form, Input, message } from "antd";

type FieldType = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const [form] = Form.useForm();

  const onFinish = (values: FieldType) => {
    console.log("提交:", values);
    message.success("登录成功");
  };

  return (
    <Form
      form={form}
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
    >
      <Form.Item<FieldType>
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="密码"
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
}
```

## 完整配置示例

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js with Ant Design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: "#1890ff",
                borderRadius: 6,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

## 常见问题

### 样式闪烁（FOUC）

如果遇到样式闪烁问题，确保：
1. 正确使用了 `@ant-design/nextjs-registry`
2. `AntdRegistry` 包裹在最外层

### message/notification 不显示

这些组件需要在客户端使用，确保组件标记了 `"use client"`。

也可以使用 App 组件包裹来获取静态方法：

```tsx
"use client";

import { App, Button } from "antd";

export default function MyComponent() {
  const { message, notification } = App.useApp();

  return (
    <Button onClick={() => message.success("成功")}>
      显示消息
    </Button>
  );
}
```

然后在 layout 中添加 App 组件：

```tsx
<AntdRegistry>
  <ConfigProvider locale={zhCN}>
    <App>{children}</App>
  </ConfigProvider>
</AntdRegistry>
```

:::tip[提示]
Ant Design 5.x 推荐使用 `App.useApp()` 来获取 message、notification、modal 的实例方法，这样可以正确获取 ConfigProvider 的配置。
:::
