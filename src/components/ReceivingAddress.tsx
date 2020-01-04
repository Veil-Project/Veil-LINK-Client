import React from 'react'
import { toast } from 'react-toastify'

import { useSelector, useDispatch } from 'react-redux'
import { selectors, regenerateReceivingAddress } from 'reducers/wallet'
// @ts-ignore
import QRCode from 'qrcode.react'
import Button from 'components/UI/Button'

const ReceivingAddress = () => {
  const currentReceivingAddress = useSelector(selectors.currentReceivingAddress)
  const dispatch = useDispatch()

  const handleRegenerateAddress = () => {
    dispatch(regenerateReceivingAddress())
  }

  const handleCopyAddress = () => {
    //clipboard.writeText(currentReceivingAddress)
    toast("Copied to clipboard!")
  }

  return (
    currentReceivingAddress ? (
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
            <Button size="sm" onClick={handleCopyAddress}>
              Copy
            </Button>
          </div>
          <div className="ml-1 flex-1 flex">
            <Button size="sm" onClick={handleRegenerateAddress}>
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <Button size="sm" onClick={handleRegenerateAddress}>
        Generate address
      </Button>
    )
  )
}
export default ReceivingAddress
