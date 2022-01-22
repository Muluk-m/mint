import React from 'react';
import { Descriptions } from 'antd';

interface PageOverviewProps {
  pages: any[];
  path: string;
  basePath: string;
}

// TODO
type Pages = Record<string, any>[];

const getDescriptions = (pages: Pages, ParentPath = '', level = 0): React.ReactNode[] =>
  pages.map(({ path, title }) => {
    const pagePath = ParentPath ? `/${ParentPath}${path}` : path;

    return (
      <React.Fragment key={path}>
        <Descriptions.Item
          key={path}
          label={<span style={{ paddingLeft: 15 * level }}>{title}</span>}
        >
          <a href={pagePath}>{pagePath}</a>
        </Descriptions.Item>
      </React.Fragment>
    );
  });

/**
 * 页面导航
 */
const PageOverview: React.FC<PageOverviewProps> = ({ pages, basePath = '', path }) => {
  return (
    <Descriptions
      title='页面导航'
      size='small'
      style={{ margin: '50px 200px', width: 500 }}
      column={1}
      bordered
      labelStyle={{ width: 150 }}
    >
      {getDescriptions(pages, basePath)}
    </Descriptions>
  );
};

export default PageOverview;
