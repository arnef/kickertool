(function() {
    var app = angular.module('kdata', []);
    
    app.service('DataService', function() {
        var _self = this;
        
        _self.tables = null;
        
        _self.player = [];
        
        _self.teams = [];
        
        _self.ranking = null;
    });
})();
