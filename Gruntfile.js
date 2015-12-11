module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      js: {
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-bootstrap/ui-bootstrap.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'bower_components/angular-scroll-glue/src/scrollglue.js',
          'bower_components/angular-loading-bar/build/loading-bar.js', //TODO remove
          'bower_components/ngstorage/ngStorage.js',
          'bower_components/angular-sanitize/angular-sanitize.js',

          'app/app.js',
          'app/directives.js',
          'app/services/update-service.js',
          'app/services/teamdrawer.service.js',
          'app/services/dialog.service.js',
          'app/services/swisssystem.service.js',
          'app/services/ko.service.js',
          'app/services/tournament.service.js',

          'app/controller/start.controller.js',
          'app/controller/tournament.controller.js',
          'app/controller/insert.controller.js',
          'app/controller/player.controller.js'
        ],
        dest: 'app/dist/js/app.js'
      },
      css: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'bower_components/angular-loading-bar/build/loading-bar.css',
          'app/app.css'
        ],
        dest: 'app/dist/css/app.css'
      }
    },
    copy: {
      main: {
        files: [
          {
            cwd: 'bower_components/bootstrap/dist/fonts/',
            src: '**',
            dest: 'app/dist/fonts/',
            expand: true
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('build', ['concat', 'copy']);
  grunt.registerTask('default', ['concat', 'copy', 'watch']);
};
