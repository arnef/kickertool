(function () {
  'use strict';

  angular.module('app')

  .directive('insertPlayer', function () {
      return {
        restrict: 'E',
        templateUrl: 'templates/insert_player.directive.html',
        scope: {
          player: '=player',
          focus: '=focus'
        },
        controller: 'InsertPlayerDirectiveController'
      };
    })
    .controller('InsertPlayerDirectiveController', function ($rootScope, $scope, $location, TeamDrawer) {
      $scope.TYPES = [{
        name: 'Gesetzt',
        value: TeamDrawer.PRO
      }, {
        name: 'Gelost',
        value: TeamDrawer.AMATEUR
      }];
      $scope.POSITIONS = [{
        name: 'Torwart/Stürmer',
        value: TeamDrawer.BOTH
      }, {
        name: 'Torwart',
        value: TeamDrawer.GOALIE
      }, {
        name: 'Stürmer',
        value: TeamDrawer.STRIKER
      }];

      $scope.newPlayer = {
        type: TeamDrawer.PRO,
        position: TeamDrawer.BOTH
      };

      $scope.showOptions = $rootScope.globals.modus === $rootScope.FAIR_FOR_ALL && !$rootScope.globals.ongoing || $location.path() == '/player';
      $scope.disableInput = $rootScope.globals.round > 1;

      $scope.$watch('focus', function () {
        console.debug($scope.focus);
      });

    })

  .directive('scrolltable', function ($window) {
    var resize = function (element, attrs) {
      var diff = 92
      if (attrs.withBtnRow == "true") {
        console.log('smaller scrolltable');
        diff = 92 + 34;
      }
      var winHeight = $window.innerHeight;

      element.css('height', (winHeight - diff) + 'px');
      element.css('overflow-x', 'hidden');
      element.css('overflow-y', 'scroll');
    };

    return function (scope, element, attrs) {
      resize(element, attrs);
      angular.element($window).bind('resize', function (e) {
        resize(element, attrs);
      });
    };
  })

  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        scope.$watch(attrs.focusMe, function (value) {
          $timeout(function () {
            if (value === true) {
              element[0].focus();
              scope[attrs.focusMe] = false;
            }
          }, 200);
        });
      }
    };
  });

})();
