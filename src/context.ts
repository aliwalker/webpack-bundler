import weblog = require("webpack-log");

import WebpackBundler = require('../index');
import BuildContext = require('./typings/context');

/**
 * An internal helper for dealing with build-context chores.
 * @param options options for creating a build context.
 */
export function ctxCreator(options: WebpackBundler.Options): BuildContext {
  let logger = options.logger ? options.logger : weblog('wb-bundler');
  let confs = options.webpackConfs;
  let mode = options.mode;

  /** 
   * Determine webpack configs' mode:
   * 1. If incosistency occured, fall back to `production`.
   * 2. If `options.mode` is set, use it.
   * 3. If none of the configs contains 'mode' field, fall back to `production`.
   */
  if (Array.isArray(confs)) {
    let modes = confs.filter(conf => conf.mode).map(conf => conf.mode);
    mode = mode ? mode : modes[0];
    if (modes.length > 0 && !modes.every(m => mode === m)) {
      (logger as any).error('Inconsistent mode. Falled back to production mode.');
      mode = 'production';
    }
  } else {
    options.webpackConfs = [ confs ];
    mode = options.mode ? options.mode : 'production';
  }

  let devOpts = options.devMiddlewareOptions;
  let hotOpts = options.hotMiddlewareOptions;

  delete options.devMiddlewareOptions;
  delete options.hotMiddlewareOptions;

  let context: BuildContext = {
    hooks: { compiler: {} },
    mode,
    hot: mode === 'development' ? true : false,
    logger,
    webpackConfs: options.webpackConfs,
    devMiddleware: {
      options: Object.assign({ stats: { modules: false, colors: true, } }, devOpts),
      instances: [],
    },
    hotMiddleware: {
      options: hotOpts,
      instances: [],
    }
  };

  return Object.assign(context, options);
}
