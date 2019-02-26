import webpack = require("webpack");
import devMiddleware = require("webpack-dev-middleware");
import hotMiddleware = require("webpack-hot-middleware");

import BuildContext = require('./typings/context');
import promCreator from './promise';

let buildContext: BuildContext;

function invoke(mode: 'run'| 'watch', compiler: webpack.Compiler) {
  let prom = promCreator();
  let handler = (err, stats) => {
    if (err) {
      // Configuration error.
      buildContext.logger && buildContext.logger.error(err);
      return prom.reject(err);
    }
    
    if (stats.hasErrors()) {
      buildContext.logger && buildContext.logger.error(err);
      return prom.reject(stats);
    }

    buildContext.logger && buildContext.logger.info(stats.toString({ modules: false, colors: true }));
    return prom.resolve(stats);
  }

  switch (mode) {
  case 'run': compiler.run(handler); break;
  case 'watch': compiler.watch({}, handler); break;
  }

  return prom.promise;
}

export default function runnerCreator(context: BuildContext) {
  buildContext = context;

  const runner = {
    client(compiler: webpack.Compiler) {
      switch (buildContext.mode) {
      case 'production':  return invoke('run', compiler);
      case 'development': {
        // resolve the compilation promise.
        compiler.hooks.done.tap('runner', (stats) => {
          if (stats.hasErrors()) {
            return prom.reject(stats);
          }
          return prom.resolve(stats);
        });

        // enable webpack-dev-middleware.
        let prom = promCreator();
        let devRecords = buildContext.devMiddleware;
        let devOpts = Object.assign({
          publicPath: compiler.options.output.publicPath,
        }, devRecords.options);
        let devInst = devMiddleware(compiler, devOpts);
        devRecords.instances.push(devInst);

        // enable webpack-hot-middleware accorrding to buildContext.
        if (buildContext.hot) {
          let hotRecords = buildContext.hotMiddleware;
          let hotInst = hotMiddleware(compiler, hotRecords.options);
          hotRecords.instances.push(hotInst);
        }

        return prom.promise;
      }
      }
    },

    server(compiler: webpack.Compiler) {
      switch (buildContext.mode) {
      case 'production':  return invoke('run', compiler);
      case 'development': return invoke('watch', compiler);
      }
    }
  }
  return runner;
}