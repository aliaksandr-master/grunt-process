'use strict';

var _ = require('lodash');
var grunto = require('grunto');

module.exports = grunto(function (grunt) {

	grunt.registerTask('default', [
		'test',
		'watch'
	]);

	grunt.loadTasks('tasks');

	grunt.registerTask('test', [
		'eslint',
		'clean',
		'process',
		'nodeunit'
	]);

	return {

		eslint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'lib/*.js',
				'<%= nodeunit.tests %>'
			]
		},

		clean: [
			'.tmp'
		],

		process: {
			compress: {
				options: {
					read: function (src, dest, fileObject) {
						return grunt.file.readJSON(src);
					},
					process: function (src, dest, content, fileObject) {
						content = JSON.stringify(content);

						return content;
					}
				},
				files: [
					{
						src: 'tests/source/compress.json',
						dest: '.tmp/compress.json'
					}
				]
			},
			compressAndSplitJsonByKey: {
				options: {
					// read file and convert to JSON
					read: function (src, dest, fileObject) {
						return grunt.file.readJSON(src);
					},

					// add someKey to content object
					process: function (src, dest, content, fileObject) {
						content.someKey = 123;

						return content;
					},

					// split json by object key
					save: function (src, dest, content, fileObject) {
						var files = {};

						_.each(content, function (v, k) {
							var file = fileObject.orig.dest + '/' + k + '.json';

							files[file] = JSON.stringify(v);
						});

						return files;
					}
				},
				files: [
					{
						expand: true,
						cwd: 'tests/source/compress_and_split',
						dest: '.tmp/compress_and_split',
						src: [
							'**/*.json'
						]
					}
				]
			},
			remove_whitespaces: {
				options: {
					process: function (src, dest, content, fileObject) {
						content = content.replace(/\s+/g, '');

						return content;
					}
				},
				files: [
					{
						src: 'tests/source/remove_whitespaces.txt',
						dest: '.tmp/remove_whitespaces.txt'
					}
				]
			},
			split: {
				options: {
					save: function (src, dest, content, fileObject) {
						var obj = {};

						_.each(content.split('|'), function (content, index) {
							obj[dest + '/' + index + '.txt'] = content.trim();
						});

						return obj;
					}
				},
				files: [
					{
						src: 'tests/source/split.txt',
						dest: '.tmp/split.txt'
					}
				]
			},
			asyncRead: {
				options: {
					read: function (src, dest, fileObject) {
						var done = this.async();

						process.nextTick(function () {
							done(null, '1');
						});
					}
				},
				files: [
					{
						src: 'tests/source/async/read.txt',
						dest: '.tmp/async/read.txt'
					}
				]
			},
			asyncSave: {
				options: {
					save: function (src, dest, content, fileObject) {
						var done = this.async();

						process.nextTick(function () {
							var obj = {};

							obj[dest + '/1.txt'] = '1';
							obj[dest + '/2.txt'] = '2';
							obj[dest + '/3.txt'] = '3';

							done(null, obj);
						});
					}
				},
				files: [
					{
						src: 'tests/source/async/save.txt',
						dest: '.tmp/async/save.txt'
					}
				]
			},
			asyncProcess: {
				options: {
					process: function (src, dest, content, fileObject) {
						var done = this.async();

						process.nextTick(function () {
							done(null, '1');
						});
					}
				},
				files: [
					{
						src: 'tests/source/async/process.txt',
						dest: '.tmp/async/process.txt'
					}
				]
			}
		},

		nodeunit: {
			tests: [
				'tests/*.js'
			]
		},

		watch: {
			files: [
				'lib/**/*',
				'tests/**/*',
				'tasks/**/*',
				'tests/source/**/*'
			],
			tasks: [
				'test'
			]
		}
	};
});
