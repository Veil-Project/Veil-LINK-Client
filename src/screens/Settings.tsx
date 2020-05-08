import React, { useState } from 'react'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
import PasswordPrompt from 'components/PasswordPrompt'

import Modal from 'components/UI/Modal'
import Button from 'components/UI/Button'

const Settings = () => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const { actions, effects } = useStore()
  const { addToast } = useToasts()

  const resetSettings = async () => {
    setIsBusy(true)
    await actions.app.reset()
    effects.electron.relaunch()
  }

  const resetCache = async () => {
    setIsBusy(true)
    await actions.transactions.reset()
    await actions.transactions.updateFromWallet()
    actions.app.closeModal()
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
    <Modal className="p-10" canClose={true}>
      <div className="grid gap-4">
        <Button
          disabled={isBusy}
          secondary
          onClick={() => setRequiresPassword(true)}
        >
          Rescan RingCT wallet
        </Button>
        <Button disabled={isBusy} secondary onClick={resetCache}>
          Reset transaction cache
        </Button>
        <Button disabled={isBusy} secondary onClick={resetSettings}>
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
