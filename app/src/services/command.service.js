'use strict';

angular.module('app')
  .factory('Command', function ($rootScope) {
    var ipc;

    ipc = require('electron').ipcRenderer;

    function on(event, callback) {
      ipc.on(event, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(ipc, args);
        });
      });
    }

    return {
      on: on
    };
  });
