import { AsyncAction } from 'store'

export const onInitialize: AsyncAction = async ({ effects, actions }) => {
  effects.daemon.initialize({
    onWarmup(
      _: any,
      status: { message: string | null; progress: number | null }
    ) {
      actions.daemon.handleWarmup(status)
    },
    onTransaction(_: any, txid: string, _event: string) {
      actions.transactions.update(txid)
    },
    onStdout(_: any, message: string) {
      // actions.daemon.logStdout(message)
    },
    onStderr(_: any, error: string) {
      // actions.daemon.logStderr(error)
    },
    onBlockchainTip(_: any, tip: any) {
      actions.blockchain.setTip(tip)
    },
    onError(_: any, message: string) {
      actions.daemon.handleError(message)
    },
    onExit(_: any) {
      actions.app.handleDaemonExit()
    },
  })

  effects.electron.initialize({
    onQuit(_: any) {
      actions.app.handleShutdown()
    },
    onUpdateAvailable(_: any, info: any) {
      actions.autoUpdate.updateAvailable(info)
    },
    onUpdateNotAvailable(_: any) {
      actions.autoUpdate.updateNotAvailable()
    },
    onUpdateDownloadProgress(_: any, progress: any) {
      actions.autoUpdate.downloadProgress(progress)
    },
    onUpdateDownloaded(_: any) {
      actions.autoUpdate.downloadComplete()
    },
    onUpdateError(_: any, error: any) {
      actions.autoUpdate.handleError(error)
    },
  })

  effects.db.initialize({
    onChanges(changes) {
      const creates = changes.filter((change: any) => change.type === 1)
      const updates = changes.filter((change: any) => change.type === 2)
      const deletes = changes.filter((change: any) => change.type === 3)

      if (creates.length > 0 || deletes.length > 0) {
        actions.transactions.updateFromCache()
      }

      if (updates.length > 0) {
        actions.balance.fetch()
      }
    },
  })
}
