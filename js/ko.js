(function() {
    var app = angular.module('kko', []);

    app.controller('KORundeController', function(DataService) {
        var _self = this;
        _self.ranking = DataService.ranking || DataService.teams;

        _self.matches = [];
        _self.playedMatches = [];
        _self.tables = [{}, {}];

        _self.winner = [];

        var buildMatches = function(type, teams) {
            _self.winner = [];
            for (var i = 0; i < type / 2; i++) {
                var team1 = teams[i];
                var team2 = teams[type - i - 1];
                if (team2 != null) {
                    var team = {
                        team1: team1,
                        team2: team2,
                        score: {
                            team1: 0,
                            team2: 0
                        },
                        round: type / 2 + '. Finale'
                    };
                    _self.matches.push(team);
                } else {
                    var team = {
                        team1: team1,
                        team2: {
                            player1: {
                                name: 'Freilos'
                            }
                        },
                        score: {
                            team1: 7,
                            team2: 0
                        },
                        round: type / 2 + '. Finale'
                    };
                    _self.winner.push(team1);
                    _self.playedMatches.push(team);
                }
            }
            for (var i = 0; i < _self.tables.length; i++) {
                _self.tables[i] = _self.matches.pop();
            }
        };




        var calculateMatches = function(teamslist) {
            var teams = teamslist.length;
            if (teams == 1) {
                alert(teamslist[0].player1.name);
            }
            else if (teams <= 2) {
                buildMatches(2, teamslist)
            }
            else if (teams <= 4) {
                buildMatches(4, teamslist);
            } else if (teams <= 8) {
                buildMatches(8, teamslist);
            } else if (teams <= 16) {
                buildMatches(16, teamslist)
            } else if (teams <= 32) {
                console.log('32telfinale');
            } else if (teams <= 64) {
                console.log('64telfinale');
            }
        };
        calculateMatches(_self.ranking);

        _self.insertScore = function(index, team) {
            if (_self.tables[index].score != null) {
                var match = _self.tables[index];
                if (team.player1.name == match.team1.player1.name) {
                    match.score.team1 = 7;
                    match.score.team2 = 0;
                } else {
                    match.score.team1 = 0;
                    match.score.team2 = 7;
                }
                _self.playedMatches.push(match);
                _self.winner.push(team);

                var roundDone = false;
                if (_self.matches.length == 0) {
                    _self.tables[index] = {};
                    roundDone = true;
                    for (var i = 0; i < _self.tables.length; i++) {
                        if (_self.tables[i].team1 != null) {
                            roundDone = false;
                            break;
                        }
                    }
                } else {
                    _self.tables[index] = _self.matches.pop();
                }
                if (roundDone) {
                    calculateMatches(_self.winner);

                }
            }
        };
    });
})();
