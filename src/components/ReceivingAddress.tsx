import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useStore } from 'store'
import QRCode from 'qrcode.react'
import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'

const ReceivingAddress = () => {
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const { state, actions } = useStore()
  const { currentReceivingAddress } = state.wallet

  useEffect(() => {
    actions.wallet.fetchReceivingAddress()
  }, [actions.wallet])

  const handleRegenerateAddress = async (password: string) => {
    setIsRegenerating(true)
    const error = await actions.wallet.generateReceivingAddress(password)
    if (error) {
      toast(error.message, { type: 'error' })
    } else {
      setRequiresPassword(false)
    }
    setIsRegenerating(false)
  }

  const handleCopyAddress = () => {
    if (!currentReceivingAddress) return
    window.clipboard.writeText(currentReceivingAddress)
    toast('Copied to clipboard!', { type: 'info' })
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
            <div className="w-1/2 text-xs text-gray-300 font-mono break-all">
              {currentReceivingAddress}
            </div>
            <div className="-mt-10 border-4 border-white">
              <QRCode value={currentReceivingAddress} size={136} />
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
