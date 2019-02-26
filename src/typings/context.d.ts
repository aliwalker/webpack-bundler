import WebpackBundler = require('../../index');
import WebpackDevMiddleware = require('webpack-dev-middleware');
import WebpackHotMiddleware = require('webpack-hot-middleware');

type BaseOptions = WebpackBundler.BaseOptions;

export = BuildContext;

interface BuildContext extends BaseOptions {
  devMiddleware: {
    options: WebpackDevMiddleware.Options;
    instances: Array<WebpackDevMiddleware.WebpackDevMiddleware>;
  }

  hotMiddleware: {
    options: WebpackHotMiddleware.Options;
    instances: Array<any>;
  }
}