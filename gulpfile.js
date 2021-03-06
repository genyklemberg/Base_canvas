var gulp = require('gulp'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    minifyCss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    uncss = require('gulp-uncss'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    sftp = require('gulp-sftp'),
    git = require('gulp-git'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserify = require('browserify'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    partialify = require('partialify'),
    prefix = require('gulp-autoprefixer');

var external = [
    'angular',
    'angular-ui-router',
    'angular-bootstrap',
    'angular-translate',
    'angular-cache',
    'angular-base64',
    'uuid4'
];

// Default
gulp.task('default', ['connect', 'bower', 'html', 'clearCss', 'css', 'watch']);

// Deploy final version on server
gulp.task('deploy', ['images', 'build']);

// SFTP
gulp.task('sftp', function () {
    return gulp.src('dist/**/*')
        .pipe(sftp({
            host: 'github.com',
            user: 'genyklemberg',
            pass: '',
            remotePath: "github.com/genyklemberg/Base_canvas.git"
        }));
});


// Clean folder dist
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// Connect server
gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    });
});

// Adds libraries to html
gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: "app/bower_components"
        }))
        .pipe(gulp.dest('./app'));
});

// Css
gulp.task('css', function () {
    gulp.src('scss/style.scss')
        .pipe(sass())
        .pipe(prefix('last 15 versions'))
        .pipe(minifyCss(''))
        .pipe(rename("bundle.min.css"))
        .pipe(gulp.dest('app/css'))
        .pipe(connect.reload());
});

// Compress images
gulp.task('images', function () {
    return gulp.src('app/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
            .pipe(gulp.dest('dist/images'));
});

// Build
gulp.task('build', ['clean'], function () {
    var assets = useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Html
gulp.task('html', function () {
    gulp.src('app/*.html')
        .pipe(connect.reload());
});

// Watch
gulp.task("watch", function() {
    gulp.watch('scss/style.scss', ["css"]);
        gulp.watch('app/index.html', ["html"]);
            gulp.watch('bower.json', ['bower']);

});

// Clear all unused attributes from css files
gulp.task('clearCss', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(gulp.dest('app/css'));
});


