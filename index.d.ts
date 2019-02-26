import webpack = require("webpack");
import * as loglevel from 'loglevel';
import WebpackDevMiddleware = require("webpack-dev-middleware");
import WebpackHotMiddleware = require("webpack-hot-middleware");
import { Logger } from "loglevel";

import BuildContext = require('./src/typings/context');

export = WebpackBundler;

type CompilerHooks = webpack.compilation.CompilerHooks;

declare class WebpackBundler {
  constructor(context: WebpackBundler.Options);

  logger: loglevel.Logger;
  context: BuildContext;
  compilers: Array<webpack.Compiler>;
  runner: WebpackBundler.Runner;
  configurations: WebpackBundler.Configuration;
  devMiddleware: Array<WebpackDevMiddleware.WebpackDevMiddleware>;
  hotMiddleware: Array<any>;
  fileSystem: webpack.OutputFileSystem;

  build(): Promise<void>;
  compile(): Promise<void>;
  middlewares(): Array<any>;
}

declare namespace WebpackBundler {
  interface Hooks {
    compiler?: {
      [hookName: string]: GenericHookFunc | HookOption;
    }
  }

  interface HookOption {
    tapType: 'tap' | 'tapAsync' | 'tapPromise';
    handler: GenericHookFunc;
  }

  type GenericHookFunc = (...args: any) => void;

  interface Options extends BaseOptions {
    devMiddlewareOptions?: WebpackDevMiddleware.Options;
    hotMiddlewareOptions?: WebpackHotMiddleware.Options;
  }

  interface BaseOptions {
    hooks?: Hooks;
    mode?: 'development' | 'production' | 'none';
    hot?: boolean;
    logger?: Logger;
    webpackConfs: webpack.Configuration | Array<webpack.Configuration>;
  }
  
  interface CSObject<T, N> {
    client(arg: T): N;
    server(arg: T): N;
  }

  type Configuration = CSObject<webpack.Configuration, webpack.Configuration>;
  type Runner = CSObject<webpack.Compiler, Promise<{}>>;
}