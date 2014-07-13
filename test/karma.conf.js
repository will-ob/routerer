module.exports = function(config) {
  config.set({

    basePath: '../',

    frameworks: ['mocha', 'sinon'],


    files: [
      'node_modules/mocha/mocha.js',
      'node_modules/chai/chai.js',
      'test/init.js',
      'node_modules/lodash/lodash.js',
      'node_modules/jquery/dist/jquery.js',
      'node_modules/backbone/backbone.js',
      'dist/router.js',
      'test/router.coffee'
    ],

    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    captureTimeout: 60000,

    singleRun: false,

    preprocessors: {
      '**/*.coffee': ['coffee']
    },

    coffeePreprocessor: {
      options: {
        bare: true,
        sourceMap: false
      },
    }

  });
};
