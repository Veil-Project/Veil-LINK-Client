import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

interface Staking {
  stakingEnabled: boolean
}

type AppState = {} & Staking

const initialState: AppState = {
  stakingEnabled: false
}

// ------------------------------------
// Slice
// ------------------------------------

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleStaking: (state) => {
      state.stakingEnabled = !state.stakingEnabled
    }
  }
})

// ------------------------------------
// Selectors
// ------------------------------------

const appSelector = (state: { app: AppState }) => state.app

const selectors = {
  stakingEnabled: createSelector(
    appSelector,
    app => app.stakingEnabled,
  )
}

const { actions } = appSlice
export { selectors, actions }
export default appSlice.reducer