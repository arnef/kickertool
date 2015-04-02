(function () {
    var app = angular.module('kturnier', []);
    
    app.controller('TurnierController', function($scope, $filter, $location, dialogs, Tourment) {
        var _self = this;
        var _currentTab = 0;
        _self.selectedMatch = null;
        
        $scope.getRanking = function() {
            return Tourment.getRanking();
        };
        
        $scope.isTab = function(tab) {
            return _currentTab == tab;
        }
        
        $scope.setTab = function(tab) {
            _currentTab = tab;
            if (tab == 1) {
                $scope.startKORound();
            }
        }
        
        $scope.getCurrentMatches = function() {
            return Tourment.getCurrentMatches();
        };
        
        $scope.getNextMatches = function() {
            return Tourment.getNextMatches();
        };
        
        $scope.getPlayedMatches = function() {
            return Tourment.getPlayedMatches();
        }
        
        
        $scope.insertScore = function(tableIdx) {
            if (Tourment.getCurrentMatches()[tableIdx] != null) {
                var match = Tourment.getCurrentMatches()[tableIdx];
                var dlg = dialogs.create('templates/result_dialog.html', 'InsertResultDialogController', match, {size: 'sm'});
                dlg.result.then(function(score) {
                    Tourment.setWinnerOnTable(tableIdx, score);
                });
            }
        };
        
        
        $scope.startKORound = function() {
            Tourment.setModus(new KORound());
        };
    });
    
    app.controller('InsertResultDialogController', function($scope, $modalInstance, data) {
        
        $scope.match = data;
        
        $scope.saveResult = function(index) {
            $modalInstance.close(index);
        };
        
        $scope.cancel = function(){
			$modalInstance.dismiss('Canceled');
		};
        
    });
})();
