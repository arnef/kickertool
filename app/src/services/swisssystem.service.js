'use strict';
angular.module('app')
  .service('SwissSystem', ['$rootScope', '$localStorage',
    function ($rootScope, $localStorage) {
      var self = this,
        matchMatrix = [];
      $rootScope.matrix = matchMatrix;

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

        for (var i = 0; i < $rootScope.globals.currentMatches.length; i++) {
          if (teamInMatch($rootScope.globals.currentMatches[i], team1, team2)) {
            return true;
          }
        }

        for (i = 0; i < $rootScope.globals.playedMatches.length; i++) {
          if (teamInMatch($rootScope.globals.playedMatches[i], team1, team2)) {
            return true;
          }
        }
        return false;
      }

      /**
       *
       */
      function updateMatrix() {
        if ($rootScope.globals.teamList.length % 2 === 1) {
          $rootScope.globals.teamList.push({
            name: 'Freilos',
            ghost: true
          });
        }
        for (var i = 0; i < $rootScope.globals.teamList.length; i++) {
          matchMatrix[i] = [];
          for (var j = i + 1; j < $rootScope.globals.teamList.length; j++) {
            if (matchPlayed($rootScope.globals.teamList[i], $rootScope.globals.teamList[j])) {
              matchMatrix[i][j] = 99;
            } else {
              matchMatrix[i][j] = Math.abs($rootScope.globals.teamList[i].points - $rootScope.globals.teamList[j].points);
            }
          }
        }

      }

      /**
       *
       */
      function sortTable() {
        $rootScope.globals.teamList.sort(function (a, b) {
          return b.points - a.points;
        });
        var winnerList = [];
        var end = $rootScope.globals.teamList.length / 2;
        for (var i = 0; i < end; i++) {
          winnerList.push($rootScope.globals.teamList[i]);
          $rootScope.globals.teamList.splice(i, 1);
        }

        winnerList.sort(function (a, b) {
          return a.points - b.points;
        });
        for (i = 0; i < winnerList.length; i++) {
          $rootScope.globals.teamList.push(winnerList[i]);
        }
      }

      /**
       *
       */
      function buildMatches() {
        $rootScope.globals.round += 1;
        var failed = function () {
          for (var i = 0; i < matchMatrix.length; i++) {
            if (matchMatrix[i][matchMatrix.length - i - 1] == 99) {
              return i;
            }
          }
          return -1;
        };
        var findBestMatch = function (i) {
          var count = 1;
          var x = i;
          var j = matchMatrix.length - i - 1;
          while (count < matchMatrix.length) {
            x -= count;
            if (x < 0) x = matchMatrix.length - count - 1;
            if (x < j && matchMatrix[x][j] < 99) {
              return x;
            }
            count += 1;
          }
          return -1;
        };
        var swapTeams = function (idx) {
          var idx2 = findBestMatch(idx);
          if (idx2 > -1) {
            var team = $rootScope.globals.teamList[idx];
            $rootScope.globals.teamList[idx] = $rootScope.globals.teamList[idx2];
            $rootScope.globals.teamList[idx2] = team;
            updateMatrix();
          }
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

        for (var i = 0; i < $rootScope.globals.teamList.length / 2; i++) {
          if (!matchPlayed($rootScope.globals.teamList[i], $rootScope.globals.teamList[$rootScope.globals.teamList.length - i - 1])) {
            var team1,
              team2,
              match;
            team1 = $rootScope.globals.teamList[i];
            team2 = $rootScope.globals.teamList[$rootScope.globals.teamList.length - i - 1];
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
            match.round = $rootScope.globals.round;
            $rootScope.globals.nextMatches.push(match);
          } else {
            //console.debug('DONE');
          }
        }

        for (var i = 0; i < $rootScope.globals.teamList.length; i++) {
          if ($rootScope.globals.teamList[i].ghost) {
            $rootScope.globals.teamList.splice(i, 1);
            return;
          }
        }
      }

      function sortTableByPointsAndMatches() {
        $rootScope.globals.teamList.sort(function (a, b) {
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
      self.enterScore = function (idx, score, callback) {
        var match = $rootScope.globals.currentMatches[idx];
        if (match != null) {
          $rootScope.globals.playedMatches.push(match);
          $rootScope.globals.currentMatches[idx] = null;

          if ($rootScope.globals.nextMatches.length == 0 && $rootScope.globals.round < $rootScope.globals.lastRound) {
            sortTable();
            updateMatrix();
            buildMatches();
          }
        }
        if (callback) {
          callback(idx);
        }
        sortTableByPointsAndMatches();
      };


      self.nextRound = function () {
        $rootScope.globals.lastRound = $rootScope.globals.teamList.length / 2;
        sortTable();
        updateMatrix();
        buildMatches();
        sortTableByPointsAndMatches();
      };

      self.sortTable = sortTable;


    }
  ]);
