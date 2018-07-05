const format = require('util').format;
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const localIdentName = process.env.NODE_ENV === 'test' ?
  // Enzyme as of v2.4.1 has trouble with classes
  // that do not start and *end* with an alpha character
  // but that will sometimes happen with the base64 hashes
  // so we leave them off in the test env
  '[name]--[local]' :
  '[name]--[local]--[hash:base64:5]';

module.exports = {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],
  devtool: 'sourcemap',
  entry: {
    index: [path.join(__dirname, '/src/index')],
    print: [path.join(__dirname, '/src/modules/print/index')],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist/'),
  },
  resolve: {
    extensions: [
      // '',
      '.js',
    ],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader?sourceMap',
            query: {
                modules: true,
                importLoaders: 1,
                localIdentName: localIdentName
            }
          },
          'postcss-loader?sourceMap',
        ]
      },
      {
        test: /\.js$/,
        exclude: path.join(__dirname, 'node_modules'),
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          'react-native-web-image-loader?name=[hash].[ext]',
        ]
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: 'url-loader?limit=25000&mimetype=image/png',
          },
        ]
      },
    ]
  },
};
