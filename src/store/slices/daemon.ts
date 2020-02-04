import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

export type DaemonStatus =
  | 'unknown'
  | 'starting'
  | 'started'
  | 'stopping'
  | 'stopped'

type DaemonState = {
  status: DaemonStatus
  message?: string
  progress?: number
}

const initialState: DaemonState = {
  status: 'unknown',
  message: undefined,
  progress: undefined,
}

// ------------------------------------
// Slice
// ------------------------------------

const slice = createSlice({
  name: 'daemon',
  initialState,
  reducers: {
    daemonStatusChanged(state, { payload }) {
      state.status = payload.status
      state.message = payload.message
      state.progress = payload.progress
    },
  },
})

// ------------------------------------
// Selectors
// ------------------------------------

const daemonSelector = (state: { daemon: DaemonState }) => state.daemon
export const getDaemonStatus = createSelector(
  daemonSelector,
  ({ status }) => status
)
export const getDaemonMessage = createSelector(
  daemonSelector,
  ({ message }) => message
)
export const getDaemonProgress = createSelector(
  daemonSelector,
  ({ progress }) => progress
)

// ------------------------------------
// Actions
// ------------------------------------

export const { daemonStatusChanged } = slice.actions

// ------------------------------------
// Reducer
// ------------------------------------

export default slice.reducer
