import pageRenderer from './renderer';
import LayoutHoc from './components/LayoutHoc';
import pages from './config/pages.config';

const Hoc = (options: unknown) => (App: React.ComponentType<unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('%cPageInfo:', 'color: #47B04B; font-weight: 700;', options);
  }

  return LayoutHoc(App);
};

try {
  if (process.env.NODE_ENV === 'development' && module && module.hot) {
    module.hot.accept();
  }
} catch {
  //
}

pageRenderer(pages, Hoc);
