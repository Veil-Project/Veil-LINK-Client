import React, { useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'

const Advanced = (props: RouteComponentProps) => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const { actions, effects } = useStore()
  const { addToast } = useToasts()

  const resetSettings = () => {
    actions.app.reset()
    effects.electron.relaunch()
  }

  const resetCache = () => {
    actions.transactions.reset()
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
    <div>
      <div className="grid gap-4">
        <Button primary onClick={() => setRequiresPassword(true)}>
          Rescan RingCT wallet
        </Button>
        <Button primary onClick={resetCache}>
          Reset transaction cache
        </Button>
        <Button primary onClick={resetSettings}>
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
    </div>
  )
}
export default Advanced
