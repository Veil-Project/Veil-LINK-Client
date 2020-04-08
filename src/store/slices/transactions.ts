import { Derive, AsyncAction } from 'store'
import { Transaction, WalletTransactionDetail } from '../models/transaction'
import { groupBy, forEach } from 'lodash'

const TRANSACTIONS_PER_REQUEST = 10

type State = {
  index: { [txid: string]: Transaction }
  all: Derive<State, Transaction[]>
  forDisplay: Derive<State, Transaction[]>
  find: Derive<State, (id: string) => Transaction>
}

type Actions = {
  fetch: AsyncAction<void, Error>
  update: AsyncAction<string>
}

export const state: State = {
  index: {},
  all: state => Object.values(state.index),
  forDisplay: state => state.all.sort((a, b) => b.time - a.time),
  find: state => id => state.index[id],
}

export const actions: Actions = {
  async fetch({ state, effects }) {
    try {
      const { transactions, lastblock } = await effects.rpc.listSinceBlock()
      forEach(groupBy(transactions, 'txid'), (txs, txid) => {
        const { time, confirmations } = txs[0]
        state.transactions.index[txid] = new Transaction({
          txid,
          time,
          confirmations,
          details: txs,
          debug: {
            vin: [],
            vout: [],
          },
        })
      })
      return null
    } catch (e) {
      console.error(e)
      return e
    }
  },

  async update({ state, effects }, txid) {
    const tx = await effects.rpc.getTransaction(txid)
    state.transactions.index[txid].updateFromWalletTx(tx)
  },
}
