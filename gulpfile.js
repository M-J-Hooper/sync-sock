var gulp = require('gulp');
var jshint = require('gulp-jshint');
var beautify = require('gulp-beautify');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');

var p = require('./package.json');

var paths = {
    main: ['index.js', 'client.js'],
    example: 'example',
    test: 'test'
};
var alljs = path => path+'/**/*.js';
paths.defaultjs = paths.main.concat([alljs(paths.test), alljs(paths.example)]);

var defaultTasks = ['lint', 'test', 'move', 'listen'];

gulp.task('default', defaultTasks.concat('watch'));

gulp.task('lint', function() {
    return gulp.src(paths.defaultjs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
    return gulp.src(alljs(paths.test))
        .pipe(mocha({
            reporter: 'progress'
        }));
});

gulp.task('move', function() {
    return gulp.src('sync-sock-client.js')
        .pipe(gulp.dest('example/client/'));
});

gulp.task('listen', function() {
    nodemon({
        script: 'example/example-server.js'
    });
});

gulp.task('beautify', function() {
    return gulp.src(paths.defaultjs, {base: "./"})
        .pipe(beautify({
            indent_size: 4
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch(paths.defaultjs, defaultTasks);
});