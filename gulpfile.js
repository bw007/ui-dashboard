const { src, dest, watch, series } = require("gulp");
const pug = require('gulp-pug');
const scss = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const cssbeautify = require("gulp-cssbeautify");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");

const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

async function pugToHTML() {
  return src("src/pug/pages/**/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

async function css() {
  return src("src/scss/style.scss", { base: "src/scss/" })
    .pipe(plumber())
    .pipe(scss())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(dest("dist/css/"))
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min", extname: ".css" }))
    .pipe(dest("dist/css/"))
    .pipe(browserSync.stream());
}

async function tsCompile() {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(plumber())
    .pipe(rigger())
    .pipe(dest("dist/js/"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min", extname: ".js" }))
    .pipe(dest("dist/js/"))
    .pipe(browserSync.stream());
}

async function images() {
  return src("src/imgs/**/*.{jpg,png,svg,gif,ico}")
    .pipe(imagemin())
    .pipe(dest("dist/imgs/"));
}

async function watchFiles() {
  watch(["src/scss/**/*.scss"], css);
  watch(["src/ts/**/*.ts"], tsCompile);
  watch(["src/pug/**/*.pug"], pugToHTML);
  watch(["src/imgs/**/*.{jpg,png,svg,gif,ico}"], images);
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

const build = series(cleanDist, css, pugToHTML, images, tsCompile);
const watching = series(build, watchFiles, browsersync);

exports.css = css;
exports.tsCompile = tsCompile;
exports.pugToHTML = pugToHTML;
exports.images = images;
exports.cleanDist = cleanDist;
exports.watching = watching;
exports.default = watching;