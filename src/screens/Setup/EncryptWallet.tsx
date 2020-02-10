import React, { useState, ChangeEvent } from 'react'
import scorePassword from 'utils/scorePassword'
import Button from 'components/UI/Button'
import api from 'api'
import DaemonStatus from 'screens/DaemonStatus'

interface StrengthMeterProps {
  strength: number
}

const StrengthMeter = ({ strength }: StrengthMeterProps) => {
  const color =
    strength < 50
      ? 'bg-red-400'
      : strength < 80
      ? 'bg-orange-400'
      : 'bg-green-400'
  return (
    <div className="w-full mt-4 h-2 bg-gray-900 flex rounded-full">
      <div
        className={`flex-none rounded-full ${color}`}
        style={{ width: `${strength}%` }}
      />
    </div>
  )
}

const EncryptWallet = () => {
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const passwordStrength = scorePassword(password)

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handlePasswordConfirmationChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value)
  }

  const doEncryptWallet = async () => {
    setIsEncrypting(true)
    try {
      await api.encryptWallet(password)
    } finally {
      setIsEncrypting(false)
    }
  }

  if (isEncrypting) {
    return <DaemonStatus />
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-titlebar draggable" />
      <header className="pt-8 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold">
          Protect your wallet with a password
        </h1>
        <p className="mt-1 text-gray-300">
          You’ll need it to unlock the wallet and make transfers.
        </p>
      </header>
      <div className="mx-auto p-8 flex flex-wrap max-w-md -m-1 items-center justify-center">
        <div>
          <input
            autoFocus
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
            className="h-12 bg-gray-500 rounded-t px-4 w-full text-lg outline-none"
          />
          <input
            type="password"
            placeholder="Repeat password"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
            className="mt-px h-12 bg-gray-500 rounded-b px-4 w-full text-lg outline-none"
          />
        </div>
        <StrengthMeter strength={passwordStrength} />
        <div className="mt-8 text-center text-sm text-gray-300">
          Note that this password can not be recovered. If you forget or lose
          it, the wallet will need to be restored from the seed.
        </div>
      </div>
      <footer className="mt-auto flex justify-between items-center p-8 border-t border-gray-500">
        <div className="ml-auto">
          <Button
            disabled={
              isEncrypting ||
              password === '' ||
              password !== passwordConfirmation
            }
            onClick={doEncryptWallet}
            primary
            size="lg"
          >
            Encrypt wallet
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default EncryptWallet
