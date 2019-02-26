"use strict";
exports.__esModule = true;
var devMiddleware = require("webpack-dev-middleware");
var hotMiddleware = require("webpack-hot-middleware");
var promise_1 = require("./promise");
var buildContext;
function invoke(mode, compiler) {
    var prom = promise_1["default"]();
    var handler = function (err, stats) {
        if (err) {
            buildContext.logger && buildContext.logger.error(err);
            return prom.reject(err);
        }
        if (stats.hasErrors()) {
            buildContext.logger && buildContext.logger.error(err);
            return prom.reject(stats);
        }
        buildContext.logger && buildContext.logger.info(stats.toString({ modules: false, colors: true }));
        return prom.resolve(stats);
    };
    switch (mode) {
        case 'run':
            compiler.run(handler);
            break;
        case 'watch':
            compiler.watch({}, handler);
            break;
    }
    return prom.promise;
}
function runnerCreator(context) {
    buildContext = context;
    var runner = {
        client: function (compiler) {
            switch (buildContext.mode) {
                case 'production': return invoke('run', compiler);
                case 'development': {
                    compiler.hooks.done.tap('runner', function (stats) {
                        if (stats.hasErrors()) {
                            return prom_1.reject(stats);
                        }
                        return prom_1.resolve(stats);
                    });
                    var prom_1 = promise_1["default"]();
                    var devRecords = buildContext.devMiddleware;
                    var devOpts = Object.assign({
                        publicPath: compiler.options.output.publicPath
                    }, devRecords.options);
                    var devInst = devMiddleware(compiler, devOpts);
                    devRecords.instances.push(devInst);
                    if (buildContext.hot) {
                        var hotRecords = buildContext.hotMiddleware;
                        var hotInst = hotMiddleware(compiler, hotRecords.options);
                        hotRecords.instances.push(hotInst);
                    }
                    return prom_1.promise;
                }
            }
        },
        server: function (compiler) {
            switch (buildContext.mode) {
                case 'production': return invoke('run', compiler);
                case 'development': return invoke('watch', compiler);
            }
        }
    };
    return runner;
}
exports["default"] = runnerCreator;
//# sourceMappingURL=runner.js.map