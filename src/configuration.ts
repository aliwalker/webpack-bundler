import webpack = require("webpack");
import BuildContext = require('./typings/context');

export default confCreator;

type Configuration = webpack.Configuration;
let buildContext: BuildContext;

const options = {
  hotClient(conf: Configuration): boolean {
    let client = 'webpack-hot-middleware/client?name=';
    let ok = true;
    let normEntry = (oldEnt, name = void 0) => {
      // If it's already there.
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
      // Failed ...
      return oldEnt;
    }
  
    if (Array.isArray(conf.entry) ||
        conf.entry === void 0 ||
        typeof conf.entry === 'string') {
      conf.entry = normEntry(conf.entry);
    } else if (Object.keys(conf.entry).length !== 0) {
      // Add to each entry if there're multiple.
      for (const entKey of Object.keys(conf.entry)) {
        let oldEnt = conf.entry[entKey];
        conf.entry[entKey] = normEntry(oldEnt, entKey);
      }
    } else {
      ok = false;
    }
  
    return ok;
  },

  mode(conf: Configuration): boolean {
    conf.mode = buildContext.mode;
    return true;
  },

  hmrPlugin(conf: Configuration): boolean {
    conf.plugins || (conf.plugins = []);
    conf.plugins.push(new webpack.HotModuleReplacementPlugin());
    return true;
  },

  noEmitOnErrors(conf: Configuration): boolean {
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

function applyOptions(_opts: Object, conf: Configuration) {
  let opts = Object.assign({}, defaultOpts, _opts);

  for (const name of Object.keys(opts)) {
    opts[name] && options[name](conf);
  }
  return conf;
}

function confCreator(context: BuildContext) {
  buildContext = context;

  const configuration = {
    client(conf: Configuration): Configuration {
      let opts = {
        hotClient: true,
        hmrPlugin: true,
      };

      return applyOptions(opts, conf);
    },
  
    server(conf: Configuration): Configuration {
      return applyOptions({}, conf);
    }
  }
  return configuration;
}