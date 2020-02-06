import React, { useEffect } from 'react'
import { Router } from '@reach/router'

import { useSelector, useDispatch } from 'react-redux'
import {
  initializeWallet,
  getWalletLoaded,
  getWalletEncrypted,
} from 'store/slices/wallet'

import Home from './Home'
import About from './About'
import Receive from './Receive'
import Settings from './Settings/Settings'
import Console from './Console'
import EncryptWallet from './Setup/EncryptWallet'
import DaemonStatus from './DaemonStatus'

import AppSidebar from 'components/AppSidebar'
import { getDaemonStatus } from 'store/slices/daemon'
import ConvertLegacyCoins from './ConvertLegacyCoins'

const WalletRoot = () => {
  const walletLoaded = useSelector(getWalletLoaded)
  const walletEncrypted = useSelector(getWalletEncrypted)
  const daemonStatus = useSelector(getDaemonStatus)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeWallet())
    // const updateInterval = setInterval(() => {
    //   dispatch(initializeWallet())
    // }, 1000)
    // return () => {
    //   clearInterval(updateInterval)
    // }
  }, [dispatch])

  if (!walletLoaded) {
    return <DaemonStatus />
  }

  if (!walletEncrypted) {
    return <EncryptWallet />
  }

  return (
    <>
      <AppSidebar />
      <Router className="flex-1 flex">
        <Home path="/*" />
      </Router>
      <Router
        className="absolute inset-0 p-20 flex items-stretch justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,.33)' }}
      >
        <About path="/about" />
        <Receive path="/receive" />
        <Settings path="/settings/*" />
        <Console path="/console" />
        <ConvertLegacyCoins path="/convert" />
      </Router>
      {daemonStatus !== 'started' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 z-0" />
          <div className="w-full max-w-md p-12 relative z-10">
            <DaemonStatus />
          </div>
        </div>
      )}
    </>
  )
}

export default WalletRoot
