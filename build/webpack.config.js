const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },
  externals: [
    {
      'openhab': {
        root: 'openhab',
        commonjs: 'openhab',
        commonjs2: 'openhab',
        amd: 'openhab'
      }
    }
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'smartheit.js',
    library: {
      name: 'smartheit',
      type: 'umd'
    },
    globalObject: 'this'
  }
};
