import { Action, AsyncAction } from 'store'
import RPC_ERRORS from 'constants/rpcErrors'

type AppStatus =
  | 'initial'
  | 'startup'
  | 'connect'
  | 'conflict'
  | 'reindex'
  | 'setup'
  | 'wallet'
  | 'error'
  | 'shutdown'

type State = {
  locale: string
  status: AppStatus
  connectionMethod: 'daemon' | 'rpc'
  modal: string | null
  isRestarting: boolean
}

export const state: State = {
  locale: 'en',
  status: 'initial',
  connectionMethod: 'daemon',
  modal: null,
  isRestarting: false,
}

interface RpcError {
  code: number
  message: string
}

type Actions = {
  load: AsyncAction
  transition: AsyncAction
  connectViaRpc: AsyncAction
  update: AsyncAction
  reset: AsyncAction
  reload: AsyncAction<{ resetTransactions: boolean }>
  openModal: Action<string>
  closeModal: Action
  handleShutdown: Action
  handleDaemonExit: Action
  handleRpcError: Action<RpcError>
}

export const actions: Actions = {
  async load({ state, actions, effects }) {
    const rpcConnectionInfo = JSON.parse(
      localStorage.getItem('rpcConnectionInfo') || '{}'
    )
    if (rpcConnectionInfo && rpcConnectionInfo.host && rpcConnectionInfo.user) {
      const pass = await effects.electron.getPassword(
        rpcConnectionInfo.host,
        rpcConnectionInfo.user
      )
      state.app.connectionMethod = 'rpc'
      effects.rpc.initialize({
        ...rpcConnectionInfo,
        pass,
      })
    } else {
      await actions.daemon.load()
    }
    await actions.app.transition()
  },

  async transition({ state, actions }) {
    if (state.app.connectionMethod === 'rpc') {
      await actions.app.update()
      state.app.status = 'wallet'
      return
    }

    const { status, installed, configured } = state.daemon

    switch (status) {
      case 'wallet-loaded':
        await actions.app.update()
        state.app.status = 'wallet'
        break
      case 'starting':
      case 'stopped':
        state.app.status = 'startup'
        break
      case 'stopping':
        state.app.status = 'shutdown'
        break
      case 'new-wallet':
        state.app.status = 'setup'
        break
      case 'already-started':
        state.app.status = 'conflict'
        break
      case 'reindex-required':
        state.app.status = 'reindex'
        break
      case 'crashed':
        state.app.status = 'error'
        break
      case 'unknown':
      case null:
        state.app.status = installed && configured ? 'startup' : 'connect'
        break
    }
  },

  async connectViaRpc({ state, actions, effects }) {
    state.app.connectionMethod = 'rpc'

    const rpcConnectionInfo = effects.rpc.getConnectionInfo()
    localStorage.setItem(
      'rpcConnectionInfo',
      JSON.stringify({ ...rpcConnectionInfo, password: null })
    )
    await effects.electron.setPassword(
      rpcConnectionInfo.host,
      rpcConnectionInfo.user,
      rpcConnectionInfo.pass
    )

    await actions.app.transition()
  },

  async update({ state, actions }) {
    if (state.app.isRestarting) return
    await actions.blockchain.load()
    await actions.wallet.load()
    await actions.balance.fetch()
  },

  async reset({ state, actions, effects }) {
    state.app.connectionMethod = 'daemon'
    localStorage.removeItem('rpcConnectionInfo')
    await effects.daemon.stop()
    await actions.app.transition()
    actions.daemon.reset()
  },

  async reload({ state, actions }, { resetTransactions = false }) {
    state.app.isRestarting = true
    await actions.daemon.restart()
    await actions.app.update()
    await actions.wallet.fetchReceivingAddress()
    if (resetTransactions) await actions.transactions.reset()
    state.app.isRestarting = false
    await actions.transactions.updateFromWallet()
  },

  openModal({ state }, modal) {
    state.app.modal = modal
  },

  closeModal({ state }) {
    state.app.modal = null
  },

  handleShutdown({ state }) {
    state.app.status = 'shutdown'
  },

  handleDaemonExit({ state }) {
    // todo: daemon exited
  },

  handleRpcError({ state }, { code, message }) {
    if (code === undefined) {
      switch (true) {
        case /connection_refused/i.test(message):
        case /request error/i.test(message):
        case /unauthorized/i.test(message):
          break
      }
    }

    switch (code) {
      case RPC_ERRORS.RPC_IN_WARMUP:
      // TODO
    }

    //throw new Error(message)
  },
}
