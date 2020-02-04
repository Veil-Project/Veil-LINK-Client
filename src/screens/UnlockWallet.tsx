import React, { useState, ChangeEvent } from 'react'
import { RouteComponentProps } from '@reach/router'
import Button from 'components/UI/Button'
import api from 'api'

const UnlockWallet = (props: RouteComponentProps) => {
  const [password, setPassword] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const doUnlock = async () => {
    setIsUnlocking(true)
    await api.unlockWallet(password)
    setIsUnlocking(false)
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="pt-8 text-center max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Unlock required</h1>
        <p className="mt-1 text-gray-300">
          You’ll need it to unlock the wallet and make transfers.
        </p>
      </header>
      <div className="mx-auto mt-8 p-8 text-center max-w-md">
        <input
          autoFocus
          disabled={isUnlocking}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          className="h-12 bg-gray-500 rounded-t px-4 w-full text-lg outline-none"
        />
        <Button onClick={doUnlock} disabled={isUnlocking} primary size="lg">
          Unlock wallet
        </Button>
      </div>
    </div>
  )
}

export default UnlockWallet
