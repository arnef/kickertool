(function () {
    'use strict';
    
    var app = angular.module('kickertool', [
        'ngRoute', 'ngSanitize', 'ui.bootstrap', 'dialogs.main',
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
        var resize = function (element) {
            var winHeight = $window.innerHeight,
                diff = 80 + 10 + 52;
            element.css("height", (winHeight - diff) + "px");
            element.css("overflow-x", "hidden");
            element.css("overflow-y", "auto");
        };
        
        return function (scope, element, attrs) {
            resize(element);
            angular.element($window).bind('resize', function (e) {
                resize(element);
            });
        };
    });
    app.directive('scrolltableFull', function ($window) {
        var resize = function (element) {
            var winHeight = $window.innerHeight,
                diff = 80 + 20;
            element.css("height", (winHeight - diff) + "px");
            element.css("overflow-x", "hidden");
            element.css("overflow-y", "auto");
        };
        
        return function (scope, element, attrs) {
            resize(element);
            angular.element($window).bind('resize', function (e) {
                resize(element);
            });
        };
    });
    
})();
