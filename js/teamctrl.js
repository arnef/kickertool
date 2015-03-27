(function () {
    var app = angular.module('kteams', []);
    
    app.controller('TeamController', function(DataService) {
        var _self = this;
        
        _self.teams = DataService.teams;
        
        
        _self.loesche = function() {
            _self.teams.length = 0;
            DataService.clearTeams();
        }
    });
})();
