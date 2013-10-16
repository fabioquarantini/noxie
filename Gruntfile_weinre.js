/*  ==========================================================================
	Grunt configuration
	==========================================================================  */

'use strict';

function injectWeinre(opt) {
    var opt = opt || {};
    var ignore = opt.ignore || opt.excludeList || ['.js', '.css', '.svg', '.ico', '.woff', '.png', '.jpg', '.jpeg'];
    var html = opt.html || _html;
    var rules = opt.rules || [{
        match: /<\/body>/,
        fn: prepend
    }, {
        match: /<\/html>/,
        fn: prepend
    }, {
        match: /<\!DOCTYPE.+>/,
        fn: append
    }];

    var port = opt.port || 35729;
    var src =  opt.src || "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
    var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";

    // helper functions
    var regex = (function() {
        var matches = rules.map(function(item) {
            return item.match.source;
        }).join('|');

        return new RegExp(matches);
    })();

    function prepend(w, s) {
        return s + w;
    }

    function append(w, s) {
        return w + s;
    }

    function _html(str) {
        if (!str) return false;
        return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
    }

    function exists(body) {
        if (!body) return false;
        return regex.test(body);
    }

    function snip(body) {
        if (!body) return false;
        return (~body.lastIndexOf("/livereload.js"));
    }

    function snap(body) {
        var _body = body;
        rules.some(function(rule) {
            if (rule.match.test(body)) {
                _body = body.replace(rule.match, function(w) {
                    return rule.fn(w, snippet);
                });
                return true;
            }
            return false;
        });
        return _body;
    }

    function accept(req) {
        var ha = req.headers["accept"];
        if (!ha) return false;
        return (~ha.indexOf("html"));
    }

    function leave(req) {
        var url = req.url;
        var ignored = false;
        if (!url) return true;
        ignore.forEach(function(item) {
            if (~url.indexOf(item)) {
                ignored = true;
            }
        });
        return ignored;
    }

    // middleware
    return function livereload(req, res, next) {
        if (res._livereload) return next();
        res._livereload = true;

        var writeHead = res.writeHead;
        var write = res.write;
        var end = res.end;

        if (!accept(req) || leave(req)) {
            return next();
        }

        function restore() {
            res.writeHead = writeHead;
            res.write = write;
            res.end = end;
        }

        res.push = function(chunk) {
            res.data = (res.data || '') + chunk;
        };

        res.inject = res.write = function(string, encoding) {
            if (string !== undefined) {
                var body = string instanceof Buffer ? string.toString(encoding) : string;
                if (exists(body) && !snip(res.data)) {
                    res.push(snap(body));
                    return true;
                } else if (html(body) || html(res.data)) {
                    res.push(body);
                    return true;
                } else {
                    restore();
                    return write.call(res, string, encoding);
                }
            }
            return true;
        };

        res.writeHead = function() {};

        res.end = function(string, encoding) {
            restore();
            var result = res.inject(string, encoding);
            if (!result) return end.call(res, string, encoding);
            if (res.data !== undefined && !res._header) res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
            res.end(res.data, encoding);
        };
        next();
    };
}





module.exports = function(grunt) {

    // Load all grunt task in package.json

    require('load-grunt-tasks')(grunt);


    grunt.initConfig({

        // Reads dependencies from package.json

        pkg: grunt.file.readJSON('package.json'),


        // Hangar Config

        hangar: {
            dev: 'app', // Development folder
            deploy: 'deploy', // Deploy folder
            hostname: 'localhost', // Set '*' or '0.0.0.0' to access the server from outside
            serverPort: 8000, // Server port
            livereloadPort: 35729, // Port number or boolean
            weinrePort: 8080 // Weinre port

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
                    //, '!<%= hangar.dev %>/js/plugins/*.js'
                    cwd: '<%= hangar.dev %>',
                    src: ['**', '!scss/**', '!js/plugins/**'],
                    dest: '<%= hangar.deploy %>/'
                }]
            }
        },

        // [ grunt connect ]
        connect: {
            server: {
                options: {
                    port: '<%= hangar.serverPort %>',
                    base: '<%= hangar.dev %>',
                    livereload: true,
                    hostname: '<%= hangar.hostname %>'
                }
            },
            weinre: {
                options: {
                    port: '<%= hangar.serverPort %>',
                    base: '<%= hangar.dev %>',
                    livereload: false,
                    keepalive: true,
                    open:true,
                    hostname: '<%= hangar.hostname %>',
                    middleware: function(connect, options) {
                        return [
                            //injectWeinre({ src: 'http://' + (location.host || 'localhost').split(':')[0] + ':8080/target/target-script-min.js#anonymous'}),
                            injectWeinre({ src: "http://localhost:8080/target/target-script-min.js#anonymous"}),
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
                options: {
                    title: 'Browser',
                    message: 'Server started on http://<%= hangar.hostname %>:<%= hangar.serverPort %>/'
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
                path: 'http://<%= hangar.hostname %>:<%= hangar.weinrePort %>/'
            },
            server: {
                path: 'http://<%= hangar.hostname %>:<%= hangar.serverPort %>/'
            }
        },


        // [grunt parallel]

        parallel: {
            server: {
                options: {
                    grunt: true
                },
                tasks: ['connect', 'watch']
            },
            weinre: {
                tasks: ['connect', 'watch', 'shell:weinre']
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
                    sourcemap: false, // Requires Sass 3.3.0, which can be installed with gem install sass --pre
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


        // [ grunt shell ] Run shell comand (https://github.com/sindresorhus/grunt-shell)
        // First install weinre [ sudo npm -g install weinre ] (http://people.apache.org/~pmuellr/weinre/docs/latest/Installing.html)

        shell: {
            weinre: {
                command: 'weinre --boundHost -all-'
            }
        },


        // [ grunt uglify ] Javascript plugins compressor (https://github.com/gruntjs/grunt-contrib-uglify)

        uglify: {
            deploy: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> + <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    '<%= hangar.deploy %>/js/plugins.js': ['<%= hangar.deploy %>/js/*.js']
                }
            }
        },


        // [ grunt watch ] Watches for file changes and optimizes images, concats and minifies scripts in plugins and also starts a livereload server (https://github.com/gruntjs/grunt-contrib-watch)

        watch: {
            css: {
                files: '<%= hangar.dev %>/scss/*.scss',
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
                    '<%= hangar.dev %>/*.html',
                    '<%= hangar.dev %>/css/{,*/}*.css',
                    '<%= hangar.dev %>/js/{,*/}*.js',
                    '<%= hangar.dev %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        }
    });


    // Register tasks

    grunt.registerTask('default', [
        //'jshint',
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

    grunt.registerTask('weinre', [
        'notify:weinre',
        'connect:weinre',
        'open:server'
        //,'watch'
    ]);

};
