(function () {
  'use strict';

  angular.module('kStartController', [])

  .controller('StartController', function ($scope, $http, $location, Tourment, UpdateService, dialogs) {

    /**
    * resore last configuration
    **/
    $scope.tables = localStorage.getItem('tables') ?
      parseInt(localStorage.getItem('tables'), 10) : 0;
    $scope.modus = localStorage.getItem('modus') ?
      parseInt(localStorage.getItem('modus'), 10): FAIR_FOR_ALL;

    $scope.withDraw = localStorage.getItem('withDraw') == 'false' ? false : true;

    // if data is from old app version
    if ($scope.modus < FAIR_FOR_ALL)
      $scope.modus += FAIR_FOR_ALL;

    /**
    * check for updates
    **/
    UpdateService.checkForUpdates(function (update) {
      var msg = '<p>Ein Update von Version ' + update.local_version + ' auf Version ' + update.version
                + ' ist Verfügbar!</p>'
                + '<p>Soll es jetzt heruntergeladen werden?</p>';
          msg += '<p>Was ist neu?</p><p><ul>';
          for (var i = 0; i < update.changelog.length; i++) {
            msg += '<li>' + update.changelog[i] + '</li>';
          }
          msg += '</li></p>';
            var dlg = dialogs.confirm('Neue Version verfügbar', msg, { size: 'md' });
            dlg.result.then(function () {
                $scope.downloading = true;
                $scope.load_update = false;
                $http({
                    url: update.link,
                    method: 'GET',
                    responseType: 'arraybuffer',
                    cache: false
                })
                .success(function (data) {
                    $scope.downloading = false;
                    var filename = 'kickertool_v' + update.version.substring(0,5) + '.zip';
                    var fileAsBlob = new Blob([data], {type:'application/zip'});
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
                  $scope.downloading = false;
                });
            });
    });

    $scope.setTab = function (newTab) {
      $scope.modus = FAIR_FOR_ALL + newTab;
    };

    $scope.isTab = function (tab) {
      return $scope.modus - FAIR_FOR_ALL == tab;
    };



    $scope.startTourment = function () {
      localStorage.setItem('tables', $scope.tables);
      localStorage.setItem('modus', $scope.modus);
      localStorage.setItem('withDraw', $scope.withDraw);
      Tourment.setTables($scope.tables);
      Tourment.setModus($scope.modus);
      Tourment.setWithDraw($scope.withDraw);
      $location.path('insert');
    };
  });

})();
