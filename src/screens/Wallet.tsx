import React, { useEffect } from 'react'
import { Router, RouteComponentProps } from '@reach/router'

import Home from './Home'
import About from './About'
import Receive from './Receive'
import Settings from './Settings/Settings'
import Console from './Console'

import ConvertLegacyCoins from './ConvertLegacyCoins'
import { useStore } from 'store'

const Wallet = (props: RouteComponentProps) => {
  const { actions } = useStore()

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const loadWallet = async () => {
      await actions.wallet.load()
      timeout = setTimeout(loadWallet, 1000)
    }
    loadWallet()
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <Home />

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
    </>
  )
}

export default Wallet
