import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Login from './Connect/Login'
import Start from './Connect/Start'
import Install from './Connect/Install'
import Welcome from 'components/Welcome'

const Connect = () => {
  const [isStarted, setIsStarted] = useState(false)
  const [mode, setMode] = useState<'install' | 'start' | 'login'>('install')

  const renderMode = () => {
    switch (mode) {
      case 'install':
        return <Install setMode={setMode} />
      case 'start':
        return <Start setMode={setMode} />
      case 'login':
        return <Login setMode={setMode} />
    }
  }

  return (
    <div className="flex-1 w-full flex">
      <motion.div
        className="flex-none bg-gray-700 flex flex-col relative"
        animate={{ width: isStarted ? '50vw' : '100vw' }}
        transition={{ delay: isStarted ? 0.3 : 0 }}
        initial={false}
      >
        <Welcome onStart={() => setIsStarted(true)} />
      </motion.div>
      <div
        className="flex-1 flex flex-col bg-gray-800 relative"
        style={{ minWidth: 0 }}
      >
        <div className="mx-auto max-w-sm flex-1 flex flex-col p-6 text-center">
          {renderMode()}
        </div>
      </div>
    </div>
  )
}

export default Connect
