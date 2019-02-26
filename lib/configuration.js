"use strict";
exports.__esModule = true;
var webpack = require("webpack");
exports["default"] = confCreator;
var buildContext;
var options = {
    hotClient: function (conf) {
        var client = 'webpack-hot-middleware/client?name=';
        var ok = true;
        var normEntry = function (oldEnt, name) {
            if (name === void 0) { name = void 0; }
            if (typeof oldEnt === 'string' &&
                oldEnt.indexOf('webpack-hot-middleware/client') > -1) {
                return oldEnt;
            }
            if (typeof oldEnt === 'string' || oldEnt === void 0) {
                return [client + (name ? name : 'main'), oldEnt];
            }
            if (Array.isArray(oldEnt)) {
                return [client + (name ? name : 'main')].concat(oldEnt);
            }
            return oldEnt;
        };
        if (Array.isArray(conf.entry) ||
            conf.entry === void 0 ||
            typeof conf.entry === 'string') {
            conf.entry = normEntry(conf.entry);
        }
        else if (Object.keys(conf.entry).length !== 0) {
            for (var _i = 0, _a = Object.keys(conf.entry); _i < _a.length; _i++) {
                var entKey = _a[_i];
                var oldEnt = conf.entry[entKey];
                conf.entry[entKey] = normEntry(oldEnt, entKey);
            }
        }
        else {
            ok = false;
        }
        return ok;
    },
    mode: function (conf) {
        conf.mode = buildContext.mode;
        return true;
    },
    hmrPlugin: function (conf) {
        conf.plugins || (conf.plugins = []);
        conf.plugins.push(new webpack.HotModuleReplacementPlugin());
        return true;
    },
    noEmitOnErrors: function (conf) {
        conf.plugins || (conf.plugins = []);
        conf.plugins.push(new webpack.NoEmitOnErrorsPlugin());
        return true;
    }
};
var defaultOpts = {
    noEmitOnErrors: true,
    mode: true,
    hotClient: false,
    hmrPlugin: false
};
function applyOptions(_opts, conf) {
    var opts = Object.assign({}, defaultOpts, _opts);
    for (var _i = 0, _a = Object.keys(opts); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        opts[name_1] && options[name_1](conf);
    }
    return conf;
}
function confCreator(context) {
    buildContext = context;
    var configuration = {
        client: function (conf) {
            var opts = {
                hotClient: true,
                hmrPlugin: true
            };
            return applyOptions(opts, conf);
        },
        server: function (conf) {
            return applyOptions({}, conf);
        }
    };
    return configuration;
}
//# sourceMappingURL=configuration.js.map