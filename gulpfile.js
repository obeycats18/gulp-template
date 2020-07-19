const { src, dest, series, parallel, watch } = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
// const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const del = require('del')


const browserSync = require('browser-sync').create()

function _browserSync () {
    browserSync.init({
        server: {baseDir: 'src/'},
        notify: false,
        online: false
    })
}

function _buildJS () {
    return src([
        'src/js/index.js'
    ])
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream())
}

function _buildStyles () {
    return src('src/scss/index.scss')
    .pipe(sass())
    .pipe(concat('index.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
    .pipe(dest('src/css/'))
    .pipe(browserSync.stream())
}

// function _images() {
//     return src('src/images/src/**/*')
//     .pipe(newer('src/images/dist/'))
//     .pipe(imagemin([imagemin.mozjpeg(), imagemin.optipng(), imagemin.svgo()]))
//     .pipe(dest('src/images/dist'))
// }

function _cleanImages () {
    return del('src/images/dist/**/*', {force: true})
}

function _cleanDist () {
    return del('dist/**/*', {force: true})
}

function _build() {
    return src([
        'src/css/**/*.min.css',
        'src/js/**/*.min.js',
        'src/images/**/*',
        'src/fonts/**/*',
        'src/**/*.html',
    ], {base: 'src'})
    .pipe(dest('dist'))
}

function _watch () {
    watch('src/scss/*.scss', _buildStyles)
    watch(['src/**/*.js', '!src/**/*.min.js'], _buildJS)
    watch('src/**/*.html').on('change', browserSync.reload)
    // watch('src/images/src/**/*', _images)
}

exports.build = series(_cleanDist, _buildStyles, _buildJS, /*_images,*/ _build)
exports.default = parallel(_buildJS, _buildStyles, /*_images,*/ _browserSync, _watch )