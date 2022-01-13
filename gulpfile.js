var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var server = require('browser-sync').create();
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
//const { texturepack } = require("texturepack");
const path = require('path');
const { execSync, exec } = require('child_process');
const log = require('fancy-log');
const sourcemaps = require("gulp-sourcemaps");
const args = require("args-parser")(process.argv);
var gulpif = require("gulp-if");
var concat = require('gulp-concat');

const paths = {
  pages: ["src/html/*.html", "src/html/*.ico"],
  assetsSrc: ["src/assets"],
  assetsDist: ["dist/assets"],
  typescriptEntries: ["src/main.js"],
  buildDir: 'dist/'
};

const isProduction = args.production || false;

const EmptyTask = () => null;

//gulp.task('copy-phaser-bin', () => gulp.src('phaser/phaser.min.js').pipe(gulp.dest(paths.buildDir)));

gulp.task("copy-html", () => gulp.src(paths.pages).pipe(gulp.dest(paths.buildDir)));
gulp.task("generate-assets", (done) => {
    const inkscape = "C:\\Program Files\\Inkscape\\bin\\inkscape.exe";
    const groups = ["blue", "red", "yellow"];
    const input = path.join(__dirname, "src", "resources", "gfx.svg");
    const maxDpiFactor = 4;
    for (let dpiFactor = 1; dpiFactor <= maxDpiFactor; ++dpiFactor) {
        for (let group of groups) {
            const output = path.join(__dirname, "src", "resources", "@" + dpiFactor, group + ".png");
            const command = `"${inkscape}" --export-id="${group}" --export-dpi=${96*dpiFactor} --export-id-only --export-background-opacity=0 --export-type=png --export-filename="${output}" "${input}"`;
            execSync(command, {stdio: "inherit"});
            log(`The element ${output} has been exported`);
        }
        texturepack({
            folder: path.join("src", "resources", "@" + dpiFactor),
            fileName: "spritesheet@" + dpiFactor,
            outFolder: path.join("src", "../assets", "images")
        })
            .then(() => log(`Pack@${dpiFactor} successful`));
    }
    done();
});

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

gulp.task('build-assets', gulp.series(['generate-assets', 'copy-assets']), EmptyTask);

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
      
      .pipe(gulpif(isProduction === false, sourcemaps.init({loadMaps: true})))
      .pipe(gulpif(isProduction === true, uglify()))
      .pipe(gulpif(isProduction === false, sourcemaps.write('.')))
      .pipe(gulp.dest(paths.buildDir));
  });



gulp.task('default', gulp.series(['copy-assets', 'copy-html', 'build', 'serve'], () => gulp.watch(['assets/**/*'], function() {
    copyAssets();
})));
