const _ = require('lodash');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const copy = require('gulp-copy');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const through = require('through2');
const watch = require('gulp-watch');

let localConfig;
try {
  localConfig = require('./app/config/environment/local.env');
} catch (e) {
  localConfig = {};
}

// configurable paths
const paths = {
  server: 'app',
  dist: 'dist',
  tmp: '.tmp',
};

const envs = {
  all: localConfig,
  test: {
    NODE_ENV: 'test',
  },
  dev: {
    NODE_ENV: 'development',
  },
  prod: {
    NODE_ENV: 'production',
  },
};

const mochaOptions = {
  reporter: 'spec',
  require: ['babel-register', 'babel-polyfill', 'test/mocha.conf.js'],
  checkLeaks: true,
  timeout: 5000, // set default mocha spec timeout
  exit: true,
};

let _nodemon;
let started = false;

function restartNodemon() {
  return through.obj((file, enc, cb) => {
    if (started) {
      _nodemon.emit('restart');
    }
    return cb(null, file);
  });
}

function handleError(err) {
  console.log(err.toString());
  process.exit(1);
}

gulp.task('env:all', () => _.assignIn(process.env, {}, localConfig));
gulp.task('env:test', ['env:all'], () => _.assignIn(process.env, {}, envs.test));
gulp.task('env:dev', ['env:all'], () => _.assignIn(process.env, {}, envs.dev));
gulp.task('env:prod', ['env:all'], () => _.assignIn(process.env, {}, envs.prod));

gulp.task('clean', () =>
  gulp.src([`${paths.tmp}/*`, `${paths.dist}/*`], { read: false, force: true, dot: true }).pipe(clean()),
);

gulp.task('copy:dist', () => gulp.src(`${paths.server}/**/*.@(json|pug)`).pipe(copy(paths.dist)));

function eslintStream(stream, dest) {
  return stream
    .pipe(eslint())
    .pipe(babel({ sourceMap: false }))
    .pipe(gulp.dest(dest))
    .pipe(
      eslint.results(results => {
        _.forEach(results, result => {
          if (result.errorCount === 0 && result.warningCount === 0) return;

          console.error(result.filePath);
          _.forEach(result.messages, message =>
            console.error(
              `\n\tline: ${message.line} column: ${message.column}\n\truleId: ${message.ruleId}\n\tmessage: ${
                message.message
              }\n`,
            ),
          );
        });
        console.log(
          `eslint - Results: ${results.length}`,
          `Warnings: ${results.warningCount}`,
          `Errors: ${results.errorCount}`,
        );
      }),
    );
}

gulp.task('watch:js', () => {
  watch([`${paths.server}/**/*.js`], event => {
    const stream = gulp.src(event.path, { base: paths.server }).pipe(plumber());
    return eslintStream(stream, `${paths.tmp}`).pipe(restartNodemon());
  });
});

gulp.task('compile:js:serve', () => eslintStream(gulp.src(`${paths.server}/**/*.js`), `${paths.tmp}`));

gulp.task('compile:js:dist', () => eslintStream(gulp.src(`${paths.server}/**/*.js`), `${paths.dist}/${paths.server}`));

gulp.task('mochaTest:model-unit', () =>
  gulp
    .src(['test/**/*.model.spec.js'], { read: false })
    .pipe(mocha(mochaOptions))
    .on('error', handleError)
);

gulp.task('mochaTest', () =>
  gulp
    .src(['test/**/*.spec.js', 'app/api/**/*.spec.js'], { read: false })
    .pipe(mocha(mochaOptions))
    .on('error', handleError)
);

gulp.task('nodemon', () => {
  _nodemon = nodemon({
    script: `${paths.tmp}/index.js`,
    // watch: `${paths.tmp}/`,
    // exec: 'DEBUG=SS:*,iamporter* node',
    // ,sequelize:* 'node --inspect=0.0.0.0:9229',
    ext: 'js',
    verbose: true,
  }).on('start', () => {
    started = true;
  });
  return _nodemon;
});

gulp.task('serve', cb => {
  runSequence('clean', 'env:dev', 'compile:js:serve', 'watch:js', 'nodemon', cb);
});

gulp.task('test', cb => {
  runSequence('env:test', 'mochaTest', cb);
});

gulp.task('build', cb => {
  runSequence('clean', 'compile:js:dist', cb);
});

gulp.task('default', cb => {
  runSequence('env:test', 'clean', 'compile:js:dist', 'copy:dist', cb);
});
