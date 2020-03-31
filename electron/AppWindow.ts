import { BrowserWindow } from 'electron'
import path from 'path'

export default class AppWindow {
  url: string
  width = 1000
  height = 760
  window: Electron.BrowserWindow | null = null

  constructor(url: string) {
    this.url = url
  }

  isOpen() {
    return this.window !== null
  }

  async open() {
    this.window = new BrowserWindow({
      width: this.width,
      height: this.height,
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#1b1e21',
      webPreferences: {
        contextIsolation: false,
        webSecurity: false,
        scrollBounce: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    })
    this.window.loadURL(this.url)
    this.window.on('closed', () => {
      this.window = null
    })
  }

  emit(event: string, ...args: any) {
    this.window?.webContents?.send(event, ...args)
  }
}
