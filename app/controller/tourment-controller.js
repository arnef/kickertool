(function () {
  'use strict';
  
  angular.module('kTourmentController', [])
  
  .controller('TourmentController', function ($scope, dialogs, Tourment) {
    
    var self = this,
      currentTab = 0;
    
    $scope.isTab = function (tab) {
      return currentTab == tab;
    };
    
    $scope.setTab = function (tab) {
      currentTab = tab;
    };
    
    $scope.getTables = function () {
      return Tourment.getTables();
    };
    
    $scope.getRanking = function () {
      return Tourment.getRanking();
    };
    
    //Tourment.nextRound();
    Tourment.start();
    
    $scope.getNextMatches = function () {
      return Tourment.getNextMatches();
    };

    $scope.getPlayedMatches = function () {
      return Tourment.getPlayedMatches();
    };
    
    $scope.insertScore = function (tableIdx) {
      var m = Tourment.getTable(tableIdx);
      if (m != null) {
        dialogs.create('templates/result_dialog.html',
                       'InsertResultDialogController',
                       { home: m.getHome().getName(),
                         away: m.getAway().getName()
                       },
                       { size: 'md' })
        .result.then(function (score) {
          Tourment.setScoreOnTable(tableIdx, score);
        });
      }
    };
    
    $scope.deferMatch = function (tableIdx) {
      if ($scope.canDeferMatch(tableIdx)) {
      dialogs.confirm('Spiel zurückstellen',
                      'Soll das Spielan Tisch ' + (tableIdx + 1) 
                      + ' zurückgestellt werden?',
                      { size: 'sm' })
      .result.then(function () {
        Tourment.deferMatch(tableIdx);
      });
    }
    };
    
    $scope.canDeferMatch = function (tableIdx) {
      return Tourment.canDeferMatch(tableIdx);
    };
    
  })
  
  .controller('InsertResultDialogController', function ($scope, $modalInstance, data) {
    $scope.head = data.head;
    $scope.home = data.home;
    $scope.away = data.away;
    
    $scope.saveResult = function (idx) {
      $modalInstance.close((WINNER_HOME + idx));
    };
    $scope.cancel = function () {
      $modalInstance.dismiss();
    };
  });
})();