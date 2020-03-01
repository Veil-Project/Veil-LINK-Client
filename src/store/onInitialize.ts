import { AsyncAction } from 'store'
import { DaemonStatus } from './slices/daemon'

export const onInitialize: AsyncAction = async ({ effects, actions }) => {
  effects.daemon.initialize({
    onStatus: (_event: any, status: DaemonStatus) => {
      actions.daemon.changeStatus(status)
    },
    onMessage: (_event: any, message: string | null) => {
      actions.daemon.setMessage(message)
    },
    onProgress: (_event: any, progress: number | null) => {
      actions.daemon.setProgress(progress)
    },
    onStdout: (_event: any, message: string) => {
      actions.daemon.logStdout(message)
    },
    onStderr: (_event: any, error: string) => {
      actions.daemon.handleError(error)
    },
  })
}
