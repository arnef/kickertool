var app, BrowserWindow, Menu, dialog, pkg, request, semver, fs, os;

app = require('app');
BrowserWindow = require('browser-window');
Menu = require('menu');
pkg = require('./package.json');
dialog = require('electron').dialog;
request = require('request');
semver = require('semver');
fs = require('original-fs');
os = require('os');
function startMainApp() {
  var mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    title: 'Kickertool',
    frame: true,
    icon: 'icon.png',
    center: true
  });
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
  if (process.argv[2] == '--debug') {
    mainWindow.openDevTools();
  } else {
    Menu.setApplicationMenu(null);
  }
}

function startUpdater(url) {
  var updateWindow = new BrowserWindow({
    width: 300,
    height: 24,
    title: 'Download Update',
    center: true,
    icon: 'icon.png'
  });
  Menu.setApplicationMenu(null);
  updateWindow.loadURL('file://' + __dirname + '/updater.html');
  updateWindow.webContents.send('update', 0);
  //return;
  var dlpkg = request(url, function (err, res) {
    //TODO error handling
  });
  dlpkg.on('response', function (res) {
    if (res && res.headers && res.headers['content-length'])
      dlpkg['content-length'] = res.headers['content-length'];
  });
  var loaded = 0;
  dlpkg.on('data', function (chunk) {
    loaded +=chunk.length;
    //console.log('Downloaded: ' + Math.floor(loaded / dlpkg['content-length'] * 100) + '%');
    var progress = Math.floor(loaded / dlpkg['content-length'] * 100);
    updateWindow.webContents.send('update', progress);
    updateWindow.setTitle('Download Update ('+progress+'%)')
  });
  var destPath = os.tmpDir() + '/app.asar';
  fs.unlink(destPath, function () {
    dlpkg.pipe(fs.createWriteStream(destPath));
    dlpkg.resume();
  });
  dlpkg.on('end', function () { // update downloaded
    console.log('update done');
    updateWindow.setTitle('Entpacke Update');
  });
}

app.on('ready', function () {

  // check for new version
  request.get('http://arnefeil.de/kickertool/test/package.json', function (err, req, data) {
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
      }, function (result) {
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
  })
});
