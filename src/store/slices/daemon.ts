import { Action, AsyncAction, Derive } from 'store'
import { DaemonStatus } from '../../../electron/Daemon'

const VEILD_DOWNLOAD_URL =
  'https://cdn-std.droplr.net/files/acc_937201/T3gdhp?download'
const VEILD_CHECKSUM = '741efac28070072ed8a2788934a70eee'

export interface DaemonOptions {
  network?: 'main' | 'test' | 'regtest' | 'dev' | null
  datadir?: string | null
  port?: string
  seed?: string
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
  checksumValid: Derive<State, boolean>
  configured: Derive<State, boolean>
  downloaded: Derive<State, boolean>
  loaded: Derive<State, boolean>
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
  checksumValid: state => state.checksum === VEILD_CHECKSUM,
  configured: state => state.options.network !== null,
  downloaded: state => state.download.completedAt !== null,
  loaded: state => state.status !== null,
  options: {
    network: null,
    datadir: null,
    port: '58812',
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
  start: AsyncAction<string | void>
  restart: AsyncAction
  logStdout: Action<string>
  logStderr: Action<string>
  handleError: Action<string | null>
  handleWarmup: Action<WarmupStatus>
}

export const actions: Actions = {
  async load({ state, effects }) {
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
    await effects.daemon.setPath(state.daemon.path)
    await actions.daemon.load()
  },

  async download({ effects, actions, state }) {
    try {
      state.daemon.download.error = null
      state.daemon.download.completedAt = null
      state.daemon.download.inProgress = true
      state.daemon.path = await effects.daemon.download(
        VEILD_DOWNLOAD_URL,
        (_: any, progress: DownloadProgress) => {
          state.daemon.download.status = progress
        }
      )
      state.daemon.download.completedAt = new Date().getTime()
      await actions.daemon.load()
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

  async start({ effects, state }, seed?) {
    try {
      state.daemon.error = null
      state.daemon.status = await effects.daemon.start({
        ...state.daemon.options,
        seed: seed || undefined,
      })
    } catch (e) {
      state.daemon.error = e
    }
  },

  async restart({ effects, actions, state }) {
    try {
      state.daemon.error = null
      await effects.daemon.stop()
      await actions.daemon.start()
    } catch (e) {
      state.daemon.error = e
    }
  },

  handleWarmup({ state }, { message, progress }) {
    // The message can remain the same while progress changes
    if (message && message !== state.daemon.warmup.message) {
      state.daemon.warmup.message = message
    }
    state.daemon.warmup.progress = progress
  },

  logStdout({ state }, message) {
    state.daemon.stdout.push(message)
  },

  logStderr({ state }, message) {
    state.daemon.stderr.push(message)
  },

  handleError({ state }, error) {
    state.daemon.error = error
  },
}
