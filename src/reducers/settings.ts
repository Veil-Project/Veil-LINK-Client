import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

interface UserPrefs {
  locale: string
}

interface RpcConfig {
  protocol: string,
  user: string,
  pass: string,
  host: string,
  port: string,
}

type SettingsState = {
  rpcConfig: RpcConfig
} & UserPrefs

const initialState: SettingsState = {
  locale: 'en',
  rpcConfig: {
    protocol: 'http',
    user: 'veild',
    pass: '',
    host: '127.0.0.1',
    port: '58812',
  },
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setRpcConfig: (state, action: PayloadAction<RpcConfig>) => {
      state.rpcConfig = action.payload
    }
  }
})

// ------------------------------------
// Selectors
// ------------------------------------

const settingsSelector = (state: { settings: SettingsState }) => state.settings

const selectors = {
  rpcConfig: createSelector(
    settingsSelector,
    settings => settings.rpcConfig
  )
}

const { actions } = slice
export { selectors, actions }
export default slice.reducer