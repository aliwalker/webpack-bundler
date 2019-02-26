"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var MFS = require("memory-fs");
var webpack = require("webpack");
var NodeFS = require("webpack/lib/node/NodeOutputFileSystem");
var configuration_1 = require("./configuration");
var runner_1 = require("./runner");
var context_1 = require("./context");
module.exports = (function () {
    function WebpackBundler(options) {
        this.context = context_1.ctxCreator(options);
        this.logger = this.context.logger;
        this.configurations = configuration_1["default"](this.context);
        this.runner = runner_1["default"](this.context);
        this.compilers = [];
        this.fileSystem = this.context.mode === 'development' ? new MFS() : new NodeFS();
    }
    WebpackBundler.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Array.isArray(this.context.webpackConfs)) {
                            this.context.webpackConfs = [this.context.webpackConfs];
                        }
                        this.context.webpackConfs.forEach(function (conf) {
                            var target = conf.target === 'node' ? 'server' : 'client';
                            conf = _this.configurations[target](conf);
                            _this.compilers.push(webpack(conf));
                        });
                        return [4, this.compile()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    WebpackBundler.prototype.compile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = this.compilers.map(function (compiler) {
                            var target = compiler.options.target === 'node' ? 'server' : 'client';
                            _this.addHooks(compiler);
                            return _this.runner[target](compiler);
                        });
                        return [4, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    WebpackBundler.prototype.middlewares = function () {
        var instances = [];
        this.context.devMiddleware.instances.forEach(function (i) { return instances.push(i); });
        this.context.hotMiddleware.instances.forEach(function (i) { return instances.push(i); });
        return instances;
    };
    WebpackBundler.prototype.addHooks = function (compiler) {
        var cmpHooks = this.context.hooks.compiler;
        var hooks = compiler.hooks;
        for (var _i = 0, _a = Object.keys(cmpHooks); _i < _a.length; _i++) {
            var hookName = _a[_i];
            var tapType = cmpHooks[hookName].tapType;
            var handler = cmpHooks[hookName].handler;
            var hook = hooks[hookName];
            tapType || (tapType = 'tap');
            handler || (handler = cmpHooks[hookName]);
            if (hook && hook[tapType]) {
                hook[tapType]('TODO', handler);
            }
        }
    };
    return WebpackBundler;
}());
//# sourceMappingURL=bundler.js.map