import { AsyncAction, Derive, Action } from 'store'
import { uniq, map } from 'lodash'
import transformWalletTx from 'utils/transformWalletTx'

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
  isUpdating: boolean
}

export const state: State = {
  txids: [],
  category: '',
  query: '',
  isUpdating: false,
}

type Actions = {
  verifyLocalDatabaseBelongsToWallet: AsyncAction
  setCategory: Action<string>
  setQuery: Action<string>
  updateFromCache: AsyncAction
  updateFromWallet: AsyncAction<boolean | void, Error>
  transform: AsyncAction<string[], any[]>
  update: AsyncAction<string>
  reset: AsyncAction
}

export const actions: Actions = {
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

  async updateFromCache({ state, actions, effects }) {
    const { txCount } = state.wallet
    const { category, query } = state.transactions

    state.transactions.isUpdating = true

    let txids = await effects.db.listTransactionIds({ category, query })

    if (!category && !query && txCount && txids.length / txCount < 0.5) {
      console.log(
        'Wallet indicates it has transactions, but no transactions found in local cache. Refetching everything…'
      )
      await actions.transactions.updateFromWallet(true)
      txids = await effects.db.listTransactionIds({ category, query })
    }

    state.transactions.txids = txids
    state.transactions.isUpdating = false
  },

  async updateFromWallet({ actions, effects, state }, ignoreLastBlock = false) {
    state.transactions.isUpdating = true
    try {
      await actions.transactions.verifyLocalDatabaseBelongsToWallet()
      const blockhash = ignoreLastBlock
        ? ''
        : localStorage.getItem('lastblock') || ''
      const { transactions, lastblock } = await effects.rpc.listSinceBlock(
        blockhash
      )
      if (transactions.length > 0) {
        const fullTransactions = await actions.transactions.transform(
          uniq(map(transactions, 'txid'))
        )
        await effects.db.addTransactions(fullTransactions)
      }
      await actions.transactions.updateFromCache()
      localStorage.setItem('lastblock', lastblock)
      return null
    } catch (e) {
      console.error(e)
      return e
    } finally {
      state.transactions.isUpdating = false
    }
  },

  async transform({ effects }, txids) {
    const fullTransactions = await Promise.all(
      txids.map(txid => effects.rpc.getTransaction(txid))
    )
    return fullTransactions.map(tx => transformWalletTx(tx))
  },

  async update({ effects }, txid) {
    const tx = await effects.rpc.getTransaction(txid)
    await effects.db.addTransactions([transformWalletTx(tx)])
  },

  async reset({ effects, actions, state }) {
    await effects.db.clearTransactions()
    localStorage.removeItem('lastblock')
    state.transactions.txids = []
  },
}
