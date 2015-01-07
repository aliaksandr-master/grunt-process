'use strict';

var task = require('../lib');

module.exports = function (grunt) {
	grunt.registerMultiTask('process', function () {
		task(grunt, this.files, this.options({}), this.async());
	});
};
