import React from 'react'
import { Router } from '@reach/router'

import { useSelector } from 'react-redux'
import { selectors } from 'reducers/wallet'

import Home from './Home'
import About from './About'
import Receive from './Receive'
import Setup from './Setup/Setup'
import Settings from './Settings/Settings'
import Console from './Console'

import AppSidebar from '../components/AppSidebar'
import Notifications from 'components/UI/Notifications'

const Root = () => {
  const wallets = useSelector(selectors.wallets)

  return (
    <div className="h-screen overflow-hidden flex text-white antialiased">
      {wallets.length === 0 ? (
        <Router className="flex-1 flex flex-col">
          <Setup path="/*" />
        </Router>
      ) : (
        <>
          <AppSidebar />
          <Router className="flex-1 flex">
            <Home path="/*" />
          </Router>
          <Router className="absolute inset-0 p-20 flex items-stretch justify-center" style={{ backgroundColor: 'rgba(0,0,0,.33)' }}>
            <About path="/about" />
            <Receive path="/receive" />
            <Settings path="/settings/*" />
            <Console path="/console" />
          </Router>
        </>
      )}
      <Notifications />
    </div>
  )
}

export default Root
