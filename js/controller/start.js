(function () {
    'use strict';
    
    var app = angular.module('controller-start', []);
    
    app.controller('StartController', function ($scope, $location, Tourment) {
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
