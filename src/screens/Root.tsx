import React, { useEffect, useState } from 'react'
import { useStore } from 'store'

import AppLayout, { Sidebar } from 'layouts/App'
import Startup from './Startup'
import Setup from './Setup'
import Connect from './Connect'
import Wallet from './Wallet'
import Shutdown from './Shutdown'
import Error from './Error'
import Welcome from 'components/Welcome'
import AppSidebar from 'components/AppSidebar'
import EncryptWallet from './EncryptWallet'
import DaemonStatus from './DaemonStatus'

const Root = () => {
  const [isStarted, setIsStarted] = useState(false)
  const { actions, state } = useStore()

  useEffect(() => {
    ;(async () => {
      await actions.daemon.load()
      await actions.app.transition()
    })()
  }, [])

  let width, delay, sidebar, body
  switch (state.app.status) {
    case 'initial':
      width = '100vw'
      body = null
      sidebar = <div key="initial" />
      break
    case 'startup':
      width = '100vw'
      body = null
      sidebar = <Startup key="startup" />
      break
    case 'connect':
      width = isStarted ? '50vw' : '100vw'
      delay = 0.3
      body = <Connect />
      sidebar = <Welcome key="welcome" onStart={() => setIsStarted(true)} />
      break
    case 'setup':
      width = '0'
      body = <Setup />
      sidebar = <div key="setup" />
      break
    case 'conflict':
      width = '100vw'
      body = null
      sidebar = <DaemonStatus showStartButton={true} />
      break
    case 'wallet':
      if (!state.wallet.encrypted) {
        body = <EncryptWallet />
        sidebar = <div key="wallet"></div>
        width = 0
      } else {
        width = '360px'
        body = <Wallet />
        sidebar = <AppSidebar key="wallet" />
      }
      break
    case 'shutdown':
      width = '100vw'
      body = null
      sidebar = <Shutdown key="shutdown" />
      break
    default:
      width = '100vw'
      body = null
      sidebar = <Error key="error" message="Unknown app state" />
  }

  return (
    <AppLayout
      sidebar={
        <Sidebar width={width} delay={delay}>
          {sidebar}
        </Sidebar>
      }
    >
      {body}
    </AppLayout>
  )
}

export default Root
