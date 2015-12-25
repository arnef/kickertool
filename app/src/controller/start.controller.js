'use strict';

angular.module('app')
  .controller('StartController', function ($rootScope, $scope, $location) {

    var T = $rootScope.globals;

    $scope.optionsModus = [{
      value: $rootScope.FAIR_FOR_ALL,
      name: $rootScope.NAME[$rootScope.FAIR_FOR_ALL]
    }, {
      value: $rootScope.ONE_ON_ONE,
      name: $rootScope.NAME[$rootScope.ONE_ON_ONE]
    }, {
      value: $rootScope.TWO_ON_TWO,
      name: $rootScope.NAME[$rootScope.TWO_ON_TWO]
    }];

    $scope.optionsDraw = [{
      value: true,
      name: 'Ja'
    }, {
      value: false,
      name: 'Nein'
    }];

    $scope.start = function () {
      T.ongoing = false;
      T.currentMatches.length = T.tables;
      $location.path('insert');
    };
  });
