var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');

module.exports = {
  entry: {
    app: ['./src/main.js']
  },
  output: {
    path    : 'dist',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test   : /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader : 'babel'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title   : 'prezmeplease',
      template: '_index.html'
    })
  ]
};
