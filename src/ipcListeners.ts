import { appStatusChanged, AppStatus } from 'store/slices/app'
import { daemonStatusChanged, DaemonStatus } from 'store/slices/daemon'

export default function(dispatch: any, getState: any) {
  window.ipcRenderer.on(
    'daemon-status-change',
    (event: any, status: DaemonStatus, message?: string, progress?: number) => {
      dispatch(
        daemonStatusChanged({
          status,
          message,
          progress,
        })
      )
    }
  )

  window.ipcRenderer.on(
    'app-status-change',
    (event: any, status: AppStatus) => {
      dispatch(appStatusChanged(status))
    }
  )
}
