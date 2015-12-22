(function () {
  'use strict';

  angular.module('app')

  .controller('StartController', function ($rootScope, $scope, $http, $location, Dialog, K, Tournament) {

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
