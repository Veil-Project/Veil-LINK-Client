import { ipcRenderer, remote, clipboard } from 'electron'
import prompt from 'electron-prompt'
import fs from 'fs'
import path from 'path'

declare global {
  interface Window {
    ipcRenderer: any
    remote: any
    clipboard: any
    getConfig: any
    promptForInput: any
  }
}
window.ipcRenderer = ipcRenderer
window.remote = remote
window.clipboard = clipboard
window.getConfig = () => {
  const configPath = path.join(remote.app.getPath('userData'), 'config.json')
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } catch (error) {
    console.error(error)
  }
}
window.promptForInput = async (options: any) => {
  return await prompt({
    ...options,
    parentWindow: remote.BrowserWindow,
    customStylesheet: path.join(__dirname, 'prompt.css'),
  })
}
