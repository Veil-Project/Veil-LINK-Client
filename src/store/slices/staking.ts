import { AsyncAction, Action, Derive } from 'store'

export type StakingStatus = 'disabled' | 'enabled'

type State = {
  status: {
    current: StakingStatus
    requested: StakingStatus | null
  }
  isEnabled: Derive<State, boolean>
  isAvailable: Derive<State, boolean>
  error: string | null
}

interface ResetOptions {
  targetState: string
  errorMessage: string
}

type Actions = {
  reset: AsyncAction<ResetOptions>
  update: Action<{ status: StakingStatus; force?: boolean }>
  enable: AsyncAction<string, Error>
  disable: AsyncAction<void, Error>
}

export const state: State = {
  status: {
    current: 'disabled',
    requested: null,
  },
  isEnabled: state => state.status.current === 'enabled',
  isAvailable: (state, globalState) =>
    globalState.balance.breakdown.zerocoinSpendable > 0,
  error: null,
}

let stakingTimeout: ReturnType<typeof setTimeout>

export const actions: Actions = {
  async reset({ state }, { targetState, errorMessage }) {
    if (
      state.staking.status.requested === targetState &&
      state.staking.status.current !== targetState
    ) {
      state.staking.status.requested = state.staking.status.current
      state.staking.error = errorMessage
    }
  },

  update({ state }, { status, force = false }) {
    if (
      force ||
      !state.staking.status.requested ||
      state.staking.status.requested === status
    ) {
      state.staking.status.current = status
      state.staking.status.requested = null
    }
  },

  async enable({ state, effects, actions }, password) {
    clearTimeout(stakingTimeout)
    state.staking.error = null
    state.staking.status.requested = 'enabled'

    try {
      await effects.rpc.unlockWalletForStaking(password)

      // Staking status will get updated through the periodic polling
      // Give it 10 seconds to enable, otherwise notify and reset requested state
      stakingTimeout = setTimeout(() => {
        actions.staking.reset({
          targetState: 'enabled',
          errorMessage:
            'Unable to enable staking. Make sure you have enough balance to stake.',
        })
      }, 15 * 1000)
      return null
    } catch (e) {
      state.staking.status.requested = state.staking.status.current
      return e
    }
  },

  async disable({ state, effects, actions }) {
    clearTimeout(stakingTimeout)
    state.staking.error = null
    state.staking.status.requested = 'disabled'

    try {
      await effects.rpc.lockWallet()

      // Staking status will get updated through the periodic polling
      // Give it 10 seconds to enable, otherwise notify and reset requested state
      stakingTimeout = setTimeout(() => {
        actions.staking.reset({
          targetState: 'disabled',
          errorMessage: 'Unable to disable staking.',
        })
      }, 15 * 1000)
      return null
    } catch (e) {
      state.staking.status.requested = state.staking.status.current
      return e
    }
  },
}
