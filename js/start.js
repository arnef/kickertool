(function() {
    var app = angular.module('kstart', []);
    
    app.controller('StartController', function($scope, $location, DataService) {
        
        $scope.modus = null;
        $scope.tables = null;
        
        $scope.startTourment = function() {
            if ($scope.tables > 0) {
                DataService.tables = [];
                for (var i = 0; i < $scope.tables; i++) {
                    DataService.tables.push({});
                }
                if ($scope.modus == 1) {
                    $location.path('player');
                }
                else {
                    alert('Sorry leider noch nicht implementiert!');
                }
            }
        }
    });
})();
