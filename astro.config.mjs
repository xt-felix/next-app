// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Next.js 学习笔记',
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			sidebar: [
				{
					label: '学习指南',
					items: [
						{
							label: '入门',
							items: [
								{ label: '开始使用', slug: 'guides/getting-started' },
								{ label: '项目搭建', slug: 'guides/create-project' },
							],
						},
						{
							label: '基础',
							items: [
								{ label: '页面元数据', slug: 'basics/metadata' },
								{ label: 'Favicon 配置', slug: 'basics/favicon' },
								{ label: '字体配置', slug: 'basics/fonts' },
								{ label: '集成 Ant Design', slug: 'basics/antd' },
							],
						},
						{
							label: '路由',
							items: [
								{ label: 'App Router', slug: 'routes/app-router' },
								{ label: '路由导航', slug: 'routes/navigation' },
								{ label: '动态路由', slug: 'routes/dynamic-routes' },
								{ label: '平行路由', slug: 'routes/parallel-routes' },
								{ label: '拦截路由', slug: 'routes/intercepting-routes' },
								{ label: 'NotFound 页面', slug: 'routes/not-found' },
							],
						},
						{
							label: '组件',
							items: [
								{ label: 'Header 组件', slug: 'components/header' },
								{ label: 'Hero 组件', slug: 'components/hero' },
								{ label: '服务端组件', slug: 'components/server-component' },
							],
						},
						{
							label: 'API',
							items: [
								{ label: 'Route Handler', slug: 'api/route-handler' },
								{ label: '集成 lowdb', slug: 'api/lowdb' },
								{ label: 'GET 缓存', slug: 'api/get-cache' },
								{ label: '数据获取和缓存', slug: 'api/data-fetching' },
								{ label: 'Next.js 中的缓存', slug: 'api/caching' },
								{ label: 'Server Action', slug: 'api/server-action' },
								{ label: '中间件', slug: 'api/middleware' },
							],
						},
						{
							label: '部署',
							items: [
								{ label: 'Vercel 自动部署', slug: 'deploy/vercel' },
							],
						},
						{ label: 'Snippets 项目', slug: 'guides/snippets-project' },
						{
							label: '实战项目',
							items: [
								{ label: '🦜 论坛项目', slug: 'guides/forum-project' },
							],
						},
					],
				},
			],
		}),
	],
});
