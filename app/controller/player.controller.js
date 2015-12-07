(function () {
  'use strict';

  angular.module('app')
    .controller('PlayerController', function ($rootScope, $scope) {
      var T = $rootScope.globals;
      $scope.player = {};

      $scope.add = function () {
        if ($scope.player.name && $scope.player.position && $scope.player.type) {
          T.globalPlayerList.push(angular.copy($scope.player));
        }
      }

    });
})();