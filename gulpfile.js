var gulp = require('gulp'),
	sass = require('gulp-sass'),
	del = require('del');

//paths in project
var sassPath = {
		src: 'public/static/sass/**/*.scss',
		dst: 'public/static/sasstarget/'
};

//task to convert scss to css
gulp.task('front', function(){
	del(sassPath.dst);
	return gulp.src(sassPath.src)
			.pipe(sass.sync().on('error', sass.logError))
			.pipe(gulp.dest(sassPath.dst));
});

//monitor changes
gulp.task('watch', function(){
	return gulp.watch(['public/static/sass/**/*.scss'], ['front']);
});