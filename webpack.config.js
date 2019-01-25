const webpack = require('webpack');
const path = require('path');

const autoprefixer = require('autoprefixer');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   mode: 'development',
   entry: {
      app: './src/index.ts',
   },
   output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
   },
   devtool: 'cheap-inline-module-source-map',
   module: {
      rules: [{
         test: /\.ts$/,
         use: [{
            loader: 'ts-loader',
            options: {
               transpileOnly: true,
               experimentalWatchApi: true,
            },
         }],
         exclude: /node_modules/
      }, {
         test: /\.pug/,
         loaders: ['html-loader', 'pug-html-loader'],
      }, {
         test: /\.sass$/,
         use: [
            MiniCssExtractPlugin.loader, //'style-loader',
            'css-loader',
            {
               loader: 'postcss-loader',
               options: {
                  plugins: [
                     autoprefixer({
                        browsers: ['last 3 version']
                     })
                  ],
                  sourceMap: true
               }
            },
            {
               loader: 'sass-loader',
               options: {
                  sourceMap: true,
               }
            }
         ]
      }, {
         test: /\.(png|svg|jpg|gif)$/,
         use: ['file-loader'],
      }],
   },
   resolve: {
      extensions: ['.tsx', '.ts', '.js']
   },
   plugins: [
      new webpack.NoErrorsPlugin(),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
         template: './src/index.pug',
         hash: false,
         minify: {
            collapseWhitespace: true,
         }
      }),
      new webpack.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
         filename: "[name].[contenthash].css",
      }),
   ],

};