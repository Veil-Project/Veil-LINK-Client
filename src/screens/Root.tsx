import React, { useEffect } from 'react'
import { Router } from '@reach/router'

import { useSelector, useDispatch } from 'react-redux'
import { getAppStatus } from 'store/slices/app'
import api from 'api'

import Setup from './Setup'
import WalletRoot from './WalletRoot'
import DaemonStatus from './DaemonStatus'
import Notifications from 'components/UI/Notifications'
import { getDaemonStatus, daemonStatusChanged } from 'store/slices/daemon'

const Root = () => {
  const status = useSelector(getAppStatus)
  const daemonStatus = useSelector(getDaemonStatus)
  const dispatch = useDispatch()

  useEffect(() => {
    const startDaemonAsync = async () => {
      const status = await api.getStatus()
      if (status === 'unknown') {
        await api.start()
      } else {
        dispatch(daemonStatusChanged({ status }))
      }
    }
    startDaemonAsync()
  }, [dispatch, daemonStatus])

  const renderApp = () => {
    switch (status) {
      case 'initializing':
      case 'daemon-stopping':
      case 'daemon-error':
        return (
          <div className="m-auto">
            <DaemonStatus showStartButton={status === 'daemon-error'} />
          </div>
        )
      case 'wallet-missing':
        return (
          <Router className="flex-1 flex flex-col">
            <Setup path="/*" />
          </Router>
        )
      case 'wallet-loaded':
        return <WalletRoot />
      default:
        return <div />
    }
  }

  return (
    <div className="h-screen overflow-hidden flex text-white antialiased">
      {renderApp()}
      <Notifications />
    </div>
  )
}

export default Root
