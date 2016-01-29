'use strict';

angular.module('app')
  .directive('boxHeading', function () {
    return {
      template: '<ul class="nav nav-tabs"><li class="active"><a ng-transclude></a></li></ul>',
      transclude: true
    };
  })
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
  var resize = function (element, attrs, scope) {
    var diff = 92
    if (scope.$eval(attrs.withBtnRow)) {
      console.log('smaller scrolltable');
      diff = 92 + 34;
    }
    var winHeight = $window.innerHeight;

    element.css('height', (winHeight - diff) + 'px');
    element.css('overflow-x', 'hidden');
    element.css('overflow-y', 'scroll');
  };

  return function (scope, element, attrs) {
    resize(element, attrs, scope);
    angular.element($window).bind('resize', function (e) {
      resize(element, attrs, scope);
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
  })
  .directive('timer', function ($interval) {
    return function (scope, element, attr) {
      var time, running;
      if (scope.table != null) {
        if (!scope.table.time) {
          scope.table.time = 0;
        }
        $interval(function () {
          scope.table.time += 1;
        }, 1000);
      }
      // time = 0;
      // running = true;
      // element.html(time + ' min');
      // $interval(function () {
      //   time += 1;
      //   if (running) {
      //     element.html(time + ' min');
      //   }
      // }, 1000 );
      //
      // scope.$watch(attr.onChange, function (newVal, oldVal) {
      //   if (newVal != oldVal && newVal != null) {
      //     running = true;
      //     time = 0;
      //     element.html(time + ' min');
      //   } else if (newVal == null) {
      //     running = false;
      //     element.html('');
      //   }
      // });
    };
  })
  .directive('animateOnChange', function ($timeout) {
    return function (scope, element, attr) {
      scope.$watch(attr.animateOnChange, function (newVal, oldVal) {
        if (newVal != oldVal && newVal != null) {
          element.removeClass('hover');
          element.addClass('bg-info');
          $timeout(function () {
            element.removeClass('bg-info');
          }, 100);
          $timeout(function () {
            element.addClass('hover');
          }, 1000 * 60)
        } else if (newVal == null) {
          element.removeClass('bg-info');
          element.addClass('hover');
        }
      });
    };
  });
