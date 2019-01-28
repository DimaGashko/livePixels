const webpackConfig = require('./webpack.config');

module.exports = function (config) {
   config.set({
      basePath: '',
      frameworks: ['mocha', 'chai', 'sinon'],
      files: ['test/*.ts'],
      exclude: [],
      preprocessors: {
         'test/**/*.ts': ['webpack'],
         'src/**/*.ts': [],
      },
      webpack: {
         mode: 'development',
         module: webpackConfig.module,
         resolve: webpackConfig.resolve,
      },
      coverageReporter: {
         type: 'text',
         file: 'output',
      },
      mochaReporter: {
         showDiff: true,
      },
      reporters: ['mocha'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['PhantomJS'],
      singleRun: false,
      concurrency: Infinity,
   });
}