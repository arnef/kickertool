(function() {
    var app = angular.module('kdata', []);
    
    app.service('DataService', function() {
        var _self = this;
        _self.player = [];
        
        _self.teams = [];
        
        _self.ranking = [];
    });
})();
