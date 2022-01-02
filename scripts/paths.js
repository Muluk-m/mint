const { resolveApp, resolveModule } = require('./utils');

module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndex: resolveModule(resolveApp, 'src/index'), // Package entry path
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'), // node_modules path
  appSrc: resolveApp('src'),
  appSrcComponents: resolveApp('src/components'),
  appSrcUtils: resolveApp('src/utils'),
  appProxySetup: resolveModule(resolveApp, 'src/config/proxy.config'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  appPages: resolveApp('src/pages')
};
