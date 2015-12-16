'use strict';

angular.module('app')
  .factory('Dialog', ['$rootScope', '$q', '$uibModal', function ($rootScope, $q, $uibModal) {
    var ipc = require('electron').ipcRenderer;

    /**
     * alert dialog
     * @param  {object} content { tite: title of the dialig,
     *                          	body: message of the }
     * @return {$promise}         $promise with blank resolve
     */
    function alertElectron(content) {
      var deferred = $q.defer();
      // return dialog.showMessageBox(appWindow, {
      //   title: content.title,
      //   type: 'info',
      //   message: content.body,
      //   buttons: ['Ok'],
      // });
      ipc.sendSync('dialog', {
        title: content.title,
        type: 'info',
        message: content.body,
        buttons: ['Ok']
      });
      ipc.on('dialog', function (event, arg) {
        deferred.resolve(arg);
      });
      return deferred.promise;
    }

    /**
     * confirm dialog
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    function confirmElectron(content) {
      var deferred = $q.defer();
      // deferred.resolve(dialog.showMessageBox(appWindow, {
      //   type: 'question',
      //   title: content.title,
      //   message: content.body,
      //   buttons: [content.cancel, content.confirm]
      // }));
      deferred.resolve(ipc.sendSync('dialog', {
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
