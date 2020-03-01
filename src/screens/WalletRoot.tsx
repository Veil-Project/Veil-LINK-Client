import React, { useEffect, useState } from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import { useStore } from 'store'

import Home from './Home'
import About from './About'
import Receive from './Receive'
import Settings from './Settings/Settings'
import Console from './Console'
import EncryptWallet from './EncryptWallet'
import Error from './Error'

import AppSidebar from 'components/AppSidebar'
import ConvertLegacyCoins from './ConvertLegacyCoins'
import Loading from 'screens/Loading'

const WalletRoot = (props: RouteComponentProps) => {
  const [error, setError] = useState()
  const { state, actions } = useStore()
  const { loaded, encrypted } = state.wallet

  useEffect(() => {
    ;(async () => {
      const error = await actions.wallet.load()
      if (error) {
        setError(error)
      }
    })()
  }, [actions.wallet])

  if (error) {
    return <Error message={error.message} />
  }

  if (!loaded) {
    return <Loading message="Loading wallet…" />
  }

  if (!encrypted) {
    return <EncryptWallet />
  }

  return (
    <>
      <div className="flex-1 w-full" style={{ paddingLeft: 360 }}>
        <aside
          className="absolute top-0 left-0 bottom-0 flex flex-col"
          style={{ width: 360 }}
        >
          <AppSidebar />
        </aside>
        <Home />
      </div>

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
    </>
  )
}

export default WalletRoot
