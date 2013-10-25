/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

'use strict';

module.exports = function(grunt) {

	// Load all grunt task in package.json

	require('load-grunt-tasks')(grunt);


	grunt.initConfig({

		// Reads dependencies from package.json

		pkg: grunt.file.readJSON('package.json'),


		// Hangar config

		hangar: {
			dev: 'app',					// Development folder
			deploy: 'deploy',			// Deploy folder
			hostname: '*',				// Set '*' or '0.0.0.0' to access the server from outside
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
					'<%= hangar.dev %>/css/main.css': ['<%= hangar.dev %>/css/main.css']
				}
			},
			deploy: {
				files: {
					'<%= hangar.deploy %>/css/main.css': ['<%= hangar.deploy %>/css/main.css']
				}
			}
		},


		// [ grunt concat ] Concatenate javascript files (https://github.com/gruntjs/grunt-contrib-concat)

		concat: {
			options: {
				separator: ';'
			},
			dev: {
				src: ['<%= hangar.dev %>/js/plugins/*.js'],
				dest: '<%= hangar.dev %>/js/plugins.js'
			},
			deploy: {
				src: ['<%= hangar.dev %>/js/plugins/*.js'],
				dest: '<%= hangar.deploy %>/js/plugins.js'
			}
		},


		// [ grunt cssmin:deploy ] Combines and minifies css (https://github.com/gruntjs/grunt-contrib-cssmin)

		cssmin: {
			deploy: {
				expand: true,
				cwd: '<%= hangar.deploy %>/css/',
				src: ['main.css'],
				dest: '<%= hangar.deploy %>/css/'
			}
		},


		// [ grunt copy ] Copies files for deployment (https://github.com/gruntjs/grunt-contrib-copy)

		copy: {
			deploy: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= hangar.dev %>',
					src: ['**', '!scss/**', '!js/plugins/**'],
					dest: '<%= hangar.deploy %>/'
				}]
			}
		},


		// [grunt concurrent:mobile ] Runs multiple tasks (https://github.com/sindresorhus/grunt-concurrent)

		concurrent: {
			mobile: {
				tasks: [
					'notify:weinre',
					'shell:weinre',
					'connect:weinre',
					'open',
					'watch'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		},


		// [ grunt connect ]

		connect: {
			server: {
				options: {
					port: '<%= hangar.serverPort %>',
					base: '<%= hangar.dev %>',
					livereload: true,
					hostname:  '<%= hangar.hostname %>'
				}
			},
			weinre: {
				options: {
					port: '<%= hangar.serverPort %>',
					base: '<%= hangar.dev %>',
					livereload: false, //Do not touch this. We implement the script below
					open: false,
					keepalive: true,
					hostname: '<%= hangar.hostname %>',
					middleware: function(connect, options) {
						return [
							require('connect-inject') ({
								snippet : [
									'<script type=\"text\/javascript\">document.write(\'<script src=\"\' + (location.protocol || \'http:\') + \'\/\/\' + (location.hostname || \'localhost\') + \':8080\/target\/target-script-min.js#anonymous\" type=\"text\/javascript\"><\\\/script>\')<\/script>\n',
									'<script type=\"text\/javascript\">document.write(\'<script src=\"\' + (location.protocol || \'http:\') + \'\/\/\' + (location.hostname || \'localhost\') + \':35729\/livereload.js?snipver=1\" type=\"text\/javascript\"><\\\/script>\')<\/script>\n'

								]
							}),
							connect.static(options.base)
						];
					}
				}
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
					cwd: '<%= hangar.deploy %>/img/',
					src: '*',
					dest: '<%= hangar.deploy %>/img/'
				}]
			}
		},


		// [ grunt jshint ] Validate files with JSHint (https://github.com/gruntjs/grunt-contrib-jshint)

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				errorsOnly: true, // only display errors
				failOnError: false // defaults to true
			},
			all: ['<%= hangar.dev %>/js/main.js']
		},


		// [grunt notify ] Desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion Notification Center, Snarl, and Notify-Send (https://github.com/dylang/grunt-notify)

		notify: {
			weinre: {
				options: {
					title: 'Browser',
					message: 'Weinre server launched on http://<%= hangar.hostname %>:<%= hangar.weinrePort %>/',
				}
			},
			server: {
				options:{
					title: 'Browser',
					message:'Server started on http://<%= hangar.hostname %>:<%= hangar.serverPort %>/'
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
				path: 'http://localhost:<%= hangar.weinrePort %>/client/#anonymous'
			},
			server: {
				path: 'http://localhost:<%= hangar.serverPort %>/'
			}
		},


		// [ grunt sass:dev ] Compiles main.scss in development mode (https://github.com/gruntjs/grunt-contrib-sass)
		// [ grunt sass:deploy ] Compiles main.scss in distribution mode

		sass: {
			dev: {
				files: {
					'<%= hangar.dev %>/css/main.css': '<%= hangar.dev %>/scss/main.scss'
				},
				options: {
					banner: '<%= hangar.banner %>',
					debugInfo: true,		// enable if you want to use FireSass
					lineNumbers: true,
					sourcemap: false,		// Requires Sass 3.3.0, which can be installed with gem install sass --pre
					style: 'expanded'
				}
			},
			deploy: {
				files: {
					'<%= hangar.deploy %>/css/main.css': '<%= hangar.dev %>/scss/main.scss'
				},
				options: {
					banner: '<%= hangar.banner %>',
					style: 'compressed'
				}
			}
		},


		// [ grunt shell ] Run shell comand (https://github.com/sindresorhus/grunt-shell)
		// First install weinre [ sudo npm -g install weinre ] (http://people.apache.org/~pmuellr/weinre/docs/latest/Installing.html)

		shell: {
			weinre: {
				command: 'weinre --boundHost -all-'
			}
		},


		// [ grunt uglify ] Javascript plugins compressor (https://github.com/gruntjs/grunt-contrib-uglify)

		uglify: {
			options: {
				banner: '<%= hangar.banner %>'
			},
			deploy: {
				files: {
					'<%= hangar.deploy %>/js/plugins.js': ['<%= hangar.deploy %>/js/plugins.js'],
					'<%= hangar.deploy %>/js/main.js': ['<%= hangar.deploy %>/js/main.js']
				}
			}
		},


		// [ grunt watch ] Watches for file changes and optimizes images, concats and minifies scripts in plugins and also starts a livereload server (https://github.com/gruntjs/grunt-contrib-watch)

		watch: {
			css: {
				files: '<%= hangar.dev %>/scss/**/*.scss',
				tasks: [
					'sass:dev',
					'autoprefixer:dev',
					'notify:sass'
				]
			},
			plugins: {
				files: '<%= hangar.dev %>/js/plugins/*.js',
				tasks: ['concat:dev']
			},
			jshint: {
				files: '<%= hangar.dev %>/js/main.js',
				tasks: ['jshint']
			},
			livereload: {
				options: {
					livereload: '<%= hangar.livereloadPort %>'
				},
				files: [
					'<%= hangar.dev %>/**/*.html',
					'<%= hangar.dev %>/css/{,*/}*.css',
					'<%= hangar.dev %>/js/{,*/}*.js',
					'<%= hangar.dev %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		}
	});


	// Register tasks

	grunt.registerTask('default', [
		'jshint',
		'sass:dev',
		'autoprefixer:dev',
		'concat:dev',
		'notify:server',
		'connect:server',
		'open:server',
		'watch'
	]);

	grunt.registerTask('deploy', [
		'jshint',
		'copy:deploy',
		'sass:deploy',
		'autoprefixer:deploy',
		'cssmin:deploy',
		'imagemin:deploy',
		'concat:deploy',
		'uglify:deploy'
	]);

	grunt.registerTask('mobile', [
		'concurrent:mobile'
	]);

};
