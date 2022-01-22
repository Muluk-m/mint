const envs = {
  test: 'https://xx.test.com',
  st: 'https://xx.st.com',
  prod: 'https://xx.prod.com'
};

module.exports = {
  /** api 代理前缀, devServer 使用 */
  apiPrefix: ['/api/xx1', '/api/xx2'],
  target: envs.st
};
