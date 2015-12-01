(function () {
  'use strict';

  angular.module('app').
  service('Ko', ['$rootScope', 'ScoreService', function ($rootScope, ScoreService) {
    var _self,
      T,
      maxLevel;

    _self = this;
    T = $rootScope.globals;

    function getRound(c) {
      var round = 1;
      while (c > round) {
        round *= 2;
      }
      return round / 2;
    }

    var idxTeam1 = 0;
    var idxTeam2 = getRound(T.teamList.length) * 2 - 1;

    function setTeams(game) {
      game.team1 = T.teamList[idxTeam1];
      if (idxTeam2 >= T.teamList.length) {
        game.team2 = {
          name: 'Freilos',
          ghost: true
        };
      } else {
        game.team2 = T.teamList[idxTeam2];
      }
      T.nextMatches.push(game);
      idxTeam1++;
      idxTeam2--;
    }

    function buildTree(parentGame, currentLevel) {
      var g1, g2;

      g1 = {
        idx: T.finals.length,
        round: currentLevel + '. Finale',
        nextMatch: parentGame.idx,
      };
      g2 = {
        idx: T.finals.length + 1,
        round: currentLevel + '. Finale',
        nextMatch: parentGame.idx
      };
      T.finals.push(g1, g2);
      if (currentLevel < maxLevel) {
        buildTree(g1, currentLevel * 2);
        buildTree(g2, currentLevel * 2);
      } else {
        setTeams(g1);
        setTeams(g2);
      }
    }

    _self.start = function () {
      T.finals = [{
        idx: 0,
        round: 'Finale'
      }];
      T.teamList.sort(function (a, b) {
        return b.points - a.points;
      });
      maxLevel = getRound(T.teamList.length);
      buildTree(T.finals[0], 2);
    }

    function updateMatches(match) {
      console.debug('update matches');
      var nextMatch = T.finals[match.nextMatch];
      console.debug(nextMatch);
      if (!nextMatch) return;
      var winner = match.score == '2:0' ? match.team1 : match.team2;
      if (!nextMatch.team1) {
        nextMatch.team1 = winner;
      } else {
        nextMatch.team2 = winner;
      }
      if (nextMatch.team1 && nextMatch.team2) {
        T.nextMatches.push(nextMatch);
      }
    }

    _self.enterScore = function (idx, score, callback) {
      console.debug('enter score ko');
      var match = T.currentMatches[idx];
      if (match != null) {
        match.score = score;
        ScoreService.enterScore(match);
        updateMatches(match);
        T.playedMatches.push(match);
        T.currentMatches[idx] = null;
      }
      callback(idx);
    }
  }]);
})();