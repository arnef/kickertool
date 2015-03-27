(function() {
    var app = angular.module('kko', []);
    
    app.controller('KORundeController', function(DataService) {
        var _self = this;
        _self.ranking = DataService.ranking;
    });
})();
