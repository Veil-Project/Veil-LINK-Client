import { Action, AsyncAction } from 'store'
import { toast } from 'react-toastify'
import RPC_ERRORS from 'constants/rpcErrors'

type AppStatus =
  | 'initial'
  | 'startup'
  | 'connect'
  | 'conflict'
  | 'setup'
  | 'wallet'
  | 'error'
  | 'shutdown'

type State = {
  locale: string
  status: AppStatus
  connectionMethod: 'daemon' | 'rpc'
}

export const state: State = {
  locale: 'en',
  status: 'initial',
  connectionMethod: 'daemon',
}

interface RpcError {
  code: number
  message: string
}

type Actions = {
  transition: AsyncAction
  connectViaRpc: AsyncAction
  update: AsyncAction
  reset: AsyncAction
  handleShutdown: Action
  handleDaemonExit: Action
  handleRpcError: Action<RpcError>
}

export const actions: Actions = {
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
      case 'crashed':
        state.app.status = 'error'
        break
      case 'unknown':
      case null:
        state.app.status = installed && configured ? 'startup' : 'connect'
        break
    }
  },

  async connectViaRpc({ state, actions }) {
    state.app.connectionMethod = 'rpc'
    await actions.app.transition()
  },

  async update({ state, actions }) {
    await actions.blockchain.load()
    await actions.wallet.load()
    if (state.app.connectionMethod === 'rpc') {
      await actions.transactions.fetch()
    }
  },

  async reset({ effects, actions }) {
    actions.daemon.configure({ network: null, datadir: null })
    await effects.electron.relaunch()
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

    toast(message, { type: 'error' })

    switch (code) {
      case RPC_ERRORS.RPC_IN_WARMUP:
      // TODO
    }

    //throw new Error(message)
  },
}
