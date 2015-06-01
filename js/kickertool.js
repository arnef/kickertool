(function() {
    "use strict";
    var app = angular.module('kickertool', [
        'ngRoute', 'ngSanitize', 'ui.bootstrap', 'dialogs.main',
        'kteaminput', 'controller-1on1', 'controller-2on2',
        'kturnier', 'kstart'
    ]);
    
    app.factory('Tourment', function() {
        return new Tourment();
    });

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

    app.directive('scrolltable', function($window) {
        var resize = function(element) {
            var winHeight = $window.innerHeight;
            var diff = 90;
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
