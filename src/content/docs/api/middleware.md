---
title: 中间件
description: 使用中间件拦截并控制请求和响应
---

## 什么是中间件？

使用中间件可以拦截并控制应用里所有的请求和响应，可以对传入的请求进行修改或重写。默认情况下，任何请求都会经过 middleware。

## 基本用法

创建 `src/middleware.ts` 文件：

```ts
// src/middleware.ts
import { NextRequest } from "next/server";

// 注意这个名字是固定的就要叫 middleware
export function middleware(request: NextRequest) {
  console.log(request.nextUrl.pathname, "🤠");
}
```

此时访问 `localhost:3000`，会发现有很多请求都经过了 middleware。一般情况下需要对此进行控制，只让某些请求命中 middleware。

## 控制匹配路径

常见的有两种方式控制 middleware 对哪些路径生效。

### 方式一：使用 matcher 配置

通过 `export const config` 进行控制，指定 `matcher` 匹配选项：

#### 单个路径匹配

```ts
export const config = {
  matcher: "/about",
};
```

只有访问 `/about` 时才走 middleware 中的逻辑。

#### 多个路径匹配

```ts
export const config = {
  matcher: ["/about", "/dashboard"],
};
```

访问 `/about` 或 `/dashboard` 时才走 middleware。

#### 正则匹配

```ts
export const config = {
  matcher: ["/about/:path*", "/dashboard/:path*"],
};
```

匹配 `/about`、`/about/xxx`、`/about/xxx/xxx` 等。

#### 排除特定路径

```ts
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了以下开头的：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### 方式二：使用条件语句

根据 `pathname` 来决定是否执行特定逻辑，比配置 `matcher` 更直观：

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 访问 /about 时，展示 /about-2 的内容（URL 不变）
  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.rewrite(new URL("/about-2", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  }
}
```

:::tip[提示]
`rewrite` 是重写，前端输入的网址不会变化，但展示的是重写后的页面内容。
:::

## 实战案例：登录认证

实现一个登录系统：登录页输入用户名密码，点击登录跳转到 `/dashboard`，`/dashboard` 点击退出清除 Cookie 返回登录页。未登录时不能访问 `/dashboard`。

### 1. 登录页面

```tsx
// src/app/login/page.tsx
"use client";
import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";

type FieldType = {
  login?: string;
  password?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Page: React.FC = () => {
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await r.json();
    if (data.success === true) {
      router.push("/dashboard");
    }
  };
  return (
    <div className="container flex justify-center pt-10 mx-auto">
      <Form
        className="w-96"
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 600 }}
        initialValues={{ login: "admin", password: "123123" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="用户名"
          name="login"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
```

### 2. 登录接口

```ts
// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { login, password } = body;
  const response = await fetch(`${process.env.DEV_API}/auth/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login,
      password,
    }),
  });
  const data = await response.json();
  if (!data.status) {
    return NextResponse.json(
      { success: false, msg: data.message },
      { status: response.status || 500 }
    );
  }
  const token = data.data.token;
  const responses = NextResponse.json({ success: true, msg: data.message });
  responses.cookies.set("token", token, {
    path: "/",
    maxAge: 86400,
    httpOnly: true,
  });
  return responses;
}
```

#### 另一种设置 Cookie 的写法

```ts
return NextResponse.json(
  { success: true, msg: data.message },
  {
    // 3600 * 24
    headers: { "Set-Cookie": `token=${token};path=/;max-age=86400;HttpOnly` },
  }
);
```

### 3. 环境变量配置

```bash
# .env.development
DEV_API=https://api.zhihur.com/admin
```

### 4. 退出接口

```ts
// src/app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function DELETE() {
  const responses = NextResponse.json({
    success: true,
    msg: "登出成功",
  });
  // 设置过期时间为 0 来删除 cookie
  responses.cookies.set("token", "", { maxAge: 0 });
  return responses;
}
```

### 5. Dashboard 页面

```tsx
// src/app/dashboard/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function Page() {
  const router = useRouter();
  const handleLogout = async () => {
    const r = await fetch("/api/logout", {
      method: "DELETE",
    });
    const data = await r.json();
    if (data.success === true) {
      router.push("/login");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Button type="primary" onClick={handleLogout}>
        退出
      </Button>
    </div>
  );
}
```

### 6. 中间件拦截

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/login")) {
    const token = request.cookies.get("token")?.value;
    // 不是登录页又没有 token
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

#### 保留查询字符串的重定向写法

```ts
// 这种写法可以保留查询字符串等信息
// http://localhost:3001/dashboard?name=ifer
const url = request.nextUrl.clone();
url.pathname = "/login";
return NextResponse.redirect(url);
```

## NextResponse 常用方法

| 方法 | 说明 |
|------|------|
| `NextResponse.next()` | 继续处理请求 |
| `NextResponse.redirect(url)` | 重定向到新 URL（地址栏变化） |
| `NextResponse.rewrite(url)` | 重写到新 URL（地址栏不变） |
| `NextResponse.json(data)` | 返回 JSON 响应 |

## 目录结构

```
src/
├── middleware.ts              # 中间件（项目根目录或 src 目录下）
├── app/
│   ├── login/
│   │   └── page.tsx          # 登录页面
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard 页面
│   └── api/
│       ├── login/
│       │   └── route.ts      # 登录接口
│       └── logout/
│           └── route.ts      # 退出接口
└── .env.development          # 环境变量
```
