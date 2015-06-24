(function () {
    'use strict';
    
    var app = angular.module('kickertool', [
        'ngRoute', 'ngSanitize', 'ui.bootstrap', 'dialogs.main', 'angular-loading-bar',
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
    * update service
    **/
    app.service('UpdateService', function ($http) {
        var self = this;
        self.checkForUpdates = function (callback) {
            $http.get('https://raw.githubusercontent.com/arnef/kickertool/master/VERSION',
                      { cache: false })
            .success(function (current_version) {
                $http.get('VERSION', { ignoreLoadingBar: true })
                .success(function (local_version) {
                    
                    var new_available = parseInt(current_version.split('.').join(''), 10) > parseInt(local_version.split('.').join(''), 10);
                    if (new_available) {
                        var link = 'http://arnef.ddns.net/kickertool/dl/kickertool_';
                        var system = window.navigator.platform.toLowerCase().split(' ');
                        system[0] = system[0].substring(0, 3);
                                                
                        if (system[0] === 'lin') {
                            if (system[1] === 'i686') {
                                link += 'linux32.zip';
                                callback(link, current_version, local_version);
                            }
                            if (system[1] === 'x86_64') {
                                link += 'linux64.zip';
                                callback(link, current_version, local_version);
                            }
                        }
                        if (system[0] === 'win') {
                            link += 'win.zip';
                            callback(link, current_version, local_version);
                        }
                        if (system[0] === 'mac') {
                            link += 'osx.zip';
                            callback(link, current_version, local_version);
                        }
                    }
                });
            });            
        };
        
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
    /*app.directive('scrolltableFull', function ($window) {
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
    });*/
    
})();
