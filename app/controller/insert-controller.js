(function () {
  'use strict';
  
  angular.module('kInsertController', [])
  
  .controller('InsertController', function ($scope, dialogs,  Tourment) {
    
    
    
    $scope.TYPES = [
      { name: 'Gesetzt', value: PRO },
      { name: 'Gelost', value: AMATEUR }
    ];
    
    $scope.POSITIONS = [
      { name: 'Torwart/Stürmer', value: BOTH },
      { name: 'Torwart', value: GOALIE },
      { name: 'Stürmer', value: STRIKER }
    ];
    
    $scope.newPlayer = {
      type: PRO,
      position: BOTH
    };
    
    
    $scope.add = function () {
      if (Tourment.addPlayer(Player.dyp($scope.newPlayer.name,
                                    $scope.newPlayer.position,
                                    $scope.newPlayer.type))) {
        $scope.newPlayer.name = null;
      } else {
         dialogs.error(
           'Spieler schon eingetragen',
           'Der Name ' + $scope.newPlayer.name + ' ist schon vergeben.',
           { size: 'sm' });
      }
    };
    
    $scope.getPlayer = function () {
      return Tourment.getPlayer();
    };
  });
  
})();