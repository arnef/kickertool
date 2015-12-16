'use strict';

angular.module('app')
  .factory('Dialog', ['$rootScope', '$q', '$uibModal', function ($rootScope, $q, $uibModal) {
    var dialog = require('electron').remote.dialog;
    var BrowserWindow = require('electron').remote.BrowserWindow;

    /**
     * alert dialog
     * @param  {object} content { tite: title of the dialig,
     *                          	body: message of the }
     * @return {$promise}         $promise with blank resolve
     */
    function alertElectron(content) {
      var deferred = $q.defer();
      deferred.resolve(dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        title: content.title,
        type: 'info',
        message: content.body,
        buttons: ['Ok'],
      }));
      return deferred.promise;
    }

    /**
     * confirm dialog
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    function confirmElectron(content) {
      var deferred = $q.defer();
      deferred.resolve(dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        type: 'question',
        title: content.title,
        message: content.body,
        buttons: [content.cancel, content.confirm]
      }));
      return deferred.promise;
    }

    return {
      alert: alertElectron,
      confirm: confirmElectron
    };
  }]);
