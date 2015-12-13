/**
 * updater app for kickertool
 */
var BrowserWindow,
  dialog,
  pkg,
  updatePkg,
  request,
  semver,
  fs,
  os;

BrowserWindow = require('browser-window');
request = require('request');
dialog = require('electron').dialog;
fs = require('original-fs');
os = require('os');
semver = require('semver');

/**
 * check if a new version is available
 * @param  {object} manifest    package.json JSON.parsed
 * @param  {String} manifestUrl url to new package.json
 * @return {boolean}            version of manifestUrl is newer
 */
module.exports.newVersion = function (manifest, manifestUrl, callback) {
  pkg = manifest;
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
    appWindow.webContents.send('update', Math.floor(loaded / dlPkg['content-length'] * 100));
  });

  // save download to tmp folder
  var destinationPath = os.tmpDir() + '/app.asar';
  fs.unlink(destinationPath, function () {
    dlPkg.pipe(fs.createWriteStream(destinationPath));
    dlPkg.resume();
  });

  // copy update when download done
  dlPkg.on('complete', function () {
    appWindow.setTitle('Entpacke Update');
    var appRunningPath = process.resourcesPath + '/app.asar';
    var appAsarFile = fs.createWriteStream(appRunningPath);
    var updateAsarFile = fs.createReadStream(destinationPath);

    updateAsarFile.pipe(appAsarFile);
    updateAsarFile.on('end', function () {
      appWindow.close();
      callback();
    });
  });
};

module.exports.dialog = function () {
  return dialog.showMessageBox(null, {
    title: 'Kickertool Updater',
    message: 'Eine neue Version ' + updatePkg.version + ' ist verfügbar!',
    buttons: ['Kickertool starten', 'Jetzt downloaden und installieren']
  });
}
