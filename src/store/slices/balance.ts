import { createSlice, createSelector } from '@reduxjs/toolkit'
import { pick, sum } from 'lodash'
import { AppThunk } from 'store'
import api from 'api'
import { handleRpcError } from './app'

interface BalanceState {
  spendable: number | null
  breakdown: {
    basecoinSpendable: number
    basecoinUnconfirmed: number
    basecoinImmature: number
    ctSpendable: number
    ctUnconfirmed: number
    ctImmature: number
    ringctSpendable: number
    ringctUnconfirmed: number
    ringctImmature: number
    zerocoinSpendable: number
    zerocoinUnconfirmed: number
    zerocoinImmature: number
  }
  marketPrice: number | null
}

const initialState: BalanceState = {
  spendable: null,
  breakdown: {
    basecoinSpendable: 0,
    basecoinUnconfirmed: 0,
    basecoinImmature: 0,
    ctSpendable: 0,
    ctUnconfirmed: 0,
    ctImmature: 0,
    ringctSpendable: 0,
    ringctUnconfirmed: 0,
    ringctImmature: 0,
    zerocoinSpendable: 0,
    zerocoinUnconfirmed: 0,
    zerocoinImmature: 0,
  },
  marketPrice: null,
}

const slice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    balancesReceived(state, { payload }) {
      state.spendable = payload.spendable
      state.breakdown = payload.breakdown
    },
    marketPriceReceived(state, { payload }) {
      state.marketPrice = payload
    },
  },
})

// ------------------------------------
// Selectors
// ------------------------------------

const balanceSelector = (state: { balance: BalanceState }) => state.balance
export const getMarketPrice = createSelector(
  balanceSelector,
  ({ marketPrice }) => marketPrice
)
export const getSpendableBalance = createSelector(
  balanceSelector,
  ({ spendable }) => spendable
)
export const getBalanceBreakdown = createSelector(
  balanceSelector,
  ({ breakdown }) => breakdown
)
export const getLegacyBalance = createSelector(
  balanceSelector,
  ({ breakdown }) =>
    sum(
      Object.values(
        pick(breakdown, 'basecoinSpendable', 'ctSpendable', 'zerocoinSpendable')
      )
    )
)
export const getTotalMarketValue = createSelector(
  getMarketPrice,
  getSpendableBalance,
  (marketPrice, spendableBalance) =>
    spendableBalance && marketPrice ? spendableBalance * marketPrice : null
)

// ------------------------------------
// Thunks
// ------------------------------------

export const fetchBalance = (): AppThunk => async dispatch => {
  try {
    const spendable = await api.getSpendableBalance()
    const breakdown = await api.getBalances()
    dispatch(
      slice.actions.balancesReceived({
        spendable,
        breakdown: {
          basecoinSpendable: parseFloat(breakdown.basecoin_spendable),
          basecoinUnconfirmed: parseFloat(breakdown.basecoin_unconfirmed),
          basecoinImmature: parseFloat(breakdown.basecoin_immature),
          ctSpendable: parseFloat(breakdown.ct_spendable),
          ctUnconfirmed: parseFloat(breakdown.ct_spendable),
          ctImmature: parseFloat(breakdown.ct_spendable),
          ringctSpendable: parseFloat(breakdown.ringct_spendable),
          ringctUnconfirmed: parseFloat(breakdown.ringct_spendable),
          ringctImmature: parseFloat(breakdown.ringct_spendable),
          zerocoinSpendable: parseFloat(breakdown.zerocoin_spendable),
          zerocoinUnconfirmed: parseFloat(breakdown.zerocoin_spendable),
          zerocoinImmature: parseFloat(breakdown.zerocoin_spendable),
        },
      })
    )
  } catch (e) {
    dispatch(handleRpcError(e))
  }
}

export const fetchMarketPrice = (): AppThunk => async dispatch => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=veil&vs_currencies=usd'
    )
    const {
      veil: { usd },
    } = await response.json()
    dispatch(slice.actions.marketPriceReceived(usd))
  } catch (e) {
    console.error(e)
  }
}

export default slice.reducer
