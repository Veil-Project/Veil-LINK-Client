import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

let updater: any
autoUpdater.autoDownload = false
log.transports.file.level = 'debug'
autoUpdater.logger = log
log.info('App starting...')

autoUpdater.on('error', error => {
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  )
})

autoUpdater.on('update-available', async info => {
  const { response: buttonIndex } = await dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: `Version ${info.version} is available. Do you want update now?`,
    defaultId: 0,
    buttons: ['Update now', 'Later'],
  })

  if (buttonIndex === 0) {
    autoUpdater.downloadUpdate()
  } else {
    updater.enabled = true
    updater = null
  }
})

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.',
  })
  updater.enabled = true
  updater = null
})

autoUpdater.on('update-downloaded', async () => {
  await dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...',
  })
  autoUpdater.quitAndInstall()
})

// export this to MenuItem click callback
// export function checkForUpdates(menuItem: any, focusedWindow: any, event: any) {
//   updater = menuItem
//   updater.enabled = false
//   autoUpdater.checkForUpdates()
// }

// export this to MenuItem click callback
export function checkForUpdates() {
  autoUpdater.checkForUpdates()
}
