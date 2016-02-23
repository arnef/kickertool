(function () {
  'use strict';

  angular.module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$rootScope', '$scope', '$location'];


  function SettingsController ($rootScope, $scope, $location) {
      var vm, T;

      vm = this;
      vm.start = start;
      T = $rootScope.globals;

      vm.optionsModus = [{
        value: $rootScope.FAIR_FOR_ALL,
        name: $rootScope.NAME[$rootScope.FAIR_FOR_ALL]
      }, {
        value: $rootScope.ONE_ON_ONE,
        name: $rootScope.NAME[$rootScope.ONE_ON_ONE]
      }, {
        value: $rootScope.TWO_ON_TWO,
        name: $rootScope.NAME[$rootScope.TWO_ON_TWO]
      }];

      vm.optionsDraw = [{
        value: true,
        name: 'Ja'
      }, {
        value: false,
        name: 'Nein'
      }];

      /**
       * [start description]
       * @return {[type]} [description]
       */
      function start() {
        T.ongoing = false;
        T.currentMatches.length = T.tables;
        $location.path('insert');
      }
    }
})();
