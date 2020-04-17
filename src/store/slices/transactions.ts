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
  lastUpdated: number
  isCacheReady: boolean
  isUpdating: boolean
}

export const state: State = {
  txids: [],
  category: '',
  query: '',
  isCacheReady: false,
  isUpdating: false,
  lastUpdated: Number(localStorage.getItem('transactionsLastUpdated')),
}

type Actions = {
  initializeCache: AsyncAction
  verifyLocalDatabaseBelongsToWallet: AsyncAction
  setCategory: Action<string>
  setQuery: Action<string>
  updateFromCache: AsyncAction
  updateFromWallet: AsyncAction<boolean | void, Error>
  update: AsyncAction<string>
  reset: AsyncAction
}

export const actions: Actions = {
  async initializeCache({ state, effects }) {
    await effects.db.open()
    state.transactions.isCacheReady = true
  },

  async verifyLocalDatabaseBelongsToWallet({ effects, actions }) {
    const tx = await effects.db.fetchFirstTransaction()
    if (!tx) return

    try {
      await effects.rpc.getTransaction(tx.txid)
    } catch (e) {
      if (e.code === -4) {
        await actions.transactions.reset()
      } else {
        throw e
      }
    }
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

  async updateFromWallet({ actions, effects, state }, ignoreLastBlock = false) {
    if (state.transactions.isUpdating) return

    try {
      state.transactions.isUpdating = true
      await actions.transactions.verifyLocalDatabaseBelongsToWallet()

      let lastBlock = ignoreLastBlock
        ? ''
        : localStorage.getItem('transactionsLastBlock') || ''

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

      const { credentials } = await effects.daemon.getInfo()
      const {
        lastBlock: newLastBlock,
      } = await transactionWorker.importWalletTransactions({
        credentials,
        lastBlock,
      })
      state.transactions.lastUpdated = new Date().getTime()
      localStorage.setItem(
        'transactionsLastUpdated',
        String(state.transactions.lastUpdated)
      )
      localStorage.setItem('transactionsLastBlock', newLastBlock)
      return null
    } catch (e) {
      console.error(e)
      return e
    } finally {
      state.transactions.isUpdating = false
    }
  },

  async update({ effects }, txid) {
    const tx = await effects.rpc.getTransaction(txid)
    await effects.db.addTransaction(transformWalletTx(tx))
  },

  async reset({ effects, state }) {
    await effects.db.clearTransactions()
    state.transactions.txids = []
    state.transactions.lastUpdated = 0
    localStorage.removeItem('transactionsLastBlock')
    localStorage.removeItem('transactionsLastUpdated')
  },
}
