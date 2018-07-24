const {app, BrowserWindow, Menu} = require('electron');
const isDevMode = require('electron-is-dev');
const path = require('path');
const audioQualities = require('./audio.qualities');

if (isDevMode) {
  require('electron-reload')(__dirname + '/public');
}


// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};


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
