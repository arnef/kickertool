(function () {
  'use strict';
  
  angular.module('kUpdateService', [])
  .service('UpdateService', function ($http) {
    var self = this;
    
    self.checkForUpdates = function (callback) {
      
      $http.get('https://raw.githubusercontent.com/arnef/kickertool/master/package.json', 
                { cache: false })
      .success(function (current) {
        $http.get('../package.json')
        .success(function (local) {
          var currentVersion = parseInt(current.version.split('.').join(''), 10);
          var localVersion = parseInt(local.version.split('.').join(''), 10);
          
          if (currentVersion > localVersion) {
            var system = window.navigator.platform.toLowerCase().split(' ');
            system[0] = system[0].substring(0, 3);
            
            if (system[0] == 'lin') {
              if (system[1] == 'i686') {
                current.link = current.downloads.linux32;
              }
              if (system[1] == 'x86_64') {
                current.link = current.downloads.linux64;
              }
            }
            
            if (system[0] == 'mac') {
              current.link = current.downloads.osx;
            }
            
            if (system[0] == 'win') {
              current.link = current.downloads.win;
            }
            
            delete current.downloads;
            callback(current);
          }
        });
      });
    };
  });
})();