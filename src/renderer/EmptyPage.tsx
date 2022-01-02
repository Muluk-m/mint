import React from 'react';
import { Result, Button } from 'antd';

interface EmptyPageProps {
  pagePath?: string;
  path: string;
}

/**
 * 404
 */
const EmptyPage: React.FC<EmptyPageProps> = ({ pagePath, path }) => {
  return (
    <Result
      style={{ marginTop: 100 }}
      status='404'
      title='404'
      subTitle={`对不起,您访问的页面路径 ${pagePath} 不存在`}
      extra={
        <Button type='primary' href='/'>
          回到主页
        </Button>
      }
    />
  );
};

EmptyPage.defaultProps = {
  pagePath: ''
};

export default EmptyPage;
