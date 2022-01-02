const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');
const moment = require('moment');

const paths = require('../paths');
const { resolveApp, resolveModule } = require('../utils');
const { isDevelopment, isProduction } = require('../env');
const { imageInlineSizeLimit } = require('../config');

const getCssLoaders = (importLoaders) => [
  isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: false,
      sourceMap: isDevelopment,
      importLoaders
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-flexbugs-fixes'),
          isProduction && [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009'
              },
              stage: 3
            }
          ]
        ].filter(Boolean)
      }
    }
  }
];

module.exports = {
  entry: resolveModule(resolveApp, 'src/index'),
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@': paths.appSrc
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1)
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDevelopment,
              lessOptions: {
                modifyVars: lessToJs(
                  fs.readFileSync(resolveApp('src/lib/assets/css/mth-theme.less'), 'utf8')
                ),
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: imageInlineSizeLimit
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '优选算法平台',
      template: paths.appHtml,
      filename: 'index.html',
      versionTime: moment().utcOffset(8).format('YYYY-MMDD-HH:mm:ss'),
      inject: true
    }),
    new CopyPlugin({
      patterns: [
        {
          context: paths.appPublic,
          from: '*',
          to: paths.appBuild,
          toType: 'dir',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new WebpackBar({
      name: isDevelopment ? 'RUNNING' : 'BUNDLING',
      color: isDevelopment ? '#52c41a' : '#722ed1'
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: paths.appTsConfig
      }
    })
  ]
};
