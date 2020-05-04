import React, { useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useStore } from 'store'

import UpdateNotification from 'components/UpdateNotification'
import UpdateProgress from 'components/UpdateProgress'
import Confirm from 'components/Confirm'
import Spinner from './UI/Spinner'
import Overlay from './Overlay'
import useInterval from 'hooks/useInterval'

const AutoUpdater = () => {
  const { addToast } = useToasts()
  const { state, actions } = useStore()
  const { status, error } = state.autoUpdate

  useEffect(() => {
    switch (status) {
      case 'pending':
        actions.autoUpdate.checkForUpdates()
        break
      case 'error':
        addToast(`Auto-update error. ${error}`, {
          appearance: 'error',
        })
        break
    }
  }, [status])

  useInterval(() => {
    if (['pending', 'up-to-date', 'error', 'dismissed'].includes(status)) {
      actions.autoUpdate.checkForUpdates()
    }
  }, 1000 * 60 * 60 * 12)

  const install = () => {
    actions.autoUpdate.install()
  }

  const dismiss = () => {
    actions.autoUpdate.dismiss()
  }

  switch (status) {
    case 'update-available':
      return <UpdateNotification />
    case 'downloading':
      return <UpdateProgress />
    case 'ready-to-install':
      return (
        <Confirm
          title="Update downloaded."
          message="Do you want to restart now to install the update?"
          cancelLabel="Later"
          submitLabel="Restart now"
          onCancel={dismiss}
          onSubmit={install}
        />
      )
    case 'installing':
      return (
        <Overlay>
          <Spinner />
        </Overlay>
      )
    default:
      return null
  }
}

export default AutoUpdater
