import React, { useState } from 'react'
import Button from 'components/UI/Button'
import { useStore } from 'store'
import Spinner from 'components/UI/Spinner'
import { FiAlertCircle } from 'react-icons/fi'
import DaemonWarmup from 'components/DaemonWarmup'

interface DaemonStatusProps {
  showStartButton?: boolean
}

const DaemonStatus = ({ showStartButton }: DaemonStatusProps) => {
  const [isStarting, setIsStarting] = useState(false)
  const { state, actions } = useStore()
  const { status } = state.daemon

  const handleStartDaemon = async () => {
    setIsStarting(true)
    try {
      await actions.daemon.start()
      await actions.app.transition()
    } finally {
      setIsStarting(false)
    }
  }

  let message
  switch (status) {
    case 'starting':
      message = 'Starting Veil server…'
      break
    case 'stopping':
      message = 'Stopping Veil server…'
      break
    case 'stopped':
      message = 'Veil server stopped.'
      break
    case 'already-started':
      message =
        'It looks like another instance of Veil is already running. Please stop it and try again.'
      break
    default:
      message = 'Default'
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {isStarting ? (
        <DaemonWarmup />
      ) : (
        <>
          <FiAlertCircle size="48" className="text-orange-500" />
          <div className="mt-4 max-w-md text-lg text-center">{message}</div>
          {showStartButton && (
            <div className="mt-10">
              <Button
                size="lg"
                disabled={isStarting}
                onClick={handleStartDaemon}
                primary
              >
                Try Again
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DaemonStatus
