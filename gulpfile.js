const { src, dest, watch, series } = require("gulp");
const pug = require("gulp-pug");
const scss = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const cssbeautify = require("gulp-cssbeautify");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");

const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

const path = {
  src: {
    pug: "src/pug/pages/**/*.pug",
    scss: "src/scss/style.scss",
    ts: "src/ts/**/*.ts",
    img: "src/imgs/**/*.{jpg,png,svg,gif,ico}",
  },
  watch: {
    pug: "src/pug/**/*.pug",
    scss: "src/scss/**/*.scss",
    ts: "src/ts/**/*.ts",
    img: "src/imgs/**/*.{jpg,png,svg,gif,ico}",
  },
  build: {
    html: "dist/",
    css: "dist/css/",
    js: "dist/js/",
    img: "dist/imgs/",
  },
};

async function pugToHTML() {
  return src(path.src.pug)
    .pipe(pug({ pretty: true }))
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

async function scssToCss() {
  return src(path.src.scss, { base: "src/scss/" })
    .pipe(plumber())
    .pipe(scss())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min", extname: ".css" }))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

async function tsCompile() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js
    .pipe(plumber())
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min", extname: ".js" }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

async function images() {
  return src(path.src.img)
    .pipe(imagemin())
    .pipe(dest(path.build.img));
}

async function watchFiles() {
  watch([path.watch.scss], scssToCss);
  watch([path.watch.ts], tsCompile);
  watch([path.watch.pug], pugToHTML);
  watch([path.watch.img], images);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
    port: 3000,
  });
}

function cleanDist() {
  return src("dist", { allowEmpty: true })
    .pipe(clean());
}

const build = series(cleanDist, scssToCss, pugToHTML, images, tsCompile);
const watching = series(build, watchFiles, browsersync);

exports.scssToCss = scssToCss;
exports.tsCompile = tsCompile;
exports.pugToHTML = pugToHTML;
exports.images = images;
exports.cleanDist = cleanDist;
exports.watching = watching;
exports.default = watching;
