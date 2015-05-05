'use strict';

var path = require('path');
var grunt = require('grunt');

module.exports['must be equal with examples'] = function (test) {
	var fs = grunt.file.expand({
		cwd: '.tmp',
		filter: 'isFile'
	}, [
		'**/*.{json,txt}'
	]);

	fs.forEach(function (f) {
		var result = grunt.file.read(path.join('.tmp', f));
		var expect = grunt.file.read(path.join('tests/expect', f));

		test.equal(result, expect);
	});

	test.done();
};
