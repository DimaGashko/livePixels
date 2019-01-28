const webpackConfig = require('./webpack.config');

module.exports = function (config) {
   config.set({
      basePath: '',
      frameworks: ['mocha', 'chai', 'sinon'],
      reporters: ['spec', 'mocha'],
      files: ['test/*.ts'],
      exclude: [],
      preprocessors: {
         'test/**/*.ts': ['webpack'],
      },
      webpack: {
         mode: 'development',
         module: webpackConfig.module,
         resolve: webpackConfig.resolve,
      },
      mochaReporter: {
         showDiff: true,
      },
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['PhantomJS'],
      singleRun: false,
      concurrency: Infinity,
   });
}
