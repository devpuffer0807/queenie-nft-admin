const webpack = require("webpack");

module.exports = {
  webpack: function (config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      url: require.resolve("url"),
      fs: false,
      vm: false,
      buffer: require.resolve("buffer"),
    });
    config.resolve.fallback = fallback;

    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ];

    return { ...config, ignoreWarnings: [/Failed to parse source map/] };
  },
};
