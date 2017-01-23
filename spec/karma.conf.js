module.exports = function (config) {
  config.set({
    basePath: './',
    preprocessors: {
      '../src/js/**/*.js': ['coverage'],
      'fixtures/**/*.json': ['json_fixtures']
    },
    files: [
      "../src/lib/lodash/lodash.js",
      "../src/lib/ionic/release/js/ionic.bundle.js",
      "../src/lib/angular-resource/angular-resource.js",
      "../src/lib/angular-mocks/angular-mocks.js",
      "../src/lib/ngCordova/dist/ng-cordova.js",
      "../src/lib/angular-input-masks/angular-input-masks-standalone.min.js",
      '../src/js/**/*.js',
      'fixtures/**/*.json',
      'phantomjs-fix.js',
      'unit/**/*.js'
    ],
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-json-fixtures-preprocessor'
    ],
    jsonFixturesPreprocessor: {
      camelizeFilenames: true
    }
  });
};
