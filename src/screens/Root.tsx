import React from 'react'
import { useStore } from 'store'

import Setup from './Setup'
import WalletRoot from './WalletRoot'
import Connect from './Connect'

const Root = () => {
  const { state } = useStore()
  const { connected } = state.blockchain

  if (connected) {
    return <WalletRoot />
  } else {
    return <Connect />
  }
}

export default Root
