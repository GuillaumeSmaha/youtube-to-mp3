const {app, BrowserWindow, Menu} = require('electron');
const isDevMode = require('electron-is-dev');
const path = require('path');
const audioQualities = require('./audio.qualities');

if (isDevMode) {
  require('electron-reload')(__dirname + '/public');
}

let mainWindow;

function createWindow() {
  const browserOptions = {
    width: 800,
    height: 600,
    maximizeable: false,
    icon: path.join(__dirname, '/logo.png')
  };

  mainWindow = new BrowserWindow(browserOptions);
  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  templateBiterateQualities = [];
  for (var bitRate in audioQualities) {
    templateBiterateQualities.push({label: audioQualities[bitRate].label, click: (function(bitRate){return () => {mainWindow.webContents.send('changeBitrate', bitRate)}})(audioQualities[bitRate].bitRate)});
  }
  templateBiterateQualities = templateBiterateQualities.reverse();

  let template = [{
    label: 'YouTube To MP3',
    submenu: [
      {label: 'About Application', selector: 'orderFrontStandardAboutPanel:'},
      {type: 'separator'},
      {
        label: 'Quit', accelerator: 'Command+Q', click: function () {
          app.quit();
        }
      }
    ]
  }, {
    label: 'Edit',
    submenu: [
      {label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:'},
      {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:'},
      {type: 'separator'},
      {label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:'},
      {label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:'},
      {label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:'}
    ]
  }, {
    label: 'Preferences',
    submenu: [{
        label: 'Download Folder',
        click: () => {
          mainWindow.webContents.send('promptForChangeDownloadFolder');
        }
      },
      {
        label: 'Changer le Bitrate',
        submenu: templateBiterateQualities
      }
    ]
  }
  ];

  // If developing add dev menu option to menu bar
  // if (isDevMode) {
    template.push({
      label: 'Dev Options',
      submenu: [
        {
          label: 'Open Dev Tools', click: () => {
            mainWindow.webContents.openDevTools()
          }
        }
      ]
    });
  // }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
