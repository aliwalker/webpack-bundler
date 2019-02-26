"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weblog = require("webpack-log");
function ctxCreator(options) {
    let logger = options.logger ? options.logger : weblog('wb-bundler');
    let confs = options.webpackConfs;
    let mode = options.mode;
    if (Array.isArray(confs)) {
        let modes = confs.filter(conf => conf.mode).map(conf => conf.mode);
        mode = mode ? mode : modes[0];
        if (modes.length > 0 && !modes.every(m => mode === m)) {
            logger.error('Inconsistent mode. Falled back to production mode.');
            mode = 'production';
        }
    }
    else {
        options.webpackConfs = [confs];
        mode = options.mode ? options.mode : 'production';
    }
    let devOpts = options.devMiddlewareOptions;
    let hotOpts = options.hotMiddlewareOptions;
    delete options.devMiddlewareOptions;
    delete options.hotMiddlewareOptions;
    let context = {
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
exports.ctxCreator = ctxCreator;
//# sourceMappingURL=context.js.map