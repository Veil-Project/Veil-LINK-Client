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
}

export const state: State = {
  locale: 'en',
  status: 'initial',
}

interface RpcError {
  code: number
  message: string
}

type Actions = {
  transition: AsyncAction
  reset: AsyncAction
  handleShutdown: Action
  handleDaemonExit: Action
  handleRpcError: Action<RpcError>
}

export const actions: Actions = {
  async transition({ state, actions }) {
    const { status, installed, configured } = state.daemon

    switch (status) {
      case 'wallet-loaded':
        // Load wallet data
        await actions.blockchain.load()
        await actions.wallet.load()
        await actions.transactions.fetch()

        // Transition to wallet UI
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
