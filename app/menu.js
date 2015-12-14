var app,
  dialog,
  BrowserWindow,
  updater;

app = require('app');
dialog = require('electron').dialog;
BrowserWindow = require('browser-window');
updater = require('../updater')(require('../package.json'));

module.exports = [{
    label: 'Kickertool',
    submenu: [{
      label: 'Über ' + app.getName(),
      click: function () {
        dialog.showMessageBox(null, {
          title: 'Über ' + app.getName(),
          message: app.getName() + '\nv ' + app.getVersion(),
          buttons: ['Ok']
        });
      }
    }, {
      label: 'Nach Updates suchen',
      click: function (item, focusedWindow) {
        updater.init();
        // updater.newVersion(require('../package.json'), 'http://arnefeil.de/kickertool/test/package.json', function (isUpdate) {
        //   if (isUpdate && updater.dialog() == 1) {
        //     updater.download();
        //   };
        // })

      }
    }, {
      label: 'Beenden',
      click: function () {
        app.quit();
      }
    }]
  }, {
    label: 'Turnier',
    submenu: [{
      label: 'Übersicht',
      click: function (item, focusedWindow) {
        focusedWindow.webContents.send('command', 'path.tournament');
      }
    }, {
      label: 'Einstellungen',
      click: function (item, focusedWindow) {
        focusedWindow.webContents.send('command', 'path./');
      }
    }, {
      type: 'separator'
    },
    {
      label: 'Neues Turnier starten',
      click: function (item, focusedWindow) {
        focusedWindow.webContents.send('command', 'cmd.newTournament');
      }
    }]
  }, {
    label: 'Teilnehmer',
    submenu: [{
      label: 'Teilnehmer bearbeiten',
      click: function (item, focusedWindow) {
        focusedWindow.webContents.send('command', 'path.insert');
      }
    }]
  }];
