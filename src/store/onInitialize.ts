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
      actions.balance.fetchBalance()
    },
    onStdout(_: any, message: string) {
      actions.daemon.logStdout(message)
    },
    onStderr(_: any, error: string) {
      actions.daemon.logStderr(error)
    },
    onBlockchainTip(_: any, date: string) {
      actions.blockchain.setTip(date)
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
  })
}
