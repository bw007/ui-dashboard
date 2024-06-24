const { src, dest } = require("gulp");

const scss = require("gulp-sass")(require("sass"));

function styles() {
  return src("./src/scss/style.scss")
  .pipe(scss())
  .pipe(dest("./src/css/"));
}

exports.styles = styles;
