import React, { useState, ChangeEvent } from 'react'
import scorePassword from 'utils/scorePassword'
import Button from 'components/UI/Button'
import { useStore } from 'store'
import Loading from './Loading'
import Error from 'screens/Error'

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
    <div className="w-full h-2 bg-gray-900 flex rounded-full">
      <div
        className={`flex-none rounded-full ${color}`}
        style={{ width: `${strength}%` }}
      />
    </div>
  )
}

const EncryptWallet = () => {
  const { effects } = useStore()
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [error, setError] = useState()
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
      await effects.rpc.encryptWallet(password)
    } catch (e) {
      setError(e.message)
      setPassword('')
      setPasswordConfirmation('')
    } finally {
      setIsEncrypting(false)
    }
  }

  if (error) {
    return <Error message={error.message} onDismiss={() => setError(null)} />
  }

  if (isEncrypting) {
    return <Loading message="Encrypting wallet…" />
  }

  return (
    <div className="flex-1 flex flex-col draggable">
      <div className="max-w-md m-auto flex flex-col justify-center items-center">
        <header className="mb-8 text-center">
          <h1 className="leading-none text-2xl font-semibold mb-2">
            Protect your wallet with a password
          </h1>
          <p className="text-gray-300 text-lg">
            You’ll need it to unlock the wallet and make transfers.
          </p>
        </header>

        <div className="bg-gray-700 rounded-lg p-6 w-full max-w-md">
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

          <div className="mt-2 mb-6">
            <StrengthMeter strength={passwordStrength} />
          </div>

          <Button
            disabled={
              isEncrypting ||
              password === '' ||
              password !== passwordConfirmation
            }
            onClick={doEncryptWallet}
            primary
            size="lg"
            className="w-full h-12"
          >
            Encrypt wallet
          </Button>

          <div className="mt-4 text-center text-sm text-gray-400">
            Note that this password can not be recovered. If you forget or lose
            it, the wallet will need to be restored from the seed.
          </div>
        </div>
      </div>
    </div>
  )
}

export default EncryptWallet
