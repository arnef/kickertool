module.exports = function (pkg) {
  var self,
    BrowserWindow,
    Menu,
    dialog,
    updatePkg,
    request,
    semver,
    fs,
    os,
    ui;

  self = this;
  BrowserWindow = require('browser-window');
  Menu = require('electron').Menu;
  dialog = require('dialog');
  request = require('request');
  semver = require('semver');
  fs = require('original-fs');
  os = require('fs');

  function initUI() {
    ui = new BrowserWindow({
      title: 'Updater',
      width: 300,
      height: 100,
      useContentSize: true
    });
    ui.setMenu(null);
    ui.loadURL('file://' + __dirname + '/updater.html');
    ui.show();
    console.log('start updater');
  }

  self.init = function () {
    initUI();
    self.checkNewVersion(function (isUpdate) {
      if (isUpdate) {
        ui.webContents.executeJavaScript(
          "document.getElementById('message').innerHTML = 'Update verfügbar';"
          +"document.getElementById('dlbtn').style.display = 'block';"
        );
      } else {
        ui.webContents.executeJavaScript(
          "document.getElementById('message').innerHTML = 'Kickertool ist auf dem neusten Stand';"
        )
      }
    });
    /*ui.on('dom-ready', function () {
      console.log('dom ready');
      self.checkNewVersion(function (newVersion) {
        if (newVersion) {
          ui.webContents.send('message', 'Neue Version verfügbar');
          /*var result = dialog.showMessageBox(ui, {
            title: 'Update verfügbar',
            message: 'Eine neue Version vom Kickertool ist verfügbar',
            buttons: ['Abbrechen', 'Jetzt downloaden und installieren']
          });
          if (result === 1) {
            self.download(function (result) {
              console.log(result);
            });
          }
        }
    });
  });*/
  };

  self.checkNewVersion = function (callback) {
    if (!pkg.version || !pkg.update.pkg) {
      return callback(false);
    }

    request.get(pkg.update.pkg, function (err, req, data) {
      if (err || req.statusCode != 200) {
        return callback(false);
      }
      try {
        updatePkg = JSON.parse(data);
        return callback(
          (semver.gt(updatePkg.version, pkg.version) && updatePkg.update != null && updatePkg.update.url != null)
        );
      } catch (e) {
        console.log(e);
        return callback(false);
      }
    });
  };

  self.download = function (callback) {
    updatePkg = request(updatePkg.update.url, function (err, res) {
      if (err || res.statusCode != 200)
        return callback(err);
    });

    updatePkg.on('response', function (res) {
      if (!(res && res.headers && res.headers['content-length']))
        return callback(false);
      updatePkg.length = res.headers['content-length'];

    });

    var loaded = 0;
    var progress = 0;
    updatePkg.on('data', function (chunk) {
      loaded += chunk.length;
      var newProgress = Math.floor(loaded / updatePkg.length * 100);
      if (newProgress - progress > 0) {
        console.log(newProgress);
        ui.webContents.send('update', newProgress);
      }

      progress = newProgress;
      //progress(loaded / updatePkg.length);
    });
  };

  return self;
};

/**
 * check if a new version is available
 * @param  {object} manifest    package.json JSON.parsed
 * @param  {String} manifestUrl url to new package.json
 * @return {boolean}            version of manifestUrl is newer

module.exports.newVersion = function (manifest, manifestUrl, callback) {
  pkg = manifest;
  console.log('Check for new version');
  request.get(manifestUrl, function (err, req, data) {
    if (err || req.statusCode != 200) {
      callback(false);
    } else {
      updatePkg = JSON.parse(data);
      callback(
        (semver.gt(updatePkg.version, pkg.version) &&
        updatePkg.update &&
        updatePkg.update.url)
      );
    }
  });

};

/*
module.exports.download = function (callback) {
  var appWindow = new BrowserWindow({
    width: 300,
    height: 48,
    title: 'Download Update',
    center: true,
    icon: '../icon.png'
  });

  appWindow.loadURL('file://' + __dirname + '/updater.html');
  appWindow.webContents.send('update', 0);

  var dlPkg = request(updatePkg.update.url, function (err, res) {
    if (err || res.statusCode != 200) //TODO error feedback
      callback(err);
  });

  dlPkg.on('response', function (res) {
    if (res && res.headers && res.headers['content-length'])
      dlPkg['content-length'] = res.headers['content-length'];
  });

  // send update progress to app window
  var loaded = 0;
  dlPkg.on('data', function (chunk) {
    loaded += chunk.length;
    var progress = loaded / dlPkg['content-length'];
    appWindow.webContents.send('update', Math.round(progress * 100));
    appWindow.setProgressBar(progress);
  });

  // save download to tmp folder
  var destinationPath = os.tmpDir() + '/app.asar';
  fs.unlink(destinationPath, function () {
    dlPkg.pipe(fs.createWriteStream(destinationPath));
    dlPkg.resume();
  });

  // copy update when download done
  dlPkg.on('complete', function () {
    if (loaded !== parseInt(dlPkg['content-length'], 10)) {
      //TODO error feedback
      appWindow.close();
      callback();
      return;
    } else {
      console.log('cp app.asar file');
      appWindow.setTitle('Entpacke Update');
      var appRunningPath = process.resourcesPath + '/app.asar';
      var appAsarFile = fs.createWriteStream(appRunningPath);
      var updateAsarFile = fs.createReadStream(destinationPath);

      updateAsarFile.pipe(appAsarFile);
      updateAsarFile.on('end', function () {
        appWindow.close();
        callback();
      });
    }

  });

  appWindow.on('close', function () {
    if (dlPkg) dlPkg.abort();
    return;
  });
};

module.exports.dialog = function () {
  return dialog.showMessageBox(null, {
    title: 'Kickertool Updater',
    message: 'Eine neue Version ' + updatePkg.version + ' ist verfügbar!',
    buttons: ['Kickertool starten', 'Jetzt downloaden und installieren']
  });
}
*/
