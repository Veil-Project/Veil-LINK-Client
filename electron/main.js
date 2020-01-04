const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 720,
    titleBarStyle: 'hiddenInset',
    backgroundColor: "#121416",
    webPreferences: {
      // contextIsolation: true,
      webSecurity: false,
      scrollBounce: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', function() {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

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

app.on('web-contents-created', (event, contents) => {
  // contents.on('will-navigate', (event, navigationUrl) => {
  //   const parsedUrl = new URL(navigationUrl)
// 
  //   if (parsedUrl.origin !== 'https://example.com') {
  //     event.preventDefault()
  //   }
  // })
});

app.on('web-contents-created', (event, contents) => {
  // contents.on('new-window', async (event, navigationUrl) => {
  //   // In this example, we'll ask the operating system
  //   // to open this event's url in the default browser.
  //   event.preventDefault()
// 
  //   await shell.openExternal(navigationUrl)
  // })
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
