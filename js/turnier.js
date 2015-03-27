(function () {
    var app = angular.module('kturnier', []);
    
    app.controller('TurnierController', function(DataService, $filter) {
        var _self = this;
        
        _self.tables = [{}, {}];
        _self.ranking = [].concat(DataService.teams);
        _self.matches = [];
        _self.playedMatches = [];
        _self.currentRound = 0;
        
        _self.selectedMatch = null;
        
        _self.matchesProRound = 0;
        _self.playedMachesInRound = 0;
        _self.startRound = function() {
            _self.currentRound += 1;
            var end = _self.ranking.length - (_self.ranking.length % 2);
            _self.matchesProRound = end;
            for (var i = 0; i < end; i += 2) {
                var match = {
                    round: _self.currentRound,
                    team1: _self.ranking[i],
                    team2: _self.ranking[i+1],
                    score: { team1: 0, team2: 0 }
                }
                _self.matches.push(match);
            }
            _self.tables[0] = _self.matches.pop();
            _self.tables[1] = _self.matches.pop();
            $('#newRoundModal').hide();
        };
        _self.startRound();
        
        _self.tableIndex;
        _self.insertScore = function(tableIndex) {
            if (_self.tables[tableIndex].score != null) {
                _self.tableIndex = tableIndex;
                _self.selectedMatch = _self.tables[tableIndex];
                _self.selectedMatch.score = {};
                $('#insertScoreModal').toggle();
            }
        };
        
        _self.saveScore = function() {
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
            
            $('#insertScoreModal').toggle();
            if (allDone) {
                $('#newRoundModal').toggle();
            }
            
        };
    });
})();
