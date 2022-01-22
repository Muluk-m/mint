const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const chalk = require('chalk');
const base = require('./webpack.base');
const paths = require('../paths');
const { getPageDirNames } = require('../utils');

const pageDirNames = getPageDirNames();

const getProxyConfig = () => {
  const proxyConfig = require(paths.appProxyConfig);

  const { apiPrefix = [], target = '' } = proxyConfig;

  return apiPrefix.reduce(
    (config, prefix) => ({
      ...config,
      [prefix]: {
        changeOrigin: true,
        secure: false,
        target,
        pathRewrite(reqPath, req) {
          /** 输出代理地址 */
          process.stdout.write(
            `${chalk.yellow('Proxy')} "${chalk.blue(req.method)} ${req.path}" to "${chalk.green(
              reqPath
            )}"\n`
          );
          return reqPath;
        }
      }
    }),
    {}
  );
};

const getHistoryApiFallbackRewrites = () => {
  return pageDirNames.map((dirName) => {
    const from = new RegExp(dirName === '/' ? '^/' : `^/${dirName}/.*$`);
    const to = dirName === '/' ? '/' : `/${dirName}/`;
    return {
      from,
      to
    };
  });
};

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  target: 'web',
  output: {
    filename: 'js/[name].js',
    path: paths.appBuild,
    publicPath: process.env.PUBLIC_PATH || '/'
  },
  devServer: {
    openPage: 'page-spa/detail',
    compress: true,
    stats: 'errors-only',
    clientLogLevel: 'silent',
    historyApiFallback: {
      rewrites: getHistoryApiFallbackRewrites()
    },
    open: true,
    hot: true,
    noInfo: true,
    proxy: getProxyConfig()
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()],
  optimization: {
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all',
      minSize: 0
    }
  }
});
