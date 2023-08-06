import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import {deleteAsync} from 'del';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';

// Styles

const styles = () => {
  return gulp.src('src/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}
// HTML

const html = () => {
  return gulp.src('src/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('src/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

// Copy

const copy = (done) => {
  gulp.src([
    'src/fonts/*.{woff2,woff}',
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('build'))
  done();
}

// Clean

const clean = () => {
  return deleteAsync('build');
}

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}


// Watcher

const watcher = () => {
  gulp.watch('src/sass/**/*.scss', gulp.series(styles));
  gulp.watch('src/js/*.js', gulp.series(scripts, reload));
  gulp.watch('src/*.html', gulp.series(html, reload));
}

// build

export const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    scripts
  ),
);


export default gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    scripts
  ),
  gulp.series(
    server,
    watcher
  ));