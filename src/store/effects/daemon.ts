export default {
  initialize(options: any) {
    const {
      onStatus,
      onMessage,
      onProgress,
      onStdout,
      onStderr,
      onExit,
    } = options
    onStatus && window.ipcRenderer.on('daemon-status', onStatus)
    onMessage && window.ipcRenderer.on('daemon-message', onMessage)
    onProgress && window.ipcRenderer.on('daemon-progress', onProgress)
    onStdout && window.ipcRenderer.on('daemon-stdout', onStdout)
    onStderr && window.ipcRenderer.on('daemon-stderr', onStderr)
    onExit && window.ipcRenderer.on('daemon-exit', onExit)
  },
  async start() {
    return await window.ipcRenderer.invoke('start-daemon')
  },
  async startFromSeed(seed: string) {
    return await window.ipcRenderer.invoke('start-daemon', seed)
  },
  async stop() {
    await window.ipcRenderer.invoke('stop-daemon')
  },
}
