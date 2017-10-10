var gulp = require('gulp'),
    clean = require('gulp-clean'),
    nodemon = require('gulp-nodemon'),
    ts = require('gulp-typescript');

//Objeto de configuração
var config = {
    server_dist: './dist',
    server_init: './dist/index.js',
    server_files: ['./**/*.ts'],
    server_package: './package.json',
    tsProject: ts.createProject('./tsconfig.json')
}

//Inicia somente o backend
gulp.task('dev', ['build'], function (cb) {
    //Api
    nodemon({
        script: config.server_init,
        env: { 'NODE_ENV': 'development' }
    });

    gulp.watch(config.server_files, ['build']);
});

//Cria nova build da aplicação backend
gulp.task('build', function () {

    return config.tsProject.src()
        .pipe(config.tsProject())
        .pipe(gulp.dest(config.server_dist));
});

//Limpa antgas builds do server
gulp.task('clean', function () {
    return gulp.src([config.server_dist])
        .pipe(clean({ force: true }));
});