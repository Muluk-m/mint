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

module.exports = { resolveApp, resolveModule, moduleFileExtensions };
