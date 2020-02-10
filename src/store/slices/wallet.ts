import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { AppThunk } from 'store'
import api from 'api'
import { handleRpcError } from './app'
import { toast } from 'react-toastify'

export type StakingStatus = 'disabled' | 'enabled'

type WalletState = {
  chain?: string
  unlockedUntil?: number
  stakingStatus: {
    current: StakingStatus
    requested: StakingStatus | null
  }
  initialBlockDownload: boolean
  verificationProgress: number
  currentReceivingAddress: string | null
}

const initialState: WalletState = {
  chain: undefined,
  unlockedUntil: undefined,
  stakingStatus: {
    current: 'disabled',
    requested: null,
  },
  initialBlockDownload: false,
  verificationProgress: 1,
  currentReceivingAddress: null,
}

// ------------------------------------
// Slice
// ------------------------------------

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    walletInitialized(state, { payload }) {
      state.chain = payload.chain
      state.initialBlockDownload = payload.initialBlockDownload
      state.verificationProgress = payload.verificationProgress
      state.unlockedUntil = payload.unlockedUntil

      const requestedStakingStatus = state.stakingStatus.requested
      const newStakingStatus = payload.stakingActive ? 'enabled' : 'disabled'
      if (
        !requestedStakingStatus ||
        newStakingStatus === state.stakingStatus.requested
      ) {
        state.stakingStatus.current = newStakingStatus
        state.stakingStatus.requested = null
      }
    },

    stakingDisableRequested(state) {
      state.stakingStatus.requested = 'disabled'
    },
    stakingDisabled(state) {
      state.stakingStatus.current = 'disabled'
    },
    stakingEnableRequested(state) {
      state.stakingStatus.requested = 'enabled'
    },
    stakingEnabled(state) {
      state.stakingStatus.current = 'enabled'
    },
    stakingStatusChangeCancelled(state) {
      state.stakingStatus.requested = null
    },
    stakingFailed(state, { payload }) {
      // todo
    },

    receivingAddressUpdated: (state, { payload }) => {
      state.currentReceivingAddress = payload
    },
  },
})

// ------------------------------------
// Selectors
// ------------------------------------

const walletSelector = (state: { wallet: WalletState }) => state.wallet

export const getBlockchainInfo = createSelector(
  walletSelector,
  ({ chain, initialBlockDownload, verificationProgress }) => ({
    chain,
    initialBlockDownload,
    verificationProgress,
  })
)
export const getWalletLoaded = createSelector(
  walletSelector,
  wallet => wallet.chain !== undefined
)
export const getWalletLocked = createSelector(
  walletSelector,
  wallet => wallet.unlockedUntil === 0
)
export const getWalletEncrypted = createSelector(
  walletSelector,
  wallet => wallet.unlockedUntil !== undefined
)
export const getCurrentReceivingAddress = createSelector(
  walletSelector,
  wallet => wallet.currentReceivingAddress
)
export const getStakingStatus = createSelector(
  walletSelector,
  wallet => wallet.stakingStatus
)

// ------------------------------------
// Actions
// ------------------------------------

export const initializeWallet = (): AppThunk => async dispatch => {
  try {
    const { staking_active, unlocked_until } = await api.getWalletInfo()
    const {
      chain,
      initialblockdownload,
      verificationprogress,
    } = await api.getBlockchainInfo()

    dispatch(
      slice.actions.walletInitialized({
        chain,
        initialBlockDownload: initialblockdownload,
        verificationProgress: verificationprogress,
        stakingActive: staking_active,
        unlockedUntil: unlocked_until,
      })
    )
  } catch (e) {
    toast(e.message, { type: 'error' })
    dispatch(handleRpcError(e))
  }
}

let stakingTimeout: ReturnType<typeof setTimeout>
export const enableStaking = (): AppThunk => async (dispatch, getState) => {
  clearTimeout(stakingTimeout)
  dispatch(slice.actions.stakingEnableRequested())

  const password = await window.promptForInput({
    title: 'Enable staking',
    label: 'Please enter your wallet password',
    inputAttrs: {
      type: 'password',
    },
  })

  if (!password) {
    dispatch(slice.actions.stakingStatusChangeCancelled())
    return
  }

  try {
    await api.unlockWalletForStaking(password)

    // Staking status will get updated through the periodic polling
    // Give it 10 seconds to enable, otherwise notify and reset request state
    stakingTimeout = setTimeout(() => {
      const {
        wallet: { stakingStatus },
      } = getState()
      if (
        stakingStatus.requested === 'enabled' &&
        stakingStatus.current !== 'enabled'
      ) {
        dispatch(slice.actions.stakingStatusChangeCancelled())
        alert(
          'Unable to enable staking. Make sure you have enough balance to stake.'
        )
      }
    }, 10 * 1000)
  } catch (e) {
    toast(e.message, { type: 'error' })
    dispatch(slice.actions.stakingStatusChangeCancelled())
    dispatch(handleRpcError(e))
  }
}

export const disableStaking = (): AppThunk => async (dispatch, getState) => {
  try {
    clearTimeout(stakingTimeout)

    dispatch(slice.actions.stakingDisableRequested())
    await api.lockWallet()

    // Staking status will get updated through the periodic polling
    // Give it 10 seconds to enable, otherwise notify and reset request state
    stakingTimeout = setTimeout(() => {
      const {
        wallet: { stakingStatus },
      } = getState()
      if (
        stakingStatus.requested === 'disabled' &&
        stakingStatus.current !== 'disabled'
      ) {
        dispatch(slice.actions.stakingStatusChangeCancelled())
        alert('Unable to disable staking.')
      }
    }, 30 * 1000)
  } catch (e) {
    toast(e.message, { type: 'error' })
    dispatch(handleRpcError(e))
  }
}

export const fetchReceivingAddress = (): AppThunk => async dispatch => {
  const address = window.localStorage.getItem('currentStealthAddress')
  if (!address) return

  try {
    const { ismine } = await api.getAddressInfo(address)
    if (!ismine) {
      window.localStorage.removeItem('currentStealthAddress')
      return
    }

    dispatch(slice.actions.receivingAddressUpdated(address))
  } catch (e) {
    window.localStorage.removeItem('currentStealthAddress')
  }
}

export const fetchNewReceivingAddress = (): AppThunk => async dispatch => {
  const password = await window.promptForInput({
    title: 'Generate receiving address',
    label: 'Please enter wallet password:',
    alwaysOnTop: true,
    inputAttrs: {
      type: 'password',
    },
  })

  if (!password) {
    return
  }

  try {
    await api.unlockWallet(password)
    const address = await api.getNewAddress()
    window.localStorage.setItem('currentStealthAddress', address)
    dispatch(slice.actions.receivingAddressUpdated(address))
  } catch (e) {
    toast(e.message, { type: 'error' })
    dispatch(handleRpcError(e))
  } finally {
    api.lockWallet()
  }
}

// ------------------------------------
// Cleanup
// ------------------------------------

window.ipcRenderer.on('app-status-change', (_event: any, status: string) => {
  if (status === 'stopping') {
    clearTimeout(stakingTimeout)
  }
})

// ------------------------------------
// Reducer
// ------------------------------------

export default slice.reducer
