const webpackConfig = require('./webpack.config');
const path = require('path');

module.exports = function (config) {
   config.set({
      basePath: '',
      frameworks: ['mocha', 'chai', 'sinon'],
      files: ['test/*.spec.ts'],
      exclude: [],
      preprocessors: {
         'test/**/*.ts': ['webpack'],
         'dist/**/!(*spec).js': ['coverage']
      },
      webpack: {
         mode: 'development',
         module: webpackConfig.module,
         resolve: webpackConfig.resolve,
      },
      plugins: ['karma-remap-istanbul', 'karma-coverage'],
      reporters: ['mocha', 'coverage-istanbul'],
      coverageReporter: {
         type: 'text',
         file: 'output',
      },
      mochaReporter: {
         showDiff: true,
      },
      remapIstanbulReporter: {
         reports: {
            html: 'coverage'
         }
      },
      coverageIstanbulReporter: {
         reports: ['html', 'text-summary'],
         dir: path.join(__dirname, 'coverage'),
         fixWebpackSourcePaths: true,
         'report-config': {
            html: { outdir: 'html' }
         }
      },
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['PhantomJS'],
      singleRun: false,
      concurrency: Infinity,

      mime: {
         "text/x-typescript": ["ts", "tsx"],
      },
   });
}