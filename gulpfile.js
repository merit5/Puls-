const gulp = require('gulp'); 
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');


// Таск для компиляции Less в Css
gulp.task('less', function(callback){
    return gulp.src('./src/less/style.less')
        .pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
     
     .pipe( sourcemaps.init() )
     .pipe( less())
     .pipe( autoprefixer({
         overrideBrowserslist: ['last 4 versions'] 
     }))
     .pipe( sourcemaps.write()) 
     .pipe( gulp.dest('./src/css'))
     
    callback();
}); 


//задача для слежения за файлами
gulp.task('watch', function() {
    // слежение за html css и обновление браузера

   watch(['./src/*.html', './src/css/**/*.css'],gulp.parallel( browserSync.reload ));
    
    // Слежение за less и компиляция в css
    watch('./src/less/**/*.less', gulp.parallel('less'));

    // Запуск слежения и компиляции SCSS с задержкой, для жесктих дисков HDD
	// watch('./app/scss/**/*.scss', function(){
	// 	setTimeout( gulp.parallel('scss'), 1000 )
	// })
});

// задача для старта сервера из папки src
gulp.task('server', function() {
     browserSync.init({
        server: {
            baseDir: "./src/"

        }
    }); 
});
//  Дефолтный таск (задача по умолчанию)
// задача для запуска слежения и старта одновременно 
gulp.task('default', gulp.parallel('server','watch', 'less'));


