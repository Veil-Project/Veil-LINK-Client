import React, { useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useStore } from 'store'

import UpdateNotification from 'components/UpdateNotification'
import UpdateProgress from 'components/UpdateProgress'
import Confirm from 'components/Confirm'
import Spinner from './UI/Spinner'
import Overlay from './Overlay'

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
        addToast(`An error occured when updating. ${error}`, {
          appearance: 'error',
        })
        break
    }
  }, [status])

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
