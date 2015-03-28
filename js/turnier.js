(function () {
    var app = angular.module('kturnier', []);
    
    app.controller('TurnierController', function($scope, $filter, $location, dialogs, DataService) {
        var _self = this;
        
        $scope.tables = DataService.tables;
        $scope.ranking = DataService.teams;
        $scope.matches = [];
        $scope.playedMatches = [];
        _self.currentRound = 0;
                
        _self.selectedMatch = null;
        
        $scope.startRound = function() {
            _self.currentRound += 1;
            var end = $scope.ranking.length - ($scope.ranking.length % 2);
            for (var i = 0; i < end; i += 2) {
                var match = {
                    round: _self.currentRound,
                    team1: $scope.ranking[i],
                    team2: $scope.ranking[i+1],
                    score: { team1: 0, team2: 0 }
                }
                $scope.matches.push(match);
            }
            $scope.tables[0] = $scope.matches.pop();
            $scope.tables[1] = $scope.matches.pop();
            
        };
        $scope.startRound();
        
        $scope.insertScore = function(tableIndex) {
            if ($scope.tables[tableIndex].score != null) {
                var match = $scope.tables[tableIndex];
                var dlg = dialogs.create('templates/result_dialog.html', 'InsertResultDialogController', match, {size: 'sm'});
                dlg.result.then(function(score) {
                    if (score == 1) {
                        match.team1.points += 2;
                        match.score = {team1: 2, team2: 0};
                    }
                    if (score == 2) {
                        match.team1.points += 1;
                        match.team2.points += 1;
                        match.score = { team1: 1, team2: 1};
                    }
                    if (score == 3) {
                        match.team2.points += 2;
                        match.score = { team1: 0, team2: 2};
                    }
                    $scope.playedMatches.push(match);
                    if ($scope.matches.length == 0) {
                        $scope.tables[tableIndex] = {};
                    }
                    else {
                        $scope.tables[tableIndex] = $scope.matches.pop();
                    }
                    $scope.ranking = $filter('orderBy')($scope.ranking, '-points');
                });
            }
        };
        
        
        $scope.saveScore = function() {
            var match = _self.selectedMatch;
            if (match.score.team1 == match.score.team2) {
                match.team1.points += 1;
                match.team2.points += 1;
            }
            else if (match.score.team1 > match.score.team2) {
                match.team1.points += 2;
            }
            else {
                match.team2.points += 2;
            }
            _self.selectedMatch = null;
            _self.playedMatches.push(match);
            var allDone = false;
            if (_self.matches.length == 0) {
                _self.tables[_self.tableIndex] = {};
                allDone = true;
                for (var i = 0; i < _self.tables.length; i++) {
                    if (_self.tables[i].team1 != null) {
                        allDone = false;
                        break;
                    }
                }
            }
            else {
                _self.tables[_self.tableIndex] = _self.matches.pop();
            }
            _self.ranking = $filter('orderBy')(_self.ranking, '-points');
            
        
            //_self.tables.splice(_self.tableIndex, 1);
            
        
            
        };
        
        _self.startKoRunde = function() {
            DataService.ranking = $filter('orderBy')(_self.ranking, '-points');
            $location.path('ko');
        };
    });
    
    app.controller('InsertResultDialogController', function($scope, $modalInstance, data) {
        
        $scope.match = data;
        
        $scope.saveResult = function(index) {
            $modalInstance.close(index);
        };
        
        $scope.cancel = function(){
			$modalInstance.dismiss('Canceled');
		};
        
    });
})();
