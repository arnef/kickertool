/**
 * electron start script for the main app
 */
var BrowserWindow;

BrowserWindow = require('browser-window');

module.exports.app = function() {
  var appWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    title: 'Kickertool',
    icon: '../icon.png',
    center: true
  });
  appWindow.loadURL('file://' + __dirname + '/index.html');
};
