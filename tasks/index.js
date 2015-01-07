'use strict';

var _ = require('lodash');
var async = require('async');

var asyncRun = function (func, callback, obj) {
	var async = 0;
	var done = 0;
	var result;
	var err;

	var _callback = function () {
		done++ || callback.apply(this, arguments);
		callback = null;
	};

	var asyncCbk = function () {
		return async++ ? null : _callback;
	};

	try {
		if (obj == null) {
			result = func(asyncCbk);
		} else {
			obj = Object.create(obj);
			obj.async = asyncCbk;
			result = func.call(obj);
		}
	} catch (e) {
		err = e;
	}

	!async && _callback.call(this, err, result);
};

module.exports = function (grunt) {
	grunt.registerMultiTask('process', function () {
		var gruntDone = this.async();

		var options = this.options({
			readOptions: null,

			read: function (fSrc, fDest, options, fOptions) {
				return grunt.file.read(fSrc, options);
			},

			process: function (fSrc, fDest, content, fOptions) {
				return content;
			},

			save: function (fSrc, fDest, content, fOptions) {
				var fileObject = {};
				fileObject[fDest] = content;
				return fileObject;
			}
		});

		var fileObjects = [];
		this.files.forEach(function (f) {
			f.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				}

                return true;
			}).forEach(function (srcFilePath) {
				fileObjects.push({
					src: srcFilePath,
					dest: f.dest,
					object: f
				});
			});
		});

		async.each(fileObjects, function (fileObject, fileDone) {
			async.nextTick(function () {
				async.series([
					function (done) {
						asyncRun(function () {
							return options.read.call(this, fileObject.src, fileObject.dest, options.readOptions, fileObject.object);
						}, function (err, result) {
							fileObject.content = result;
							done(err);
						}, options);
					},

					function (done) {
						asyncRun(function () {
							return options.process.call(this, fileObject.src, fileObject.dest, fileObject.content, fileObject.object);
						}, function (err, result) {
							fileObject.content = result;
							done(err);
						}, options);
					},

					function (done) {
						asyncRun(function () {
							return options.save.call(this, fileObject.src, fileObject.dest, fileObject.content, fileObject.object);
						}, function (err, filesHash) {
							if (err) {
								done(err);
								return;
							}

							_.each(filesHash, function (fileContent, filePath) {
								grunt.file.write(filePath, fileContent);
								grunt.log.ok('File "' + filePath.replace(process.cwd(), '') + '" ' + (filePath === fileObject.src ? 'processed' : 'created'));
							});

							done();
						}, options);
					}
				], fileDone);
			});
		}, gruntDone);
	});
};
