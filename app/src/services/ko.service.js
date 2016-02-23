'use strict';

angular.module('app')
  .service('Ko', ['$rootScope', function ($rootScope) {
    var self, maxLevel, idxTeam1, idxTeam2, counter;

    self = this;

    function getRound(c) {
      var round = 1;
      while (c > round) {
        round *= 2;
      }
      return round / 2;
    }
    counter = 0;

    function setTeams(game) {
      var team1, team2, ghost;
      if (counter % 2 === 0) {
        idxTeam1 = counter;
      } else {
        idxTeam1 = maxLevel - counter;
      }
      idxTeam2 = maxLevel * 2 - 1 - idxTeam1;

      team1 = $rootScope.globals.teamList[idxTeam1];
      team2 = $rootScope.globals.teamList[idxTeam2];
      if (team1 && team2) {
        game.team1 = team1;
        game.team2 = team2;
      } else {
        ghost = {
          name: 'Freilos',
          ghost: true
        };
        game.team1 = team1 || team2;
        game.team2 = ghost;
      }
      $rootScope.globals.nextMatches.push(game);
      counter++;
    }

    function buildTree(parentGame, currentLevel) {
      var g1, g2;

      g1 = {
        idx: $rootScope.globals.finals.length,
        round: currentLevel + '. Finale',
        nextMatch: parentGame.idx
      };
      g2 = {
        idx: $rootScope.globals.finals.length + 1,
        round: currentLevel + '. Finale',
        nextMatch: parentGame.idx
      };
      $rootScope.globals.finals.push(g1, g2);
      if (currentLevel < maxLevel) {
        buildTree(g1, currentLevel * 2);
        buildTree(g2, currentLevel * 2);
      } else {
        setTeams(g1);
        setTeams(g2);
      }
    }

    self.start = function () {
      $rootScope.globals.finals = [{
        idx: 0,
        round: 'Finale'
      }];
      $rootScope.globals.teamList.sort(function (a, b) {
        return b.points - a.points;
      });
      maxLevel = getRound($rootScope.globals.teamList.length);
      buildTree($rootScope.globals.finals[0], 2);
      $rootScope.globals.round += 1;
      $rootScope.globals.nextMatches.sort(function (a, b) {
        a = a.team2.ghost ? 1 : 0;
        b = b.team2.ghost ? 1 : 0;
        return b - a;
      });
    };

    function updateMatches(match) {
      var nextMatch, winner, looser;

      nextMatch = $rootScope.globals.finals[match.nextMatch];
      winner = match.score == '2:0' ? match.team1 : match.team2;
      looser = match.score == '0:2' ? match.team1 : match.team2;
      looser.out = true;
      if (!nextMatch) {
        return;
      }
      if (!nextMatch.team1) {
        nextMatch.team1 = winner;
      } else {
        nextMatch.team2 = winner;
      }
      if (nextMatch.team1 && nextMatch.team2) {
        $rootScope.globals.nextMatches.push(nextMatch);
      }
    }

    function sortTable() {
      $rootScope.globals.teamList.sort(function (a, b) {
        if (a.matches == b.matches) {
          return b.points - a.points;
        }
        return b.matches - a.matches;
      });
    }

    self.enterScore = function (idx, score, callback) {
      var match = $rootScope.globals.currentMatches[idx];
      if (match != null) {
        updateMatches(match);
        $rootScope.globals.playedMatches.push(match);
        $rootScope.globals.currentMatches[idx] = null;
        sortTable();
        callback(idx);
      }
    };
  }]);
