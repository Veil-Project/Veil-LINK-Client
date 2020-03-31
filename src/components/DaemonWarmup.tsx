import React from 'react'
import { useStore } from 'store'
import Loading from 'screens/Loading'

const DaemonWarmup = () => {
  const { state } = useStore()
  const { message, progress } = state.daemon.warmup

  return (
    <Loading message={message || 'Starting veild...'} progress={progress} />
  )
}

export default DaemonWarmup
