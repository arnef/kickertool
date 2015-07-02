/**
* Consts
**/
var WINNER_HOME = 100,
  DRAW = 101,
  WINNER_AWAY = 102,
  FAIR_FOR_ALL = 201,
  ONE_ON_ONE = 202,
  TWO_ON_TWO = 203,
  KO_ROUND = 204,
  GOALIE = 1,
  STRIKER = 2,
  BOTH = 4,
  PRO = 8,
  AMATEUR = 16;

(function () {
    'use strict';
    
    var app = angular.module('kickertool', [
        'ngRoute', 'ngSanitize', 'ui.bootstrap', 'dialogs.main', 'angular-loading-bar',
      'kUpdateService',
        'controller-dyp',
        'controller-1on1',
        'controller-2on2',
        'controller-turnier',
        'controller-start'
    ]);
    
    
    /**
    * shared model tourment
    **/
    app.factory('Tourment', function () {
        return new Tourment();
    });
    
    
   
    /**
    * app routes
    **/
    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/start.html',
                controller: 'StartController'
            })
            .when('/player', {
                templateUrl: 'templates/dyp.html',
                controller: 'DypController'
            })
            .when('/1on1', {
                templateUrl: 'templates/1on1.html',
                controller: '1on1Controller'
            })
            .when('/2on2', {
                templateUrl: 'templates/2on2.html',
                controller: '2on2Controller'
            })
            .when('/turnier', {
                templateUrl: 'templates/turnier.html',
                controller: 'TurnierController',
                controllerAs: 'turnierCtrl'
            });
    });

    
    /**
    * full height scroll container
    **/
    app.directive('scrolltable', function ($window) {
        var resize = function (element, attrs) {
          var diff = 80+10+52;
          
          if (attrs.fullheight == "true") {
            console.log("Full");
            diff = 80+20;
          }
          
            var winHeight = $window.innerHeight;
          
            element.css("height", (winHeight - diff) + "px");
            element.css("overflow-x", "hidden");
            element.css("overflow-y", "auto");
        };
        
        return function (scope, element, attrs) {
          
          
          resize(element, attrs);
          angular.element($window).bind('resize', function (e) {
                resize(element, attrs);
            });
        };
    });
  
  app.directive('insertPlayer', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/insert_player.html'
    };
  });
  
  app.directive('insertTeam', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/insert_team.html'
    };
  });
  
  app.run(['$templateCache', function ($templateCache) {
    var modalTmpl = function (head, directive) {
      return '<form ng-submit="add()"><div class="modal-header">' +
        '<h4 class="modal-title">' + head + '</h4>' +
        '</div><div class="modal-body">' +
        '<' + directive + '></' + directive + '>' +
        '<p class="alert alert-danger" ng-show="err">{{ err }}</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="submit" class="btn btn-default">Hinzufügen</button>' +
        '<button type="button" class="btn btn-primary" ng-click="cancel()">Abbrechen</button>' +
        '</div></form>';
    };
    $templateCache.put('/dialog/insert-player.html', modalTmpl('Spieler eintragen', 'insert-player'));
    $templateCache.put('/dialog/insert-team.html', modalTmpl('Team eintragen', 'insert-team'));
  }]);
})();
