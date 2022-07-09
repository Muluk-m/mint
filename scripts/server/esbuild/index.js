const express = require('express');
const path = require('path');
const fsPromise = require('fs/promises');
const childProcess = require('child_process');
const process = require('process');
const chokidar = require('chokidar');
const _ = require('lodash');
const appPaths = require('../../paths');

const { spawn } = childProcess;
const app = express();

const { main, buildJs, ebuildJs } = require('./core');

// 获取 src 下所有的子页面名称，以对其进行 html 转发
// 启动 express 服务
async function startExpressServer() {
  // 页面刷新
  const livereload = require('livereload');
  // 实时刷新 服务中间件
  const connectLiveReload = require('connect-livereload');
  const liveReloadServer = livereload.createServer();

  app.use(connectLiveReload());
  app.use(express.static(path.resolve(__dirname, appPaths.appBuild)));
  const paths = await main();

  // 将 paths 路径关联到对应的 index.html
  for (const urlPath of paths) {
    app.get(`/${urlPath}/*`, (req, res) => {
      const filePath = path.resolve(appPaths.appBuild, urlPath, 'index.html');
      res.sendFile(filePath);
    });
  }

  // 监听文件变化，自动构建，并自动更新html
  const watcher = chokidar.watch(path.resolve(__dirname, appPaths.appSrc), {});
  watcher.on(
    'change',
    _.debounce(
      async (filePath) => {
        if (filePath) {
          console.log(`${filePath} has changed`);
        }

        let isInPath = false;

        for (const dirPath of paths) {
          if (filePath.includes(dirPath)) {
            const srcPath = path.resolve(appPaths.appSrc, dirPath);
            const stat = await fsPromise.stat(srcPath);
            if (stat.isDirectory()) {
              await ebuildJs(srcPath);
            }
            liveReloadServer.refresh('/');
            isInPath = true;
          }
        }

        if (!isInPath && filePath.includes('src')) {
          await buildJs(paths);
          liveReloadServer.refresh('/');
        }
      },
      2000,
      {
        leading: false,
        trailing: true
      }
    )
  );

  const resPath = paths[paths.length - 1];

  app.listen(8288, () => {
    console.log('express server is running');
  });

  return resPath;
}

async function startServer() {
  try {
    await startExpressServer();

    const nginxConf = path.resolve(__dirname, '../../../config/', 'nginx.conf');
    console.log('nginx config:', nginxConf);
    const childProcess = spawn('nginx', ['-c', nginxConf]);

    const url = 'http://localhost:8288/';
    spawn('open', [url]);
    childProcess.on('error', (err) => {
      console.log('##### 如果未安装 nginx，请先安装 nginx #####');
      console.log('nginx安装地址和方法详见：https://ports.macports.org/port/nginx/');
      console.log('----------------------------------------');
      console.log(`error${err}`);
    });
  } catch (error) {
    console.log(`error${error.stack}`);
  }
}

startServer();

// beforeExit 避免程序崩溃
process.on('SIGINT', () => {
  console.log('正在关闭中...');
  spawn('nginx', ['-s', 'stop']);
  console.log('关闭成功');
  process.exit(0);
});
