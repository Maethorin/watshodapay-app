var es          = require('event-stream');
var fs          = require('fs');
var del         = require('del');
var gulp        = require('gulp');
var shell         = require('gulp-shell');
var open          = require('open');
var _             = require('lodash');
var express       = require('express');
var sass          = require('gulp-sass');
var watch         = require('gulp-watch');
var karma         = require('karma').server;
var runSequence   = require('run-sequence');
var minifyJS      = require('gulp-uglify');
var vinylPaths    = require('vinyl-paths');
var inject        = require('gulp-inject');
var concat        = require('gulp-concat');
var cssmin        = require('gulp-cssmin');
var livereload    = require('gulp-livereload');
var replace       = require('gulp-replace-task');
var connectLr     = require('connect-livereload');
var watchSequence = require('gulp-watch-sequence');
var architectures = ['armv7', 'x86'];

var isRelease,
    defaultVersion = '0.0.0',
    defaultVersionCode = '001',
    args = require('yargs')
             .alias('e', 'env')
             .alias('l', 'live')
             .alias('v', 'version')
             .alias('c', 'versionCode')
             .alias('s', 'specs')
             .argv;

var paths = {
  gulpFile:   'gulpfile.js',

  src: {
    assetsFile: 'src/assets.json',
    templates:  'src/templates/**/**.*',
    index:      'src/index.html',
    fonts:      ['src/fonts/**.*', 'src/lib/ionic/release/fonts/**.*'],
    imgs:       'src/img/**/**.*',
    path:       'src/',
    scss:       'src/sass/**/**.scss',
    css:        'src/css/**/**.css',
    js:         'src/js/**/**.js'
  },

  dist: {
    templates: 'www/templates',
    scssFiles: 'www/css/**/**.scss',
    cssFiles:  'www/css/**/**.*',
    cssFile:   'www/css/application.css',
    jsFiles:   'www/js/**/**.*',
    jsFile:    'www/js/application.js',
    files: 'www/**/**.*',
    fonts: 'www/fonts',
    path:  'www/',
    imgs:  'www/img',
    css:   'www/css',
    js:    'www/js'
  },

  root: '.',

  config: {
    build:       "config/build.json",
    configXML:   "config/config.xml",

    test:        "config/test.json",
    sandbox:     "config/sandbox.json",
    production:  "config/production.json",
    development: "config/development.json"
  }
};

var read = function(path) {
  return fs.readFileSync(path, 'utf8')
};

var parse = function(content) {
  return JSON.parse(content)
};


// ********
// GULP WEB
// ********


gulp.task('web:build', function () {
  isRelease = false;

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveHTML',

    'moveCSS',
    'clearCSS',

    'moveJS',
    'replaceJS',

    'inject'
  );
});

gulp.task('web:run', function (callback) {
  isRelease = false;

  livereload.listen();

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveHTML',

    'moveCSS',
    'clearCSS',

    'moveJS',
    'replaceJS',

    'inject',
    'watch',
    'serve',

    callback
  );
});


// ********
// GULP RUN
// ********


gulp.task('android:run', function(callback) {
  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveHTML',

    'moveCSS',
    'clearCSS',

    'moveJS',
    'replaceJS',

    'moveConfig',

    'inject',

    'android:deploy',

    callback
  );
});


// ************
// GULP RELEASE
// ************


gulp.task('android:release', function(callback) {
  isRelease = true;

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveHTML',

    'moveCSS',
    'concatCSS',
    'minifyCSS',

    'moveAndConcatJS',
    'minifyJS',
    'replaceJS',

    'moveConfig',

    'inject',

    'clear',

    'android:release:build',
    'android:release:sign',
    'android:release:align',

    callback
  )
});

gulp.task('clean', function() {
  return gulp.src(paths.dist.files).pipe(vinylPaths(del));
});

gulp.task('clear', function() {
  var sources = [
    paths.dist.cssFiles,
    '!' + paths.dist.cssFile,

    paths.dist.jsFiles,
    '!' + paths.dist.jsFile
  ];

  return gulp.src(sources)
             .pipe(vinylPaths(del));
});


/*
 * IMGS
 */


gulp.task('moveImgs', function() {
  return gulp.src(paths.src.imgs)
             .pipe(gulp.dest(paths.dist.imgs));
});


