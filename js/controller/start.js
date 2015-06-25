(function () {
    'use strict';
    
    var app = angular.module('controller-start', []);
    
    app.controller('StartController', function ($scope, $http, $location, Tourment, UpdateService, dialogs) {
        var currentTab = 0,
            
            restoreTourment = function () {
                var tables = localStorage.getItem('tables'),
                    modus = localStorage.getItem('modus');
                
                if (tables !== null) {
                    $scope.tables = parseInt(tables, 10);
                }
                if (modus !== null) {
                    $scope.setTab(parseInt(modus, 10));
                }
            };
        
        UpdateService.checkForUpdates(function (update) {
          console.debug(update);
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
            currentTab = newTab;
        };
        
        $scope.isTab = function (tab) {
            return currentTab === tab;
        };
        
        $scope.tables = 0;
        
        $scope.startTourment = function () {
            if ($scope.tables > 0) {
                localStorage.setItem('tables', $scope.tables);
                localStorage.setItem('modus', currentTab);
                Tourment.setCountTables($scope.tables);
                if (currentTab === 0) {
                    $location.path('player');
                }
                if (currentTab === 1) {
                    $location.path('1on1');
                }
                if (currentTab === 2) {
                    $location.path('2on2');
                }
            }
        };
        
        restoreTourment();
        
    });
})();
