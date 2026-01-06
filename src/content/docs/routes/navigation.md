---
title: 路由导航
description: Next.js 中的页面跳转和导航方式
---

## Link 组件

`Link` 是 Next.js 提供的客户端导航组件，支持预加载和无刷新跳转：

```tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">首页</Link>
      <Link href="/about">关于</Link>
      <Link href="/blog/hello-world">文章详情</Link>
    </nav>
  );
}
```

### Link 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `href` | string \| object | 目标路径（必填） |
| `replace` | boolean | 替换历史记录而不是新增 |
| `prefetch` | boolean | 是否预加载，默认 true |
| `scroll` | boolean | 跳转后是否滚动到顶部，默认 true |

```tsx
// 替换历史记录
<Link href="/dashboard" replace>
  Dashboard
</Link>

// 禁用预加载
<Link href="/heavy-page" prefetch={false}>
  大页面
</Link>

// 保持滚动位置
<Link href="/section" scroll={false}>
  锚点
</Link>
```

### 动态路径

```tsx
// 使用模板字符串
<Link href={`/blog/${post.slug}`}>
  {post.title}
</Link>

// 使用对象形式
<Link
  href={{
    pathname: '/blog/[slug]',
    query: { slug: post.slug },
  }}
>
  {post.title}
</Link>
```

## useRouter Hook

`useRouter` 用于在客户端组件中进行编程式导航：

```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    // 登录逻辑...
    router.push('/dashboard');
  };

  return <button onClick={handleLogin}>登录</button>;
}
```

### router 方法

| 方法 | 说明 |
|------|------|
| `router.push(url)` | 跳转到新页面 |
| `router.replace(url)` | 替换当前页面 |
| `router.back()` | 返回上一页 |
| `router.forward()` | 前进到下一页 |
| `router.refresh()` | 刷新当前页面 |
| `router.prefetch(url)` | 预加载页面 |

```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function NavigationButtons() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.back()}>返回</button>
      <button onClick={() => router.forward()}>前进</button>
      <button onClick={() => router.refresh()}>刷新</button>
      <button onClick={() => router.push('/home')}>去首页</button>
      <button onClick={() => router.replace('/login')}>去登录</button>
    </div>
  );
}
```

## redirect 函数

在服务端组件或 Server Actions 中使用 `redirect` 进行重定向：

```tsx
import { redirect } from 'next/navigation';

async function checkAuth() {
  const isLoggedIn = await getSession();

  if (!isLoggedIn) {
    redirect('/login');
  }
}

export default async function DashboardPage() {
  await checkAuth();

  return <div>Dashboard 内容</div>;
}
```

:::caution[注意]
`redirect` 会抛出异常来中断渲染，所以不要在 try/catch 块中使用它。
:::

## usePathname Hook

获取当前路径，常用于高亮当前导航项：

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于' },
  { href: '/blog', label: '博客' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? 'active' : ''}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

### usePathname 返回值

| URL | usePathname() 返回值 |
|-----|---------------------|
| `/` | `/` |
| `/about` | `/about` |
| `/about?name=test` | `/about` |
| `/blog/hello-world` | `/blog/hello-world` |

:::note[注意]
`usePathname` 只返回路径部分，不包含查询参数和 hash。如需获取查询参数，使用 `useSearchParams`。
:::

### 子路由匹配

判断当前路径是否属于某个父路由：

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  // 精确匹配
  const isHome = pathname === '/';

  // 前缀匹配（包括子路由）
  const isBlog = pathname.startsWith('/blog');

  return (
    <nav>
      <Link href="/" className={isHome ? 'active' : ''}>
        首页
      </Link>
      <Link href="/blog" className={isBlog ? 'active' : ''}>
        博客
      </Link>
    </nav>
  );
}
```

## useSearchParams Hook

获取 URL 查询参数：

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // /search?q=hello → 'hello'

  return <div>搜索关键词: {query}</div>;
}
```

### 更新查询参数

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <select onChange={(e) => updateFilter('sort', e.target.value)}>
      <option value="newest">最新</option>
      <option value="popular">最热</option>
    </select>
  );
}
```
