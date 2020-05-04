import { Derive, AsyncAction, Action } from 'store'

type BlockchainTip = {
  date: string
  height: number
}

type State = {
  chain: string | null
  height: number | null
  bestBlock?: string
  initialBlockDownload: boolean
  verificationProgress: number
  tip: BlockchainTip | null
  connected: Derive<State, boolean>
  isSynced: Derive<State, boolean>
}

type Actions = {
  load: AsyncAction<void, Error>
  setTip: Action<BlockchainTip>
}

export const state: State = {
  chain: null,
  height: null,
  initialBlockDownload: false,
  verificationProgress: 0,
  tip: null,
  connected: state => state.chain !== null,
  isSynced: state => state.verificationProgress > 0.9999,
}

export const actions: Actions = {
  async load({ state, effects }) {
    try {
      const {
        chain,
        blocks,
        initialblockdownload: initialBlockDownload,
        verificationprogress: verificationProgress,
      } = await effects.rpc.getBlockchainInfo()

      state.blockchain.chain = chain
      state.blockchain.height = blocks
      state.blockchain.bestBlock = blocks
      state.blockchain.initialBlockDownload = initialBlockDownload
      state.blockchain.verificationProgress = verificationProgress

      return null
    } catch (e) {
      return e
    }
  },
  setTip({ state }, tip) {
    state.blockchain.tip = tip
  },
}
