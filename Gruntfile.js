module.exports = function(grunt) {
  path = require('path');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      jquery: {
        src: 'src/js/jquery-1.8.3.min.js',
        dest: 'assets/js/jquery-1.8.3.min.js',
      },
      font: {
        expand: true,
        cwd: 'src/font/',
        src: '*',
        dest: 'assets/font/',
      },
      gifs: {
        expand: true,
        cwd: 'src/img/',
        src: '*.gif',
        dest: 'assets/img',
      }
    },
    uglify: {
      vendor: {
        src: [ /* Order of resources is important */
          'src/js/spin.min.js',
          'src/js/modernizr.custom.05513.js',
          'src/js/jquery.chosen-0.9.7.js',
          'src/js/bootstrap-3.0.0.js',
          'src/js/d3.v3.js',
          'src/js/d3.sankey.js',
        ],
        dest: 'assets/js/vendor.min.js'
      }
    },
    less: {
      options: {
        banner: '/* dgu-less compiled <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        yuicompress: true
      },
      shared: {
        src: [  /* Order of resources is important. */
          'src/css/bootstrap-3.0.0.css',
          'src/css/jquery.chosen.css',
          'src/css/font-awesome.css',
          'src/css/dgu-shared.less',
        ],
        dest: 'assets/css/datagovuk.min.css'
      },
      viz: {
        src: 'src/css/viz.less',
        dest: 'assets/css/viz.css'
      }
    },
    coffee: {
      viz: {
        src: [
          'src/js/viz_lib/*.coffee',
          'src/js/viz.coffee'
        ],
        dest: 'assets/js/viz.js'
      }
    },
    watch: {
      styles_shared: {
        files: 'src/css/dgu-shared.less',
        tasks: 'less:shared'
      },
      viz_script: {
        files: 'src/js/**/*.coffee',
        tasks: 'coffee:viz',
      },
    },
    imagemin: {
      build: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            src: '*.jpg',
            cwd: 'src/img/',
            dest: 'assets/img/'
          },
          {
            expand: true,
            src: '*.png',
            cwd: 'src/img/',
            dest: 'assets/img/'
          }
        ]
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  // Default task(s).
  grunt.registerTask('styles', ['less']);
  grunt.registerTask('scripts', ['coffee','copy:jquery','uglify']);
  grunt.registerTask('images', ['copy:gifs','imagemin',]);
  grunt.registerTask('default', ['coffee','styles','scripts','copy','imagemin']);
};
