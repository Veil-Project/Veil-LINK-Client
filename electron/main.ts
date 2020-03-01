import { app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import url from 'url'
import path from 'path'
import Daemon from './Daemon'
import AppWindow from './AppWindow'

// Set up main window
const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true,
  })

const mainWindow = new AppWindow(startUrl)

// Set up veild daemon
const daemon = new Daemon()

daemon.on('status', (status: string) => {
  mainWindow.emit('daemon-status', status)
})

daemon.on('message', (message: string | null) => {
  mainWindow.emit('daemon-message', message)
})

daemon.on('progress', (progress: number | null) => {
  mainWindow.emit('daemon-progress', progress)
})

daemon.on('exit', () => {
  // mainWindow.emit('daemon-status', 'stopped')
})

daemon.on('wallet-loaded', () => {
  mainWindow.emit('wallet-loaded')
})

daemon.on('wallet-missing', () => {
  mainWindow.emit('wallet-missing')
})

// App listeners
app.on('before-quit', e => {
  if (daemon.running) {
    e.preventDefault()
    mainWindow.emit('app-quitting')
    const stopAndQuit = async () => {
      await daemon.stop()
      app.quit()
    }
    stopAndQuit()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', e => {
  mainWindow.open()
  autoUpdater.checkForUpdatesAndNotify()
})

app.on('activate', e => {
  if (!mainWindow.isOpen()) {
    mainWindow.open()
  }
})

// Auto-update listeners
autoUpdater.on('update-available', () => {
  mainWindow.emit('update-available')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.emit('update-downloaded')
})

// API for renderer process
ipcMain.handle('start-daemon', async (_, options = {}) => {
  await daemon.start(options)
})
ipcMain.handle('stop-daemon', async _ => {
  await daemon.stop()
})
