import React from 'react';
import { Layout } from 'antd';
import CatchErrorInfo from './components/ErrorInfo';

/**
 * 定制菜单高阶组件
 */
const LayoutHoc = (App: React.FC<any>) => {
  @CatchErrorInfo()
  class LayoutMenu extends React.Component<any> {

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
