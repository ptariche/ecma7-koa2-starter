'use strict';

const GULP        = require('gulp');
const SOURCE_MAPS = require('gulp-sourcemaps');
const ES2015      = require('babel-preset-es2015-node');
const BABEL       = require('gulp-babel');
const PATH        = require('path');

const PATHS = {
  es6: ['src/**/*.js'],
  es5: 'dist',
  sourceRoot: PATH.join(__dirname, 'src'),
};

const COMPILE = () => {
  GULP.src(PATHS.es6)
    .pipe(SOURCE_MAPS.init())
    .pipe(BABEL({presets: [ES2015] }))
    .pipe(SOURCE_MAPS.write('.',
              { sourceRoot: PATHS.sourceRoot }))
    .pipe(GULP.dest(PATHS.es5));
};

GULP.task('babel', () => {
  return COMPILE();
});

GULP.task('watch', () => {
  GULP.watch(PATHS.es6, ['babel']);
  COMPILE();
});

GULP.task('default', ['watch']);
