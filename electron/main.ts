import { app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import url from 'url'
import path from 'path'
import crypto from 'crypto'
import Daemon from './Daemon'
import AppWindow from './AppWindow'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      rpcUser: string
      rpcPass: string
    }
  }
}

global.rpcUser = crypto.randomBytes(256 / 8).toString('hex')
global.rpcPass = crypto.randomBytes(256 / 8).toString('hex')

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
const daemon = new Daemon({
  user: global.rpcUser,
  pass: global.rpcPass,
})

daemon.on(
  'status-change',
  (status: string, message?: string, progress?: number) => {
    mainWindow.send('daemon-status-change', status, message, progress)
  }
)

daemon.on('wallet-loaded', () => {
  mainWindow.send('app-status-change', 'wallet-loaded')
})

daemon.on('wallet-missing', () => {
  mainWindow.send('app-status-change', 'wallet-missing')
})

daemon.on('error', () => {
  mainWindow.send('app-status-change', 'daemon-error')
})

daemon.on('exit', () => {
  // mainWindow.send('daemon-status-change', 'stopped', null, null)
})

// App listeners
app.on('before-quit', e => {
  if (daemon.isStarted()) {
    e.preventDefault()
    mainWindow.send('app-status-change', 'daemon-stopping')
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
  mainWindow.send('update-available')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.send('update-downloaded')
})

// API for renderer process
ipcMain.handle('start-daemon', async (_, seed?: string) => {
  try {
    await daemon.start(seed)
  } catch (e) {
    mainWindow.send('app-status-change', 'daemon-error')
  }
})
ipcMain.handle('stop-daemon', async _ => {
  try {
    await daemon.stop()
  } catch (e) {
    mainWindow.send('app-status-change', 'daemon-error')
  }
})
