const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const lessGlob = require('gulp-less-glob');
const pug = require('gulp-pug');
const del = require('del');

// Таск для сборки Gulp файлов
gulp.task ('pug', function(callback) {
    return gulp.src('./src/pug/pages/**/*.pug')
        .pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}))
        .pipe( pug({
            pretty: true
        }))
        .pipe( gulp.dest('./build/'))
        .pipe(browserSync.stream() )
    callback();   
});


// Таск для компиляции Less в Css
gulp.task('less', function(callback){
    return gulp.src('./src/less/main.less')
       .pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
                        sound: false,
                        message: err.message
				}
			})
		}))
      .pipe(sourcemaps.init())
      .pipe(lessGlob())
      .pipe(
            less({
                indentType: "tab",
                indentWidth: 1,
                outputStyle: "expanded"
            })
        )
       .pipe(autoprefixer({
         overrideBrowserslist: ['last 4 versions'] 
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./build/css/'))
      .pipe(browserSync.stream() )    
    callback();
});

// Копирование изображений
gulp.task('copy:img', function(callback){
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./build/img/'))
    callback();
})

// Копирование скриптов
gulp.task('copy:js', function(){
    return gulp.src('./src/js/**/*.*')
        .pipe(gulp.dest('./build/js/'))
    callback();
})

// Слежение за html,css и обновление браузера
gulp.task('watch', function(){
    
    // Следим за картинками с скриптами и обновляем браузер
    watch( ['./build/js/**/*.*'], gulp.parallel(browserSync.reload) );

  //Слежение за Less и компиляция в css
   watch('./src/less/**/*.less', gulp.parallel('less'))

   // Слежение за pug и сборка 
    watch('./src/pug/**/*.pug', gulp.parallel('pug'))
    
    // Следим за картинками и скриптами, и копируем их в build
    watch('./src/img/**/*.*', gulp.parallel('copy:img'))
    watch('./src/js/**/*.*', gulp.parallel('copy:js'))
});

// Задача для запуска сервера из папки app
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

// Таск для del
gulp.task('clean:build', function(){
    return del('./build')
});

// Дефолтный таск (задача по умолчанию)
// Запускаем одновременно задачи server, watch,less
// gulp.task('default', gulp.parallel('server', 'watch', 'less', 'pug'));
gulp.task(
    'default', 
    gulp.series(
        gulp.parallel( 'clean:build'),
        gulp.parallel('less', 'pug', 'copy:img', 'copy:js'), 
        gulp.parallel('server', 'watch') 
    )
);

