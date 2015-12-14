/**
 * electron start script for the main app
 */
var BrowserWindow, Menu;

BrowserWindow = require('browser-window');
Menu = require('electron').Menu;
module.exports.app = function() {
  var appWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    title: 'Kickertool',
    icon: 'icon.png',
    center: true
  });
  appWindow.loadURL('file://' + __dirname + '/index.html');
  appWindow.openDevTools();
  var template = require('./menu.js');
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

};
