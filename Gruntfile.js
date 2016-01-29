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
    concat: {
      options: {
        sourceMap: true
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

          'app/src/app.js',
          'app/src/directives.js',
          'app/src/services/update.service.js',
          'app/src/services/teamdrawer.service.js',
          'app/src/services/dialog.service.js',
          'app/src/services/swisssystem.service.js',
          'app/src/services/ko.service.js',
          'app/src/services/tournament.service.js',
          'app/src/services/command.service.js',

          'app/src/controller/start.controller.js',
          'app/src/controller/tournament.controller.js',
          'app/src/controller/insert.controller.js',
          'app/src/controller/player.controller.js'
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
        files: ['**/*.js', '!bower_components/**', '!node_modules/**', '!app/dist/**'],
        tasks: ['concat:js']
      },
      less: {
        files: ['**/*.less', '!bower_components/**', '!node_modules/**', '!app/dist/**'],
        tasks: ['less']
      }
      // css: {
      //   files: ['**/*.css', '!bower_components/**', '!node_modules/**', '!app/dist/**'],
      //   tasks: ['concat:css']
      // }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['less', 'concat', 'copy']);
  grunt.registerTask('default', ['less', 'concat', 'copy', 'watch']);
};
