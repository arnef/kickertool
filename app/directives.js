(function () {
  'use strict';
  
  angular.module('kDirectives', [])
  
  .directive('scrolltable', function ($window) {
    var resize = function (element, attrs) {
      var diff = 142;
      
      if (attrs.fullheight == 'true')
        diff = 100;
      
      var winHeight = $window.innerHeight;
      
      element.css('height', (winHeight - diff)  + 'px');
      element.css('overflow-x', 'hidden');
      element.css('overflow-y', 'auto');
    };
    
    return function (scope, element, attrs) {
      resize(element, attrs);
      angular.element($window).bind('resize', function (e) {
        resize(element, attrs);
      });
    };
  })
  
  .directive('insertForm', function (Tourment) {
    console.debug(Tourment.getModus());
    switch (Tourment.getModus()) {
      case FAIR_FOR_ALL:
        return {
          restrict: 'E',
          templateUrl: 'templates/insert_player_dyp.html'
        };
      case TWO_ON_TWO:
        return {
          restrict: 'E',
          templateUrl: 'templates/insert_team.html'
        };
      default:
        return {
          restrict: 'E',
          templateUrl: 'templates/insert_player.html'
        };
    }
  });
})();