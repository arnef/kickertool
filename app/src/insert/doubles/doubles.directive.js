(function () {
  'use strict';
  console.log('DoublesDirective');
  angular.module('app')
    .directive('doubles', DoublesDirective);

  function DoublesDirective() {
    return {
      templateUrl: 'kickertool-tpls/doubles.view.html',
      controllerAs: 'doublesCtrl',
      controller: ['$scope', '$attrs', function ($scope, $attrs) {
        console.log('Doubles');
      }]
    };
  }
})();
