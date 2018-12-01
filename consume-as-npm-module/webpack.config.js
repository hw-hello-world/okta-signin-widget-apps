const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // mode: 'development',
  entry: {
    bundle: './src/index.js',
    'bundle-test': ['babel-polyfill', './src/test.js'],
  },
  output: {
    filename: '[name].pack.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      // '@okta/okta-auth-js/jquery': path.resolve(__dirname, 'node_modules/@okta/okta-auth-js/jquery'),
    }
  },
  module: {
    rules: [
      // Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './public/index.html',
        to: './index.html',
        toType: 'file',
        flatten: true,
      }
    ]),

    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      // reportFilename: `bundle.html`,
      analyzerMode: 'static',
    }),
  ]
};
