## Webpack-Bundler

A small package wrapped around webpack, used for dealing with bundling over bunches of webpack configurations.

This package contains some common code for starting webpack programatically. Webpack-dev-middleware & webpack-hot-middleware are integrated and middleware instances can be obtained easily.


### Usage

TODO: (Yiyong.Li)

In development mode, `WebpackBundler` uses webpack-dev-middleware & webpack-hot-middleware for any "non-node-targeted" configurations.

```ts
import WebpackBundler = require('bundler');
import webpackConf from '/path/to/webpack/configuration';

const bundler = new WebpackBundler({
  mode: 'development'
});

bundler.build()
  .then(() => {
    // webpack-dev-middleware & webpack-hot-middleware.
    const middlewares = builder.middlewares();
    // ...
  })
```

### Options

- `mode` - 'development' | 'production' | 'none'.
- `hot` - True to enable webpack-hot-middleware.
- `logger` - Defaults to webpack-log. Set to false to disable logging.
- `webpackConfs` - A webpack configuration object or an array of webpack configs.
- `devMiddlewareOptions` - Options that'll pass to webpack-dev-middleware.
- `hotMiddlewareOptions` - Options that'll pass to webpack-hot-middleware.
- `hooks` - Add your compiler hooks in this field, for example:

  ```js
  new WebpackBundler({
    hooks: {
      compiler: {
        // Pass in an object here.
        done: {
          name: 'foo',        // Plugin name.
          tapType: 'tapAsync',// Tap type.
          handler(stats) {    // Handler.
            ...
          },
        },

        // Or simply just a handler.
        compile(compParam) {
          ...
        }
      }
    }
  });

  // which will be merged into compilation:
  compiler.hooks.done.tapAsync('foo', handler);
  compiler.hooks.compile.tap('a-random-string', afterEmit);
  ```

  If the given hooks do not exist, they'll fail silently.