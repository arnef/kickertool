(function() {
    var app = angular.module('kstart', []);
    
    app.controller('StartController', function($scope, $location, Tourment) {
        
        $scope.modus = 1;
        $scope.tables = 0;
        
        $scope.startTourment = function() {
            if ($scope.tables > 0) {
                Tourment.setCountTables($scope.tables);
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
