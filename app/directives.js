(function () {
  'use strict';

  angular.module('app')

  .directive('scrolltable', function ($window) {
      var resize = function (element, attrs) {
        var diff = 142;

        if (attrs.fullheight == 'true')
          diff = 100;

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
    .directive('navbarTournament', function () {
      return {
        restrict: 'E',
        templateUrl: 'templates/directive/navbar-tournament.view.html'
      };
    })
    .directive('navbarInsert', function () {
      return {
        restrict: 'E',
        templateUrl: 'templates/directive/navbar-insert.view.html'
      };
    })
    .directive('insertPlayerDyp', function () {
      return {
        restrict: 'E',
        templateUrl: 'templates/insert_player_dyp.html'
      };
    })
    .directive('insertPlayer', function () {
      return {
        restrict: 'E',
        templateUrl: 'templates/insert_player.html'
      };
    })
    .directive('insertTeam', function () {
      return {
        restrict: 'E',
        templateUrl: 'templates/insert_team.html'
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