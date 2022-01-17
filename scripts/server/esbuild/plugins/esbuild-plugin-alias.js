const path = require('path');
const resolve = require('enhanced-resolve');

module.exports = options => {
  const aliases = Object.keys(options);
  const re = new RegExp(`^(${aliases.map(escapeRegExp).join('|')})`);

  return {
    name: 'alias',
    setup(build) {
      // we do not register 'file' namespace here, because the root file won't be processed
      // https://github.com/evanw/esbuild/issues/791
      build.onResolve({ filter: re }, args => {
        const alias = args.path.match(re)[1];
        let _replacer = '';
        if(alias.endsWith('/')) {
          _replacer = alias.replace(/\/$/, '');
        }

        const srcPath = args.path.replace(_replacer, options[alias]);

        const resolvedFn = resolve.create.sync({
          extensions: [".ts", ".js", ".json", ".tsx", ".jsx"],
        })

        const resolved = resolvedFn(path.resolve(__dirname, '../..'), srcPath);
        return ({
          path: resolved
        })
      });
    },
  };
};

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
