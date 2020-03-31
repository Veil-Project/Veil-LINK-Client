import React, { useState } from 'react'
import { motion } from 'framer-motion'

import ChooseOption from './Setup/ChooseOption'
import CreateWallet from './Setup/CreateWallet'
import RestoreWallet from './Setup/RestoreWallet'
import OpenWallet from './Setup/OpenWallet'
import Welcome from 'components/Welcome'

type SetupMode = 'create-wallet' | 'restore-wallet' | 'open-wallet' | null

const Setup = () => {
  const [mode, switchMode] = useState<SetupMode>(null)

  const renderMode = () => {
    switch (mode) {
      case 'create-wallet':
        return <CreateWallet switchMode={switchMode} />
      case 'restore-wallet':
        return <RestoreWallet switchMode={switchMode} />
      case 'open-wallet':
        return <OpenWallet switchMode={switchMode} />
      default:
        return <ChooseOption switchMode={switchMode} />
    }
  }

  return (
    <div className="flex-1 w-full flex">
      <motion.div
        className="flex-none bg-gray-700 flex flex-col relative"
        animate={{ width: mode === null ? '50vw' : 0 }}
        transition={{ delay: 0 }}
        initial={false}
      >
        <div className="m-auto" style={{ width: '50vw' }}>
          <Welcome defaultRevealed={true} />
        </div>
      </motion.div>
      <div
        className="flex-1 flex flex-col bg-gray-800 relative"
        style={{ minWidth: 0 }}
      >
        <div className="h-titlebar draggable" />
        {renderMode()}
      </div>
    </div>
  )
}

export default Setup
