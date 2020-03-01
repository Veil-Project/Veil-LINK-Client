import { AsyncAction } from 'store'
import { DaemonStatus } from './slices/daemon'
// import crypto from 'crypto'

export const onInitialize: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  // const user = 'letmein123' //crypto.randomBytes(256 / 8).toString('hex')
  // const pass = 'letmein123' //crypto.randomBytes(256 / 8).toString('hex')

  effects.wallet.initialize({
    onLoaded: () => {
      state.status = 'wallet'
    },
    onMissing: () => {
      state.status = 'setup'
    },
  })

  effects.daemon.initialize({
    onStatus: (status: DaemonStatus) => {
      alert(status)
      state.daemon.status = status
    },
    onMessage: (message: string | null) => {
      state.daemon.message = message
    },
    onProgress: (progress: number | null) => {
      state.daemon.progress = progress
    },
    onStdout: (message: string) => {
      state.daemon.stdout.push(message)
    },
    onStderr: (error: string) => {
      state.daemon.error = error
    },
  })
}
