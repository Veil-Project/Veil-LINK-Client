import React, { useEffect } from 'react'
import { useStore } from 'store'

import Startup from './Startup'
import Setup from './Setup'
import Connect from './Connect'
import Wallet from './Wallet'
import Shutdown from './Shutdown'
import Error from './Error'
import DaemonStatus from './DaemonStatus'

const Root = () => {
  const { actions, state } = useStore()

  useEffect(() => {
    ;(async () => {
      await actions.daemon.load()
      await actions.app.transition()
    })()
  }, [actions.daemon, actions.app])

  switch (state.app.status) {
    case 'initial':
      return <div />
    case 'startup':
      return <Startup />
    case 'connect':
      return <Connect />
    case 'setup':
      return <Setup />
    case 'conflict':
      return <DaemonStatus showStartButton={true} />
    case 'wallet':
      return <Wallet />
    case 'shutdown':
      return <Shutdown key="shutdown" />
    default:
      return <Error key="error" message="Unknown app state" />
  }
}

export default Root
