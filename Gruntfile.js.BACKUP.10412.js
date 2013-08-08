/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

module.exports = function(grunt) {

	grunt.initConfig({

		/* Reads dependencies from package.json */
		
		pkg: grunt.file.readJSON('package.json'),


<<<<<<< HEAD
			/* [ grunt concat ] Concatenate javascript files (https://github.com/gruntjs/grunt-contrib-concat) */
			
			concat: {
				options: {
					separator: ';'
				},
				dev: {
					src: ['js/plugins/*.js'],
					dest: 'js/plugins.js'
				},
				deploy: {
					src: ['js/plugins/*.js', '!js/plugins/livereload.js', '!js/plugins/weinre.js'],
					dest: 'deploy/js/plugins.js'
				}
			},
			copy: {
				deploy: {
					files: [{
						expand: true, 
						src: ['*.html','humans.txt', 'robots.txt', '.htaccess', 'js/vendor/*.js' ], 
						dest: 'deploy/', 
						filter: 'isFile'
					}]
				}
=======
		/* [ grunt concat ] Concatenate javascript files (https://github.com/gruntjs/grunt-contrib-concat) */
		
		concat: {
			options: {
				separator: ';'
>>>>>>> 864ab97367f68ac4e0cbab85ffc53d07dd8ba834
			},
			dist: {
				src: ['js/plugins/*.js'],
				dest: 'js/plugins.js'
			}
		},

<<<<<<< HEAD
			/* [ grunt cssmin:combine ] [ grunt cssmin:minify ] Combines and minifies css (https://github.com/gruntjs/grunt-contrib-cssmin) */			
			cssmin: {
				dev: {
					combine: {
						files: {
							'css/main.css': ['css/*.css']
						}
					}
				},
				deploy: {
					minify: {
						expand: true,
						cwd: 'deploy/css/',
						src: ['*.css'],
						dest: 'deploy/css/'
					},
					combine: {
						files: {
							'deploy/css/main.css': ['deploy/css/*.css']
						}
					}
				}				
=======

		/* [ grunt cssmin:combine ] [ grunt cssmin:minify ] Combines and minifies css (https://github.com/gruntjs/grunt-contrib-cssmin) */
		
		cssmin: {
			combine: {
				files: {
					'css/main.css': ['css/*.min.css']
				}
>>>>>>> 864ab97367f68ac4e0cbab85ffc53d07dd8ba834
			},
			minify: {
				expand: true,
				cwd: 'css/',
				src: ['*.css'],
				dest: 'css/',
				ext: '.min.css'
			}
		},


<<<<<<< HEAD
			/* [ grunt imagemin ] Images optimization (https://github.com/gruntjs/grunt-contrib-imagemin) */
			
			imagemin: {
				deploy: {
					options: {
						optimizationLevel: 3,
						progressive: true
					},
					files: [{
						expand: true,
						cwd: 'img/',
						src: '*',
						dest: 'deploy/img/'
					}
					]
=======
		/* [ grunt imagemin ] Images optimization (https://github.com/gruntjs/grunt-contrib-imagemin) */
		
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3,
					progressive: true
				},
				files: [{
					expand: true,
					cwd: 'img/',
					src: '*',
					dest: 'img/optimized/'
>>>>>>> 864ab97367f68ac4e0cbab85ffc53d07dd8ba834
				}
				]
			}
		},


<<<<<<< HEAD
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
=======
		/* [ grunt sass:dev ] Compiles main.scss in development mode (https://github.com/gruntjs/grunt-contrib-sass) */
		/* [ grunt sass:dist ] Compiles main.scss in distribution mode */
		
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
>>>>>>> 864ab97367f68ac4e0cbab85ffc53d07dd8ba834
				}
			},
			dist: {
				files: {
					'css/main.css': 'scss/main.scss'
				},
				options: {
					style: 'compressed'
				}
			}
		},


		/* [ grunt shell ] Run shell comand (https://github.com/sindresorhus/grunt-shell) */

<<<<<<< HEAD
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
						'deploy/js/plugins.js': ['deploy/js/plugins.js'],
						'deploy/js/main.js': ['js/main.js']
					}
					
				},
				dev: {
					files: {
						'js/plugins.js': ['deploy/js/plugins.js']
					},
					files: {
						'js/main.js': ['js/main.js']
					}						
				}
			},
			

			/* [ grunt watch ] Watches for file changes and optimizes images, concats and minifies scripts in plugins and also starts a livereload server (https://github.com/gruntjs/grunt-contrib-watch)*/
			
			watch: {
				css: {
					files: 'scss/*.scss',
					tasks: ['sass:dev'],
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
					tasks: ['concat']
				},
				scripts: {
					files: ['js/main.js','js/plugins.js'],
					options: {
						livereload: true
					}
=======
		shell: {
			weinre: {
				command: 'weinre --boundHost -all-'
			}
		},


		/* [ grunt uglify ] Javascript plugins compressor (https://github.com/gruntjs/grunt-contrib-uglify) */
		
		uglify: {
			my_target: {
				options: {
					sourceMapRoot: 'js/plugins/',
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> + <%= grunt.template.today("yyyy-mm-dd") %> */'
				},
				files: {
					'js/plugins.js': ['js/plugins/*.js']
				}
			}
		},
		

		/* [ grunt watch ] Watches for file changes and optimizes images, concats and minifies scripts in plugins and also starts a livereload server (https://github.com/gruntjs/grunt-contrib-watch)*/
		
		watch: {
			css: {
				files: 'scss/*.scss',
				tasks: ['sass:dev'],
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
			images: {
				files: ['img/*.jpg','img/*.jpeg','img/*.JPG', 'img/*.JPEG','img/*.png' ],
				tasks: ['imagemin']
			},
			plugins: {
				files: 'js/plugins/*.js',
				tasks: ['concat', 'uglify']
			},
			scripts: {
				files: ['js/main.js','js/plugins.js'],
				options: {
					livereload: true
>>>>>>> 864ab97367f68ac4e0cbab85ffc53d07dd8ba834
				}
			}
		}
		
	});


	/* Load tasks */

<<<<<<< HEAD
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-shell');


/* Register tasks */

grunt.registerTask('default', [ 'sass:dev', 'concat', 'shell:weinre', 'watch']);
grunt.registerTask('deploy', [ 'imagemin:deploy','sass:deploy','concat:deploy','uglify:deploy', 'copy:deploy']);
=======
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');

	/* Register tasks */

	grunt.registerTask('default', [ 'watch']);
>>>>>>> 864ab97367f68ac4e0cbab85ffc53d07dd8ba834

};