const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: path.resolve('./src/main.js'),
    bundle2: path.resolve('./src/2/main2.js')
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: './src/index.html' },
      { from: './src/2/index2.html'},
      { from: 'node_modules/@okta/okta-signin-widget/dist/js', to: 'okta/js' },
      { from: 'node_modules/@okta/okta-signin-widget/dist/css', to: 'okta/css' },
      { from: 'node_modules/@okta/okta-signin-widget/dist/font', to: 'okta/font' },
      { from: 'node_modules/@okta/okta-signin-widget/dist/img', to: 'okta/img' }
    ]),
  ],

  modulesDirectories: [
    'node_modules'
  ],

  devtool: 'source-map',

  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015']
        }
      },
      {
        test:    /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader:  'elm-webpack'
      }
    ],

    noParse: /\.elm$/
  }

};
