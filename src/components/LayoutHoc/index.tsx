import React from 'react';
import { Layout } from 'antd';
import CatchErrorInfo from './components/ErrorInfo/catchCompnentsError';

/**
 * 定制菜单高阶组件
 */
const LayoutHoc = (App: React.ComponentType<unknown>) => {
  @CatchErrorInfo({ info: '页面渲染错误', errMessage: '' })
  class LayoutMenu extends React.Component<unknown> {
    render() {
      return (
        <Layout>
          <App />
        </Layout>
      );
    }
  }

  return LayoutMenu;
};

export default LayoutHoc;
