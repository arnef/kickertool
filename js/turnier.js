(function () {
    var app = angular.module('kturnier', []);
    
    app.controller('TurnierController', function($scope, $filter, $location, DataService) {
        var _self = this;
        
        $scope.tables = DataService.tables;
        $scope.ranking = DataService.ranking || DataService.teams;
        $scope.matches = [];
        $scope.playedMatches = [];
        _self.currentRound = 0;
        console.log($scope.tables);
        console.log($scope.raking);
        
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
        
        _self.tableIndex;
        $scope.insertScore = function(tableIndex) {
            if (_self.tables[tableIndex].score != null) {
                _self.tableIndex = tableIndex;
                _self.selectedMatch = _self.tables[tableIndex];
                _self.selectedMatch.score = {};
                var instance = $modal.open({
                    templateUrl: 'insertScore.html',
                    controller: 'ModalScoreController',
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
})();
