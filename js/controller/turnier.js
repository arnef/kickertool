(function () {
    var app = angular.module('kturnier', []);
    
    app.controller('TurnierController', function($scope, $filter, $location, dialogs, Tourment) {
        var _self = this;
        var _currentTab = 0;
        _self.selectedMatch = null;
        var _koRoundActive = false;
        
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
        
        $scope.requeueMatch = function (tableIdx) {
            Tourment.requeueMatch(tableIdx);
        };
        
        
        $scope.insertScore = function(tableIdx) {
            if (Tourment.getCurrentMatches()[tableIdx] != null) {
                var match = Tourment.getCurrentMatches()[tableIdx];
                var dlg = dialogs.create('templates/result_dialog.html', 'InsertResultDialogController', {match: match, koRound: _koRoundActive}, {size: 'sm'});
                dlg.result.then(function(score) {
                    Tourment.setWinnerOnTable(tableIdx, score);
                });
            }
        };
        
        
        
        
        
        $scope.startKORound = function() {
            if (_koRoundActive) {
                _currentTab = 1;
                return;
            }
            var dlg = dialogs.confirm(
                'K.O. Runde starten',
                'Soll die K.O. Runde gestartet werden?<br>Danach kann nicht mehr zur Vorrunde zurück gewechselt werden!'
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
