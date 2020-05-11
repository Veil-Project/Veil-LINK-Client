import React, { useEffect } from 'react'
import { useStore } from 'store'

import Startup from './Startup'
import Setup from './Setup'
import Connect from './Connect'
import Wallet from './Wallet'
import Shutdown from './Shutdown'
import Error from './Error'
import DaemonStatus from './DaemonStatus'
import Spinner from 'components/UI/Spinner'
import RpcError from './RpcError'

const Root = () => {
  const { actions, state } = useStore()

  useEffect(() => {
    ;(async () => {
      await actions.app.load()
    })()
  }, [actions.daemon, actions.app])

  switch (state.app.status) {
    case 'initial':
      return <Spinner />
    case 'startup':
      return <Startup />
    case 'connect':
      return <Connect />
    case 'setup':
      return <Setup />
    case 'conflict':
    case 'reindex':
      return <DaemonStatus showStartButton={true} />
    case 'wallet':
      return <Wallet />
    case 'shutdown':
      return <Shutdown key="shutdown" />
    case 'rpc-error':
      return <RpcError />
    default:
      return <Error key="error" message="Unknown app state" />
  }
}

export default Root
