"use strict";
exports.__esModule = true;
var weblog = require("webpack-log");
function ctxCreator(options) {
    var logger = options.logger ? options.logger : weblog('wb-bundler');
    var confs = options.webpackConfs;
    var mode = options.mode;
    if (Array.isArray(confs)) {
        var modes = confs.filter(function (conf) { return conf.mode; }).map(function (conf) { return conf.mode; });
        mode = mode ? mode : modes[0];
        if (modes.length > 0 && !modes.every(function (m) { return mode === m; })) {
            logger.error('Inconsistent mode. Falled back to production mode.');
            mode = 'production';
        }
    }
    else {
        options.webpackConfs = [confs];
        mode = options.mode ? options.mode : 'production';
    }
    var devOpts = options.devMiddlewareOptions;
    var hotOpts = options.hotMiddlewareOptions;
    delete options.devMiddlewareOptions;
    delete options.hotMiddlewareOptions;
    var context = {
        hooks: { compiler: {} },
        mode: mode,
        hot: mode === 'development' ? true : false,
        logger: logger,
        webpackConfs: options.webpackConfs,
        devMiddleware: {
            options: Object.assign({ stats: { modules: false, colors: true } }, devOpts),
            instances: []
        },
        hotMiddleware: {
            options: hotOpts,
            instances: []
        }
    };
    return Object.assign(context, options);
}
exports.ctxCreator = ctxCreator;
//# sourceMappingURL=context.js.map