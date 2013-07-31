/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

module.exports = function(grunt) {

	grunt.initConfig({

		/* Reads dependencies from package.json */
		pkg: grunt.file.readJSON('package.json'),


		/* [ grunt concat ] Concatenate javascript files (https://github.com/gruntjs/grunt-contrib-concat) */
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['js/plugins/*.js'],
				dest: 'js/plugins.js'
			}
		},


		/* [ grunt cssmin:combine ] [ grunt cssmin:minify ] Combines and minifies css (https://github.com/gruntjs/grunt-contrib-cssmin) */
		cssmin: {
			combine: {
				files: {
					'css/main.css': ['css/*.min.css']
				}
			},
			minify: {
				expand: true,
				cwd: 'css/',
				src: ['*.css'],
				dest: 'css/',
				ext: '.min.css'
			}
		},


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
					}
				]
			}
		},


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
					debugInfo: true
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
		}


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
		
	});


	/* Load tasks */
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');	
	
	/* Register tasks */
	grunt.registerTask('default', [ 'sass:dev']);

};