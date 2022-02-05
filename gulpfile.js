const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const server = require('browser-sync').create();
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const sourcemaps = require("gulp-sourcemaps");
const args = require("args-parser")(process.argv);
const gulpif = require("gulp-if");

const paths = {
    pages: ["src/html/*.html", "src/html/*.ico"],
    assetsSrc: ["src/assets"],
    assetsDist: ["dist/assets"],
    typescriptEntries: ["src/main.ts"],
    buildDir: 'dist/'
};

const isProduction = args.production || false;


gulp.task("copy-html", () => gulp.src(paths.pages).pipe(gulp.dest(paths.buildDir)));

function copyAssets() {
    return gulp.src("./assets/**/*").pipe(gulp.dest("./dist/assets/"));
}

gulp.task("copy-assets", copyAssets);


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
        debug: true,
        entries: paths.typescriptEntries,
        transform: [
            [
                babelify, {
                    presets: ['@babel/preset-env']
                }
            ]
        ]
    })
        .plugin(tsify, 'tsconfig.json')
        .bundle()

        .pipe(source("bundle.js"))
        .pipe(buffer())

        .pipe(gulpif(isProduction === false, sourcemaps.init({ loadMaps: true })))
        .pipe(gulpif(isProduction === true, uglify()))
        .pipe(gulpif(isProduction === false, sourcemaps.write('.')))
        .pipe(gulp.dest(paths.buildDir));
});



gulp.task('default', gulp.series(['copy-assets', 'copy-html', 'build', 'serve'], () => gulp.watch(['assets/**/*'], function () {
    copyAssets();
})));
