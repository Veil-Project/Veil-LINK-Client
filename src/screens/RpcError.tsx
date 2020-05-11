import React, { useState } from 'react'
import Button from 'components/UI/Button'
import { useStore } from 'store'
import { FiAlertCircle } from 'react-icons/fi'

const RpcError = () => {
  const { state, actions } = useStore()
  const { status } = state.daemon

  const handleRetry = () => {
    actions.app.load()
  }

  const handleReset = () => {
    actions.app.resetConnection()
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <FiAlertCircle size="48" className="text-orange-500" />
      <div className="max-w-md mt-4 text-lg text-center">
        Unable to connect to RPC server
      </div>
      <div className="w-full max-w-xs mt-10">
        <div className="flex flex-col w-full max-w-xs p-6 bg-gray-700 rounded">
          <Button size="lg" onClick={handleRetry} primary>
            Try again
          </Button>
          <Button size="lg" onClick={handleReset} className="mt-3">
            Reconfigure
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RpcError
