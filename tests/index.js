'use strict';

var grunt = require('grunt');
var process = require('./_lib');

exports['no files'] = function (test) {
	process(grunt, [], {}, function (err) {
		test.ok(!err);
		test.done();
	});
};

exports['empty files'] = function (test) {
	process(grunt, [
		{
			src: [ 'tests/source/unit/process.txt' ],
			dest: '.tmp/unit/process.txt'
		}
	], {}, function (err) {
		test.ok(!err);
		test.done();
	});
};
