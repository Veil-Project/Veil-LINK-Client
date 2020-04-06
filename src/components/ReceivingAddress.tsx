import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useStore } from 'store'
import QRCode from 'qrcode.react'
import Button from 'components/UI/Button'
import PasswordPrompt from 'components/PasswordPrompt'

interface ReceivingAddressProps {
  address: string | null
  size?: 'lg'
}

const ReceivingAddress = ({ address, size }: ReceivingAddressProps) =>
  address ? (
    <div>
      <div className="flex items-start justify-between">
        <div className="flex-none relative">
          <div className="border-4 border-white">
            <QRCode value={address} size={size === 'lg' ? 132 : 98} />
          </div>
        </div>
        <div
          className={`${
            size === 'lg' ? 'w-3/5 text-base' : 'flex-1 text-xs'
          } font-mono break-all ml-4 -my-1`}
          style={{ lineHeight: 1.6 }}
        >
          {address}
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="flex justify-between">
        <div
          className="bg-gray-600"
          style={{
            width: size === 'lg' ? '132px' : '106px',
            height: size === 'lg' ? '132px' : '106px',
          }}
        />
        <div
          className={`${
            size === 'lg'
              ? 'w-3/5 text-base'
              : 'flex-1 flex flex-col justify-between items-start text-xs'
          } ml-4`}
        >
          <div className="h-3 bg-gray-600 w-full" />
          <div className="h-3 bg-gray-600 w-full" />
          <div className="h-3 bg-gray-600 w-full" />
          <div className="h-3 bg-gray-600 w-full" />
          <div className="h-3 bg-gray-600 w-full" />
          <div className="h-3 bg-gray-600 w-4/5" />
        </div>
      </div>
    </div>
  )
export default ReceivingAddress
