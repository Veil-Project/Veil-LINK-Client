import React, { useState } from 'react'
import api from 'api'
import Button from 'components/UI/Button'
import { useSelector } from 'react-redux'
import {
  getDaemonStatus,
  getDaemonMessage,
  getDaemonProgress,
} from 'store/slices/daemon'
import Spinner from 'components/UI/Spinner'
import { FiAlertCircle } from 'react-icons/fi'

interface DaemonStatusProps {
  showStartButton?: boolean
}

const DaemonStatus = ({ showStartButton }: DaemonStatusProps) => {
  const [isStarting, setIsStarting] = useState(false)
  const status = useSelector(getDaemonStatus)
  const message = useSelector(getDaemonMessage)
  const progress = useSelector(getDaemonProgress)

  const handleStartDaemon = async () => {
    setIsStarting(true)
    try {
      await api.start()
    } finally {
      setIsStarting(false)
    }
  }

  let fallbackMessage
  switch (status) {
    case 'starting':
      fallbackMessage = 'Starting Veil server…'
      break
    case 'stopping':
      fallbackMessage = 'Stopping Veil server…'
      break
    case 'stopped':
      fallbackMessage = 'Veil server stopped.'
      break
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {status === 'stopped' && !isStarting ? (
        <FiAlertCircle size="48" className="text-orange-500" />
      ) : (
        <Spinner progress={progress} />
      )}
      <div className="mt-10 max-w-md text-center">
        {message || fallbackMessage}
      </div>

      {showStartButton && (
        <div className="mt-10">
          <Button disabled={isStarting} onClick={handleStartDaemon} primary>
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}

export default DaemonStatus
