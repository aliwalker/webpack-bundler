"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const promise_1 = require("./promise");
let buildContext;
function invoke(mode, compiler) {
    let prom = promise_1.default();
    let handler = (err, stats) => {
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
    const runner = {
        client(compiler) {
            switch (buildContext.mode) {
                case 'production': return invoke('run', compiler);
                case 'development': {
                    compiler.hooks.done.tap('runner', (stats) => {
                        if (stats.hasErrors()) {
                            return prom.reject(stats);
                        }
                        return prom.resolve(stats);
                    });
                    let prom = promise_1.default();
                    let devRecords = buildContext.devMiddleware;
                    let devOpts = Object.assign({
                        publicPath: compiler.options.output.publicPath,
                    }, devRecords.options);
                    let devInst = devMiddleware(compiler, devOpts);
                    devRecords.instances.push(devInst);
                    if (buildContext.hot) {
                        let hotRecords = buildContext.hotMiddleware;
                        let hotInst = hotMiddleware(compiler, hotRecords.options);
                        hotRecords.instances.push(hotInst);
                    }
                    return prom.promise;
                }
            }
        },
        server(compiler) {
            switch (buildContext.mode) {
                case 'production': return invoke('run', compiler);
                case 'development': return invoke('watch', compiler);
            }
        }
    };
    return runner;
}
exports.default = runnerCreator;
//# sourceMappingURL=runner.js.map