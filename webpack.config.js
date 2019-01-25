const webpack = require('webpack');
const path = require('path');

const plugins = {
   HtmlPlugin: require('html-webpack-plugin'),
   CleanPlugin: require('clean-webpack-plugin'),
}

module.exports = {
   entry: {
      app: './src/index.ts',
   },
   output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
   },
   module: {
      rules: [{
         test: /\.tsx?$/,
         use: [
            {
               loader: 'ts-loader',
               options: {
                  transpileOnly: true,
                  experimentalWatchApi: true,
               },
            },
         ],
         exclude: /node_modules/
      }, {
         test: /\.pug/,
         loaders: ['html-loader', 'pug-html-loader'],
         options: {}
      }]
   },
   resolve: {
      extensions: ['.tsx', '.ts', '.js']
   },
   plugins: [
      new plugins.CleanPlugin(['dist']),
      new plugins.HtmlPlugin({
         template: './src/index.pug',
         hash: false,
         minify: {
            collapseWhitespace: true,
         }
      }),
      new webpack.HashedModuleIdsPlugin(),
   ],

};