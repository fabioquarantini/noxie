/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),

		concat: { //https://github.com/gruntjs/grunt-contrib-concat
			options: {
				separator: ';'
			},
			dist: {
				src: ['js/plugins/*.js'],
				dest: 'js/plugins.js'
			}
		},
		cssmin: { // https://github.com/gruntjs/grunt-contrib-cssmin
			// todo: attualmente il file main.css viene sovrascritto 
			combine: {
				files: {
					'css/main.css': ['css/main.min.css', 'css/normalize.min.css']
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
		// image-min https://github.com/gruntjs/grunt-contrib-imagemin
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
						expand: true,
						cwd: 'img/',
						src: '*',
						dest: 'img'
					}
				]
			}
		},
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
		sass: {                                 
			dev: {  
				files: {                        
					'css/main.css': 'scss/main.scss'
				},
				options: {
					sourcemap: true,  // Requires Sass 3.3.0, which can be installed with gem install sass --pre
					style: 'expanded',
					lineNumbers: true
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
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	//grunt.registerTask('default', [ 'sass:dev']);

};

