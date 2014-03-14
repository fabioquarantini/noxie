/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

'use strict';

function getIP() {

	var os = require('os');
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
		for (var k2 in interfaces[k]) {
			var address = interfaces[k][k2];
			if (address.family === 'IPv4' && !address.internal) {
				addresses.push(address.address);
			}
		}
	}
	return addresses[0];

}


module.exports = function(grunt) {

	// Load all grunt task in package.json

	require('jit-grunt')(grunt, {
		browser_sync : 'grunt-browser-sync'
	});


	grunt.initConfig({

		// Reads dependencies from package.json

		pkg: grunt.file.readJSON('package.json'),


		// noxie config

		noxie: {
			dev: 'app',					// Development folder
			deploy: 'deploy',			// Deploy folder
			hostname: getIP(),			// Set '*' or '0.0.0.0' to access the server from outside
			serverPort: 8000,			// Server port
			livereloadPort: 35729,		// Port number or boolean
			weinrePort: 8080,			// Weinre port
			banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <%= pkg.author.url %> */\n'
		},


		// [ grunt autoprefixer ] Prefixes css3 propreties (https://github.com/nDmitry/grunt-autoprefixer)

		autoprefixer: {
			options: {
				browsers: [
					'last 3 version',
					'> 1%',
					'ie 8',
					'ie 7'
				]
			},
			dev: {
				files: {
					'<%= noxie.dev %>/css/main.css': ['<%= noxie.dev %>/css/main.css']
				}
			},
			deploy: {
				files: {
					'<%= noxie.deploy %>/css/main.css': ['<%= noxie.deploy %>/css/main.css']
				}
			}
		},


		// [ browser sync ] Keeps multiple devices ( https://github.com/shakyShane/grunt-browser-sync )

		browser_sync: {
			dev: {
				options: {
					debugInfo: true,
					ghostMode: {
						clicks: true,
						scroll: true,
						links: true,
						forms: true
					},
					host: '<%= noxie.hostname %>',
					server: {
						baseDir: '<%= noxie.dev %>'
					}
				},
				bsFiles: {
					src : [
						'<%= noxie.dev %>/css/{,*/}*.css',
						'<%= noxie.dev %>/**/*.html',
						'<%= noxie.dev %>/js/{,*/}*.js',
						'<%= noxie.dev %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
					]
				}
			},
			deploy: {
				options: {
					debugInfo: false,
					ghostMode: {
						clicks: true,
						scroll: true,
						links: true,
						forms: true
					},
					host: '<%= noxie.hostname %>',
					server: {
						baseDir: '<%= noxie.deploy %>'
					}
				},
			}
		},


		// [ grunt clean ] Cleans deploy direcory (https://github.com/gruntjs/grunt-contrib-clean)

		clean: {
			deploy: {
				src: [ '<%= noxie.deploy %>']
			}
		},


		// [ grunt concat ] Concatenate javascript files (https://github.com/gruntjs/grunt-contrib-concat)

		concat: {
			options: {
				separator: ';'
			},
			dev: {
				src: ['<%= noxie.dev %>/js/plugins/*.js'],
				dest: '<%= noxie.dev %>/js/plugins.js'
			},
			deploy: {
				src: ['<%= noxie.dev %>/js/plugins/*.js'],
				dest: '<%= noxie.deploy %>/js/plugins.js'
			}
		},


		// [ grunt cssmin:deploy ] Combines and minifies css (https://github.com/gruntjs/grunt-contrib-cssmin)

		cssmin: {
			deploy: {
				expand: true,
				cwd: '<%= noxie.deploy %>/css/',
				src: ['main.css'],
				dest: '<%= noxie.deploy %>/css/'
			}
		},


		// [ grunt copy ] Copies files for deployment (https://github.com/gruntjs/grunt-contrib-copy)

		copy: {
			deploy: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= noxie.dev %>',
					src: ['**', '!scss/**', '!js/plugins/**'],
					dest: '<%= noxie.deploy %>/'
				}]
			}
		},


		// [ grunt concurrent ] Runs multiple tasks (https://github.com/sindresorhus/grunt-concurrent)

		concurrent: {
			dev: {
				tasks: [
					'jshint',
					'sass:dev',
					'autoprefixer:dev',
					'concat:dev',
					'weinre',
					'notify:server',
					'open',
					'watch',
					'browser_sync'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		},


		// [ grunt htmlmin ] Compresses html ( https://github.com/gruntjs/grunt-contrib-htmlmin )

		htmlmin: {
			deploy: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,        // Enable dynamic expansion.
					cwd: '<%= noxie.deploy %>',  // Src matches are relative to this path.
					src: ['*.html'],     // Actual pattern(s) to match.
					dest: '<%= noxie.deploy %>'  // Destination path prefix.
			}]
			}
		},



		// [ grunt imagemin ] Images optimization (https://github.com/gruntjs/grunt-contrib-imagemin)

		imagemin: {
			options: {
				optimizationLevel: 3,
				progressive: true
			},
			deploy: {
				files: [{
					expand: true,
					cwd: '<%= noxie.deploy %>/img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= noxie.deploy %>/img/'
				}]
			}
		},


		// [ grunt jshint ] Validate files with JSHint (https://github.com/gruntjs/grunt-contrib-jshint)

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				force: true,
				reporter: require('jshint-stylish')
			},
			all: ['<%= noxie.dev %>/js/main.js']
		},


		// [ grunt notify ] Desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion Notification Center, Snarl, and Notify-Send (https://github.com/dylang/grunt-notify)

		notify: {
			bower: {
				options: {
					title: 'Bower',
					message: 'New package added in bower_components/',
				}
			},
			weinre: {
				options: {
					title: 'Browser',
					message: 'Weinre server launched on http://<%= noxie.hostname %>:<%= noxie.weinrePort %>/',
				}
			},
			server: {
				options:{
					title: 'Browser',
					message:'Server started on http://<%= noxie.hostname %>:<%= noxie.serverPort %>/'
				}
			},
			imagemin: {
				options: {
					title: 'Minification',
					message: 'Image minification done successfully',
				}
			},
			jshint: {
				options: {
					title: 'JSHint',
					message: 'Js validation done successfully',
					max_jshint_notifications: 5
				}
			},
			sass: {
				options: {
					title: 'Sass',
					message: 'SASS Compilation done successfully',
				}
			}
		},


		// [grunt open:weinre ] Opens weinre url in default web browser (https://github.com/jsoverson/grunt-open)

		open: {
			weinre: {
				path: 'http://<%= noxie.hostname %>:<%= noxie.weinrePort %>/client/#anonymous'
			}
		},


		// [ grunt sass:dev ] Compiles main.scss in development mode (https://github.com/gruntjs/grunt-contrib-sass)
		// [ grunt sass:deploy ] Compiles main.scss in distribution mode

		sass: {
			dev: {
				files: {
					'<%= noxie.dev %>/css/main.css': '<%= noxie.dev %>/scss/main.scss'
				},
				options: {
					banner: '<%= noxie.banner %>',
					debugInfo: true,		// enable if you want to use FireSass
					lineNumbers: true,
					sourcemap: false,		// Requires Sass 3.3.0, which can be installed with gem install sass --pre
					style: 'expanded'
				}
			},
			deploy: {
				files: {
					'<%= noxie.deploy %>/css/main.css': '<%= noxie.dev %>/scss/main.scss'
				},
				options: {
					banner: '<%= noxie.banner %>',
					style: 'compressed'
				}
			}
		},


		// [ grunt uglify ] Javascript plugins compressor (https://github.com/gruntjs/grunt-contrib-uglify)

		uglify: {
			options: {
				banner: '<%= noxie.banner %>'
			},
			deploy: {
				files: {
					'<%= noxie.deploy %>/js/plugins.js': ['<%= noxie.deploy %>/js/plugins.js'],
					'<%= noxie.deploy %>/js/main.js': ['<%= noxie.deploy %>/js/main.js']
				}
			}
		},


		// [ grunt svgmin ] Svg compressor (https://github.com/sindresorhus/grunt-svgmin)

		svgmin: {
			deploy: {
				files: [{
					expand: true,
					cwd: '<%= noxie.deploy %>/img',
					src: ['**/*.svg'],
					dest: '<%= noxie.deploy %>/img/',
				}]
			}
		},


		// [ grunt watch ] Watches for file changes and optimizes images, concats and minifies scripts in plugins and also starts a livereload server (https://github.com/gruntjs/grunt-contrib-watch)

		watch: {
			css: {
				files: '<%= noxie.dev %>/scss/{,*/}*.{scss,sass}',
				tasks: [
					'sass:dev',
					'autoprefixer:dev',
					'notify:sass'
				]
			},
			bower: {
				files: 'bower_components/{,*/}*.*',
				tasks: [
					'notify:bower'
				]
			},
			plugins: {
				files: '<%= noxie.dev %>/js/plugins/*.js',
				tasks: ['concat:dev']
			},
			jshint: {
				files: '<%= noxie.dev %>/js/main.js',
				tasks: ['jshint']
			}
		},


		// [grunt weinre ]

		weinre: {
			dev: {
				options: {
					httpPort: '<%= noxie.weinrePort %>',
					boundHost: '-all-',
					verbose: false,
					debug: false,
					readTimeout: 5,
					deathTimeout: 15
				}
			}
		}


	});


	// Register tasks

	grunt.registerTask('default', [
		'concurrent:dev'
	]);

	grunt.registerTask('deploy', [
		'jshint',
		'clean:deploy',
		'copy:deploy',
		'htmlmin:deploy',
		'sass:deploy',
		'autoprefixer:deploy',
		'cssmin:deploy',
		'imagemin:deploy',
		'concat:deploy',
		'svgmin:deploy',
		'uglify:deploy',
		'browser_sync:deploy'
	]);


};
