var app,
  dialog,
  BrowserWindow,
  nativeImage,
  updater;

app = require('app');
dialog = require('electron').dialog;
nativeImage = require('electron').nativeImage;
BrowserWindow = require('browser-window');
updater = require('../updater')(require('../package.json'));

module.exports = [{
  label: 'Kickertool',
  submenu: [{
    label: 'Über ' + app.getName(),
    click: function () {
      var icon = nativeImage.createFromPath('icon.png');
      console.log(icon.isEmpty());
      dialog.showMessageBox(null, {
        title: 'Über ' + app.getName(),
        message: app.getName() + '\nv ' + app.getVersion(),
        buttons: ['Ok'],
        icon: icon
      });
    },
  }, {
    type: 'separator'
  }, {
    label: 'Nach Updates suchen',
    click: function (item, focusedWindow) {
      updater.init();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Beenden',
    accelerator: 'CmdOrCtrl+Q',
    click: function () {
      app.quit();
    }
  }]
}, {
  label: 'Turnier',
  submenu: [{
    label: 'Übersicht',
    click: function (item, focusedWindow) {
      focusedWindow.webContents.send('path', 'tournament');
      focusedWindow.webContents.send('setTab', 0);
    }
  }, {
    label: 'Gespielte Begegnungen',
    click: function (item, focusedWindow) {
      focusedWindow.webContents.send('setTab', 2);
    }
  }, {
    type: 'separator'
  }, {
    label: 'Letzte Vorrunde starten',
    click: function (item, focusedWindow) {
      focusedWindow.webContents.send('tournament', 'lastRound');
    }
  }, {
    label: 'K.O. Runde starten',
    click: function (item, focusedWindow) {

    }
  }, {
    label: 'Einstellungen',
    click: function (item, focusedWindow) {
      focusedWindow.webContents.send('path', '/');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Neues Turnier starten',
    click: function (item, focusedWindow) {
      focusedWindow.webContents.send('tournament', 'new');
    }
  }]
}, {
  label: 'Teilnehmer',
  submenu: [{
    label: 'Teilnehmer bearbeiten',
    click: function (item, focusedWindow) {
      focusedWindow.webContents.send('path', '/insert');
    }
  }]
}, {
  label: 'Dev',
  submenu: [{
    label: 'Reload View',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.reload();
    }
  }, {
    label: 'Toggle Dev Tools',
    accelerator: (function () {
      if (process.platform == 'darwin')
        return 'Alt+Command+I';
      else
        return 'Ctrl+Shift+I';
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.toggleDevTools();
    }
  }]
}];
