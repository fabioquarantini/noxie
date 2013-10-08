/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

module.exports = function(grunt) {

	/* Load all grunt task in package.json */

	require('load-grunt-tasks')(grunt);


	grunt.initConfig({

		/* Reads dependencies from package.json */

		pkg: grunt.file.readJSON('package.json'),


		/* Hangar Config */

		hangar: {
			dev: 'dev',			// Development folder
			deploy: 'deploy'	// Deploy folder
		},
		

		/* [ grunt autoprefixer ] Prefixes css3 propreties (https://github.com/nDmitry/grunt-autoprefixer) */

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
					'<%= hangar.dev %>/css/main.css' : ['<%= hangar.dev %>/css/main.css']
				}
			},
			deploy: {
				files: {
					'<%= hangar.deploy %>/css/main.css': ['<%= hangar.deploy %>/css/main.css']
				}
			}
		},


		/* [ grunt concat ] Concatenate javascript files (https://github.com/gruntjs/grunt-contrib-concat) */

		concat: {
			options: {
				separator: ';'
			},
			dev: {
				//src: ['<%= hangar.dev %>/js/plugins/*.js', '!<%= hangar.dev %>/js/plugins/weinre.js'],
				src: ['<%= hangar.dev %>/js/plugins/*.js'],
				dest: '<%= hangar.dev %>/js/plugins.js'
			},
			deploy: {
				//src: ['<%= hangar.dev %>/js/plugins/*.js', '!<%= hangar.dev %>/js/plugins/livereload.js', '!<%= hangar.dev %>/js/plugins/weinre.js'],
				src: ['<%= hangar.dev %>/js/plugins/*.js'],
				dest: '<%= hangar.deploy %>/js/plugins.js'
			}
			/*weinre: {
				src: ['js/plugins/*.js'],
				dest: 'js/plugins.js'
			}*/
		},


		/* [ grunt cssmin:deploy ] Combines and minifies css (https://github.com/gruntjs/grunt-contrib-cssmin) */

		cssmin: {
			deploy: {
				expand: true,
				cwd: '<%= hangar.deploy %>/css/',
				src: ['main.css'],
				dest: '<%= hangar.deploy %>/css/'
			}
		},


		/* [ grunt copy ] Copies files for deployment (https://github.com/gruntjs/grunt-contrib-copy) */

		copy: {
			deploy: {
				files: [{
					expand: true,
					src: ['<%= hangar.dev %>/*' ],
					dest: '<%= hangar.deploy %>/'
				}]
			}
		},


		/* [ grunt imagemin ] Images optimization (https://github.com/gruntjs/grunt-contrib-imagemin) */

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
		

		/* [grunt notify ] Desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion Notification Center, Snarl, and Notify-Send (https://github.com/dylang/grunt-notify) */

		notify: {
			open:{
				options: {
					title: 'Browser',
					message: 'Weinre server launched',
				}
			},
			imagemin: {
				options: {
					title: 'Minification',
					message: 'Image minification done successfully',
				}
			},
			sass: {
				options: {
					title: 'Sass',
					message: 'SASS Compilation completed.',
				}
			}
		},


		/* [grunt open:weinre ] Opens weinre url in default web browser (https://github.com/jsoverson/grunt-open) */

		open: {
			weinre : {
				path: 'http://localhost:8080/'
			}
		},


		/* [ grunt sass:dev ] Compiles main.scss in development mode (https://github.com/gruntjs/grunt-contrib-sass) */
		/* [ grunt sass:deploy ] Compiles main.scss in distribution mode */

		sass: {
			dev: {
				files: {
					'<%= hangar.dev %>/css/main.css': '<%= hangar.dev %>/scss/main.scss'
				},
				options: {
					sourcemap: false,  // Requires Sass 3.3.0, which can be installed with gem install sass --pre
					style: 'expanded',
					lineNumbers: true,
					debugInfo: true // enable if you want to use FireSass
				}
			},
			deploy: {
				files: {
					'<%= hangar.deploy %>/css/main.css': '<%= hangar.dev %>/scss/main.scss'
				},
				options: {
					style: 'compressed'
				}
			}
		},


		/* [ grunt shell ] Run shell comand (https://github.com/sindresorhus/grunt-shell) */
		/* First install weinre [ sudo npm -g install weinre ] (http://people.apache.org/~pmuellr/weinre/docs/latest/Installing.html) */

		shell: {
			weinre: {
				command: 'weinre --boundHost -all-'
			}
		},


		/* [ grunt uglify ] Javascript plugins compressor (https://github.com/gruntjs/grunt-contrib-uglify) */

		uglify: {
			deploy: {
				options: {
					sourceMapRoot: 'js/plugins/',
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> + <%= grunt.template.today("yyyy-mm-dd") %> */'
				},
				files: {
					'<%= hangar.deploy %>/js/*.js': ['<%= hangar.deploy %>/js/*.js']
				}
			}
		},


		/* [ grunt watch ] Watches for file changes and optimizes images, concats and minifies scripts in plugins and also starts a livereload server (https://github.com/gruntjs/grunt-contrib-watch)*/

		watch: {
			css: {
				files: '<%= hangar.dev %>/scss/*.scss',
				tasks: [
					'sass:dev',
					'autoprefixer:dev',
					'notify:sass'
				],
				options: {
					livereload: true
				}
			},
			src: {
				files: ['<%= hangar.dev %>/*.html'],
				options: {
					livereload: true
				}
			},
			plugins: {
				files: '<%= hangar.dev %>/js/plugins/*.js',
				tasks: ['concat:dev']
			},
			scripts: {
				files: ['<%= hangar.deploy %>/js/main.js','<%= hangar.deploy %>/js/plugins.js'],
				options: {
					livereload: true
				}
			}
		}

	});

	
	/* Register task */

	grunt.registerTask('default', [
		'sass:dev',
		'autoprefixer:dev',
		'concat:dev',
		'watch'
	]);

	grunt.registerTask('deploy',[
		'copy:deploy',
		'sass:deploy',
		'autoprefixer:deploy',
		'cssmin:deploy',
		'imagemin:deploy',
		'concat:deploy',
		'uglify:deploy'
	]);

	grunt.registerTask('weinre', [
		'concat:weinre',
		'open:weinre',
		'notify:open',
		'shell:weinre'
	]);

};