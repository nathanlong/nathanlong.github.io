const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-include');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const liveServer = require('live-server');

var paths = {
	styles: {
		src: "source/scss/**/*.scss",
		dest: "build/css",
		minifySrc: "build/css/*.css"
	},
	scripts: {
		src: "source/js/*.js",
		dest: "build/js",
		minifySrc: "build/js/*.js"
	}
};

var params = {
    port: 8585, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "./", // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
};

// Runs SASS on main scss file, handles vendor prefixes through autoprefixer
function styles() {
	return src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(dest(paths.styles.dest));
}

// Minify all css
function stylesMinify() {
	return src(paths.styles.minifySrc)
		.pipe(cleanCSS())
		.pipe(dest(paths.styles.dest));
}

// Runs includes on javascript, exports to build
function scripts() {
	return src(paths.scripts.src)
		.pipe(include())
		.on("error", console.log)
		.pipe(dest(paths.scripts.dest));
}

// Minify all js
function scriptsMinify() {
	return src(paths.scripts.minifySrc)
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest));
}

function watchFiles() {
	watch(paths.styles.src, styles),
	watch(paths.scripts.src, scripts)
}

function server() {
	liveServer.start(params);
}

// Expose tasks
exports.styles = styles;
exports.stylesMinify = stylesMinify;
exports.scripts = scripts;
exports.scriptsMinify = scriptsMinify;
exports.watchFiles = watchFiles;
exports.server = server;

// Default task - builds, then watches assets and recompiles
exports.default = series(
	parallel(
		styles,
		scripts,
	),
	parallel(
		server,
		watchFiles
	)
);

exports.build = series(
	parallel(
		styles,
		scripts,
	),
	parallel(
		stylesMinify,	
		scriptsMinify
	)
);
