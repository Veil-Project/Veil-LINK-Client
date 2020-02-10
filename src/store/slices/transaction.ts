import { createSlice, createSelector } from '@reduxjs/toolkit'
import { AppThunk } from 'store'
import api from 'api'
import { handleRpcError } from './app'
import { sum } from 'lodash'

// ------------------------------------
// Types
// ------------------------------------

export interface Transaction {
  txid: string
  type: 'receive' | 'send'
  time: number
  address: string
  amount: number
  fee?: number
  details: any
  debug: {
    vin: {
      from_me: boolean
      prevout_hash: string
      prevout_n: number
      type: string
      has_tx_rec: boolean
      output_record: any
    }[]
    vout: {
      type: string
      ct_fee: string
      data: string
      is_mine: boolean
      has_tx_rec: boolean
      output_record: any
    }[]
  }
}

type TransactionState = {
  transactions: Transaction[]
}

// ------------------------------------
// Helpers
// ------------------------------------

const normalizeTransactions = (transactions: Array<any>): Transaction[] =>
  [...transactions].map(tx => ({
    ...tx,
    time: tx.time * 1000,
    conversion:
      tx.debug.vout.every((vout: any) => vout.is_mine) &&
      tx.debug.vin.every((vin: any) => vin.from_me),
    sent: sum(
      tx.debug.vin
        .filter((vin: any) => vin.from_me)
        .map((vin: any) =>
          Number(
            (vin.prevout_hash
              ? transactions.find(tx2 => tx2.txid === vin.prevout_hash)?.debug
                  ?.vout[vin.prevout_n]?.amount
              : vin.denom) || 0
          )
        )
    ),
    received: sum(
      tx.debug.vout
        .filter((vout: any) => vout.is_mine)
        .map((vout: any) =>
          Number(vout.amount || vout.output_record?.amount || 0)
        )
    ),
    fee:
      tx.debug.vin.filter((vin: any) => vin.from_me).length > 0
        ? sum(
            tx.debug.vin.map((vin: any) =>
              Number(
                (vin.prevout_hash
                  ? transactions.find(tx2 => tx2.txid === vin.prevout_hash)
                      ?.debug?.vout[vin.prevout_n]?.amount
                  : vin.denom) || 0
              )
            )
          ) -
          sum(
            tx.debug.vout.map((vout: any) =>
              Number(vout.amount || vout.output_record?.amount || 0)
            )
          )
        : 0,
  }))

// ------------------------------------
// Slice
// ------------------------------------

const initialState: TransactionState = {
  transactions: [],
}

const slice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    transactionsReceived(state, { payload }) {
      state.transactions = normalizeTransactions(payload)
    },
  },
})

// ------------------------------------
// Selectors
// ------------------------------------

const transactionSelector = (state: { transaction: TransactionState }) =>
  state.transaction

export const getTransactions = createSelector(
  transactionSelector,
  ({ transactions }) => [...transactions].sort((a, b) => b.time - a.time)
)

// ------------------------------------
// Actions
// ------------------------------------

export const fetchTransactions = (): AppThunk => async dispatch => {
  try {
    const transactions = await api.listTransactions()
    dispatch(slice.actions.transactionsReceived(transactions))
  } catch (e) {
    dispatch(handleRpcError(e))
  }
}

export default slice.reducer
