/**
 * electron start script for the main app
 */
var BrowserWindow, Menu, ipc, dialog;

BrowserWindow = require('browser-window');
Menu = require('electron').Menu;
ipc = require('electron').ipcMain;
dialog = require('dialog');

module.exports.app = function() {
  var appWindow, template, menu;

  appWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    title: 'Kickertool',
    icon: 'icon.png',
    center: true
  });

  require('electron').appWindow = appWindow;
  appWindow.loadURL('file://' + __dirname + '/index.html');
  //appWindow.openDevTools();
  template = require('./menu.js');
  menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
  ipc.on('dialog', function(event, arg) {
    event.returnValue = dialog.showMessageBox(appWindow, arg);
  });
};
