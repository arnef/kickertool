(function () {
  'use strict';
  angular.module('app')
    .service('SwissSystem', ['$rootScope', 'ScoreService',
      function ($rootScope, ScoreService) {
        var _self = this,
          T = $rootScope.globals,
          _matchMatrix = [];

        /**
         *
         * @param team1
         * @param team2
         * @returns {boolean}
         */
        function matchPlayed(team1, team2) {
          var teamInMatch = function (m, team1, team2) {
            if (m == null) return false;
            return (m.team1.name == team1.name && m.team2.name == team2.name) || (m.team1.name == team2.name && m.team2.name == team1.name);
          };

          for (var i = 0; i < T.currentMatches.length; i++) {
            if (teamInMatch(T.currentMatches[i], team1, team2)) {
              return true;
            }
          }

          for (i = 0; i < T.nextMatches.length; i++) {
            if (teamInMatch(T.nextMatches[i], team1, team2)) {
              return true;
            }
          }
          return false;
        }

        /**
         *
         */
        function updateMatrix() {
          if (T.teamList.length % 2 === 1) {
            T.teamList.push({
              name: 'Freilos',
              ghost: true
            });
          }
          for (var i = 0; i < T.teamList.length; i++) {
            _matchMatrix[i] = [];
            for (var j = i + 1; j < T.teamList.length; j++) {
              if (matchPlayed(T.teamList[i], T.teamList[j])) {
                _matchMatrix[i][j] = 99;
              } else {
                _matchMatrix[i][j] = Math.abs(T.teamList[i].points - T.teamList[j].points);
              }
            }
          }
        }

        /**
         *
         */
        function sortTable() {
          T.teamList.sort(function (a, b) {
            return b.points - a.points;
          });
          var winnerList = [];
          var end = T.teamList.length / 2;
          for (var i = 0; i < end; i++) {
            winnerList.push(T.teamList[i]);
            T.teamList.splice(i, 1);
          }

          winnerList.sort(function (a, b) {
            return a.points - b.points;
          });
          for (i = 0; i < winnerList.length; i++) {
            T.teamList.push(winnerList[i]);
          }
        }

        /**
         *
         */
        function buildMatches() {
          T.round += 1;
          var failed = function () {
            for (var i = 0; i < _matchMatrix.length; i++) {
              if (_matchMatrix[i][_matchMatrix.length - i - 1] == 99) {
                return i;
              }
            }
            return -1;
          };
          var findBestMatch = function (i) {
            var count = 1;
            var x = i;
            var j = _matchMatrix.length - i - 1;
            while (count < _matchMatrix.length) {
              x -= count;
              if (x < 0) x = _matchMatrix.length - count - 1;
              if (x < j && _matchMatrix[x][j] < 99) {
                return x;
              }
              count += 1;
            }
            return -1;
          };
          var swapTeams = function (idx) {
            var idx2 = findBestMatch(idx);
            if (idx2 > -1) {
              var team = T.teamList[idx];
              T.teamList[idx] = T.teamList[idx2];
              T.teamList[idx2] = team;
              updateMatrix();
            }
            console.debug('swap ' + idx + ' and ' + idx2);
          };

          var failedIdx = failed();
          var tries = 0;
          while (failedIdx > -1 && tries < 100) {
            swapTeams(failedIdx);
            failedIdx = failed();
            tries += 1;
            console.debug(failedIdx);
          }
          console.debug(failedIdx);

          for (var i = 0; i < T.teamList.length / 2; i++) {
            if (!matchPlayed(T.teamList[i], T.teamList[T.teamList.length - i - 1])) {
              var team1,
                team2,
                match;
              team1 = T.teamList[i];
              team2 = T.teamList[T.teamList.length - i - 1];
              if (team1.ghost) {
                match = {
                  team1: team2,
                  team2: team1
                };
              } else {
                match = {
                  team1: team1,
                  team2: team2
                };
              }
              match.round = T.round;
              T.nextMatches.push(match);
            } else {
              //console.debug('DONE');
            }
          }

          for (var i = 0; i < T.teamList.length; i++) {
            if (T.teamList[i].ghost) {
              T.teamList.splice(i, 1);
              return;
            }
          }
        }

        function sortTableByPointsAndMatches() {
          T.teamList.sort(function (a, b) {
            if (a.points == b.points) {
              return a.matches - b.matches;
            } else {
              return b.points - a.points;
            }
          });
        }


        /**
         *
         * @param match
         */
        _self.enterScore = function (idx, score, callback) {
          var match = T.currentMatches[idx];
          if (match != null) {
            match.score = score;
            ScoreService.enterScore(match);
            T.playedMatches.push(match);
            T.currentMatches[idx] = null;

            if (T.nextMatches.length == 0 && T.round < T.lastRound) {
              sortTable();
              updateMatrix();
              buildMatches();
            }
          }
          callback(idx);
          sortTableByPointsAndMatches();
        };


        _self.nextRound = function () {
          T.lastRound = T.teamList.length / 2;
          sortTable();
          updateMatrix();
          buildMatches();
          sortTableByPointsAndMatches();
        }


      }]);
})();