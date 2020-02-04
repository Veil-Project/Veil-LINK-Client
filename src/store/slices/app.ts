import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { AppThunk } from 'store'
import RPC_ERRORS from 'constants/rpcErrors'

export type AppStatus =
  | 'initializing'
  | 'wallet-missing'
  | 'wallet-loaded'
  | 'daemon-error'
  | 'daemon-stopping'

type AppState = {
  status: AppStatus
}

const initialState: AppState = {
  status: 'initializing',
}

// ------------------------------------
// Slice
// ------------------------------------

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appStatusChanged(state, { payload }) {
      state.status = payload
    },
  },
})

// ------------------------------------
// Selectors
// ------------------------------------

const appSelector = (state: { app: AppState }) => state.app
export const getAppStatus = createSelector(appSelector, app => app.status)

// ------------------------------------
// Actions
// ------------------------------------

interface RpcError {
  code: number
  message: string
}

export const handleRpcError = (e: RpcError): AppThunk => async dispatch => {
  switch (e.code) {
    case RPC_ERRORS.RPC_IN_WARMUP:
    // TODO
  }
}

export const { appStatusChanged } = slice.actions

// ------------------------------------
// Reducer
// ------------------------------------

export default slice.reducer
