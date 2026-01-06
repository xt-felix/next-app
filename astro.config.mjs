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
							],
						},
						{
							label: '路由',
							items: [
								{ label: 'App Router', slug: 'routes/app-router' },
								{ label: '路由导航', slug: 'routes/navigation' },
								{ label: '动态路由', slug: 'routes/dynamic-routes' },
								{ label: 'NotFound 页面', slug: 'routes/not-found' },
							],
						},
						{
							label: '组件',
							items: [
								{ label: 'Header 组件', slug: 'components/header' },
								{ label: 'Hero 组件', slug: 'components/hero' },
							],
						},
						{
							label: '部署',
							items: [
								{ label: 'Vercel 自动部署', slug: 'deploy/vercel' },
							],
						},
					],
				},
			],
		}),
	],
});
