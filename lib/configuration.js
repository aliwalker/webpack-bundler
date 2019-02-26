"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
exports.default = confCreator;
let buildContext;
const options = {
    hotClient(conf) {
        let client = 'webpack-hot-middleware/client?name=';
        let ok = true;
        let normEntry = (oldEnt, name = void 0) => {
            if (typeof oldEnt === 'string' &&
                oldEnt.indexOf('webpack-hot-middleware/client') > -1) {
                return oldEnt;
            }
            if (typeof oldEnt === 'string' || oldEnt === void 0) {
                return [client + (name ? name : 'main'), oldEnt];
            }
            if (Array.isArray(oldEnt)) {
                return [client + (name ? name : 'main'), ...oldEnt];
            }
            return oldEnt;
        };
        if (Array.isArray(conf.entry) ||
            conf.entry === void 0 ||
            typeof conf.entry === 'string') {
            conf.entry = normEntry(conf.entry);
        }
        else if (Object.keys(conf.entry).length !== 0) {
            for (const entKey of Object.keys(conf.entry)) {
                let oldEnt = conf.entry[entKey];
                conf.entry[entKey] = normEntry(oldEnt, entKey);
            }
        }
        else {
            ok = false;
        }
        return ok;
    },
    mode(conf) {
        conf.mode = buildContext.mode;
        return true;
    },
    hmrPlugin(conf) {
        conf.plugins || (conf.plugins = []);
        conf.plugins.push(new webpack.HotModuleReplacementPlugin());
        return true;
    },
    noEmitOnErrors(conf) {
        conf.plugins || (conf.plugins = []);
        conf.plugins.push(new webpack.NoEmitOnErrorsPlugin());
        return true;
    }
};
const defaultOpts = {
    noEmitOnErrors: true,
    mode: true,
    hotClient: false,
    hmrPlugin: false,
};
function applyOptions(_opts, conf) {
    let opts = Object.assign({}, defaultOpts, _opts);
    for (const name of Object.keys(opts)) {
        opts[name] && options[name](conf);
    }
    return conf;
}
function confCreator(context) {
    buildContext = context;
    const configuration = {
        client(conf) {
            let opts = {
                hotClient: true,
                hmrPlugin: true,
            };
            return applyOptions(opts, conf);
        },
        server(conf) {
            return applyOptions({}, conf);
        }
    };
    return configuration;
}
//# sourceMappingURL=configuration.js.map