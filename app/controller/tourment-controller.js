(function () {
  'use strict';
  
  angular.module('kTourmentController', [])
  
  .controller('TourmentController', function ($scope, Tourment) {
    
    var self = this,
      currentTab = 0;
    
    $scope.isTab = function (tab) {
      return currentTab == tab;
    };
    
    $scope.setTab = function (tab) {
      currentTab = tab;
    };
    
    $scope.getRanking = function () {
      return Tourment.getRanking();
    };
    
  });
})();