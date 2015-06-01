(function () {
    var app = angular.module('kturnier', []);
    
    app.controller('TurnierController', function($scope, $filter, $location, dialogs, Tourment) {
        var _self = this;
        var _currentTab = 0;
        _self.selectedMatch = null;
        var _koRoundActive = false;
        
       
        $scope.toggleLastRound = function () {
            Tourment.toggleLastRound();
            $scope.isLastRound = Tourment.isLastRound();
            if (!$scope.isLastRound && Tourment.getNextMatches().length == 0) {
                Tourment.nextRound();
            }
        };
            
        
        $scope.isKoRound = function () {
            return _koRoundActive;
        };
        
        $scope.getRanking = function() {
            return Tourment.getRanking();
        };
        
        
        $scope.isTab = function(tab) {
            return _currentTab == tab;
        }
        
        $scope.setTab = function(tab) {
            if (tab == 1) {
                $scope.startKORound();
            }
            else if (!(_koRoundActive && tab == 0)) {
                _currentTab = tab;
            }
        }
        
        $scope.getCurrentMatches = function() {
            return Tourment.getCurrentMatches();
        };
        
        $scope.getNextMatches = function() {
            return Tourment.getNextMatches();
        };
        
        $scope.getPlayedMatches = function() {
            return Tourment.getPlayedMatches();
        };
        
        $scope.deferMatch = function (tableIdx) {
            var dlg = dialogs.confirm('Spiel zurückstellen',
                                      'Soll das Spiel an Tisch ' + (tableIdx+1) + ' zurückgestellt werden?',
                                      { size: 'sm' });
            dlg.result.then(function (btn) {
                Tourment.deferMatch(tableIdx);
            });
            
        };
        
        
        $scope.insertScore = function(tableIdx) {
            if (Tourment.getCurrentMatches()[tableIdx] != null) {
                var match = Tourment.getCurrentMatches()[tableIdx];
                var dlg = dialogs.create('templates/result_dialog.html', 'InsertResultDialogController', 
                                         { match: match, koRound: _koRoundActive, head: 'Ergebnis eintragen' }, 
                                         { size: 'sm' });
                dlg.result.then(function(score) {
                    Tourment.setWinnerOnTable(tableIdx, score);
                });
            }
            else if (Tourment.getCurrentMatches()[tableIdx] == null) {
                Tourment.setMatchOnTable(tableIdx);
            }
        };
        
        
        $scope.reenterScore = function (tableIdx) {
            var match = Tourment.getPlayedMatches()[tableIdx];
            if (match != null) {
                var dlg = dialogs.create('templates/result_dialog.html', 
                                         'InsertResultDialogController', 
                                         { match: match, 
                                           koRound: !(parseInt(match.round) === match.round), 
                                           head: 'Ergebnis korrigieren' },
                                         { size: 'sm' });
                dlg.result.then(function (score) {
                    console.debug(score);
                    // reset score                    
                    match.team1.points -= match.score.team1;
                    match.team2.points -= match.score.team2;
                    
                    Tourment.enterScore(match, score);
                });
            }
        };
        
        $scope.showReenterScore = function (match) {
            return !(match.team1.ghost || match.team2.ghost);
        }
        
        
        $scope.startKORound = function() {
            if (_koRoundActive) {
                _currentTab = 1;
                return;
            }
            var dlg = dialogs.confirm(
                'K.O. Runde starten',
                'Soll die K.O. Runde gestartet werden?<br>Danach kann nicht mehr zur Vorrunde zurück gewechselt werden!',
                { size: 'md' }
            );
            dlg.result.then(function(btn) {
                _currentTab = 1;
                _koRoundActive = true;
                Tourment.setModus(new KORound());
                Tourment.nextRound();
            });
            
        };
    });
    
    app.controller('InsertResultDialogController', function($scope, $modalInstance, data) {
        
        $scope.head = data.head;
        $scope.match = data.match;
        var _koRoundActive = data.koRound;
        
        $scope.saveResult = function(index) {
            $modalInstance.close(index);
        };
        
        $scope.cancel = function(){
			$modalInstance.dismiss('Canceled');
		};
        
        $scope.isKORound = function() {
            return _koRoundActive;
        };
        
    });
})();
