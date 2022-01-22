const { resolveApp, resolveModule } = require('./utils');

module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndex: resolveModule(resolveApp, 'src/index'), // Package entry path
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'), // node_modules path
  appSrc: resolveApp('src'),
  appSrcUtils: resolveApp('src/utils'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  appPages: resolveApp('src/pages'),
  appProjectConfig: resolveApp('config/project.config'),
  appProxyConfig: resolveModule(resolveApp, 'config/proxy.config'),
  appConfig: resolveApp('config')
};
