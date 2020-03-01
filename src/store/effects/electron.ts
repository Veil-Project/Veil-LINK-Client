export default {
  initialize(options: any) {
    const { onQuit } = options
    onQuit && window.ipcRenderer.on('app-quitting', onQuit)
  },
}
