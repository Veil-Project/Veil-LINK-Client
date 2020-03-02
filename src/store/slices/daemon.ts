import { Action } from 'store'

export type DaemonStatus =
  | 'unknown'
  | 'starting'
  | 'new-wallet'
  | 'already-running'
  | 'wallet-loaded'
  | 'stopping'
  | 'stopped'
  | 'crashed'

type State = {
  status: DaemonStatus
  message: string | null
  progress: number | null
  stdout: string[]
  error: any
}

type Actions = {
  changeStatus: Action<DaemonStatus>
  logStdout: Action<string>
  handleError: Action<string | null>
  setProgress: Action<number | null>
  setMessage: Action<string | null>
}

export const state: State = {
  status: 'unknown',
  progress: null,
  message: null,
  stdout: [],
  error: null,
}

export const actions: Actions = {
  changeStatus({ state }, status) {
    state.daemon.status = status
  },
  logStdout({ state }, message) {
    state.daemon.stdout.push(message)
  },
  handleError({ state }, error) {
    state.daemon.error = error
  },
  setMessage({ state }, message) {
    state.daemon.message = message
  },
  setProgress({ state }, progress) {
    state.daemon.progress = progress
  },
}
