import React from 'react';
import { Descriptions } from 'antd';
import { PagesConfig } from '.';

interface PageInfo {
  title: string;
  entryPath: string;
  path: string;
  isSpa?: boolean | undefined;
  children?: PagesConfig;
}
interface PageOverviewProps {
  pages: PageInfo[];
  path: string;
}

const formatPagesConfig = (pagesConfig: PagesConfig) =>
  Object.values(pagesConfig).map(({ route, ...config }) => ({
    path: route ?? config.entryPath,
    ...config
  }));

const getDesciptions = (pages: PageInfo[], ParentPath = '', level = 0): React.ReactNode[] =>
  pages.map(({ path, title, children, isSpa }) => {
    const pagePath = ParentPath ? `${ParentPath}/${path}` : path;
    return (
      <>
        <Descriptions.Item
          key={path}
          label={<span style={{ paddingLeft: 15 * level }}>{title}</span>}
        >
          <a href={pagePath}>{pagePath}</a>
        </Descriptions.Item>
        {isSpa && children && getDesciptions(formatPagesConfig(children), path, level + 1)}
      </>
    );
  });

/**
 * 页面导航
 */
const PageOverview: React.FC<PageOverviewProps> = ({ pages, path }) => {
  return (
    <Descriptions
      title='页面导航'
      size='small'
      style={{ margin: '50px 200px', width: 500 }}
      column={1}
      bordered
      labelStyle={{ width: 150 }}
    >
      {getDesciptions(pages)}
    </Descriptions>
  );
};

export default PageOverview;
