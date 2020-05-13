import { Derive, AsyncAction } from 'store'
import { sum } from 'lodash'

type State = {
  totalBalance: Derive<State, number>
  spendableBalance: Derive<State, number>
  unconfirmedBalance: Derive<State, number>
  immatureBalance: Derive<State, number>
  unspendableBalance: Derive<State, number>
  legacyBalance: Derive<State, number>
  marketValue: Derive<State, number>
  canSend: Derive<State, boolean>
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
  lastUpdated: number | null
  error: any
}

type Actions = {
  fetch: AsyncAction
  fetchMarketPrice: AsyncAction
}

export const state: State = {
  totalBalance: state => sum(Object.values(state.breakdown)),
  spendableBalance: state => state.breakdown.ringctSpendable,
  unspendableBalance: state =>
    state.unconfirmedBalance + state.immatureBalance + state.legacyBalance,
  unconfirmedBalance: state =>
    state.breakdown.basecoinUnconfirmed +
    state.breakdown.ctUnconfirmed +
    state.breakdown.ringctUnconfirmed +
    state.breakdown.zerocoinUnconfirmed,
  immatureBalance: state =>
    state.breakdown.basecoinImmature +
    state.breakdown.ctImmature +
    state.breakdown.ringctImmature +
    state.breakdown.zerocoinImmature,
  legacyBalance: state =>
    state.breakdown.basecoinSpendable +
    state.breakdown.ctSpendable +
    state.breakdown.zerocoinSpendable,
  marketPrice: null,
  marketValue: state =>
    state.spendableBalance && state.marketPrice
      ? state.spendableBalance * state.marketPrice
      : 0,
  canSend: state =>
    state.spendableBalance !== null && state.spendableBalance > 0,
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
  lastUpdated: null,
  error: null,
}

export const actions: Actions = {
  async fetch({ state, effects, actions }) {
    try {
      state.balance.error = null
      const previousTotal = state.balance.totalBalance
      state.balance.breakdown = await effects.rpc.getBalances()
      const newTotal = state.balance.totalBalance
      // Update transactions if balance changed
      if (
        state.app.connectionMethod === 'rpc' &&
        state.balance.lastUpdated &&
        previousTotal !== newTotal
      ) {
        actions.transactions.updateFromWallet()
      }
      state.balance.lastUpdated = new Date().getTime()
    } catch (e) {
      state.balance.error = e
    }
  },

  async fetchMarketPrice({ state, effects, actions }) {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=veil&vs_currencies=usd'
      )
      const { veil } = await response.json()
      state.balance.marketPrice = veil.usd
    } catch (e) {
      state.balance.marketPrice = null
    }
  },
}
