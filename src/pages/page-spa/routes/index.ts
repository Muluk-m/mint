const importPage = (path: string) => () => import(`../views/${path}`);

const routes = {
  list: {
    title: 'spa-列表页',
    path: '/list',
    component: importPage('list')
  },
  detail: {
    title: 'spa-详情页',
    path: '/detail',
    component: importPage('detail')
  }
};

/**
 * 基于routes配置生成 页面地址对象
 * 使用方式 PAGE_LINK.list
 *  => list的path
 */
export const PAGE_LINK = Object.entries(routes).reduce(
  (pageLinks, [key, { path }]) => ({ ...pageLinks, [key]: path }),
  {}
) as Record<keyof typeof routes, string>;

export default routes;
