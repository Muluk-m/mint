const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base');
const paths = require('../paths');

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
    openPage: 'page-overview',
    compress: true,
    stats: 'errors-only',
    clientLogLevel: 'silent',
    historyApiFallback: true,
    open: true,
    hot: true,
    noInfo: true,
    proxy: {
      ...require(paths.appProxySetup)
    },
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
