import { app, dialog, ipcMain, shell } from 'electron'
import url from 'url'
import path from 'path'
import fs from 'fs'
import Daemon, { DaemonOptions } from './Daemon'
import AppWindow from './AppWindow'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

autoUpdater.autoDownload = false
log.transports.file.level = 'debug'
autoUpdater.logger = log
log.info('App starting...')

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

daemon.on('transaction', (txid: string, event: string) => {
  mainWindow.emit('daemon-transaction', txid, event)
})

daemon.on('download-progress', (state: any) => {
  mainWindow.emit('daemon-download-progress', state)
})

daemon.on(
  'warmup',
  (status: { message: string | null; progress: number | null }) => {
    mainWindow.emit('daemon-warmup', status)
  }
)

daemon.on('stdout', (message: string | null) => {
  mainWindow.emit('daemon-stdout', message)
})

daemon.on('stderr', (message: string | null) => {
  mainWindow.emit('daemon-stderr', message)
})

daemon.on('blockchain-tip', (tip: any) => {
  mainWindow.emit('daemon-blockchain-tip', tip)
})

daemon.on('error', (message: string) => {
  mainWindow.emit('daemon-error', message)
})

daemon.on('exit', () => {
  mainWindow.emit('daemon-exit')
})

// App listeners
app.on('before-quit', e => {
  if (daemon.isRunning) {
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
})

app.on('activate', e => {
  if (!mainWindow.isOpen()) {
    mainWindow.open()
  }
})

// API for renderer process
ipcMain.handle('show-open-dialog', (_, options: any) => {
  if (mainWindow.window === null) return
  return dialog.showOpenDialogSync(mainWindow.window, options)
})
ipcMain.handle('show-save-dialog', (_, options: any) => {
  if (mainWindow.window === null) return
  return dialog.showSaveDialogSync(mainWindow.window, options)
})
ipcMain.handle('open-external-link', (_, url: string) => {
  shell.openExternal(url)
})
ipcMain.handle('relaunch', () => {
  app.relaunch()
  app.quit()
})

// Daemon API for renderer
ipcMain.handle('set-daemon-path', (_, path: string | null) => {
  daemon.path = path
})
ipcMain.handle('get-daemon-info', _ => {
  return daemon.getInfo()
})
ipcMain.handle('download-daemon', async (_, url: string) => {
  return await daemon.download(url)
})
ipcMain.handle('start-daemon', async (_, options: DaemonOptions) => {
  return await daemon.start(options)
})
ipcMain.handle('stop-daemon', async _ => {
  return await daemon.stop()
})
ipcMain.handle('read-daemon-config', (_, datadir: string) => {
  try {
    return fs.readFileSync(`${datadir}/veil.conf`)
  } catch (e) {
    return null
  }
})
ipcMain.handle('write-daemon-config', (_, datadir: string, content: string) => {
  try {
    fs.writeFileSync(`${datadir}/veil.conf`, content, 'utf-8')
    return true
  } catch (e) {
    return false
  }
})

// Updater API
ipcMain.handle('check-for-updates', _ => {
  autoUpdater.checkForUpdates()
})

ipcMain.handle('download-update', _ => {
  autoUpdater.downloadUpdate()
})

ipcMain.handle('install-update', _ => {
  autoUpdater.quitAndInstall()
})

autoUpdater.on('error', error => {
  mainWindow.emit('update-error', error.stack)
})

autoUpdater.on('update-available', info => {
  mainWindow.emit('update-available', info)
})

autoUpdater.on('update-not-available', () => {
  mainWindow.emit('update-not-available')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.emit('update-downloaded')
})

autoUpdater.on('download-progress', progress => {
  mainWindow.emit('update-download-progress', progress)
})
