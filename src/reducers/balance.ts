import { createSlice } from '@reduxjs/toolkit'

interface Balance {
  spendable: number,
  unconfirmed: number,
  immature: number,
}

const initialState: Balance = {
  spendable: 0,
  unconfirmed: 0,
  immature: 0,
}

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {}
})

export default balanceSlice.reducer