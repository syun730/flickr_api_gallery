var
gulp = require('gulp'),
browserSync = require('browser-sync').create()
;

// サーバー・ブラウザ自動更新
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: ['./'],
      directory: true,
    },
    port: 8888,
    ghostMode: true,
    open: false,
    notify: false
  });
});

gulp.task('browser-reload', function () {
  browserSync.reload();
});

// デフォルト
gulp.task('default', ['server'], function () {
  gulp.watch('./**/*.html', ['browser-reload']);
  gulp.watch('css/**/*.css', ['browser-reload']);
  gulp.watch('js/**/*.js', ['browser-reload']);
});
