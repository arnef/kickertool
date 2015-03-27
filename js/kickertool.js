(function () {
    var app = angular.module('kickertool', ['ngRoute', 'kdata', 'kteaminput', 'kteams', 'kturnier']);
    
    app.config(function($routeProvider) {
        $routeProvider.when('/player', {
            templateUrl: 'templates/players.html',
            controller: 'TeamInputController',
            controllerAs: 'teamCtrl'
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
