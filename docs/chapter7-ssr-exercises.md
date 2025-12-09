# SSR 实战练习题 + 答案解析

> 💪 **目标**：通过实际练习巩固 SSR 知识
> ⏱️ **建议时间**：每个练习 30-60 分钟
> 📝 **提示**：先自己尝试，再看答案

---

## 📋 目录

- [初级练习](#初级练习)
- [中级练习](#中级练习)
- [高级练习](#高级练习)
- [挑战题](#挑战题)

---

## 初级练习

### 练习 1：显示访问次数

**需求：**
在新闻列表页面显示用户的访问次数，每次刷新页面加 1。

**提示：**
- 使用 Cookie 存储访问次数
- 在 getServerSideProps 中读取和更新

**难度：** ⭐☆☆☆☆

<details>
<summary>点击查看答案</summary>

```typescript
// pages/ssr-news.tsx
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    // 1. 读取当前访问次数
    const currentCount = parseInt(context.req.cookies.visitCount || '0');

    // 2. 访问次数 +1
    const newCount = currentCount + 1;

    // 3. 设置新的 Cookie
    context.res.setHeader(
      'Set-Cookie',
      `visitCount=${newCount}; Path=/; Max-Age=86400`
    );

    // 4. 获取其他数据
    const user = getCurrentUser(context.req);
    const newsList = await fetchNewsList();

    return {
      props: {
        newsList,
        user,
        visitCount: newCount, // 传给页面
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);

// 页面组件中显示
export default function NewsPage({ newsList, user, visitCount, timestamp }) {
  return (
    <div>
      <p>您已访问 {visitCount} 次</p>
      {/* 其他内容 */}
    </div>
  );
}
```

**知识点：**
- 如何读取 Cookie：`context.req.cookies.xxx`
- 如何设置 Cookie：`context.res.setHeader('Set-Cookie', ...)`
- Cookie 格式：`name=value; Path=/; Max-Age=86400`

</details>

---

### 练习 2：根据时间显示问候语

**需求：**
根据服务器时间显示不同的问候语：
- 0-12点：早上好
- 12-18点：下午好
- 18-24点：晚上好

**难度：** ⭐☆☆☆☆

<details>
<summary>点击查看答案</summary>

```typescript
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    // 1. 获取服务器当前时间
    const now = new Date();
    const hour = now.getHours();

    // 2. 根据时间确定问候语
    let greeting = '';
    if (hour >= 0 && hour < 12) {
      greeting = '早上好';
    } else if (hour >= 12 && hour < 18) {
      greeting = '下午好';
    } else {
      greeting = '晚上好';
    }

    const user = getCurrentUser(context.req);
    const newsList = await fetchNewsList();

    return {
      props: {
        newsList,
        user,
        greeting, // 传给页面
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);

// 页面组件
export default function NewsPage({ newsList, user, greeting }) {
  return (
    <div>
      <h1>{greeting}，{user.username}！</h1>
      {/* 其他内容 */}
    </div>
  );
}
```

**知识点：**
- getServerSideProps 使用的是服务器时间
- 可以根据服务器数据动态渲染内容

</details>

---

### 练习 3：添加简单的日志

**需求：**
每次用户访问新闻列表时，在服务端打印日志，包含：
- 访问时间
- 用户名
- IP 地址

**难度：** ⭐⭐☆☆☆

<details>
<summary>点击查看答案</summary>

```typescript
// 获取客户端 IP 的工具函数
function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(',')[0];
  }
  return req.socket?.remoteAddress || 'unknown';
}

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const user = getCurrentUser(context.req);
    const ip = getClientIp(context.req);
    const timestamp = new Date().toLocaleString('zh-CN');

    // 打印日志（在终端查看）
    console.log(`[${timestamp}] ${user.username} (${ip}) 访问新闻列表`);

    const newsList = await fetchNewsList();

    return {
      props: {
        newsList,
        user,
        timestamp,
      },
    };
  }
);
```

**知识点：**
- 如何获取客户端 IP
- console.log 在 getServerSideProps 中会输出到终端
- 可以用于服务端监控和调试

</details>

---

## 中级练习

### 练习 4：实现分页功能

**需求：**
在新闻列表添加分页：
- 每页显示 5 条新闻
- URL 格式：`/ssr-news?page=1`
- 显示上一页、下一页按钮

**难度：** ⭐⭐⭐☆☆

<details>
<summary>点击查看答案</summary>

```typescript
// pages/ssr-news.tsx
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    // 1. 从 URL 获取页码
    const page = parseInt(context.query.page as string) || 1;
    const pageSize = 5;

    const user = getCurrentUser(context.req);
    const allNews = await fetchNewsList();

    // 2. 计算分页
    const totalPages = Math.ceil(allNews.length / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pagedNews = allNews.slice(start, end);

    return {
      props: {
        newsList: pagedNews,
        user,
        currentPage: page,
        totalPages,
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);

// 页面组件
export default function NewsPage({ newsList, user, currentPage, totalPages }) {
  const router = useRouter();

  const goToPage = (page: number) => {
    router.push(`/ssr-news?page=${page}`);
  };

  return (
    <div>
      {/* 新闻列表 */}
      {newsList.map((news) => (
        <div key={news.id}>{news.title}</div>
      ))}

      {/* 分页按钮 */}
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </button>

        <span>
          第 {currentPage} 页 / 共 {totalPages} 页
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
```

**知识点：**
- 使用 `context.query.page` 获取 URL 参数
- 数组切片：`array.slice(start, end)`
- 使用 `router.push` 跳转页面

</details>

---

### 练习 5：实现搜索功能

**需求：**
添加搜索框，搜索新闻标题和内容：
- URL 格式：`/ssr-news?q=关键词`
- 高亮显示搜索关键词
- 显示搜索结果数量

**难度：** ⭐⭐⭐☆☆

<details>
<summary>点击查看答案</summary>

```typescript
// pages/ssr-news.tsx
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const user = getCurrentUser(context.req);
    const keyword = (context.query.q as string) || '';

    let newsList = await fetchNewsList();

    // 如果有搜索关键词，过滤新闻
    if (keyword) {
      newsList = newsList.filter(
        (news) =>
          news.title.includes(keyword) || news.content.includes(keyword)
      );
    }

    return {
      props: {
        newsList,
        user,
        keyword,
        totalResults: newsList.length,
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);

// 页面组件
export default function NewsPage({ newsList, user, keyword, totalResults }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(keyword);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/ssr-news?q=${encodeURIComponent(searchText)}`);
  };

  // 高亮关键词
  const highlightKeyword = (text: string) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      {/* 搜索框 */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="搜索新闻..."
        />
        <button type="submit">搜索</button>
      </form>

      {/* 搜索结果提示 */}
      {keyword && <p>找到 {totalResults} 条结果（关键词：{keyword}）</p>}

      {/* 新闻列表 */}
      {newsList.map((news) => (
        <div key={news.id}>
          <h2>{highlightKeyword(news.title)}</h2>
          <p>{highlightKeyword(news.content)}</p>
        </div>
      ))}
    </div>
  );
}
```

**知识点：**
- URL 编码：`encodeURIComponent()`
- 字符串搜索：`string.includes(keyword)`
- 正则表达式分割：`string.split(regex)`
- 条件渲染：`{condition && <Component />}`

</details>

---

### 练习 6：添加缓存优化

**需求：**
为新闻列表添加 HTTP 缓存，减少服务器压力：
- 缓存 60 秒
- 允许使用过期缓存

**难度：** ⭐⭐⭐☆☆

<details>
<summary>点击查看答案</summary>

```typescript
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    // 设置缓存头
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30'
    );

    const user = getCurrentUser(context.req);
    const newsList = await fetchNewsList();

    return {
      props: {
        newsList,
        user,
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);
```

**Cache-Control 参数说明：**
- `public`: 允许 CDN 缓存
- `s-maxage=60`: CDN 缓存 60 秒
- `stale-while-revalidate=30`: 允许返回过期 30 秒内的缓存，同时在后台更新

**测试方法：**
1. 访问页面，记下时间戳
2. 60 秒内再次访问，时间戳不变（使用缓存）
3. 60 秒后访问，时间戳更新（缓存过期）

</details>

---

## 高级练习

### 练习 7：实现多条件筛选

**需求：**
添加多个筛选条件：
- 分类筛选（技术资讯、前端开发等）
- 日期筛选（最近 7 天、最近 30 天）
- 排序方式（最新、最热）

URL 示例：`/ssr-news?category=前端开发&date=7&sort=views`

**难度：** ⭐⭐⭐⭐☆

<details>
<summary>点击查看答案</summary>

```typescript
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const user = getCurrentUser(context.req);

    // 1. 获取筛选参数
    const category = context.query.category as string;
    const dateFilter = context.query.date as string; // '7' 或 '30'
    const sortBy = (context.query.sort as string) || 'date'; // 'date' 或 'views'

    let newsList = await fetchNewsList();

    // 2. 按分类筛选
    if (category) {
      newsList = newsList.filter((news) => news.category === category);
    }

    // 3. 按日期筛选
    if (dateFilter) {
      const days = parseInt(dateFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      newsList = newsList.filter((news) => {
        const newsDate = new Date(news.publishDate);
        return newsDate >= cutoffDate;
      });
    }

    // 4. 排序
    if (sortBy === 'views') {
      newsList.sort((a, b) => b.views - a.views); // 浏览量降序
    } else {
      newsList.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() -
          new Date(a.publishDate).getTime()
      ); // 日期降序
    }

    // 5. 获取所有分类（用于显示筛选选项）
    const allNews = await fetchNewsList();
    const categories = [...new Set(allNews.map((n) => n.category))];

    return {
      props: {
        newsList,
        user,
        categories,
        filters: {
          category: category || '',
          date: dateFilter || '',
          sort: sortBy,
        },
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);

// 页面组件
export default function NewsPage({ newsList, user, categories, filters }) {
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const query = { ...router.query, [key]: value };
    router.push({ pathname: '/ssr-news', query });
  };

  return (
    <div>
      {/* 筛选器 */}
      <div className="filters">
        {/* 分类筛选 */}
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="">全部分类</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 日期筛选 */}
        <select
          value={filters.date}
          onChange={(e) => updateFilter('date', e.target.value)}
        >
          <option value="">全部时间</option>
          <option value="7">最近 7 天</option>
          <option value="30">最近 30 天</option>
        </select>

        {/* 排序方式 */}
        <select
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
        >
          <option value="date">最新发布</option>
          <option value="views">最多浏览</option>
        </select>
      </div>

      {/* 新闻列表 */}
      {newsList.map((news) => (
        <div key={news.id}>
          <h2>{news.title}</h2>
          <p>分类：{news.category}</p>
          <p>日期：{news.publishDate}</p>
          <p>浏览量：{news.views}</p>
        </div>
      ))}
    </div>
  );
}
```

**知识点：**
- 多参数处理：`context.query.xxx`
- 数组去重：`[...new Set(array)]`
- 日期比较：`new Date().getTime()`
- 数组排序：`array.sort((a, b) => ...)`
- 动态路由跳转：`router.push({ pathname, query })`

</details>

---

### 练习 8：实现用户收藏功能

**需求：**
允许用户收藏新闻：
- 收藏数据存储在 Cookie 中
- 显示收藏状态（已收藏/未收藏）
- 添加"我的收藏"页面

**难度：** ⭐⭐⭐⭐⭐

<details>
<summary>点击查看答案</summary>

```typescript
// pages/ssr-news.tsx
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const user = getCurrentUser(context.req);

    // 读取收藏列表（存储为 JSON 字符串）
    const favoritesJson = context.req.cookies.favorites || '[]';
    const favorites: number[] = JSON.parse(favoritesJson);

    const newsList = await fetchNewsList();

    // 标记哪些新闻已收藏
    const newsListWithFavorites = newsList.map((news) => ({
      ...news,
      isFavorited: favorites.includes(news.id),
    }));

    return {
      props: {
        newsList: newsListWithFavorites,
        user,
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);

// 页面组件
export default function NewsPage({ newsList, user }) {
  const toggleFavorite = async (newsId: number) => {
    // 调用 API 更新收藏状态
    await fetch('/api/v1/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsId }),
    });

    // 刷新页面
    window.location.reload();
  };

  return (
    <div>
      {newsList.map((news) => (
        <div key={news.id}>
          <h2>{news.title}</h2>
          <button onClick={() => toggleFavorite(news.id)}>
            {news.isFavorited ? '取消收藏' : '收藏'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// pages/api/v1/favorites.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST' });
  }

  const { newsId } = req.body;

  // 读取当前收藏列表
  const favoritesJson = req.cookies.favorites || '[]';
  let favorites: number[] = JSON.parse(favoritesJson);

  // 切换收藏状态
  if (favorites.includes(newsId)) {
    favorites = favorites.filter((id) => id !== newsId);
  } else {
    favorites.push(newsId);
  }

  // 保存到 Cookie
  res.setHeader(
    'Set-Cookie',
    `favorites=${JSON.stringify(favorites)}; Path=/; Max-Age=2592000` // 30天
  );

  return res.status(200).json({ success: true, favorites });
}
```

```typescript
// pages/ssr-favorites.tsx（我的收藏页）
export const getServerSideProps: GetServerSideProps = withAuth(
  async (context) => {
    const user = getCurrentUser(context.req);

    // 读取收藏列表
    const favoritesJson = context.req.cookies.favorites || '[]';
    const favoriteIds: number[] = JSON.parse(favoritesJson);

    // 获取收藏的新闻
    const allNews = await fetchNewsList();
    const favoriteNews = allNews.filter((news) =>
      favoriteIds.includes(news.id)
    );

    return {
      props: {
        newsList: favoriteNews,
        user,
        timestamp: new Date().toLocaleString('zh-CN'),
      },
    };
  }
);

export default function FavoritesPage({ newsList, user }) {
  return (
    <div>
      <h1>我的收藏（{newsList.length} 条）</h1>
      {newsList.length === 0 ? (
        <p>暂无收藏</p>
      ) : (
        newsList.map((news) => (
          <div key={news.id}>
            <h2>{news.title}</h2>
          </div>
        ))
      )}
    </div>
  );
}
```

**知识点：**
- Cookie 存储复杂数据：`JSON.stringify()` / `JSON.parse()`
- 客户端调用 API：`fetch('/api/...')`
- 数组操作：`includes()`, `filter()`, `push()`

</details>

---

## 挑战题

### 挑战 1：实现无限滚动加载

**需求：**
当用户滚动到页面底部时，自动加载更多新闻。

**提示：**
- 首次 SSR 加载 10 条
- 后续通过 API 加载
- 使用 IntersectionObserver 检测滚动

**难度：** ⭐⭐⭐⭐⭐

---

### 挑战 2：实现服务端数据缓存

**需求：**
使用 Redis 或内存缓存，避免每次都查询数据库。

**提示：**
- 缓存新闻列表 5 分钟
- 缓存失效后重新获取

**难度：** ⭐⭐⭐⭐⭐

---

## 🎯 学习建议

1. **循序渐进**：先完成初级，再做中级
2. **动手实践**：不要只看答案，自己写一遍
3. **理解原理**：搞懂为什么这样写，而不是死记硬背
4. **举一反三**：尝试改进和扩展

**加油！** 💪
