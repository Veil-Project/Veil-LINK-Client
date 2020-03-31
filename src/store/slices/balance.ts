import { Derive, AsyncAction } from 'store'
import { sum, pick } from 'lodash'

type State = {
  spendable: number | null
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
  fetchBalance: AsyncAction
  fetchMarketPrice: AsyncAction
}

export const state: State = {
  spendable: null,
  marketPrice: null,
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
  marketValue: state =>
    state.spendable && state.marketPrice
      ? state.spendable * state.marketPrice
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
  async fetchBalance({ state, effects, actions }) {
    try {
      state.balance.error = null
      state.balance.spendable = await effects.rpc.getSpendableBalance()
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
