import { AsyncAction, Action, Derive } from 'store'
import transformWalletTx from 'utils/transformWalletTx'
import transactionWorker from 'workers/transactions'

export type WalletTxType =
  | 'basecoin'
  | 'ringct'
  | 'ct'
  | 'zerocoin'
  | 'zerocoinspend'
  | 'zerocoinmint'
  | 'data'

export type WalletTransaction = {
  txid: string
  time: number
  confirmations: number
  blockhash?: string
  blockindex?: number
  blocktime?: number
  fee?: number
  details: {
    category: 'receive' | 'send'
    address: string
    amount: number
    label?: string
    vout: number
    fee?: number
    abandoned: boolean
  }[]
  debug: {
    vin: {
      from_me: boolean
      is_change: boolean
      prevout_hash: string
      prevout_n: number
      type: WalletTxType
      has_tx_rec: boolean
      output_record: any
      denom?: number
    }[]
    vout: {
      type: WalletTxType
      ct_fee: string
      data: string
      is_mine: boolean
      has_tx_rec: boolean
      output_record: any
      amount?: string
    }[]
  }
}

type State = {
  txids: string[]
  category: string
  query: string
  isCacheReady: boolean
  isUpdating: boolean
}

export const state: State = {
  txids: [],
  category: '',
  query: '',
  isCacheReady: false,
  isUpdating: false,
}

type Actions = {
  initializeCache: AsyncAction
  setCategory: Action<string>
  setQuery: Action<string>
  updateFromCache: AsyncAction
  updateFromWallet: AsyncAction<boolean | void, Error>
  update: AsyncAction<string>
  reset: AsyncAction
}

export const actions: Actions = {
  async initializeCache({ state, effects, actions }) {
    state.transactions.txids = []
    const cacheId = state.wallet.hdseedid || 'default'
    await effects.db.open(cacheId, actions.transactions.updateFromCache)
    state.transactions.isCacheReady = true
  },

  setCategory({ state, actions }, category) {
    state.transactions.category = category
    actions.transactions.updateFromCache()
  },

  setQuery({ state, actions }, query) {
    state.transactions.query = query
    actions.transactions.updateFromCache()
  },

  async updateFromCache({ state, effects }) {
    const { category, query } = state.transactions
    state.transactions.txids = await effects.db.listTransactionIds({
      category,
      query,
    })
  },

  async updateFromWallet({ effects, state, actions }, ignoreLastBlock = false) {
    if (state.transactions.isUpdating) return

    const walletId = state.wallet.hdseedid || 'default'

    try {
      state.transactions.isUpdating = true

      let lastBlock = ignoreLastBlock
        ? ''
        : localStorage.getItem(walletId) || ''

      if (lastBlock) {
        try {
          await effects.rpc.getBlock(lastBlock)
        } catch (e) {
          if (e.code === -5) {
            console.log('Last block not found. Refetching everything…')
            lastBlock = ''
          }
        }
      }

      if (lastBlock) {
        const { txCount } = state.wallet
        const txidCount = state.transactions.txids.length
        if (txCount && txidCount / txCount < 0.5) {
          console.log(
            'Wallet indicates it has transactions, but no transactions found in local cache. Refetching everything…'
          )
          lastBlock = ''
        }
      }

      let connectionInfo
      switch (state.app.connectionMethod) {
        case 'rpc':
          connectionInfo = effects.rpc.getConnectionInfo()
          break
        default:
          const { credentials } = await effects.daemon.getInfo()
          connectionInfo = credentials
      }

      const {
        lastBlock: newLastBlock,
      } = await transactionWorker.importWalletTransactions({
        wallet: walletId,
        connectionInfo,
        lastBlock,
      })
      localStorage.setItem(walletId, newLastBlock)
      await actions.transactions.updateFromCache()
      return null
    } catch (e) {
      console.error(e)
      return e
    } finally {
      state.transactions.isUpdating = false
    }
  },

  async update({ effects, actions }, txid) {
    const tx = await effects.rpc.getTransaction(txid)
    await effects.db.addTransaction(transformWalletTx(tx))
    actions.transactions.updateFromCache()
  },

  async reset({ effects, state }) {
    await effects.db.clearTransactions()
    state.transactions.txids = []
    localStorage.removeItem(state.wallet.hdseedid || 'default')
  },
}
