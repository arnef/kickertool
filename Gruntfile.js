module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    less: {
      production: {
        files: {
          'app/dist/css/app.css': 'app/src/less/app.less'
        }
      }
    },
    html2js: {
      options: {
        rename: function (moduleName) {
          var name;
          name = moduleName.split('/');
          return 'kickertool-tpls/' + name[name.length - 1];
        }
      },
      app: {
        src: ['app/src/**/*.html'],
        dest: 'app/dist/js/templates-kickertool.js'
      }
    },
    concat: {
      options: {
        sourceMap: false
      },
      js: {
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-bootstrap/ui-bootstrap.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'bower_components/angular-scroll-glue/src/scrollglue.js',
          'bower_components/ngstorage/ngStorage.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'app/src/**/*.js'
        ],
        dest: 'app/dist/js/app.js'
      }
    },
    copy: {
      main: {
        files: [{
          // copy bootstrap fonts for glyphicons
          cwd: 'bower_components/bootstrap/dist/fonts/',
          src: '**',
          dest: 'app/dist/fonts/',
          expand: true
        }]
      }
    },
    watch: {
      js: {
        files: ['app/src/**/*.js'],
        tasks: ['concat:js']
      },
      less: {
        files: ['app/src/**/*.less'],
        tasks: ['less']
      },
      html: {
        files: ['app/src/**/*.html'],
        tasks: ['html2js']
      }
      // css: {
      //   files: ['**/*.css', '!bower_components/**', '!node_modules/**', '!app/dist/**'],
      //   tasks: ['concat:css']
      // }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['less', 'html2js', 'concat', 'copy']);
  grunt.registerTask('default', ['build', 'watch']);
};
