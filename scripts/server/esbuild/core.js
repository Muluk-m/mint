const esbuild = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');
const { lessLoader } = require('esbuild-plugin-less');
// const ejs = require('ejs');
const svgrPlugin = require('esbuild-plugin-svgr');
const path = require('path');
const FsPromise = require('fs/promises'); // 引入 FsPromise 方法
const alias = require('./plugins/esbuild-plugin-alias');
const appPaths = require('../../paths');

// const { appPaths.appPages, appPaths.appBuild } = require('../../config');

const baseSrcDir = path.resolve(__dirname, appPaths.appPages);

const DEPLOY_ENV = process.env.AWP_DEPLOY_ENV;
const publicPath = process.env.PUBLIC_PATH || '';

// 获取 src 下所有的子页面名称，以对其进行 html 转发
async function getPaths() {
  const result = [];
  try {
    const dirs = await FsPromise.readdir(baseSrcDir);
    for (const dir of dirs) {
      const filePath = path.resolve(baseSrcDir, dir);
      const stat = await FsPromise.stat(filePath);
      if (stat.isDirectory()) {
        result.push(dir);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

// 返回文件列表
async function getFiles(dir) {
  const files = await FsPromise.readdir(dir);
  const result = {};
  for (const file of files) {
    const filePath = path.resolve(dir, file);
    const stat = await FsPromise.stat(filePath);
    if (!stat.isDirectory()) {
      const ext = path.extname(file).replace('.', '');
      if (ext !== 'map') {
        result[ext] = file;
      }
    }
  }

  return result;
}

// 根据 path 路径生成单个 html 文件
async function generateHtml(subPath) {
  const srcPath = path.resolve(baseSrcDir, subPath);
  const outPath = srcPath.replace(appPaths.appPages, appPaths.appBuild);
  let { js: jsPath, css: cssPath } = await getFiles(outPath);

  // TODO 模板替换为 ejs

  jsPath = `${publicPath}/${subPath}/${jsPath}`;
  cssPath = `${publicPath}/${subPath}/${cssPath}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link href="${cssPath}" rel="stylesheet"></link>
      </head>
      <body>
        <div id="root"></div>
      </body>
      <script src="${jsPath}"></script>
    </html>
  `;

  try {
    await FsPromise.writeFile(path.resolve(outPath, 'index.html'), html);
  } catch (error) {
    console.log(error);
  }
}

// 单个 esbuild 转换
async function ebuildJs(buildpath) {
  const aliasConfig = {
    '@/': appPaths.appSrc,
    'utils/': path.resolve(__dirname, '../node_modules/@yxfe/data-utils/src'),
    'pc-components/': path.resolve(
      __dirname,
      '../node_modules/@yxfe/data-pc-components/components'
    ),
    'common-components/': path.resolve(
      __dirname,
      '../node_modules/@yxfe/data-common-components/components'
    )
  };

  await esbuild.build({
    entryPoints: [buildpath],
    outdir: buildpath.replace(appPaths.appPages, appPaths.appBuild),
    plugins: [alias(aliasConfig), sassPlugin(), lessLoader(), svgrPlugin()],
    define: {
      this: 'window',
      'process.env.USER_TALOS_ENV': '"prod"'
    },
    target: ['es2020', 'chrome88'],
    loader: { '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl' },
    bundle: true,
    sourcemap: !DEPLOY_ENV,
    publicPath: DEPLOY_ENV ? `${publicPath}build/` : '',
    external: ['*.woff', '*.ttf', '*.eot', '*.woff2', '~antd-fonts/ant-iconfont.svg#iconfont']
    // format: 'cjs',
  });
}

// 通过 esbuild 转换所有的子页面中的 js 代码
async function buildJs(paths) {
  try {
    await Promise.all(
      paths.map(async (subpath) => {
        const srcPath = path.resolve(baseSrcDir, subpath);

        const stat = await FsPromise.stat(srcPath);
        if (stat.isDirectory()) {
          await ebuildJs(srcPath);
          await generateHtml(subpath);
        }
      })
    );
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const paths = await getPaths();
  await buildJs(paths);

  return paths;
}

module.exports = {
  main,
  ebuildJs,
  buildJs
};
