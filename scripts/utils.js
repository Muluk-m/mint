const path = require('path');
const fs = require('fs');

// Get the working directory of the file executed by node
const appDirectory = fs.realpathSync(process.cwd());

// Resolve absolute path from relative path
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// Default module extension
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];

// Resolve module path
function resolveModule(resolveFn, filePath) {
  // Check if the file exists
  const extension = moduleFileExtensions.find((ex) =>
    fs.existsSync(resolveFn(`${filePath}.${ex}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.ts`); // default is .ts
}

const proxyConfig = require(resolveModule(resolveApp, 'config/proxy.config'));
const pagesPath = resolveApp('src/pages');

function getProcessEnv() {
  if (process.env.USER_ENV) return process.env.USER_ENV;

  /**
   * 本地服务运行时,基于代理地址去区分运行环境
   */
  const { target = '' } = proxyConfig || {};

  if (target.includes('.st.com')) return 'st';
  if (target.includes('.test.com')) return 'test';
  if (/(.com)/.test(target)) return 'prod';
  return 'test';
}

function verifyDirectory(modules) {
  const dirList = modules.split(',');
  const firstDir = fs.readdirSync(path.resolve(pagesPath));
  for (const dir of dirList)
    if (!firstDir.includes(dir)) throw new Error(`directory ${dir} not found`);
}

/**
 * 获取pages目录下所有层级的入口页面的路径
 * 基于目录下是否包含index文件为基准判断是否为页面
 */
function getPageDirNames(pageDirs = '', res = []) {
  const basePath = path.resolve(pagesPath, pageDirs);
  const isFirstLevel = pageDirs === '';
  // 用于独立部署指定目录
  const specifiedEntry = isFirstLevel && process.env.USER_DEPLOY_PAGES;

  if (specifiedEntry) verifyDirectory(specifiedEntry);

  const pageDirNames = specifiedEntry
    ? specifiedEntry.split(',')
    : fs.readdirSync(basePath, { encoding: 'utf8' });

  if (pageDirNames.some((dir) => dir.includes('index'))) return [...res, pageDirs];

  return pageDirNames.reduce((dirNames, dirName) => {
    const itemPath = pageDirs ? `${pageDirs}/${dirName}` : dirName;
    const isDirectory = fs.statSync(path.resolve(pagesPath, pageDirs, dirName)).isDirectory();
    if (isDirectory) return [...dirNames, ...getPageDirNames(itemPath, res)];

    return dirNames;
  }, res);
}

module.exports = {
  resolveApp,
  resolveModule,
  getProcessEnv,
  getPageDirNames,
  moduleFileExtensions
};
