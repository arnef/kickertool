var app = require('app');
var Window = require('browser-window');

app.on('ready', function () {
  var mainWindow = new Window({
    width: 1100,
    height: 600,
    title: 'Kickertool',
    frame: false,
    icon: 'icon.png',
    center: true
  });
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});
