import WebpackDevMiddleware = require('webpack-dev-middleware');
import * as loglevel from 'loglevel';
import MFS = require('memory-fs');
import webpack = require('webpack');
import * as Koa from "koa";
import NodeFS = require('webpack/lib/node/NodeOutputFileSystem');
import stream = require('stream');

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
      
      compiler.outputFileSystem = this.fileSystem;
      this.addHooks(compiler);
      return this.runner[target](compiler);
    });

    await Promise.all(promises);
  }

  middlewares(style: 'express'| 'koa' = 'express') {
    let instances: Array<any> = [];
    let map = {
      express(instance: any) { return instance; },
      koa(instance: any) {
        return async (ctx: Koa.Context, next: Function) => {
          const s = new stream.PassThrough();
          await instance(ctx.req, {
            end: (content: any) => {
              ctx.body = content;
            },
            write: s.write.bind(s),
            writeHead: (status: any, headers: any) => {
              ctx.body = s;
              ctx.status = status;
              ctx.set(headers);
            },
            setHeader: (name: string, value: string) => {
              ctx.set(name, value);
            },
          }, next);
        }
      }
    };

    this.context.devMiddleware.instances.forEach(i => instances.push(map[style](i)));
    this.context.hotMiddleware.instances.forEach(i => instances.push(map[style](i)));
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