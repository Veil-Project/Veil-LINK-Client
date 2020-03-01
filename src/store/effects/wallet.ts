export default {
  initialize(options: any) {
    const { onLoaded, onMissing } = options
    onLoaded && window.ipcRenderer.on('wallet-loaded', onLoaded)
    onMissing && window.ipcRenderer.on('wallet-missing', onMissing)
  },
}
