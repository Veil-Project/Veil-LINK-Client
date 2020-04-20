import { DaemonOptions, DaemonStartOptions } from 'store/slices/daemon'

export default {
  initialize({
    onWarmup,
    onTransaction,
    onBlockchainTip,
    onStdout,
    onStderr,
    onError,
    onExit,
  }: any) {
    onTransaction && window.ipcRenderer.on('daemon-transaction', onTransaction)
    onWarmup && window.ipcRenderer.on('daemon-warmup', onWarmup)
    onBlockchainTip &&
      window.ipcRenderer.on('daemon-blockchain-tip', onBlockchainTip)
    onStdout && window.ipcRenderer.on('daemon-stdout', onStdout)
    onStderr && window.ipcRenderer.on('daemon-stderr', onStderr)
    onError && window.ipcRenderer.on('daemon-stderr', onError)
    onExit && window.ipcRenderer.on('daemon-exit', onExit)
  },
  async setPath(path: string | null) {
    await window.ipcRenderer.invoke('set-daemon-path', path)
  },
  async getInfo() {
    return await window.ipcRenderer.invoke('get-daemon-info')
  },
  async readConfig(datadir: string) {
    return await window.ipcRenderer.invoke('read-daemon-config', datadir)
  },
  async writeConfig(datadir: string, content: string) {
    return await window.ipcRenderer.invoke(
      'write-daemon-config',
      datadir,
      content
    )
  },
  async download(url: string, onProgress: Function) {
    window.ipcRenderer.on('daemon-download-progress', onProgress)
    const download = await window.ipcRenderer.invoke('download-daemon', url)
    window.ipcRenderer.removeListener('daemon-download-progress', onProgress)
    return download
  },
  async start(options: (DaemonOptions & DaemonStartOptions) | void) {
    return await window.ipcRenderer.invoke('start-daemon', options)
  },
  async startFromSeed(seed: string) {
    return await window.ipcRenderer.invoke('start-daemon', seed)
  },
  async stop() {
    return await window.ipcRenderer.invoke('stop-daemon')
  },
}
