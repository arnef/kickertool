module.exports = function (pkg) {
  var self,
    BrowserWindow,
    app,
    Menu,
    dialog,
    ipc,
    updatePkg,
    request,
    semver,
    fs,
    os,
    ui,
    exec,
    downloading;

  self = this;
  BrowserWindow = require('browser-window');
  app = require('app');
  Menu = require('electron').Menu;
  dialog = require('dialog');
  request = require('request');
  semver = require('semver');
  fs = require('original-fs');
  os = require('os');
  ipc = require('electron').ipcMain;
  exec = require('child_process').exec;

  function initUI() {
    var height = os.platform() == 'darwin' ? 95 : 80;
    ui = new BrowserWindow({
      title: app.getName() + ' Updater',
      width: 300,
      height: height,
      maxWidth: 300,
      maxHeihgt: 90,
      useContentSize: true,
      resizable: false,
      alwaysOnTop: true
    });

    ui.setMenu(null);
    ui.loadURL('file://' + __dirname + '/updater.html');
    ui.show();
  }

  self.init = function () {
    initUI();
    ipc.on('window', function (event, arg) {
      if (arg == 'ready') {
        console.log('window ready');
        self.checkNewVersion(function (isUpdate) {
          if (isUpdate) {
            ui.webContents.send('message', 'Eine neue Version ist verfügbar');
            ui.webContents.send('button', [{
              id: 'cancel',
              show: true,
              title: 'Abbrechen'
            }, {
              id: 'download',
              show: true
            }]);
          } else {
            ui.webContents.send('message', 'Die Software ist auf dem neusten Stand');
            ui.webContents.send('button', ['cancel']);
          }
        });
      }
      if (arg == 'restart') {
        // multi ipc sending no idea why?!?
        if (downloading) {
          exec(process.execPath);
          app.quit();
          downloading = false;
        }
      }
    });
    ipc.on('download', function (event, arg) {
      if (!downloading) {
          self.download();
          downloading = true;
      }
    });
    ui.on('close', function () {
      downloading = false;
      if (updatePkg && updatePkg.abort) {
        updatePkg.abort();
      }
    });
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

    var destinationPath = os.tmpDir() + '/app.asar';
    fs.unlink(destinationPath, function () {
      updatePkg.pipe(fs.createWriteStream(destinationPath));
      updatePkg.resume();
    });

    updatePkg.on('response', function (res) {
      if (!(res && res.headers && res.headers['content-length']))
        return callback(false);
      updatePkg.length = res.headers['content-length'];

    });

    var loaded = 0;
    updatePkg.on('data', function (chunk) {
      loaded += chunk.length;
      ui.webContents.send('update', Math.floor(loaded / updatePkg.length * 100));
    });

    updatePkg.on('complete', function () {
      if (loaded !== parseInt(updatePkg.length, 10)) {
        ui.webContents.send('message', 'Fehler beim Download :(')
        return;
      } else {
        ui.webContents.send('message', 'Entpacke Update...');
        var appRunningPath = process.resourcesPath + '/app.asar';
        var appAsarFile = fs.createWriteStream(appRunningPath);
        var updateAsarFile = fs.createReadStream(destinationPath);

        updateAsarFile.pipe(appAsarFile);
        updateAsarFile.on('end', function () {
          ui.webContents.send('message', 'Update installiert!');
          ui.webContents.send('button', [{
            id: 'download', show: false
          }, {
            id: 'restart', show: true,
            title: app.getName() + ' neustarten'
          }])
        });
      }

    });
  };


  return self;
};
