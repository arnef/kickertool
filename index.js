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

  // check for new version
  /*request.get('http://arnefeil.de/kickertool/test/package.json', function(err, req, data) {
    // error getting info -> start app
    if (err || req.statusCode != 200) {
      startMainApp();
      return;
    }
    data = JSON.parse(data);
    if (semver.gt(data.version, pkg.version)) {
      dialog.showMessageBox(null, {
        title: 'neue version',
        message: 'Version ' + data.version,
        buttons: ['Nein', 'Ja, jetzt downloaden und installieren!']
      }, function(result) {
        if (result == 0)
          startMainApp();
        else
          startUpdater(data.update.url);
        return;
      });
    } else {
      startMainApp();
      return;
    }
  })*/
});

app.on('window-all-closed', function () {
  // quit app if window is closed
  app.quit();
})
