import { ipcRenderer, remote, app, clipboard } from 'electron'
import fs from 'fs'
import path from 'path'

declare global {
  interface Window {
    platform: string
    arch: string
    ipcRenderer: any
    remote: any
    clipboard: any
    getConfig: any
  }
}

window.platform = process.platform
window.arch = process.arch
window.ipcRenderer = ipcRenderer
window.remote = remote
window.clipboard = clipboard
window.getConfig = () => {
  const configPath = path.join(app.getPath('userData'), 'config.json')
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } catch (error) {
    console.error(error)
  }
}
