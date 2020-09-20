var gulp = require("gulp");
var sass = require("gulp-sass");
var sassGlob = require("gulp-sass-glob");
var browserSync = require("browser-sync").create();
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssvariables = require("postcss-css-variables");
var calc = require("postcss-calc");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");

// js file paths
var utilJsPath = 'node_modules/codyhouse-framework/main/assets/js'; // util.js path - you may need to update this if including the framework as external node module
var componentsJsPath = "./assets/js/components/*.js"; // component js files
var scriptsJsPath = "./src/_includes/js"; //folder for final scripts.js/scripts.min.js files

// css file paths
var cssFolder = "./src/_includes/css"; // folder for final style.css/style-custom-prop-fallbac.css files
var scssFilesPath = "./assets/css/**/*.scss"; // scss files to watch

gulp.task("sass", function () {
	return gulp
		.src(scssFilesPath)
		.pipe(sassGlob())
		.pipe(
			sass({
				outputStyle: "compressed",
			}).on("error", sass.logError)
		)
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest(cssFolder))
		.pipe(rename("style-fallback.css"))
		.pipe(postcss([cssvariables(), calc()]))
		.pipe(gulp.dest(cssFolder));
});

gulp.task("scripts", function () {
	return gulp
		.src([utilJsPath + "/util.js", componentsJsPath])
		.pipe(concat("scripts.js"))
		.pipe(gulp.dest(scriptsJsPath))
		.pipe(rename("scripts.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(scriptsJsPath));
});

//Dev
gulp.task(
	"watch",
	gulp.series(["sass", "scripts"], function () {
		gulp.watch("assets/css/**/*.scss", gulp.parallel(["sass"]));
		gulp.watch(componentsJsPath, gulp.parallel(["scripts"]));
	})
);

//Build
gulp.task("build", gulp.parallel("sass", "scripts"));