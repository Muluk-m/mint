import pageRenderer from '@/libs/renderer';
import LayoutHoc from '@/components/LayoutHoc';
import routes from './routes';
import '@/common/share';

/**
 * 页面组件预处理 可用来实现页面鉴权，异常处理等
 */

const Hoc = (options: unknown) => (App: React.ComponentType<unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('%cPageInfo:', 'color: #47B04B; font-weight: 700;', options);
  }

  return LayoutHoc(App);
};

pageRenderer(routes, Hoc, {
  name: '单页应用',
  basePath: 'page-spa'
});
