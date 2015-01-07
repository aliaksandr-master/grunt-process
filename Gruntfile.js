'use strict';

var _ = require('lodash');

module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'lib/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		clean: [
			'.tmp'
		],

		process: {
			compress: {
				options: {
					read: function (src, dest, readOptions, fileObject) {
						return grunt.file.readJSON(src);
					},
					process: function (src, dest, content, fileObject) {
						content = JSON.stringify(content);
						return content;
					}
				},
				files: [{
					src: 'tests/source/compress.json',
				   dest: '.tmp/compress.json'
				}]
			},
			remove_whitespaces: {
				options: {
					process: function (src, dest, content, fileObject) {
						content = content.replace(/\s+/g, '');
						return content;
					}
				},
				files: [{
					src: 'tests/source/remove_whitespaces.txt',
					dest: '.tmp/remove_whitespaces.txt'
				}]
			},
			split: {
				options: {
					save: function (src, dest, content, fileObject) {
						var obj = {};

						_.each(content.split('|'), function (content, index) {
							obj[dest+'/'+index + '.txt'] = content.trim();
						});

						return obj;
					}
				},
				files: [{
					src: 'tests/source/split.txt',
					dest: '.tmp/split.txt'
				}]
			},
			asyncRead: {
				options: {
					read: function (src, dest, readOptions, fileObject) {
						var done = this.async();
						process.nextTick(function () {
							done(null, '1');
						});
					}
				},
				files: [{
					src: 'tests/source/async/read.txt',
					dest: '.tmp/async/read.txt'
				}]
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
				files: [{
					src: 'tests/source/async/save.txt',
					dest: '.tmp/async/save.txt'
				}]
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
				files: [{
					src: 'tests/source/async/process.txt',
					dest: '.tmp/async/process.txt'
				}]
			}
		},

		nodeunit: {
			tests: [ 'tests/*.js' ]
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
	});

	grunt.registerTask('default', [
		'test',
		'watch'
	]);

	grunt.registerTask('test', [
		'jshint',
		'clean',
		'process',
		'nodeunit'
	]);

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
