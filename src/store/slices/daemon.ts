export type DaemonStatus =
  | 'unknown'
  | 'starting'
  | 'started'
  | 'stopping'
  | 'stopped'

type State = {
  status: DaemonStatus
  message: string | null
  progress: number | null
  stdout: string[]
  error: any
}

type Actions = {}

export const state: State = {
  status: 'unknown',
  progress: null,
  message: null,
  stdout: [],
  error: null,
}

export const actions: Actions = {}
