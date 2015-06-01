(function() {
    var app = angular.module('kstart', []);
    
    app.controller('StartController', function($scope, $location, Tourment) {
        var currentTab = 0;
        
        $scope.setTab = function (newTab) {
            currentTab = newTab;
        };
        
        $scope.isTab = function (tab) {
            return currentTab == tab;
        };
        
        $scope.modus = 1;
        $scope.tables = 0;
        
        $scope.startTourment = function() {
            if ($scope.tables > 0) {
                Tourment.setCountTables($scope.tables);
                if (currentTab == 0) {
                    $location.path('player');
                }
                if (currentTab == 1) {
                    $location.path('1on1');
                }
                if (currentTab == 2) {
                    $location.path('2on2');
                }
            }
        }
    });
})();
