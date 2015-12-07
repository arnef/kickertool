(function () {
  'use strict';

  angular.module('kUpdateService', [])
    .service('UpdateService', function ($rootScope, $http) {
      var self = this,
        gui, pkg, copyPath, execPath, os, platform,
        tmpPath, request;
      $rootScope.updater = {
        downloading: false
      };

      function checkNewVersion(pkg, callback) {
        callback(null, true);
      }

      self.checkForUpdates = function (callback) {
        // try {
        gui = require('nw.gui');
        pkg = require('../package.json');
        os = require('os');
        request = require('request');
        tmpPath = os.tmpdir();
        console.debug(tmpPath);
        // pkg.manifestUrl = "https://raw.githubusercontent.com/arnef/kickertool/master/package.json";
        pkg.manifestUrl = 'http://localhost:8080/package_new.json';
        platform = 'linux64';

        checkNewVersion(pkg, function (err, newVersion) {
          console.debug(err, newVersion);
          if (!err && newVersion) {
            console.debug(pkg.downloads.linux64);
          }
        });
      };
      //  } catch (e) {
      //     console.debug(e.message);
      //   }
      /*$http.get('https://raw.githubusercontent.com/arnef/kickertool/master/package.json', {
          cache: false,
          ignoreLoadingBar: true
        })
        .success(function (current) {
          $http.get('../package.json', {
              ignoreLoadingBar: true

            })
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
        });*/

    });
})();