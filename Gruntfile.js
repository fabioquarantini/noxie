/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	// Metadata.
	pkg: grunt.file.readJSON('package.json'),

	concat: {	//https://github.com/gruntjs/grunt-contrib-concat
		options: {
			separator: ';'
		},
		dist: {
			src: [ 'js/plugins/*.js'],
			dest: 'js/plugins.js'
		}
	},
	cssmin: {	// https://github.com/gruntjs/grunt-contrib-cssmin
		combine: {
			files: {
				'css/main.css': ['css/main.css', 'css/reset.css']
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'css/',
				src: ['*.css'],
				dest: 'css/',
				ext: '.min.css'
			}
		}
	},
	// image-min https://github.com/gruntjs/grunt-contrib-imagemin
	imagemin: {
		dist: {
			options: {
				optimizationLevel: 3
			},
			files: {
				'src/*': 'src/*'	// 'destination': 'source'			
			}
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
	}
});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');



  //grunt.registerTask('default', [ 'concat']);

};