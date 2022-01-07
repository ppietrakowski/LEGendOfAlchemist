var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var server = require('browser-sync').create()
var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer');

const paths = {
  pages: ["src/*.html"],
  typescriptEntries: ["src/main.js"],
  buildDir: 'dist/'
};

const EmptyTask = () => null;

gulp.task('copy-phaser-bin', () => gulp.src('phaser/phaser.min.js').pipe(gulp.dest(paths.buildDir)));

gulp.task("copy-html", () => gulp.src(paths.pages).pipe(gulp.dest(paths.buildDir)));


gulp.task('serve', () =>
    server.init({
        server: {
            baseDir: paths.buildDir
        }
    })
);

gulp.task('build', () => {
    return browserify({
      basedir: ".",
      debug: false,
      entries: paths.typescriptEntries,
      cache: {},
      packageCache: {},
    })
      .plugin(tsify, 'tsconfig.json')
      
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(paths.buildDir));
  });


gulp.task('default', gulp.series(['copy-phaser-bin', 'copy-html', 'build', 'serve'], EmptyTask));