/*
 * FONTS
 */


gulp.task('moveFonts', function() {
  return gulp.src(paths.src.fonts)
             .pipe(gulp.dest(paths.dist.fonts));
});


/*
 * STYLESHEETS
 */


gulp.task('moveCSS', function() {
  var assetsCSS = parse(read(paths.src.assetsFile)).css;

  var sources = _.map(assetsCSS, function(asset) {
    var css  = '.css';
    var sass = '.scss';
    var extension = '';

    var pathWithoutExtension = paths.src.path + asset;

    if (fs.existsSync(pathWithoutExtension + css)) {
      extension = css;
    } else if (fs.existsSync(pathWithoutExtension + sass)) {
      extension = sass;
    } else {
      return '';
    }

    return pathWithoutExtension + extension;
  });
  sources.push(paths.src.scss);
  return gulp.src(sources)
             .pipe(sass({
               includePaths: [
                 'src/lib'
               ]
             }).on('error', sass.logError))
             .pipe(gulp.dest(paths.dist.css))
             .pipe(livereload())
});

gulp.task('moveHTML', function() {
  es.concat(
    gulp.src(paths.src.templates)
        .pipe(gulp.dest(paths.dist.templates))
        .pipe(livereload())
  )
});

gulp.task('clearCSS', function() {
  return gulp.src(paths.dist.scssFiles)
             .pipe(vinylPaths(del));
});

gulp.task('concatCSS', function() {
  return gulp.src(paths.dist.cssFiles)
             .pipe(concat('application.css'))
             .pipe(gulp.dest(paths.dist.css))
});

gulp.task('minifyCSS', function() {
  return gulp.src(paths.dist.cssFiles)
             .pipe(cssmin())
             .pipe(gulp.dest(paths.dist.css));
});


/*
 * JAVASCRIPTS
 */


gulp.task('moveJS', function() {
  var assetsJS = parse(read(paths.src.assetsFile)).js;

  var sources  = _.map(assetsJS, function(asset) {
    return paths.src.path + asset + '.js';
  });

  return gulp.src(sources)
             .pipe(gulp.dest(paths.dist.js))
             .pipe(livereload())
});

gulp.task('moveAndConcatJS', function() {
  var assetsJS = parse(read(paths.src.assetsFile)).js;

  var sources  = _.map(assetsJS, function(asset) {
    return paths.src.path + asset + '.js';
  });

  return gulp.src(sources)
             .pipe(concat('application.js'))
             .pipe(gulp.dest(paths.dist.js))
});

gulp.task('minifyJS', function() {
  return gulp.src(paths.dist.jsFiles)
             .pipe(minifyJS({ mangle: false }))
             .pipe(gulp.dest(paths.dist.js));
});

gulp.task('replaceJS', function() {
  args.env = args.env || 'development';
  var configs = parse(read(paths.config[args.env]));

  var patterns = _.map(configs, function(value, key) {
    return { match: key, replacement: value };
  });

  return gulp.src(paths.dist.jsFiles)
             .pipe(replace({ patterns: patterns }))
             .pipe(gulp.dest(paths.dist.js));
});

