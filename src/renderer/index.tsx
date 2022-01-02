import React from 'react';
import { Router } from '@reach/router';
import { render } from 'react-dom';
import { Spin } from 'antd';
import PageOverview from './PageOverview';
import EmptyPage from './EmptyPage';
import pages from '@/config/pages.config';

type RenderHOC = (config: any) => (App: React.FC<unknown>) => React.FC<unknown>;

const BASE_PATH = '/';

const getPages = (hoc: RenderHOC) => {
  return Object.values(pages).map((config) => {
    const PageComponent = React.lazy(() => import(`../pages/${config.entryPath}`));

    const App: React.FC<any> = hoc
      ? hoc({
          ...config,
          path: config.entryPath
        })(PageComponent)
      : PageComponent;

    return {
      ...config,
      path: config.route ?? config.entryPath,
      App
    };
  });
};

const InitTitleComponent: React.FC<any> = (props) => {
  const { title, App } = props;
  if (title) {
    document.title = title;
  }

  return <App {...props} />;
};

const Loading: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 300
      }}
    >
      <Spin />
    </div>
  );
};

const pageRenderer = (hoc: RenderHOC) => {
  const pages = getPages(hoc);

  const App: React.FC = () => {
    return (
      <React.Suspense fallback={<Loading />}>
        <Router style={{ height: '100%', width: '100%' }} basepath={BASE_PATH}>
          <PageOverview path='page-overview' pages={pages} />
          <EmptyPage path=':pagePath' />
          {pages.map((options) => (
            <InitTitleComponent key={options.entryPath} {...options} />
          ))}
        </Router>
      </React.Suspense>
    );
  };

  return render(<App />, document.querySelector('#root'));
};

export default pageRenderer;
