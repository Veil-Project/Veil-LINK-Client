import React, { useState } from 'react'

import Welcome from './Setup/Welcome'
import CreateWallet from './Setup/CreateWallet'
import RestoreWallet from './Setup/RestoreWallet'
import OpenWallet from './Setup/OpenWallet'

const Setup = () => {
  const [mode, switchMode] = useState()

  const getCurrent = () => {
    switch (mode) {
      case 'create-wallet':
        return <CreateWallet switchMode={switchMode} />
      case 'restore-wallet':
        return <RestoreWallet switchMode={switchMode} />
      case 'open-wallet':
        return <OpenWallet switchMode={switchMode} />
      default:
        return <Welcome switchMode={switchMode} />
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="h-titlebar draggable" />
      {getCurrent()}
    </div>
  )
}

export default Setup
