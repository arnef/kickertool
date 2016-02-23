var app,
  kickertool,
  updater,
  exec;

app = require('app');
kickertool = require('./app/app.js');
updater = require('./updater');
exec = require('child_process').exec;

app.on('ready', function() {
  kickertool.app();
});

app.on('window-all-closed', function () {
  // quit app if window is closed
  app.quit();
});
