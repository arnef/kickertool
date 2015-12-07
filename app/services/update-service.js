(function () {
  'use strict';

  angular.module('kUpdateService', [])
    .service('UpdateService', function ($rootScope, $http) {
      var self = this,
        gui, pkg, copyPath, execPath, os, platform,
        tmpPath, request, fs;
      $rootScope.updater = {
        downloading: false
      };

      function checkNewVersion(pkg, callback) {
        callback(null, true);
      }

      self.checkForUpdates = function (callback) {

        var gui = require('nw.gui');
        var pkg = require('../package.json'); // Insert your app's manifest here
        pkg.manifestUrl = 'http://localhost:8080/package_new.json';
        var updater = require('node-webkit-updater');
        var upd = new updater(pkg);
        var copyPath, execPath;


        upd.checkNewVersion(function (error, newVersionExists, manifest) {
          console.debug(error, newVersionExists, manifest);
          if (!error && newVersionExists) {
            $rootScope.updater.downloading = true;
            $rootScope.updater.msg = 'Lade Updates...';
            upd.download(function (error, filename) {
              console.debug(error, filename);
              if (!error) {
                $rootScope.updater.msg = 'Entpacke Updates...';
                upd.unpack(filename, function (error, newAppPath) {
                  console.debug(error, newAppPath);
                  if (!error) {
                    $rootScope.updater.msg = 'Kickertool wird neugestartet...';
                    upd.runInstaller(newAppPath, [upd.getAppPath(), upd.getAppExec()], {});
                    gui.App.quit();
                  }
                }, manifest);
              }
            }, manifest);
          }
        });
      };

      // try {
      /*  gui = require('nw.gui');
        pkg = require('../package.json');
        os = require('os');
        request = require('request');
        fs = require('fs');

        tmpPath = os.tmpdir();
        console.debug(tmpPath);
        // pkg.manifestUrl = "https://raw.githubusercontent.com/arnef/kickertool/master/package.json";
        pkg.manifestUrl = 'http://localhost:8080/package_new.json';
        platform = 'linux64';

        checkNewVersion(pkg, function (err, newVersion) {
          console.debug(err, newVersion);
          if (!err && newVersion) {
            var dl = request(pkg.downloads.linux64, function (err, response) {
              console.debug(err, response);
              if (response && response.statusCode < 200 || response.statusCode >= 300) {
                dl.abort();
                console.debug('error download');
              }
            });
            dl.on('response', function (response) {
              if (response && response.headers && response.headers['content-length']) {
                dl['content-length'] = response.headers['content-length'];
              }
            });
            var destinationPath = tmpPath + '/update.zip';
            fs.unlink(destinationPath, function () {
              dl.pipe(fs.createWriteStream(destinationPath));
              dl.resume();
            });
            dl.on('end', function () {
              console.debug('download done');
              console.debug(process.execPath);
            });
          }
        });
      };*/
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