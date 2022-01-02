const color = require('bash-color');

const handleProxySettings = (settings) =>
  Object.entries(settings).reduce(
    (config, [name, setting]) => ({
      ...config,
      [name]: {
        ...setting,
        pathRewrite(reqpath, req) {
          /** 终端日志输出代理地址 */
          process.stdout.write(
            `${color.yellow('Proxy')} "${color.blue(req.method)} ${req.path}" to "${color.green(
              setting.target + reqpath
            )}"\n`
          );
          return reqpath;
        }
      }
    }),
    {}
  );

const proxySettings = {
  '/api/xx': {
    target: 'https://xxx.com',
    changeOrigin: true
  },
};

module.exports = handleProxySettings(proxySettings);
