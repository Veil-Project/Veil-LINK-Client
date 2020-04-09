import { Derive, AsyncAction, Action } from 'store'

type State = {
  name: string | null
  version: number | null
  unlockedUntil: number | null
  currentReceivingAddress: string | null
  txCount: number | null
  loaded: Derive<State, boolean>
  locked: Derive<State, boolean>
  encrypted: Derive<State, boolean>
  hasTransactions: Derive<State, boolean>
  error: any
}

type Actions = {
  load: AsyncAction<void, Error>
  fetchReceivingAddress: AsyncAction
  resetReceivingAddress: Action
  generateReceivingAddress: AsyncAction
}

export const state: State = {
  name: null,
  version: null,
  unlockedUntil: null,
  currentReceivingAddress: null,
  txCount: null,
  loaded: state => state.name !== null,
  locked: state => state.unlockedUntil === 0,
  encrypted: state => state.unlockedUntil !== undefined,
  hasTransactions: state => state.txCount !== null && state.txCount > 0,
  error: null,
}

let postponedCycles = 0
export const actions: Actions = {
  async load({ state, effects, actions }) {
    try {
      const {
        walletname: name,
        walletversion: version,
        staking_active: stakingActive,
        unlocked_until: unlockedUntil,
        txcount: txCount,
      } = await effects.rpc.getWalletInfo()

      state.wallet.name = name.split('/')[name.split('/').length - 1]
      state.wallet.version = version
      state.wallet.unlockedUntil = unlockedUntil
      state.wallet.txCount = txCount

      // debounce disable events to prevent flicker
      if (!stakingActive || unlockedUntil === 0) {
        if (unlockedUntil === 0 || postponedCycles >= 2) {
          actions.staking.update({ status: 'disabled', force: true })
          postponedCycles = 0
        } else {
          postponedCycles += 1
        }
      } else {
        actions.staking.update({ status: 'enabled', force: true })
        postponedCycles = 0
      }

      return null
    } catch (e) {
      return e
    }
  },

  async fetchReceivingAddress({ state, effects, actions }) {
    const address = window.localStorage.getItem('currentStealthAddress')
    if (!address) return

    try {
      // Make sure the address belongs to the currently active wallet
      const { ismine } = await effects.rpc.getAddressInfo(address)
      if (!ismine) {
        actions.wallet.resetReceivingAddress()
        return
      } else {
        state.wallet.currentReceivingAddress = address
      }
    } catch (e) {
      actions.wallet.resetReceivingAddress()
    }
  },

  resetReceivingAddress({ state }) {
    window.localStorage.removeItem('currentStealthAddress')
    state.wallet.currentReceivingAddress = null
  },

  async generateReceivingAddress({ state, effects }) {
    try {
      const address = await effects.rpc.getNewAddress()
      window.localStorage.setItem('currentStealthAddress', address)
      state.wallet.currentReceivingAddress = address
    } catch (e) {
      throw e
    }
  },
}
