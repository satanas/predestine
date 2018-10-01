var fs = require('fs');
var child = require('child_process');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var sequence = require('run-sequence');
var clean = require('gulp-clean');
var chalk = require('chalk');
var config = require('./config');

console.timelog = function(text) {
  if (text === '' || text === null || text === undefined) return;

  const time = new Date().toTimeString().slice(0, 8);
  console.log(`[${chalk.gray(time)}] ${text}`);
}

gulp.task('concat_js', function() {
  // Remove code marked as DEBUG
  const debugPattern = /\/\/-- DEBUG_START --([\s\S]*)\/\/-- DEBUG_END --/;

  return gulp.src(config.sourceFiles)
  .pipe(concat('all.js'))
  //.pipe(replace(debugPattern, ''))
  .pipe(gulp.dest('min'));
});

gulp.task('minify_css', function() {
  return gulp.src('style.css')
  .pipe(minifyCSS())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('min'));
});

gulp.task('minify_html', function() {
  // Remove all imports and replace them for the global one
  var pattern = /<!-- Begin imports -->([\s\S]*)<!-- End imports -->/;

  return gulp.src(['index.html'])
  .pipe(replace(pattern, '<script src="all.min.js"></script>'))
  .pipe(replace(/style.css/, 'style.min.css'))
  .pipe(gulp.dest('min'))
  .on('end', function() {
    return gulp.src('min/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('min'));
  });
});

gulp.task('clean', function() {
  gulp.src('min/*.zip', {read: false})
  .pipe(clean());
  gulp.src('min/*.css', {read: false})
  .pipe(clean());
  gulp.src('min/*.js', {read: false})
  .pipe(clean());
  gulp.src('min/*.html', {read: false})
  .pipe(clean());
});

gulp.task('build', function(cb) {
  sequence('concat_js', ['minify_css', 'minify_js', 'minify_html'], 'zip', cb);
});

gulp.task('minify_js', function(cb) {
  let cmd = [
    'closure-compiler',
    //'--warning_level', 'QUIET',
    '--compilation_level', 'ADVANCED',
    '--create_source_map', 'min/all.min.js.map',
    '--js', 'min/all.js',
    '--language_out', 'ECMASCRIPT_2015',
    '--js_output_file', 'min/all.min.js'
  ];

  child.exec(cmd.join(' '), (err, stdout, stderr) => {
    cb(err);
  });
});

gulp.task('zip', (cb) => {
  const outputFileName = `min/${config.appName}.zip`;

  child.exec(`advzip -p -4 --add ${outputFileName} min/all.min.js min/index.html min/style.min.css`, (err, stdout, stderr) => {
      for (let line of stdout.trim().split('\n')) {
        console.timelog(`  ${line}`);
      }
      console.timelog(stderr);
      cb(err);
  }).on('close', (code) => {
    if (code === 0) {
      let fstats = fs.statSync(outputFileName);
      let r = (13312 - fstats.size) + ' bytes';
      let sizeText;
      if (r < 0)
        sizeText = chalk.red(r);
      else
        sizeText = chalk.green(r);
      console.timelog(chalk.default('ZIP size: ') + chalk.cyan(fstats.size + ' bytes'));
      console.timelog(chalk.yellow('Remaining size: ') + sizeText);
    }
  });
});
