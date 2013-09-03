/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

module.exports = function(grunt) {

	grunt.initConfig({

		/* Reads dependencies from package.json */

		pkg: grunt.file.readJSON('package.json'),


		/* [ grunt autoprefixer ] Prefixes css3 propreties (https://github.com/nDmitry/grunt-autoprefixer) */

		autoprefixer: {
			options: {
				browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 7']
			},
			dev: {
				files: {
					'css/main.css' : ['css/main.css']
				}
			},
			deploy: {
				files: {
					'deploy/css/main.css': ['deploy/css/main.css']
				}
			}
		},


		/* [ grunt concat ] Concatenate javascript files (https://github.com/gruntjs/grunt-contrib-concat) */

		concat: {
			options: {
				separator: ';'
			},
			dev: {
				src: ['js/plugins/*.js', '!js/plugins/weinre.js'],
				dest: 'js/plugins.js'
			},
			deploy: {
				src: ['js/plugins/*.js', '!js/plugins/livereload.js', '!js/plugins/weinre.js'],
				dest: 'deploy/js/plugins.js'
			},
			weinre: {
				src: ['js/plugins/*.js'],
				dest: 'js/plugins.js'
			}
		},


		/* [ grunt cssmin:combine ] [ grunt cssmin:minify ] Combines and minifies css (https://github.com/gruntjs/grunt-contrib-cssmin) */

		cssmin: {
			minify: {
				expand: true,
				cwd: 'deploy/css/',
				src: ['main.css'],
				dest: 'deploy/css/'
			}
		},


		/* [ grunt copy ] */

		copy: {
			deploy: {
				files: [{
					expand: true,
					src: ['*.html','humans.txt', 'robots.txt', '.htaccess', 'js/vendor/*.js' ],
					dest: 'deploy/',
					filter: 'isFile'
				},
				{
					expand: true,
					src: ['img/original/*.gif', 'img/original/*.GIF' ],
					dest: 'deploy/img',
					flatten: true,
					filter: 'isFile'
				}


				]
			}
		},


		/* [ grunt imagemin ] Images optimization (https://github.com/gruntjs/grunt-contrib-imagemin) */

		imagemin: {
			options: {
				optimizationLevel: 3,
				progressive: true
			},
			dev: {
				files: [{
					expand: true,
					cwd: 'img/original',
					src: '*',
					dest: 'img/'
				}]
			},
			deploy: {
				files: [{
					expand: true,
					cwd: 'img/original',
					src: '*',
					dest: 'deploy/img/'
				}]
			}
		},
		
		notify: {
			open:{
				options: {
        			title: 'Browser',  // optional
        			message: 'Weinre server launched', //required
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
					'css/main.css': 'scss/main.scss'
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
					'deploy/css/main.css': 'scss/main.scss'
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
			dev: {
				files: {
					'js/plugins.js': ['deploy/js/plugins.js'],
					'js/main.js': ['js/main.js']
				}
			},
			deploy: {
				options: {
					sourceMapRoot: 'js/plugins/',
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> + <%= grunt.template.today("yyyy-mm-dd") %> */'
				},
				files: {
					'deploy/js/plugins.js': ['deploy/js/plugins.js'],
					'deploy/js/main.js': ['js/main.js']
				}

			}
		},


		/* [ grunt watch ] Watches for file changes and optimizes images, concats and minifies scripts in plugins and also starts a livereload server (https://github.com/gruntjs/grunt-contrib-watch)*/

		watch: {
			css: {
				files: 'scss/*.scss',
				tasks: ['sass:dev', 'autoprefixer:dev'],
				options: {
					livereload: true
				}
			},
			src: {
				files: ['*.html'],
				options: {
					livereload: true
				}
			},
			plugins: {
				files: 'js/plugins/*.js',
				tasks: ['concat:dev']
			},
			scripts: {
				files: ['js/main.js','js/plugins.js'],
				options: {
					livereload: true
				}
			},
			images: {
				files: ['img/original/*'],
				tasks: ['imagemin:dev']
			}
		}

	});


	/* Load tasks */

	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', [ 'sass:dev', 'imagemin:dev', 'concat:dev', 'watch']);
	grunt.registerTask('deploy', [ 'sass:deploy', 'autoprefixer:deploy', 'cssmin', 'imagemin:deploy', 'concat:deploy','uglify:deploy', 'copy:deploy']);
	grunt.registerTask('weinre', ['concat:weinre', 'open:weinre', 'notify:open', 'shell:weinre']);


};