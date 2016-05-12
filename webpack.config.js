var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');

//开发时使用webpack -w
//发布时使用pack.ssh打包

/**
 * 开发 or 线上
 *  __DEV__: true 开发
 *  __DEV__: false 线上
 * */
var __DEV__ = JSON.stringify(process.env.NODE_ENV) === '"production"' ? false : true;

/**
 * 线上测试 or 线上正式
 *  __TEST__: true 线上测试
 *  __TEST__: false 线上正式
 * */
var __TEST__ = JSON.stringify(process.env.TEST_ENV) === '"production"' ? false : true;

module.exports = {
  context: __dirname,//path.join(__dirname, 'app'),
  entry: {
    scripts: './index.jsx'
  },
  output: {
    filename: './assets/scripts/[name].js'
  },
  plugins: [
    new CopyWebpackPlugin([ 
      { from: './assets/', to: './dist/assets/' },
      { from: './index.html', to: './dist/index.html' },
    ]),
    new CleanWebpackPlugin(['dist'], {
      verbose: true,
      dry: false
    }),
    new webpack.DefinePlugin({
      __DEV__: __DEV__,
      __TEST__: __TEST__,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || '"development"'
    })
  ],
  module: {
    preLoaders: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      'plugins': [
        'esLint-plugin-react'
      ]
    }],
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0'],
        plugins: ['syntax-decorators', 'transform-decorators-legacy']
      }
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules' //&localIdentName=[name]__[local]-[hash:base64:5] //重命名便于模块化样式
    }]
  },
  eslint: {
    configFile: '.eslintrc'
  }
};
