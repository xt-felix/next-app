import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { checkLogin, getCurrentUser } from '../utils/auth';

/**
 * SSR 鉴权中间件
 * 用于保护需要登录才能访问的页面
 *
 * @example
 * export const getServerSideProps = withAuth(async (ctx) => {
 *   // 这里的代码只有在用户已登录时才会执行
 *   return { props: { data: 'some data' } };
 * });
 */
export function withAuth<P extends { [key: string]: any }>(
  getServerSidePropsFunc: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const { req } = context;

    // 检查用户是否已登录
    if (!checkLogin(req)) {
      return {
        redirect: {
          destination: `/ssr-login?redirect=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      };
    }

    // 用户已登录，继续执行原函数
    return await getServerSidePropsFunc(context);
  };
}

/**
 * SSR 角色权限中间件
 * 用于保护需要特定角色才能访问的页面
 *
 * @param roles - 允许访问的角色列表
 * @example
 * export const getServerSideProps = withRole(['admin'], async (ctx) => {
 *   // 这里的代码只有管理员才能执行
 *   return { props: { data: 'admin data' } };
 * });
 */
export function withRole<P extends { [key: string]: any }>(
  roles: string[],
  getServerSidePropsFunc: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const { req } = context;

    // 先检查是否登录
    if (!checkLogin(req)) {
      return {
        redirect: {
          destination: `/ssr-login?redirect=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      };
    }

    // 获取当前用户信息
    const user = getCurrentUser(req);

    // 检查用户角色
    if (!user || !roles.includes(user.role)) {
      return {
        redirect: {
          destination: '/ssr-403',
          permanent: false,
        },
      };
    }

    // 权限验证通过，继续执行原函数
    return await getServerSidePropsFunc(context);
  };
}

/**
 * SSR 错误处理中间件
 * 自动捕获 getServerSideProps 中的错误
 *
 * @example
 * export const getServerSideProps = withErrorHandling(async (ctx) => {
 *   // 如果这里抛出错误，会自动跳转到错误页面
 *   const data = await fetchData();
 *   return { props: { data } };
 * });
 */
export function withErrorHandling<P extends { [key: string]: any }>(
  getServerSidePropsFunc: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    try {
      return await getServerSidePropsFunc(context);
    } catch (error) {
      console.error('SSR Error:', error);

      // 可以根据错误类型返回不同的结果
      return {
        redirect: {
          destination: '/ssr-error?message=' + encodeURIComponent(
            error instanceof Error ? error.message : '服务器错误'
          ),
          permanent: false,
        },
      };
    }
  };
}

/**
 * 组合多个中间件
 *
 * @example
 * export const getServerSideProps = compose(
 *   withErrorHandling,
 *   withAuth,
 *   async (ctx) => {
 *     return { props: { data: 'some data' } };
 *   }
 * );
 */
export function compose<P extends { [key: string]: any }>(
  ...middlewares: Array<
    (
      func: (
        context: GetServerSidePropsContext
      ) => Promise<GetServerSidePropsResult<P>>
    ) => (
      context: GetServerSidePropsContext
    ) => Promise<GetServerSidePropsResult<P>>
  >
) {
  return (
    getServerSidePropsFunc: (
      context: GetServerSidePropsContext
    ) => Promise<GetServerSidePropsResult<P>>
  ) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      getServerSidePropsFunc
    );
  };
}
