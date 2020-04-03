import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useStore } from 'store'
import QRCode from 'qrcode.react'
import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'

interface ReceivingAddressProps {
  size?: 'lg'
}

const ReceivingAddress = ({ size }: ReceivingAddressProps) => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const { state, actions } = useStore()
  const { addToast } = useToasts()
  const { currentReceivingAddress } = state.wallet

  useEffect(() => {
    actions.wallet.fetchReceivingAddress()
  }, [actions.wallet])

  const handleRegenerateAddress = async (password: string) => {
    setIsRegenerating(true)
    const error = await actions.wallet.generateReceivingAddress(password)
    if (error) {
      addToast(error.message, { appearance: 'error' })
    } else {
      setRequiresPassword(false)
    }
    setIsRegenerating(false)
  }

  const handleCopyAddress = () => {
    if (!currentReceivingAddress) return
    window.clipboard.writeText(currentReceivingAddress)
    addToast('Copied to clipboard!', { appearance: 'info' })
  }

  return (
    <>
      {requiresPassword && (
        <PasswordPrompt
          title="Generate receiving address"
          onCancel={() => setRequiresPassword(false)}
          onSubmit={(password: string) => handleRegenerateAddress(password)}
          disabled={isRegenerating}
        />
      )}
      {currentReceivingAddress ? (
        <div>
          <div className="flex items-start justify-between">
            <div
              className={`${
                size === 'lg' ? 'w-3/5 text-base' : 'w-1/2 text-xs'
              } text-gray-300 font-mono break-all`}
            >
              {currentReceivingAddress}
            </div>
            <div
              className={`${
                size === 'lg' ? '' : '-mt-10'
              } border-4 border-white`}
            >
              <QRCode
                value={currentReceivingAddress}
                size={size === 'lg' ? 110 : 132}
              />
            </div>
          </div>
          <div className="mt-4 flex">
            <div className="mr-1 flex-1 flex">
              <Button
                size="sm"
                className="w-full"
                onClick={handleCopyAddress}
                disabled={isRegenerating}
              >
                Copy
              </Button>
            </div>
            <div className="ml-1 flex-1 flex">
              <Button
                size="sm"
                className="w-full"
                onClick={() => setRequiresPassword(true)}
                disabled={isRegenerating}
              >
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button size="sm" onClick={() => setRequiresPassword(true)}>
          Generate address
        </Button>
      )}
    </>
  )
}
export default ReceivingAddress
