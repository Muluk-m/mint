import pageRenderer from './renderer';
import LayoutHoc from './components/LayoutHoc';
import 'antd/dist/antd.less'; // 引入官方提供的 less 样式入口文件
import '@ss/mtd-react/lib/style/index.css';
import '@/lib/assets/css/mth-theme.less';

const Hoc = (options: unknown) => (Wrap: React.FC<unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('%cPageInfo:', 'color: #47B04B; font-weight: 700;', options);
  }

  return LayoutHoc(Wrap) as unknown as React.FC<unknown>;
};

try {
  if (process.env.NODE_ENV === 'development' && module && module.hot) {
    module.hot.accept();
  }
} catch {
  //
}

pageRenderer(Hoc);
