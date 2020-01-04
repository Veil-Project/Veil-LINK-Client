import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

// ------------------------------------
// Types
// ------------------------------------

export interface Transaction {
  id: number,
  type: string,
  timestamp: Date,
  address: string,
  amount: number,
}

type TransactionState = {
  query: string,
  transactions: Transaction[]
}


// TODO: delete me
const randomDate = (start: Date, end: Date) => (
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
)
const generateRandomTransaction = (id: number): Transaction => ({
  id,
  type: ["send", "receive", "reward"][(Math.floor(Math.random() * 3))],
  timestamp: randomDate(new Date(2019, 0, 1), new Date()),
  address: "lksdfhlkasfasdfjfj390utwjefjqwetoihqefpgn2qpq",
  amount: Math.random() * 10000,
})


// ------------------------------------
// Slice
// ------------------------------------

const initialState: TransactionState = {
  query: '',
  transactions: [...Array(20)].map((_, i) => (
    generateRandomTransaction(i)
  ))
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
    }
  }
})

export const { 
  setQuery
} = transactionSlice.actions

// ------------------------------------
// Selectors
// ------------------------------------

const transactionSelector = (state: { transaction: TransactionState }) => state.transaction
const querySelector = createSelector(
  transactionSelector,
  transaction => transaction.query
)
const transactionsSelector = createSelector(
  transactionSelector,
  transaction => transaction.transactions
)
const sortedTransactionsSelector = createSelector(
  transactionsSelector,
  querySelector,
  (transactions, query) => (
    [...transactions]
      .sort((a, b) => (b.timestamp.getTime() - a.timestamp.getTime()))
      .filter((t) => t.address.includes(query))
  )
)

export const selectors = {
  query: querySelector,
  transactions: sortedTransactionsSelector
}

export default transactionSlice.reducer