const { src, dest, watch, series } = require("gulp");
const pug = require('gulp-pug');
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

async function pugToHTML() {
  return src("src/pug/pages/**/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

async function css() {
  return src("src/scss/style.scss")
    .pipe(autoprefixer())
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("dist/css/"))
    .pipe(browserSync.stream());
}

async function tsCompile() {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(uglify())  // Minifikatsiya qilish
    .pipe(dest("dist/js/"))
    .pipe(browserSync.stream());
}

async function watchFiles() {
  watch(["src/scss/**/*.scss"], css);
  watch(["src/ts/**/*.ts"], tsCompile);
  watch(["src/pug/pages/**/*.pug"], pugToHTML);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
    port: 3000
  });
}

function cleanDist() {
  return src("dist", { allowEmpty: true })
    .pipe(clean())
}

const build = series(cleanDist, css, pugToHTML, tsCompile);
const watcher = series(build, watchFiles, browsersync);

exports.css = css;
exports.tsCompile = tsCompile;
exports.pugToHTML = pugToHTML;
exports.cleanDist = cleanDist;
exports.watch = watcher;
exports.default = watcher;