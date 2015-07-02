(function () {
    'use strict';
    
    var app = angular.module('controller-turnier', []);
    
    app.controller('TurnierController', function ($window, $scope, $filter, $location, dialogs, Tourment) {
        var self = this,
            currentTab = 0,
            koRoundActive = false;
        
        self.selectedMatch = null;
        
        $scope.toggleLastRound = function () {
            Tourment.toggleLastRound();
            $scope.isLastRound = Tourment.isLastRound();
            if (!$scope.isLastRound && Tourment.getNextMatches().length === 0) {
                Tourment.nextRound();
            }
        };
            
        
        $scope.isKoRound = function () {
            return koRoundActive;
        };
        
        $scope.getRanking = function () {
            return Tourment.getRanking();
        };
        
        
        $scope.isTab = function (tab) {
            return currentTab === tab;
        };
        
        $scope.setTab = function (tab) {
            if (tab === 1) {
                $scope.startKORound();
            } else if (!(koRoundActive && tab === 0)) {
                currentTab = tab;
            }
        };
        
        $scope.getCurrentMatches = function () {
            return Tourment.getCurrentMatches();
        };
        
        $scope.getNextMatches = function () {
            return Tourment.getNextMatches();
        };
        
        $scope.getPlayedMatches = function () {
            return Tourment.getPlayedMatches();
        };
        
        $scope.deferMatch = function (tableIdx) {
            var dlg = dialogs.confirm('Spiel zurückstellen',
                                      'Soll das Spiel an Tisch ' + (tableIdx + 1) + ' zurückgestellt werden?',
                                      { size: 'sm' });
            dlg.result.then(function (btn) {
                Tourment.deferMatch(tableIdx);
            });
            
        };
        
        
        $scope.insertScore = function (tableIdx) {
            if (Tourment.getCurrentMatches()[tableIdx] !== null) {
                var match = Tourment.getCurrentMatches()[tableIdx],
                    dlg = dialogs.create('templates/result_dialog.html', 'InsertResultDialogController',
                                         { 
                                            match: match, 
                                            koRound: koRoundActive, 
                                            head: koRoundActive ? 'Gewinner wählen' : 'Ergebnis eintragen' 
                                         },
                                         { size: 'md' });
                dlg.result.then(function (score) {
                    Tourment.setWinnerOnTable(tableIdx, score);
                });
            } else if (Tourment.getCurrentMatches()[tableIdx] === null) {
                Tourment.setMatchOnTable(tableIdx);
            }
        };
        
        
        $scope.reenterScore = function (tableIdx) {
            var match = Tourment.getPlayedMatches()[tableIdx];
            if (match !== null) {
                var dlg = dialogs.create('templates/result_dialog.html',
                                         'InsertResultDialogController',
                                         { match: match,
                                           koRound: parseInt(match.round, 10) !== match.round,
                                           head: 'Ergebnis korrigieren' },
                                         { size: 'sm' });
                dlg.result.then(function (score) {
                    // reset score                    
                    match.team1.points -= match.score.team1;
                    match.team2.points -= match.score.team2;
                    
                    Tourment.enterScore(match, score);
                });
            }
        };
        
        $scope.showReenterScore = function (match) {
            return !(match.team1.ghost || match.team2.ghost);
        };
      
      $scope.modus = localStorage.getItem('modus');
        
      $scope.addDisabled = function () {
        if (Tourment.getRound() == 1) return false;
        if (Tourment.getRound() == 2) {
          for (var i = 0; i < Tourment.getCurrentMatches().length; i++) {
            if (Tourment.getCurrentMatches()[i].round == 1) return false;
          }
          return true;
        }
        return true;
      };
      
      var addnew = function (newplayer) {
        var lastIdx = Tourment.getRanking().length - 1;
            if (Tourment.getRanking()[lastIdx].ghost) {
              Tourment.getRanking()[lastIdx] = newplayer;
            }
            else {
              Tourment.getRanking().push(newplayer);
              Tourment.getRanking().push({name: 'Freilos', points: -100, ghost: true});
            }
      }
      
      $scope.add = function () {
        if ($scope.modus == 1) {
          var dlg = dialogs.create('/dialog/insert-player.html',
                                   'AddResultDialogController',
                                  { modus : 1,
                                    teams: Tourment.getRanking() },
                                  { size: 'sm' });
          dlg.result.then(function (newplayer) {
            addnew(newplayer);
          });
        }
        if ($scope.modus == 2) {
          var dlg = dialogs.create('/dialog/insert-team.html',
                                   'AddResultDialogController',
                                   { modus: 2,
                                     teams: Tourment.getRanking()},
                                   { size: 'sm'});
          dlg.result.then(function (newteam) {
            addnew(newteam);
          });
        }
      };
        $scope.startKORound = function () {
          console.debug($window.onresize);
            if (koRoundActive) {
                currentTab = 1;
                return;
            }
            var dlg = dialogs.confirm(
                'K.O. Runde starten',
                'Soll die K.O. Runde gestartet werden?<br>Danach kann nicht mehr zur Vorrunde zurück gewechselt werden!',
                { size: 'md' }
            );
            dlg.result.then(function (btn) {
                currentTab = 1;
                koRoundActive = true;
                Tourment.setModus(new KORound());
                Tourment.nextRound();
            });
            
        };
    });
    
    
  app.controller('AddResultDialogController', function ($scope, $modalInstance, data) {
    $scope.cancel = function () {
      $modalInstance.dismiss('Canceled');
    };
    $scope.err = null;
    var player_in_list = function (player) {
            player = player.name.split(' ').join('').toLowerCase();
            for (var i = 0; i < data.teams.length; i++) {
                var current_player = data.teams[i].name.split(' ').join('').toLowerCase();
                if (current_player == player) {
                    return true;
                }
            }
            return false;
    };
    
    var team_in_list = function (player1, player2) {
            var team1 = player1.name + '/' + player2.name;
            team1 = team1.split(' ').join('').toLowerCase();
            var team2 = player2.name + '/' + player1.name;
            team2 = team2.split(' ').join('').toLowerCase();

            for (var i = 0; i < data.teams.length; i++) {
                var current_player = data.teams[i].name.split(' ').join('').toLowerCase();
                if (current_player == team1 || current_player == team2) {
                    return true;
                }
            }
            return false;
    };
    
    var addplayer = function () {
      if (!player_in_list($scope.newPlayer)) {
        
        $modalInstance.close({name: $scope.newPlayer.name, points: 0})
        $scope.newPlayer.name = '';
      }
      else {
        $scope.err = 'Spielername schon eingetragen';
      }
    };
    
    var addteam = function () {
      if (!team_in_list($scope.newPlayer1, $scope.newPlayer2)) {
        $modalInstance.close({ name: $scope.newPlayer1.name + ' / ' + $scope.newPlayer2.name,
          points: 0});
      } else {
        $scope.err = 'Team schon eingetragen';
      }
      
    };
    $scope.add = function () {
      if (data.modus == 1) addplayer();
      if (data.modus == 2) addteam();
      
    };
  });
  
    app.controller('InsertResultDialogController', function ($scope, $modalInstance, data) {
        var koRoundActive = data.koRound;
        
        $scope.head = data.head;
        $scope.match = data.match;
                
        $scope.saveResult = function (index) {
            $modalInstance.close(index);
        };
        
        $scope.cancel = function () {
			$modalInstance.dismiss('Canceled');
		};
        
        $scope.isKORound = function () {
            return koRoundActive;
        };
        
    });
})();