gulp.task('inject', function() {
  if (isRelease) {
    var srcOptions    = { read: false };
    var injectOptions = { ignorePath: paths.dist.path, addRootSlash: false };

    return gulp.src(paths.src.index)
               .pipe(inject(gulp.src(paths.dist.jsFile,  srcOptions), injectOptions))
               .pipe(inject(gulp.src(paths.dist.cssFile, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  }
  else {
    var assets = parse(read(paths.src.assetsFile));

    var sourcesCSS = _.map(assets.css, function(asset) {
      return paths.dist.css + '/' + _.last(asset.split('/')) + '.css';
    });
    sourcesCSS.push(paths.dist.cssFile);
    var sourcesJS = _.map(assets.js, function(asset) {
      return paths.dist.js + '/' + _.last(asset.split('/')) + '.js';
    });

    srcOptions    = { base: paths.dist, read: false };
    injectOptions = { ignorePath: paths.dist.path, addRootSlash: false };

    return gulp.src(paths.src.index)
               .pipe(inject(gulp.src(sourcesJS,  srcOptions), injectOptions))
               .pipe(inject(gulp.src(sourcesCSS, srcOptions), injectOptions))
               .pipe(gulp.dest(paths.dist.path))
  }
});


/*
 * DEVICES
 */


gulp.task('moveConfig', function () {
  var version = args.version || defaultVersion,
      versionCode = args.versionCode || defaultVersionCode;

  var patterns = [
    {
      match: 'version',
      replacement: version
    },
    {
      match: 'versionCode',
      replacement: versionCode
    }
  ];

  return gulp.src(paths.config.configXML)
             .pipe(replace({ patterns: patterns }))
             .pipe(gulp.dest(paths.root))
});

gulp.task('android:deploy', shell.task([
  'ionic run android --device' + (args.live ? ' -l -c -s' : '')
]));

gulp.task('android:release:build', shell.task([
  'ionic build android --release'
]));

gulp.task('android:release:sign', function() {
  var config = parse(read(paths.config.build)),
      commands = [];

  _.forEach(architectures, function(architecture) {
    commands.push('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore certificates/google-play-key.keystore platforms/android/build/outputs/apk/android-' + architecture + '-release-unsigned.apk watshodapay -storepass ' + config.android.storepass);
  });

  return gulp.src('').pipe(shell(commands))
});

gulp.task('android:release:align', function() {
  var dir = 'builds/android/' + args.version + '/',
      commands = [ 'mkdir -p ' + dir ];

  _.forEach(architectures, function(architecture) {
    var file = 'zipalign -v 4 platforms/android/build/outputs/apk/android-' + architecture + '-release-unsigned.apk ' + dir + '_' + architecture + '_' + Date.now() + '.apk';
    commands.push(file)
  });

  return gulp.src('').pipe(shell(commands))
});


/*
 * TESTS
 */


gulp.task('test:unit', function (done) {
  karma.start({
    singleRun: true,
    configFile: __dirname + '/spec/karma.conf.js'
  }, function () {
    done();
    process.exit(0);
  });
});

gulp.task('test:e2e', function () {
  var commands = [],
      webdriver = 'webdriver-manager start &>/dev/null &',
      protractor = !args.specs ? 'protractor spec/protractor.conf.js' : 'protractor spec/protractor.conf.js --specs ' + args.specs;

  commands.push(webdriver);
  commands.push(protractor);

  return gulp.src('').pipe(shell(commands, { PATH: process.env.PATH }));
});




/*
 * OTHERS
 */


gulp.task('deliver', function (callback) {
  args.env = args.env || 'sandbox';

  runSequence(
    'clean',

    'moveImgs',
    'moveFonts',

    'moveHTML',

    'moveCSS',
    'clearCSS',

    'moveJS',
    'replaceJS',

    'inject',
    'upload',

    callback
  );
});


gulp.task('upload', shell.task([
  'ionic upload',
  'git push origin master:master',
  'git tag -f delivered',
  'git push --tags -f'
]));

gulp.task('watch', function() {
  // FONTS
  gulp.watch(paths.src.fonts, function() {
    gulp.start('moveFonts');
  });

  // IMGS
  gulp.watch(paths.src.imgs, function() {
    gulp.start('moveImgs');
  });

  // CSS
  var cssSources = [
    paths.src.css,
    paths.src.scss,
    paths.src.assetsFile
  ];

  gulp.watch(cssSources, function() {
    gulp.start('moveCSS')
  });

  // JS
  var jsSources = [
    paths.src.js,
    paths.src.assetsFile
  ];

  var queue = watchSequence(300);

  watch(
    jsSources,
    { name: 'JS', emitOnGlob: false },
    queue.getHandler('moveJS', 'replaceJS', 'inject')
  );

  // HTML
  var htmlSources = [
    paths.src.index,
    paths.src.templates
  ];

  gulp.watch(htmlSources, function() {
    gulp.start('inject');
    gulp.start('moveHTML');
  });

  // INJECT
  var injectSources = [
    paths.src.assetsFile,
    paths.src.index
  ];

  gulp.watch(injectSources, function() {
    gulp.start('inject');
  });
});

gulp.task('serve', function() {
  express()
    .use(connectLr())
    .use(express.static(paths.dist.path))
    .listen('3100');

  open('http://localhost:' + 3100 + '/');
});