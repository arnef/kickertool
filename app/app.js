/**
* Consts
**/
var WINNER_HOME = 100,
  DRAW = 101,
  WINNER_AWAY = 102,
  FAIR_FOR_ALL = 200,
  ONE_ON_ONE = 201,
  TWO_ON_TWO = 202,
  KO_ROUND = 203,
  GOALIE = 1,
  STRIKER = 2,
  BOTH = 4,
  PRO = 8,
  AMATEUR = 16;

(function () {
  'use strict';
  
  angular.module('kickertool', [
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'dialogs.main',
    'angular-loading-bar',
    'kDirectives',
    'kUpdateService',
    'kStartController',
    'kInsertController'
    ])
  
  .factory('Tourment', function () {
    return new Tourment();
  })
  
  
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'templates/start.html',
      controller: 'StartController'
    })
    .when('/insert', {
      templateUrl: 'templates/insert.html',
      controller: 'InsertController'
    });
  });
  
})();