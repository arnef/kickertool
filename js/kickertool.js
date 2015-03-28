(function() {
    "use strict";
    var app = angular.module('kickertool', [
        'ngRoute','ngSanitize', 'ui.bootstrap', 'dialogs.main',
        'kdata', 'kteaminput', 
        'kteams', 'kturnier', 'kko', 'kstart'
    ]);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/start.html',
                controller: 'StartController'
            })
            .when('/player', {
                templateUrl: 'templates/fair-dyp.html',
                controller: 'TeamInputController'
            })
            .when('/teams', {
                templateUrl: 'templates/teams.html',
                controller: 'TeamController',
                controllerAs: 'teamCtrl'
            })
            .when('/turnier', {
                templateUrl: 'templates/turnier.html',
                controller: 'TurnierController',
                controllerAs: 'turnierCtrl'
            })
            .when('/ko', {
                templateUrl: 'templates/ko.html',
                controller: 'KORundeController',
                controllerAs: 'koCtrl'
            });
    });
})();
