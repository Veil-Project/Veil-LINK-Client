import { Action, AsyncAction, Derive } from 'store'
import { DaemonStatus } from '../../../electron/Daemon'
import compareVersions from 'compare-versions'
import getDefaultVeilDatadir from 'utils/getDefaultVeilDatadir'
import defaultConfig from 'lib/default-veilconf'
import VEILD from 'constants/veild'
import { get } from 'lodash'

export interface DaemonStartOptions {
  seed?: string
  reindex?: boolean
}

export interface DaemonOptions {
  network?: 'main' | 'test' | 'regtest' | 'dev' | null
  datadir?: string | null
  wallet?: string
}

export interface WarmupStatus {
  message: string | null
  progress: number | null
}

export interface DownloadStatus {
  inProgress: boolean
  status: DownloadProgress | null
  error: Error | null
  completedAt: number | null
}

export interface DownloadProgress {
  percent: number
  speed: number | null
  size: {
    total: number | null
    transferred: number | null
  }
}

type State = {
  path: string | null
  status: DaemonStatus | null
  installed: boolean
  version: string | null
  checksum: string | null
  upgradeAvailable: Derive<State, boolean>
  checksumValid: Derive<State, boolean>
  configured: Derive<State, boolean>
  downloaded: Derive<State, boolean>
  loaded: Derive<State, boolean>
  actualDatadir: Derive<State, string>
  download: DownloadStatus
  options: DaemonOptions
  warmup: WarmupStatus
  stdout: string[]
  stderr: string[]
  error: any
}

export const state: State = {
  path: null,
  status: null,
  installed: false,
  version: null,
  checksum: null,
  upgradeAvailable: state =>
    !!state.version && compareVersions(state.version, VEILD.version) > 0,
  checksumValid: state => state.checksum === VEILD.checksum,
  configured: state => state.options.network !== null,
  downloaded: state => state.download.completedAt !== null,
  loaded: state => state.status !== null,
  actualDatadir: state => {
    if (state.options.datadir) {
      return state.options.datadir
    } else {
      return getDefaultVeilDatadir()
    }
  },
  options: {
    network: null,
    datadir: null,
  },
  download: {
    inProgress: false,
    status: null,
    error: null,
    completedAt: null,
  },
  warmup: {
    progress: null,
    message: null,
  },
  stdout: [],
  stderr: [],
  error: null,
}

type Actions = {
  setPath: AsyncAction<string>
  load: AsyncAction
  download: AsyncAction
  configure: AsyncAction<DaemonOptions>
  start: AsyncAction<DaemonStartOptions | void>
  restart: AsyncAction
  readConfig: AsyncAction<void, string>
  writeConfig: AsyncAction<string, boolean>
  reset: Action
  logStdout: Action<string>
  logStderr: Action<string>
  handleError: Action<string | null>
  handleWarmup: Action<WarmupStatus>
}

export const actions: Actions = {
  async load({ state, effects }) {
    const savedPath = localStorage.getItem('daemonPath')
    if (savedPath) {
      await effects.daemon.setPath(savedPath)
    }

    const {
      path,
      status,
      installed,
      checksum,
      version,
      credentials,
    } = await effects.daemon.getInfo()

    state.daemon.path = path
    state.daemon.status = status
    state.daemon.installed = installed
    state.daemon.checksum = checksum
    state.daemon.version = version

    const storedOptions = localStorage.getItem('daemonOptions')
    if (storedOptions) {
      state.daemon.options = JSON.parse(storedOptions)
    }

    // Ensure RPC interface has correct details
    effects.rpc.initialize(credentials)
  },

  async setPath({ state, effects, actions }, path) {
    state.daemon.path = path
    localStorage.setItem('daemonPath', path)
    await effects.daemon.setPath(state.daemon.path)
    await actions.daemon.load()
  },

  async download({ effects, actions, state }) {
    const url = get(VEILD.download, [window.platform, window.arch])

    try {
      state.daemon.download.error = null
      state.daemon.download.completedAt = null
      state.daemon.download.inProgress = true
      const path = await effects.daemon.download(
        url,
        (_: any, progress: DownloadProgress) => {
          state.daemon.download.status = progress
        }
      )
      state.daemon.download.completedAt = new Date().getTime()
      await actions.daemon.setPath(path)
    } catch (e) {
      state.daemon.download.error = e
    } finally {
      state.daemon.download.inProgress = false
    }
  },

  async configure({ state }, options) {
    state.daemon.options = {
      ...state.daemon.options,
      ...options,
    }

    localStorage.setItem('daemonOptions', JSON.stringify(state.daemon.options))
  },

  async start({ effects, state }, options = {}) {
    try {
      state.daemon.error = null
      state.daemon.status = await effects.daemon.start({
        ...state.daemon.options,
        ...options,
      })
    } catch (e) {
      state.daemon.error = e
    }
  },

  async restart({ effects, actions, state }) {
    try {
      state.daemon.error = null
      state.daemon.warmup = { message: 'Restarting…', progress: null }
      await effects.daemon.stop()
      await actions.daemon.start()
    } catch (e) {
      state.daemon.error = e
    }
  },

  async readConfig({ state, effects }) {
    const content = await effects.daemon.readConfig(state.daemon.actualDatadir)
    return content === null ? defaultConfig : content
  },

  async writeConfig({ state, effects }, content) {
    return await effects.daemon.writeConfig(state.daemon.actualDatadir, content)
  },

  reset({ effects, actions }) {
    actions.daemon.configure({ network: null, datadir: null })
    localStorage.removeItem('daemonOptions')
    localStorage.removeItem('daemonPath')
    effects.daemon.setPath(null)
  },

  handleWarmup({ state }, { message, progress }) {
    // The message can remain the same while progress changes
    if (message && message !== state.daemon.warmup.message) {
      state.daemon.warmup.message = message
    }
    state.daemon.warmup.progress = progress
  },

  logStdout({ state }, message) {
    // state.daemon.stdout.push(message)
  },

  logStderr({ state }, message) {
    // state.daemon.stderr.push(message)
  },

  handleError({ state }, error) {
    state.daemon.error = error
  },
}
