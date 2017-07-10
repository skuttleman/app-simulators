require('babel-core/register');

const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const del = require('del');
const glob = require('glob');
const gulp = require('gulp');
const { ifn } = require('fun-util');
const { noop } = require('gulp-util');
const jasmine = require('gulp-jasmine');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');

const BROWSERIFY_CONFIG = {
  extensions: ['.jsx', '.js'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true,
  entries: './src/js/app/main.js'
};

const BABELIFY_CONFIG = {
  presets: ['es2015', 'react', 'stage-1'],
  ignore: 'node_modules'
};

const errorReporter = ({ build }) => {
  return function (error) {
    console.error(error);
    if (build) {
      process.exit(1);
    }
    this.emit('end');
  };
};

const buildOnly = (condition, action, ...args) => {
  return ifn(() => condition, action, noop)(...args);
};

const toFilePath = file => {
  return file.split('/src')[1].split('/');
};

const toTranspile = file => {
  let filePath = toFilePath(file);
  return `transpile:${filePath.join('/')}`;
};

const toDirectory = file => {
  let filePath = toFilePath(file).slice(0, -1);
  return filePath.join('/');
};

const testError = exit => function (err) {
  if (err.name && err.message && err.codeFrame) {
    console.error(err.name + ':', err.message);
    console.error(err.codeFrame, '\n');
  } else {
    console.log('An error occurred', err);
  }
  if (exit) process.exit(1);
  this.emit('end');
};

const test = exit => () => {
  return gulp.src('spec/**/*.js')
    .pipe(jasmine({
      config: {
        stopSpecOnExpectationFailure: false,
        random: true
      }
    }).on('error', testError(exit)));
};

let srcFiles = glob.sync(`${__dirname}/src/**/*.js`, { ignore: `${__dirname}/src/js/app/**/*.js` });

const jsTranspile = (config = {}) => () => {
  return browserify(BROWSERIFY_CONFIG)
    .transform(babelify.configure(BABELIFY_CONFIG))
    .bundle()
    .on('error', errorReporter(config))
    .pipe(source('app.js'))
    .pipe(gulp.dest('build/js'));
};

const sassTranspile = (config = {}) => () => {
  return gulp.src('src/scss/main.scss')
    .pipe(sass().on('error', errorReporter(config)))
    .pipe(gulp.dest('build/css'));
};

srcFiles.forEach(file => {
  var taskName = toTranspile(file);
  console.log('adding task:', taskName);
  gulp.task(taskName, () => gulp.src(file)
    .pipe(babel())
    .pipe(gulp.dest(`lib/${toDirectory(file)}`)));
});

gulp.task('clean:lib', () => {
  return del('lib');
});

gulp.task('clean:build/js', () => {
  return del('build/js');
});

gulp.task('clean:build/css', () => {
  return del('build/css');
});

gulp.task('clean', ['clean:lib', 'clean:build/js', 'clean:build/css']);

gulp.task('transpile:sass', sassTranspile());

gulp.task('sass:watch', ['transpile:sass'], () => {
  gulp.watch('src/scss/**/*.scss', ['transpile:sass'])
});

gulp.task('transpile:api', () => {
  return gulp.start(srcFiles.map(toTranspile));
});

gulp.task('transpile:app', jsTranspile());

gulp.task('transpile:all', ['clean'], () => {
  return gulp.start(['transpile:api', 'transpile:app', 'transpile:sass']);
});

gulp.task('transpile:watch', ['transpile:all', 'sass:watch'], () => {
  return gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['transpile:all']);
});

gulp.task('test:continue', test());

gulp.task('test', test(true));

gulp.task('test:watch', ['test:continue'], () => {
  return gulp.watch(['spec/**/*.js', 'src/**/*.js'], test());
});

gulp.task('default', ['test']);
