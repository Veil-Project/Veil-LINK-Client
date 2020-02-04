import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

import { useSelector, useDispatch } from 'react-redux'
import {
  getCurrentReceivingAddress,
  fetchReceivingAddress,
  fetchNewReceivingAddress,
} from 'store/slices/wallet'
import QRCode from 'qrcode.react'
import Button from 'components/UI/Button'

const ReceivingAddress = () => {
  const currentReceivingAddress = useSelector(getCurrentReceivingAddress)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchReceivingAddress())
  }, [dispatch])

  const handleRegenerateAddress = () => {
    dispatch(fetchNewReceivingAddress())
  }

  const handleCopyAddress = () => {
    if (!currentReceivingAddress) return
    window.clipboard.writeText(currentReceivingAddress)
    toast('Copied to clipboard!', { type: 'info' })
  }

  return currentReceivingAddress ? (
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
          <Button size="sm" className="w-full" onClick={handleCopyAddress}>
            Copy
          </Button>
        </div>
        <div className="ml-1 flex-1 flex">
          <Button
            size="sm"
            className="w-full"
            onClick={handleRegenerateAddress}
          >
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
}
export default ReceivingAddress
