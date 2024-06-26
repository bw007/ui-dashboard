const { src, dest, parallel, watch, series } = require("gulp");

const pug = require('gulp-pug');
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function pugToHTML() {
  return src("src/pug/pages/**/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

function css() {
  return src("src/scss/style.scss")
    .pipe(autoprefixer())
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("dist/css/"))
    .pipe(browserSync.stream());
}

function js() {
  return src("src/js/main.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("src/js"))
    .pipe(browserSync.stream());
}

function watching() {
  watch(["src/scss/style.scss"], css);
  watch(["src/js/main.js"], js);
  watch(["src/*.html"]).on("change", browserSync.reload);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "src/",
    },
  });
}

function cleanDist() {
  return src("dist", { allowEmpty: true })
    .pipe(clean())
}

const build = series(cleanDist, css, js, pugToHTML);
const watch = series(build, watching, browsersync);

exports.css = css;
exports.js = js;
exports.watching = watching;
exports.browsersync = browsersync;
exports.default = watch;