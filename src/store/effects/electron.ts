export default {
  initialize(options: any) {
    const {
      onQuit,
      onUpdateNotAvailable,
      onUpdateAvailable,
      onUpdateDownloadProgress,
      onUpdateDownloaded,
      onUpdateError,
    } = options

    onQuit && window.ipcRenderer.on('app-quitting', onQuit)

    onUpdateAvailable &&
      window.ipcRenderer.on('update-available', onUpdateAvailable)
    onUpdateNotAvailable &&
      window.ipcRenderer.on('update-not-available', onUpdateNotAvailable)
    onUpdateDownloadProgress &&
      window.ipcRenderer.on(
        'update-download-progress',
        onUpdateDownloadProgress
      )
    onUpdateDownloaded &&
      window.ipcRenderer.on('update-downloaded', onUpdateDownloaded)
    onUpdateError && window.ipcRenderer.on('update-error', onUpdateError)
  },

  relaunch() {
    window.ipcRenderer.invoke('relaunch')
  },

  openExternalLink(url: string) {
    window.ipcRenderer.invoke('open-external-link', url)
  },

  async openFile() {
    return await window.ipcRenderer.invoke('show-open-dialog', {
      properties: ['openFile'],
    })
  },

  async openFolder(options: any = {}, properties: string[] = []) {
    return await window.ipcRenderer.invoke('show-open-dialog', {
      ...options,
      properties: [...properties, 'openDirectory'],
    })
  },

  async showSaveDialog(options: any = {}, properties: string[] = []) {
    return await window.ipcRenderer.invoke('show-save-dialog', {
      ...options,
      properties: [...properties, 'createDirectory'],
    })
  },

  // Keychain
  async setPassword(service: string, account: string, password: string) {
    return await window.ipcRenderer.invoke(
      'set-password',
      service,
      account,
      password
    )
  },

  async getPassword(service: string, account: string) {
    return await window.ipcRenderer.invoke('get-password', service, account)
  },

  // Auto-update
  async checkForUpdates() {
    return await window.ipcRenderer.invoke('check-for-updates')
  },
  async downloadUpdate() {
    return await window.ipcRenderer.invoke('download-update')
  },
  async installUpdate() {
    return await window.ipcRenderer.invoke('install-update')
  },
}
