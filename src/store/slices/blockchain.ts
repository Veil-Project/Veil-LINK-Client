import { Derive, AsyncAction } from 'store'

type State = {
  chain: string | null
  initialBlockDownload: boolean
  verificationProgress: number
  connected: Derive<State, boolean>
}

type Actions = {
  load: AsyncAction<void, Error>
}

export const state: State = {
  chain: null,
  initialBlockDownload: false,
  verificationProgress: 0,
  connected: state => state.chain !== null,
}

export const actions: Actions = {
  async load({ state, effects }) {
    try {
      const {
        chain,
        initialblockdownload: initialBlockDownload,
        verificationprogress: verificationProgress,
      } = await effects.rpc.getBlockchainInfo()

      state.blockchain.chain = chain
      state.blockchain.initialBlockDownload = initialBlockDownload
      state.blockchain.verificationProgress = verificationProgress

      return null
    } catch (e) {
      return e
    }
  },
}
