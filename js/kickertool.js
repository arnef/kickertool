(function() {
    "use strict";
    var app = angular.module('kickertool', [
        'ngRoute', 'ngSanitize', 'ui.bootstrap', 'dialogs.main',
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
                templateUrl: 'templates/insertplayer.html',
                controller: 'InsertPlayerController'
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

    app.directive('scrolltable', function($window) {
        var resize = function(element) {
            var winHeight = $window.innerHeight;
            var diff = 120;
                element.css("max-height", (winHeight - diff) + "px");
                element.css("overflow-x", "hidden");
                element.css("overflow-y", "auto");
                
        };
        
        return function(scope, element, attrs) {
            resize(element);
            angular.element($window).bind('resize', function(e) {
                resize(element);
             });
        }
    });
})();
