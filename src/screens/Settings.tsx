import React, { useState } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
import PasswordPrompt from 'components/PasswordPrompt'

import Modal from 'components/UI/Modal'
import Button from 'components/UI/Button'

const Settings = (props: RouteComponentProps) => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const { actions, effects } = useStore()
  const { addToast } = useToasts()

  const resetSettings = () => {
    actions.app.reset()
    effects.electron.relaunch()
  }

  const resetCache = async () => {
    await actions.transactions.reset()
    await actions.transactions.updateFromWallet()
  }

  const startRescan = async (password: string) => {
    try {
      await effects.rpc.unlockWallet(password)
      await effects.rpc.rescanRingCtWallet()
      addToast('Rescan started', { appearance: 'success' })
    } catch (e) {
      addToast(e.message, { appearance: 'error' })
    } finally {
      await effects.rpc.lockWallet()
      setRequiresPassword(false)
    }
  }

  return (
    <Modal className="p-10" onClose={() => navigate('/')} canClose={true}>
      <div className="grid gap-4">
        <Button secondary onClick={() => setRequiresPassword(true)}>
          Rescan RingCT wallet
        </Button>
        <Button secondary onClick={resetCache}>
          Reset transaction cache
        </Button>
        <Button secondary onClick={resetSettings}>
          Reset settings
        </Button>
      </div>

      {requiresPassword && (
        <PasswordPrompt
          title={`Rescan RingCT wallet`}
          onCancel={() => setRequiresPassword(false)}
          onSubmit={startRescan}
        />
      )}
    </Modal>
  )
}
export default Settings
