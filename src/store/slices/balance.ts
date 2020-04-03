import { Derive, AsyncAction } from 'store'
import { sum, pick } from 'lodash'

type State = {
  spendableBalance: Derive<State, number>
  unconfirmedBalance: Derive<State, number>
  immatureBalance: Derive<State, number>
  pendingBalance: Derive<State, number>
  legacyBalance: Derive<State, number>
  marketValue: Derive<State, number>
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
  error: any
}

type Actions = {
  fetch: AsyncAction
  fetchMarketPrice: AsyncAction
}

export const state: State = {
  spendableBalance: state => state.breakdown.ringctSpendable,
  unconfirmedBalance: state =>
    sum(
      Object.values(
        pick(
          state.breakdown,
          'basecoinUnconfirmed',
          'ctUnconfirmed',
          'ringctUnconfirmed',
          'zerocoinUnconfirmed'
        )
      )
    ),
  immatureBalance: state =>
    sum(
      Object.values(
        pick(
          state.breakdown,
          'basecoinImmature',
          'ctImmature',
          'ringctImmature',
          'zerocoinImmature'
        )
      )
    ),
  pendingBalance: state => state.unconfirmedBalance + state.immatureBalance,
  legacyBalance: state =>
    sum(
      Object.values(
        pick(
          state.breakdown,
          'basecoinSpendable',
          'ctSpendable',
          'zerocoinSpendable'
        )
      )
    ),
  marketPrice: null,
  marketValue: state =>
    state.spendableBalance && state.marketPrice
      ? state.spendableBalance * state.marketPrice
      : 0,
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
  error: null,
}

export const actions: Actions = {
  async fetch({ state, effects, actions }) {
    try {
      state.balance.error = null
      state.balance.breakdown = await effects.rpc.getBalances()
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
