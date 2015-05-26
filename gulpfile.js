 'use strict';

// Include Gulp & Tools We'll Use
var gulp 		= require('gulp');
var $ 			= require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var cp          = require('child_process');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        proxy: 'qeewi.dev'
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return $.rubySass('_sass/style.scss')
            .pipe($.autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
            .pipe(gulp.dest('_site/assets/css'))
            .pipe(browserSync.reload({stream:true}))
            .pipe(gulp.dest('assets/css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_sass/**/*.scss', ['sass']);
    gulp.watch(['*.html', '*.php', '_layouts/*.html', '_includes/*.html', '_posts/*', 'assets/js/*.js', 'assets/images/*.{png, jpeg, jpg, gif}'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);