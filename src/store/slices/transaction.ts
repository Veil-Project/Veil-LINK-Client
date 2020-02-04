import { createSlice, createSelector } from '@reduxjs/toolkit'
import { AppThunk } from 'store'
import api from 'api'
import { handleRpcError } from './app'

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
    amount: (tx.creditbase || tx.creditanon) - (tx.debitbase || tx.debitanon),
    fee: tx.debug.vout[0].ct_fee,
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
