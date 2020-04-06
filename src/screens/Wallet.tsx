import React, { useEffect } from 'react'
import { Router, RouteComponentProps } from '@reach/router'

import Home from './Home'
import About from './About'
import Receive from './Receive'
import Settings from './Settings/Settings'
import Console from './Console'

import ConvertLegacyCoins from './ConvertLegacyCoins'
import { useStore } from 'store'
import EncryptWallet from './EncryptWallet'
import AppSidebar from 'components/AppSidebar'

const Wallet = (props: RouteComponentProps) => {
  const { state, actions } = useStore()

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const updateAppData = async () => {
      await actions.app.update()
      timeout = setTimeout(updateAppData, 5 * 1000)
    }
    updateAppData()
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (!state.wallet.encrypted) {
    return <EncryptWallet />
  }

  return (
    <div className="flex-1 w-full flex">
      <div
        className="flex-none bg-gray-700 flex flex-col relative"
        style={{ width: 310 }}
      >
        <AppSidebar />
      </div>
      <div
        className="flex-1 flex flex-col bg-gray-800 relative"
        style={{ minWidth: 0 }}
      >
        <Home />
      </div>

      <Router
        className="fixed inset-0 z-50 p-20 flex items-stretch justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,.33)' }}
      >
        <About path="/about" />
        <Receive path="/receive" />
        <Settings path="/settings/*" />
        <Console path="/console" />
        <ConvertLegacyCoins path="/convert" />
      </Router>
    </div>
  )
}

export default Wallet
