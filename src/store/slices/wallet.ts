import { Derive, AsyncAction } from 'store'
import { RpcError } from 'store/effects/rpc'

type State = {
  name: string | null
  version: number | null
  unlockedUntil: number | null
  currentReceivingAddress: string | null
  loaded: Derive<State, boolean>
  locked: Derive<State, boolean>
  encrypted: Derive<State, boolean>
  error: any
}

type Actions = {
  load: AsyncAction<void, Error>
  fetchReceivingAddress: AsyncAction
  generateReceivingAddress: AsyncAction
}

export const state: State = {
  name: null,
  version: null,
  unlockedUntil: null,
  currentReceivingAddress: null,
  loaded: state => state.name !== null,
  locked: state => state.unlockedUntil === 0,
  encrypted: state => state.unlockedUntil !== undefined,
  error: null,
}

export const actions: Actions = {
  async load({ state, effects, actions }) {
    try {
      const {
        walletname: name,
        walletversion: version,
        staking_active: stakingActive,
        unlocked_until: unlockedUntil,
      } = await effects.rpc.getWalletInfo()

      state.wallet.name = name
      state.wallet.version = version
      state.wallet.unlockedUntil = unlockedUntil
      actions.staking.update(stakingActive ? 'enabled' : 'disabled')

      return null
    } catch (e) {
      return e
    }
  },

  async fetchReceivingAddress({ state, effects }) {
    const address = window.localStorage.getItem('currentStealthAddress')
    if (!address) return

    try {
      const { ismine } = await effects.rpc.getAddressInfo(address)
      if (!ismine) {
        window.localStorage.removeItem('currentStealthAddress')
        return
      }

      state.wallet.currentReceivingAddress = address
    } catch (e) {
      window.localStorage.removeItem('currentStealthAddress')
    }
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
