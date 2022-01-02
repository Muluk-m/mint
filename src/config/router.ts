import pagesConfig from './pages.config';

/**
 * 页面地址
 */
export const PAGE_LINK: Record<keyof typeof pagesConfig, string> = Object.entries(
  pagesConfig
).reduce(
  (pageLinks, [key, val]) => ({
    ...pageLinks,
    [key]: val?.route ?? val?.entryPath
  }),
  {}
) as Record<keyof typeof pagesConfig, string>;

/**
 * 面包屑配置
 */
export const pageBreadCrumb = {
  // /** 模型管理 */
  // modulerManage: [{ name: '模型管理' }],
  // /** 仿真管理 */
  // modulerSimulation: [ { name: '仿真管理' }],
  /** 版本管理 */
  getVersionManage: (modelName: string) => [
    { name: `模型列表-${modelName}`, href: PAGE_LINK.modulerManage },
    { name: '版本管理' }
  ]
};
