const fs = require('fs');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');

const polyfills = {
  // ECMAScript
  'es5-shim': 'node_modules/es5-shim/es5-shim.js', // IE8
  'es5-sham': 'node_modules/es5-shim/es5-sham.js', // IE8
  'es6-shim': 'node_modules/es6-shim/es6-shim.js', // IE8
  'es6-sham': 'node_modules/es6-shim/es6-sham.js', // IE8
  'es7-shim': 'node_modules/es7-shim/dist/es7-shim.js', // IE8
  'babel-polyfill': 'node_modules/babel-polyfill/dist/polyfill.js', // IE9+

  // DOM
  'html5shiv': 'node_modules/html5shiv/dist/html5shiv.js', // IE6-8
  'placeholders': 'node_modules/fork-placeholders.js/dist/placeholders.js', // IE6-9

  // CSSOM
  'classlist-polyfill': 'node_modules/classlist-polyfill/src/index.js', // IE8-9
  'matchmedia-polyfill': 'node_modules/matchmedia-polyfill/matchMedia.js', // IE8-9

  // Web APIs
  'console-polyfill': 'node_modules/console-polyfill/index.js', // IE8
  'raf-polyfill': 'vendor/rAF.js', // IE8-9
  'performance-now-polyfill': 'vendor/performance-now.js', // IE8-9
  'blob-polyfill': 'node_modules/blob-polyfill/Blob.js', // IE9

  'es6-promise': 'node_modules/es6-promise/dist/es6-promise.auto.js',
  'fetch-ie8': 'node_modules/fetch-ie8/fetch.js', // IE8

  'flexibility': 'node_modules/flexibility/flexibility.js' // IE8-9
};

const paths = {
  ie8Scripts: [
    // use shim/sham on IE8
    polyfills['es5-shim'],
    polyfills['es5-sham'],
    polyfills['es6-shim'],
    polyfills['es6-sham'],
    polyfills['es7-shim'],
    polyfills['html5shiv'],
    polyfills['placeholders'],
    polyfills['classlist-polyfill'],
    polyfills['matchmedia-polyfill'],
    polyfills['console-polyfill'],
    polyfills['raf-polyfill'],
    polyfills['performance-now-polyfill']
  ],
  ie9Scripts: [
    polyfills['babel-polyfill'],
    polyfills['placeholders'],
    polyfills['classlist-polyfill'],
    polyfills['matchmedia-polyfill'],
    polyfills['console-polyfill'],
    polyfills['raf-polyfill'],
    polyfills['performance-now-polyfill'],
    polyfills['blob-polyfill']
  ],
  ie10Scripts: [
    polyfills['babel-polyfill']
  ],
  ie11Scripts: [
    polyfills['babel-polyfill']
  ],
  esNextScripts: [
    polyfills['babel-polyfill']
  ],
  dist: 'lib/js'
};

gulp.task('css', function () {
  const plugins = [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'chrome >=32', // the latest Chrome Frame version
        'firefox >=49',
        'ie >= 8', // IE 8-11
        'safari >=9' // OS X 10.9+ Mavericks/Yosemite/El Capitan/Sierra
      ]
    })
  ];
  return gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('lib/css'));
});

gulp.task('polyfills', function () {
  return gulp.src('src/js/polyfills.js')
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license',
      compress: {screw_ie8: false},
      mangle: {screw_ie8: false},
      output: {screw_ie8: false}
    }))
    // .pipe(concat('index.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

// 检查依赖的 js 是否下载
gulp.task('check', function () {
  for (let prop in polyfills) {
    if (polyfills.hasOwnProperty(prop) && polyfills[prop]) {
      fs.stat(polyfills[prop], (err, stats) => {
        if (err) {
          console.error(err);
          console.error(`Dependency: ${prop} may not be installed successfully!`);
          throw err;
        }
      });
    }
  }
});

gulp.task('ie8', function () {
  return gulp.src(paths.ie8Scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license',
      compress: {screw_ie8: false},
      mangle: {screw_ie8: false},
      output: {screw_ie8: false}
    }))
    .pipe(concat('ie8-polyfills.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('ie9', function () {
  return gulp.src(paths.ie9Scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(concat('ie9-polyfills.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('ie10', function () {
  return gulp.src(paths.ie10Scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(concat('ie10-polyfills.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('ie11', function () {
  return gulp.src(paths.ie11Scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(concat('ie11-polyfills.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('es-next', function () {
  return gulp.src(paths.esNextScripts)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(concat('es-next-polyfills.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy', function () {
  return gulp.src([polyfills['file-saver']])
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license',
      compress: {screw_ie8: false},
      mangle: {screw_ie8: false},
      output: {screw_ie8: false}
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function () {
  return gulp.src(['lib'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['css', 'check', 'polyfills', 'ie8', 'ie9', 'ie10', 'ie11', 'es-next']);
