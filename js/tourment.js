(function() {
    var app = angular.module('kdata', []);
    
    app.factory('Tourment', function() {
        return new FairForAllDyp();
    });
})();
