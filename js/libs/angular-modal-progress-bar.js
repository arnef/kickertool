
angular.module('500tech.modal-progress-bar', [])
  .service('Loader', ['$interval', function($interval) {
    var _this = this;

    return {
      states: {},
      loading: { progress: 0, phrase: '' },

      progressStart: function(duration) {
        _this.progressInterval = $interval(function() {
          if (_this.loading.progress < 100) {
            _this.loading.progress += 1;
          }
        }, duration)
      },

      phraseProgressStart: function(duration) {
        var phraseCount = 1;
        _this.phraseInterval = $interval(function() {
          if (phraseCount < _this.phrases.length) {
            _this.loading.phrase = '' + _this.phrases[phraseCount] + '...';
            phraseCount += 1;
          }
        }, duration)
      },

      start: function(state) {
        if (Object.keys(this.states).indexOf(state) != -1) {
          console.log('State ' + state + ' was not found in loader states');
          console.log('Declared loader states are: ' + this.states);
          return
        }
        this.phrases = this.states[state].phrases;
        this.loading.progress = 0;
        this.loading.phrase = this.phrases[0];
        this.progressStart(this.states[state].duration * 10);
        this.phraseProgressStart(this.states[state].duration / (this.phrases.length - 0.5) * 1000);
      },

      end: function() {
        this.loading.progress = 0;
        this.loading.phrase = '';
        $interval.cancel(this.progressInterval);
        $interval.cancel(this.phraseInterval);
      }
    }
  }])

 .directive('progressModal', function() {
    return {
      restrict: 'E',
      scope: {},
      controller: function($scope, Loader) {
        $scope.loading = Loader.loading;
      },
      template: "<div class=\"loader\" ng-show=\"loading.progress\">\n" +
                  "<div class=\"backdrop\"></div>\n" +
                  "<div class=\"loader-box\">\n" +
                    "<div class=\"phrase\">{{ loading.phrase }}</div>\n" +
                      "<div class=\"progress-bar\">\n" +
                      "<div class=\"progress\" style=\"width: {{ loading.progress }}%\"></div>\n" +
                    "</div>\n" +
                  "</div>\n" +
                "</div>\n"
    }
  });
