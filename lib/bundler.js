"use strict";
const MFS = require("memory-fs");
const webpack = require("webpack");
const NodeFS = require("webpack/lib/node/NodeOutputFileSystem");
const stream = require("stream");
const configuration_1 = require("./configuration");
const runner_1 = require("./runner");
const context_1 = require("./context");
module.exports = class WebpackBundler {
    constructor(options) {
        this.context = context_1.ctxCreator(options);
        this.logger = this.context.logger;
        this.configurations = configuration_1.default(this.context);
        this.runner = runner_1.default(this.context);
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
    middlewares(style = 'express') {
        let instances = [];
        let map = {
            express(instance) { return instance; },
            koa(instance) {
                return async (ctx, next) => {
                    const s = new stream.PassThrough();
                    await instance(ctx.req, {
                        end: (content) => {
                            ctx.body = content;
                        },
                        write: s.write.bind(s),
                        writeHead: (status, headers) => {
                            ctx.body = s;
                            ctx.status = status;
                            ctx.set(headers);
                        },
                        setHeader: (name, value) => {
                            ctx.set(name, value);
                        },
                    }, next);
                };
            }
        };
        this.context.devMiddleware.instances.forEach(i => instances.push(map[style](i)));
        this.context.hotMiddleware.instances.forEach(i => instances.push(map[style](i)));
        return instances;
    }
    addHooks(compiler) {
        let cmpHooks = this.context.hooks.compiler;
        let hooks = compiler.hooks;
        for (const hookName of Object.keys(cmpHooks)) {
            let tapType = cmpHooks[hookName].tapType;
            let handler = cmpHooks[hookName].handler;
            let hook = hooks[hookName];
            tapType || (tapType = 'tap');
            handler || (handler = cmpHooks[hookName]);
            if (hook && hook[tapType]) {
                hook[tapType]('TODO', handler);
            }
        }
    }
};
//# sourceMappingURL=bundler.js.map