var gulp = require("gulp");
var rename = require("gulp-rename");
var through = require("through-gulp");
var ts = require("gulp-typescript");
var gutil = require("gulp-util");
var fs = require("fs");
var path = require("path");

var taskFun = function(cb, filename) {
	gulp.src(filename ? filename : ["**/*.ts", "!**/node_modules/**"])
		.pipe(through(function(file, encoding, callback) {
			gutil.log("[ts2js] " + file.path);
			this.push(file);
			callback();
		}))
		.pipe(ts())
		.pipe(rename(function(path) {
			path.ext = ".js";
		}))
		.pipe(gulp.dest(filename ? path.dirname(filename) : "."));
};

gulp.task("default", taskFun);

gulp.watch(["**/*.ts", "!**/node_modules/**"], function(e) {
	if (fs.existsSync(e.path)) {
		var stat = fs.statSync(e.path);
		if (stat.isFile())
			taskFun(null, e.path);
	}
});