var app,
  kickertool,
  updater,
  exec;

app = require('app');
kickertool = require('./app/app.js');
updater = require('./updater/app.js');
exec = require('child_process').exec;

app.on('ready', function() {
  var pkg = require('./package.json');
  var url = 'http://arnefeil.de/kickertool/test/package.json';
  updater.newVersion(pkg, url, function (isNewVersion) {
    console.log(isNewVersion);
    if (isNewVersion && updater.dialog() == 1) {
      updater.download(function () {
        //kickertool.app();
        exec(process.execPath);
        app.quit();
      });
    }
    else {
      kickertool.app();
    }
  });
});

app.on('window-all-closed', function () {
  // quit app if window is closed
  app.quit();
});
