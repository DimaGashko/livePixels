const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'development',
   devtool: 'cheap-inline-module-source-map',
   devServer: {
      contentBase: '/',
      open: false
   }
});