const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const base = require('./webpack.base');
const paths = require('../paths');

const { shouldOpenAnalyzer, ANALYZER_HOST, ANALYZER_PORT } = require('../config');

module.exports = merge(base, {
  mode: 'production',
  devtool: false,
  target: 'browserslist',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: paths.appBuild,
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
    publicPath: `${process.env.PUBLIC_PATH}/` || '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    }),
    shouldOpenAnalyzer &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: ANALYZER_HOST,
        analyzerPort: ANALYZER_PORT
      })
  ].filter(Boolean),
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0
    }
  }
});
