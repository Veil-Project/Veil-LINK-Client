import { Derive, AsyncAction, Action } from 'store'
import { version } from '../../../package.json'

type Status =
  | 'pending'
  | 'checking'
  | 'update-available'
  | 'up-to-date'
  | 'downloading'
  | 'ready-to-install'
  | 'installing'
  | 'error'
  | 'dismissed'

type State = {
  status: Status
  latestVersion: string
  releaseNotes: string
  downloadProgress: any
  error: any
  available: Derive<State, boolean>
}

export const state: State = {
  status: 'pending',
  latestVersion: version,
  releaseNotes: '',
  downloadProgress: null,
  error: null,
  available: state => state.latestVersion !== version,
}

type Actions = {
  dismiss: Action
  download: Action
  install: Action
  checkForUpdates: Action
  updateAvailable: Action<any, void>
  updateNotAvailable: Action
  downloadProgress: Action<any, void>
  downloadComplete: Action
  handleError: Action<any, void>
}

export const actions: Actions = {
  checkForUpdates({ state, effects }) {
    state.autoUpdate.status = 'checking'
    effects.electron.checkForUpdates()
  },
  dismiss({ state }) {
    state.autoUpdate.status = 'dismissed'
  },
  download({ state, effects }) {
    state.autoUpdate.status = 'downloading'
    effects.electron.downloadUpdate()
  },
  install({ state, effects }) {
    state.autoUpdate.status = 'installing'
    effects.electron.installUpdate()
  },
  updateNotAvailable({ state }) {
    state.autoUpdate.status = 'up-to-date'
  },
  updateAvailable({ state }, info) {
    state.autoUpdate.status = 'update-available'
    state.autoUpdate.latestVersion = info.version
    state.autoUpdate.releaseNotes = info.releaseNotes
  },
  downloadProgress({ state }, progress) {
    state.autoUpdate.downloadProgress = progress
  },
  downloadComplete({ state }) {
    state.autoUpdate.status = 'ready-to-install'
  },
  handleError({ state }, error) {
    state.autoUpdate.error = error
    state.autoUpdate.status = 'error'
  },
}
