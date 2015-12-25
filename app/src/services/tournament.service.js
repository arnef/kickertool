(function () {
  'use strict';

  angular.module('app')
    .service('Tournament', function (
      $rootScope, SwissSystem, Ko, K
    ) {
      var _self,
        T;

      _self = this;
      T = $rootScope.globals;

      // fill tables
      function fillTables(idx) {
        if (T.nextMatches.length === 0) return;

        if (idx !== undefined) {
          T.currentMatches[idx] = T.nextMatches[0];
          T.nextMatches.splice(0, 1);
          if (T.currentMatches[idx] != null && T.currentMatches[idx].team2.ghost) {
            _self.enterScore(idx, '2:0');
          }
        } else {
          for (var i = 0; i < T.currentMatches.length; i++) {
            if (T.currentMatches[i] == null) {
              T.currentMatches[i] = T.nextMatches[0];
              T.nextMatches.splice(0, 1);
              if (T.currentMatches[i] != null && T.currentMatches[i].team2.ghost) {
                _self.enterScore(i, '2:0');
              }
            }
          }
        }
      }

      _self.fillTables = fillTables;

      function getModus() {
        if (T.koRound)
          return Ko;
        else
          return SwissSystem;
      }

      // start the tournament
      _self.start = function () {
        T.ongoing = true;
        getModus().nextRound();
        fillTables();
      };

      // enter score on table
      _self.enterScore = function (idx, score) {
        if (T.currentMatches[idx] !== null) {
          var splitScore = score.split(':');
          T.currentMatches[idx].score = score;
          T.currentMatches[idx].team1.points += parseInt(splitScore[0], 10);
          T.currentMatches[idx].team2.points += parseInt(splitScore[1], 10);
          T.currentMatches[idx].team1.matches += 1;
          T.currentMatches[idx].team2.matches += 1;
        }
        getModus().enterScore(idx, score, fillTables);
      };

      // correct score for match
      _self.correctScore = function (match, newScore) {
        if (match.round === T.round && match.score !== newScore) {
          var oldScore = match.score.split(':');
          match.team1.points -= parseInt(oldScore[0], 10);
          match.team2.points -= parseInt(oldScore[1], 10);
          match.score = newScore;
          newScore = newScore.split(':');
          match.team1.points += parseInt(newScore[0], 10);
          match.team2.points += parseInt(newScore[1], 10);
          //  ScoreService.reenterScore(match, newScore);
          //  TODO implement this feature
        }
      };

      // defer match on table
      _self.deferMatch = function (idx) {
        if (T.currentMatches[idx] !== null) {
          T.nextMatches.push(T.currentMatches[idx]);
          T.currentMatches[idx] = null;
          fillTables(idx);
        }
      };

      // start ko round
      _self.startKo = function () {
        if (T.nextMatches.length > 0) {
          T.nextMatches = [];
        }
        for (var i = 0; i < T.currentMatches.length; i++) {
          T.currentMatches[i] = null;
        }
        T.koRound = true;
        getModus().start();
        fillTables();
      };


      // remove team from tournament
      _self.removeTeam = function (idx) {
        var team = T.teamList[idx];
        if (T.ongoing) {
          T.teamListOut.splice(0, 0, team);
          team.out = true;
        }
        T.teamList.splice(idx, 1);
      }

      // clear localstorage for new tournament
      _self.clear = function () {
        T.nextMatches = [];
        T.playedMatches = [];
        T.currentMatches = new Array(T.tables);
        T.round = 0;
        T.koRound = false;
        T.playerList = [];
        T.teamList = [];
        T.teamListOut = [];
        T.ongoing = false;
        T.currentTab = 0;
      };
    });
})();
