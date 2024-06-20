const { watch } = require('gulp');

watch(['src/*.js', '!input/something.js'], function(cb) {
  // body omitted
  cb();
});