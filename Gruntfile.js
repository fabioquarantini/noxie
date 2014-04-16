/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

'use strict';

// Get local IP

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
			weinrePort: 8080,			// Weinre port
			banner: '/*! <%= pkg.title %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <%= pkg.author.url %> */\n'
		},


		// [ grunt autoprefixer ] Parses CSS and adds vendor-prefixed CSS properties using the Can I Use database (https://github.com/nDmitry/grunt-autoprefixer)

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


		// [ browser sync ] Keep multiple browsers & devices in sync when building websites ( https://github.com/shakyShane/grunt-browser-sync )

		browserSync: {
			dev: {
				options: {
					debugInfo: true,
					injectChanges: false,
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


		// [ grunt clean ] Clean deploy files and folders (https://github.com/gruntjs/grunt-contrib-clean)

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
				src: ['<%= noxie.dev %>/js/plugins/*.js', '!<%= noxie.dev %>/js/plugins/weinre.js' ],
				dest: '<%= noxie.deploy %>/js/plugins.js'
			}
		},


		// [ grunt concurrent ] Run grunt tasks concurrently (https://github.com/sindresorhus/grunt-concurrent)
		concurrent: {
			dev: {
				tasks: [
					'jshint',
					'notify:jshint',
					'sass:dev',
					'notify:sass',
					'autoprefixer:dev',
					'concat:dev',
					'weinre',
					'notify:weinre',
					'open',
					'watch',
					'browserSync:dev',
					'notify:server'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		},


		// [ grunt copy ] Copy files and folders for deployment (https://github.com/gruntjs/grunt-contrib-copy)

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


		// [ grunt cssmin ] Combines and minifies css files (https://github.com/gruntjs/grunt-contrib-cssmin)

		cssmin: {
			deploy: {
				expand: true,
				cwd: '<%= noxie.deploy %>/css/',
				src: ['main.css'],
				dest: '<%= noxie.deploy %>/css/'
			}
		},


		// [ grunt htmlmin ] Minify HTML ( https://github.com/gruntjs/grunt-contrib-htmlmin )

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



		// [ grunt imagemin ] Minify PNG, JPEG and GIF images (https://github.com/gruntjs/grunt-contrib-imagemin)

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


		// [ grunt notify ] Desktop notifications for Grunt errors and warnings (https://github.com/dylang/grunt-notify)

		notify: {
			bower: {
				options: {
					title: 'Bower',
					message: 'New package added in bower_components/',
				}
			},
			concat: {
				options: {
					title: 'Concat',
					message: 'Js concatenation done',
				}
			},
			imagemin: {
				options: {
					title: 'Minification',
					message: 'Image minification done',
				}
			},
			jshint: {
				options: {
					title: 'JSHint',
					message: 'Js validation done',
					max_jshint_notifications: 5
				}
			},
			sass: {
				options: {
					title: 'Sass',
					message: 'Compilation done',
				}
			},
			server: {
				options:{
					title: 'Local server',
					message:'Server started'
				}
			},
			weinre: {
				options: {
					title: 'Weinre',
					message: 'Server started',
				}
			}
		},


		// [grunt open ] Open urls and files from a grunt task (https://github.com/jsoverson/grunt-open)

		open: {
			weinre: {
				path: 'http://<%= noxie.hostname %>:<%= noxie.weinrePort %>/client/#anonymous'
			}
		},


		// [ grunt sass ] Compile Sass to CSS (https://github.com/gruntjs/grunt-contrib-sass)

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


		// [ grunt uglify ] Minify files with UglifyJS (https://github.com/gruntjs/grunt-contrib-uglify)

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


		// [ grunt svgmin ] Minify SVG using SVGO (https://github.com/sindresorhus/grunt-svgmin)

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


		// [ grunt watch ] Run predefined tasks whenever watched file patterns are added, changed or deleted (https://github.com/gruntjs/grunt-contrib-watch)

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
				tasks: [
					'concat:dev',
					'notify:concat'
				]
			},
			jshint: {
				files: '<%= noxie.dev %>/js/main.js',
				tasks: [
					'jshint',
					'notify:jshint'
				]
			}
		},


		// [ grunt weinre ] Run weinre as a grunt task (https://github.com/ChrisWren/grunt-weinre)

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



	// Registered default tasks
	grunt.registerTask('default', [
		'concurrent:dev'
	]);

	// Registered deploy tasks

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
		'browserSync:deploy'
	]);


};
