'use strict';

angular.module('app')
  .service('Tournament', function ($rootScope, $localStorage, SwissSystem, Ko) {
    var self, T, isLastRound;

    self = this;
    T = $rootScope.globals;
    isLastRound = false; //$rootScope.globals.lastRound == $rootScope.globals.round;

    // fill tables
    function fillTables(idx) {
      if ($rootScope.globals.nextMatches.length === 0) return;

      if (idx !== undefined) {
        $rootScope.globals.currentMatches[idx] = $rootScope.globals.nextMatches[0];
        $rootScope.globals.nextMatches.splice(0, 1);
        if ($rootScope.globals.currentMatches[idx] != null && $rootScope.globals.currentMatches[idx].team2.ghost) {
          self.enterScore(idx, '2:0');
        }
      } else {
        for (var i = 0; i < $rootScope.globals.currentMatches.length; i++) {
          if ($rootScope.globals.currentMatches[i] == null) {
            $rootScope.globals.currentMatches[i] = $rootScope.globals.nextMatches[0];
            $rootScope.globals.nextMatches.splice(0, 1);
            if ($rootScope.globals.currentMatches[i] != null && $rootScope.globals.currentMatches[i].team2.ghost) {
              self.enterScore(i, '2:0');
            }
          }
        }
      }
    }

    self.fillTables = fillTables;

    function getModus() {
      if ($rootScope.globals.koRound)
        return Ko;
      else
        return SwissSystem;
    }

    // start the tournament
    self.start = function () {
      $rootScope.globals.ongoing = true;
      getModus().nextRound();
      fillTables();
    };

    // enter score on table
    self.enterScore = function (idx, score) {
      if ($rootScope.globals.currentMatches[idx] !== null) {
        var splitScore = score.split(':');
        $rootScope.globals.currentMatches[idx].score = score;
        $rootScope.globals.currentMatches[idx].team1.points += parseInt(splitScore[0], 10);
        $rootScope.globals.currentMatches[idx].team2.points += parseInt(splitScore[1], 10);
        $rootScope.globals.currentMatches[idx].team1.matches += 1;
        $rootScope.globals.currentMatches[idx].team2.matches += 1;
      }
      getModus().enterScore(idx, score, fillTables);
    };

    // correct score for match
    self.correctScore = function (match, newScore) {
      if (match.round === $rootScope.globals.round && match.score !== newScore) {
        var oldScore = match.score.split(':');
        match.team1.points -= parseInt(oldScore[0], 10);
        match.team2.points -= parseInt(oldScore[1], 10);
        match.score = newScore;
        newScore = newScore.split(':');
        match.team1.points += parseInt(newScore[0], 10);
        match.team2.points += parseInt(newScore[1], 10);
        if (getModus().sortTable) getModus().sortTable();
      }
    };

    // defer match on table
    self.deferMatch = function (idx) {
      if ($rootScope.globals.currentMatches[idx] !== null) {
        $rootScope.globals.nextMatches.push($rootScope.globals.currentMatches[idx]);
        $rootScope.globals.currentMatches[idx] = null;
        fillTables(idx);
      }
    };

    // start ko round
    self.startKo = function () {
      if ($rootScope.globals.nextMatches.length > 0) {
        $rootScope.globals.nextMatches = [];
      }
      for (var i = 0; i < $rootScope.globals.currentMatches.length; i++) {
        $rootScope.globals.currentMatches[i] = null;
      }
      $rootScope.globals.koRound = true;
      getModus().start();
      fillTables();
    };


    // remove team from tournament
    self.removeTeam = function (idx) {
      var team = $rootScope.globals.teamList[idx];
      if ($rootScope.globals.ongoing) {
        team.out = true;
        $rootScope.globals.teamListOut.splice(0, 0, team);
      }
      $rootScope.globals.teamList.splice(idx, 1);
    };

    /**
     * set tables
     * @param {Number} count count of tables
     */
    self.setTables = function (count) {
      if (count != $rootScope.globals.currentMatches.length) {
        // TODO change tables while tournament
        $rootScope.globals.currentMatches = [];
        $rootScope.globals.currentMatches.length = count;
      }
    };

    self.toogleLastRound = function () {
      isLastRound = !isLastRound;
      if (isLastRound) {
        $rootScope.globals.lastRound = $rootScope.globals.round;
      } else {
        $rootScope.globals.lastRound = $rootScope.globals.teamList.length / 2;
      }
      // if ($rootScope.globals.lastRound == )
    };

    /**
     * clear current tournament
     */
    self.clear = function () {
      $rootScope.globals.nextMatches = [];
      $rootScope.globals.playedMatches = [];
      $rootScope.globals.currentMatches = [];
      if ($rootScope.globals.tables) {
        $rootScope.globals.currentMatches.length = $rootScope.globals.tables;
      }
      $rootScope.globals.round = 0;
      $rootScope.globals.koRound = false;
      $rootScope.globals.playerList = [];
      $rootScope.globals.teamList = [];
      $rootScope.globals.teamListOut = [];
      $rootScope.globals.ongoing = false;
      $rootScope.globals.currentTab = 0;
    };
  });
