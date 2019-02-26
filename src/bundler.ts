import WebpackDevMiddleware = require('webpack-dev-middleware');
import * as loglevel from 'loglevel';
import MFS = require('memory-fs');
import webpack = require('webpack');
import NodeFS = require('webpack/lib/node/NodeOutputFileSystem');

import WebpackBundler = require('../index');
import confCreator from './configuration';
import runnerCreator from './runner';
import BuildContext = require('./typings/context');
import { ctxCreator } from './context';

type GenericHookFunc = WebpackBundler.GenericHookFunc;
type HookOption = WebpackBundler.HookOption;
type Options = WebpackBundler.Options;

export = class WebpackBundler {
  logger: loglevel.Logger;
  context: BuildContext;
  compilers: Array<webpack.Compiler>;
  runner: WebpackBundler.Runner;
  configurations: WebpackBundler.Configuration;
  devMiddleware: Array<WebpackDevMiddleware.WebpackDevMiddleware>;
  hotMiddleware: Array<any>;
  fileSystem: webpack.OutputFileSystem;

  constructor(options: Options) {
    this.context = ctxCreator(options);
    this.logger = this.context.logger;
    this.configurations = confCreator(this.context);
    this.runner = runnerCreator(this.context);
    this.compilers = [];
    this.fileSystem = this.context.mode === 'development' ? new MFS() : new NodeFS();
  }

  async build() {
    if (!Array.isArray(this.context.webpackConfs)) {
      this.context.webpackConfs = [this.context.webpackConfs];
    }

    this.context.webpackConfs.forEach(conf => {
      let target = conf.target === 'node' ? 'server' : 'client';

      conf = this.configurations[target](conf);
      this.compilers.push(webpack(conf));
    });

    await this.compile();
  }

  async compile() {
    const promises = this.compilers.map(compiler => {    
      let target = compiler.options.target === 'node' ? 'server' : 'client';

      this.addHooks(compiler);
      return this.runner[target](compiler);
    });

    await Promise.all(promises)
  }

  middlewares() {
    let instances: Array<any> = [];

    this.context.devMiddleware.instances.forEach(i => instances.push(i));
    this.context.hotMiddleware.instances.forEach(i => instances.push(i));
    return instances;
  }

  addHooks(compiler: webpack.Compiler) {
    let cmpHooks = this.context.hooks.compiler;
    let hooks = compiler.hooks;

    for (const hookName of Object.keys(cmpHooks)) {
      let tapType = (cmpHooks[hookName] as HookOption).tapType;
      let handler = (cmpHooks[hookName] as HookOption).handler;
      let hook = hooks[hookName];

      tapType || (tapType = 'tap');
      handler || (handler = (cmpHooks[hookName] as GenericHookFunc));
      
      if (hook && hook[tapType]) {
        hook[tapType]('TODO', handler);
      }
    }
  }
}