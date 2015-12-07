(function () {
  'use strict';

  angular.module('app')

  .controller('StartController', function ($rootScope, $scope, $http, $location, UpdateService, Dialog, K, Tournament) {

    $scope.optionsModus = [
      {
        value: K.FAIR_FOR_ALL,
        name: K.NAME[K.FAIR_FOR_ALL]
      },
      {
        value: K.ONE_ON_ONE,
        name: K.NAME[K.ONE_ON_ONE]
      },
      {
        value: K.TWO_ON_TWO,
        name: K.NAME[K.TWO_ON_TWO]
      }
    ];

    $scope.optionsDraw = [
      {
        value: true,
        name: 'Ja'
      },
      {
        value: false,
        name: 'Nein'
      }
    ];

    /**
     * check for updates
     **/
    UpdateService.checkForUpdates(function (update) {
      console.debug(update);
      var msg = '<p>Ein Update von Version ' + update.local_version + ' auf Version ' + update.version + ' ist Verfügbar!</p>' + '<p>Soll es jetzt heruntergeladen werden?</p>';
      msg += '<p>Was ist neu?</p><p><ul>';
      for (var i = 0; i < update.changelog.length; i++) {
        msg += '<li>' + update.changelog[i] + '</li>';
      }
      msg += '</li></p>';
      var dlg = Dialog.confirm({
        title: 'Neue Version verfügbar',
        body: msg,
        cancel: 'Abbrechen',
        confirm: 'Ok'
      });
      dlg.result.then(function (result) {
        if (result === 1) {


          $rootScope.downloading = true;
          $scope.load_update = false;
          $http({
              url: update.link,
              method: 'GET',
              responseType: 'arraybuffer',
              cache: false
            })
            .success(function (data) {
              $rootScope.downloading = false;
              var filename = 'kickertool_v' + update.version.substring(0, 5) + '.zip';
              var fileAsBlob = new Blob([data], {
                type: 'application/zip'
              });
              var downloadLink = document.createElement("a");
              downloadLink.download = filename;
              downloadLink.innerHTML = "My Hidden Link";
              window.URL = window.URL || window.webkitURL;
              downloadLink.href = window.URL.createObjectURL(fileAsBlob);
              downloadLink.onclick = destroyClickedElement;
              downloadLink.style.display = "none";
              document.body.appendChild(downloadLink);
              downloadLink.click();

              function destroyClickedElement(event) {
                document.body.removeChild(event.target);
              };
            })
            .error(function () {
              $rootScope.downloading = false;
            });
        }
      });

    });


    $scope.start = function () {
      $rootScope.globals.ongoing = false;
      $location.path('insert')
    };

    $scope.new = function () {
      Tournament.clear();
      $scope.start();
    }
  });

})();