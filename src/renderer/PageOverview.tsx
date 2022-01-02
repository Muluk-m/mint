import React from 'react';
import { Descriptions } from 'antd';

interface PageOverviewProps {
  pages: any[];
  path: string;
}

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
      {pages.map(({ path, title }) => (
        <Descriptions.Item key={path} label={title}>
          <a href={path}>{path}</a>
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};

export default PageOverview;
