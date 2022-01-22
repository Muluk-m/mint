import 'antd/dist/antd.less'; // 引入官方提供的 less 样式入口文件

try {
  if (process.env.NODE_ENV === 'development' && module && module.hot) {
    module.hot.accept();
  }
} catch {
  //
}
