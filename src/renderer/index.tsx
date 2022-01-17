import React from 'react';
import { Router } from '@reach/router';
import { render } from 'react-dom';
import PageOverview from './PageOverview';
import EmptyPage from './EmptyPage';
import FallLoading from './FallLoading';

type RenderHOC = (
  config: any
) => (App: React.ComponentType<unknown>) => React.ComponentType<unknown>;

interface PageConfig {
  title: string;
  entryPath: string;
  route?: string;
  children?: PagesConfig;
}

export interface PagesConfig {
  [name: string]: PageConfig;
}

const BASE_PATH = '/';

const getChildrenPages = (
  PageComponent: React.LazyExoticComponent<React.ComponentType<unknown>>,
  parentConfig: PageConfig
) => {
  const Component = (options: any) => {
    return (
      <PageComponent {...options}>
        <Router>
          {Object.values(parentConfig.children!).map(({ route, ...options }) => {
            const { entryPath } = options;
            const childrenPath = `${parentConfig.entryPath}/pages/${entryPath}`;
            const App = React.lazy(() => import(`@/pages/${childrenPath}`));

            const props = {
              path: route ?? entryPath,
              ...options
            };

            return <App key={entryPath} {...props} />;
          })}
        </Router>
      </PageComponent>
    );
  };

  return Component;
};

const getPages = (pagesConfig: PagesConfig, hoc: RenderHOC) =>
  Object.values(pagesConfig).map((pageConfig) => {
    const { route, children, ...config } = pageConfig;
    /**
     * TODO 后期项目体量大了需要缩小 import() 静态路径的范围
     * 或者生成绝对路径的 entryPath 文件
     * 避免webpack打包的chunk体量过大,不益于tree shaking
     */
    const PageComponent = React.lazy(() => import(`@/pages/${config.entryPath}`));
    const path = route ?? config.entryPath;

    const Page =
      typeof children === 'object' ? getChildrenPages(PageComponent, pageConfig) : PageComponent;

    const App: React.ComponentType<unknown> = hoc
      ? hoc({
          ...config,
          path
        })(Page)
      : Page;

    return {
      ...config,
      children,
      path,
      App
    };
  });

const PageRouteComponent: React.FC<any> = (props) => {
  const { title, App } = props;
  if (title) {
    document.title = title;
  }

  return <App {...props} />;
};

const pageRenderer = (pagesConfig: PagesConfig, hoc: RenderHOC) => {
  const pages = getPages(pagesConfig, hoc);

  const App: React.FC = () => {
    return (
      <React.Suspense fallback={<FallLoading />}>
        <Router style={{ height: '100%', width: '100%' }} basepath={BASE_PATH}>
          <PageOverview path='page-overview' pages={pages} />
          <EmptyPage default />
          {pages.map(({ path, ...options }) => (
            <PageRouteComponent
              key={options.entryPath}
              path={options?.children ? `${path}/*` : path}
              {...options}
            />
          ))}
        </Router>
      </React.Suspense>
    );
  };

  return render(<App />, document.querySelector('#root'));
};

export default pageRenderer;
