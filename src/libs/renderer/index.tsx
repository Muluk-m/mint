import React from 'react';
import { Router } from '@reach/router';
import { render } from 'react-dom';
import PageOverview from './PageOverview';
import EmptyPage from './EmptyPage';
import FallLoading from './FallLoading';

type RenderHOC = (
  config: any
) => (App: React.ComponentType<unknown>) => React.ComponentType<unknown>;

type Route = any; // TODO

interface PageOptions {
  // 专题名称,用于区分MPA
  name: string;
  // MPA页面前缀 用于分割MPA同级路由,避免子页面路由冲突
  basePath: string;
}

const getPages = (routes: Record<string, Route>, hoc: RenderHOC) =>
  Object.values(routes).map((route) => {
    const { component, ...options } = route;
    const PageComponent = React.lazy(component);

    const App: React.ComponentType<unknown> = hoc ? hoc(options)(PageComponent) : PageComponent;

    return {
      ...route,
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

/**
 * 渲染路由
 * @param prefix 定制项目前缀
 * @param routes
 * @param hoc
 */
const pageRenderer = (routes: Route, hoc: RenderHOC, options?: PageOptions) => {
  const basePath = options?.basePath ?? '';
  const pages = getPages(routes, hoc);

  const App: React.FC = () => {
    return (
      <React.Suspense fallback={<FallLoading />}>
        <Router style={{ height: '100%', width: '100%' }} basepath={basePath}>
          <PageOverview path='page-overview' basePath={basePath} pages={pages} />
          <EmptyPage default />
          {pages.map(({ path, ...options }) => (
            <PageRouteComponent key={path} path={path} {...options} />
          ))}
        </Router>
      </React.Suspense>
    );
  };

  render(<App />, document.querySelector('#root'));
};

export default pageRenderer;
