const webpackConfig = require('./webpack.config');

module.exports = function (config) {
   config.set({
      basePath: '',
      frameworks: ['mocha', 'chai', 'sinon'],
      reporters: ['mocha'],
      files: ['src/**/*.spec.ts'],
      exclude: [],
      preprocessors: {
         'src/**/*.spec.ts': ['webpack'],
      },
      webpack: {
         mode: 'development',
         module: webpackConfig.module,
         resolve: webpackConfig.resolve,
      },
      webpackMiddleware: {
         noInfo: true,
         stats: 'errors-only'
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
