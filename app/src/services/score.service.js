(function () {
  'use strict';

  angular.module('app')
    .service('ScoreService', ['$rootScope', function ($rootScope) {
      var _self, T;
      _self = this;
      T = $rootScope.globals;

      var updatePoints = function (match) {
        var score = match.score.split(':');
        var pointsTeam1 = parseInt(score[0], 10);
        var pointsTeam2 = parseInt(score[1], 10);
        match.team1.points += pointsTeam1;
        match.team2.points += pointsTeam2;
        match.team1.matches += 1;
        match.team2.matches += 1;
        /*   for (var i = 0; i < T.teamList.length; i++) {
             var team = T.teamList[i];
             if (team.name == match.team1.name) {
               team.points += pointsTeam1;
               team.matches += 1;
             }
             if (team.name == match.team2.name) {
               team.points += pointsTeam2;
               team.matches += 1;
             }
           }*/
      };

      _self.enterScore = function (match) {
        updatePoints(match);
      };

      _self.reenterScore = function (match, newScore) {
        if (match.score !== newScore) {
          var oldScore = match.score.split(':');
          var newScore = newScore.split(':');
          for (var i = 0; i < T.teamList.length; i++) {
            if (match.team1.name === T.teamList[i].name) {
              T.teamList[i].points -= parseInt(oldScore[0], 10);
              T.teamList[i].points += parseInt(newScore[0], 10);
            }
            if (match.team2.name === T.teamList[i].name) {
              T.teamList[i].points -= parseInt(oldScore[1], 10);
              T.teamList[i].points += parseInt(newScore[1], 10);
            }
          }
          match.score = newScore[0] + ':' + newScore[1];
        }
        T.teamList.sort(function (a, b) {
          if (a.points === b.points) {
            return a.matches - b.matches;
          } else {
            return b.points - a.points;
          }
        })
      };

    }]);
})();