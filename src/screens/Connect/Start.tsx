import React, { useState, useEffect, MouseEvent } from 'react'
import { useStore } from 'store'
import { motion } from 'framer-motion'

import StartForm from 'components/Connect/StartForm'
import DaemonWarmup from 'components/DaemonWarmup'

const Start = ({ setMode }: { setMode: Function }) => {
  const [isStarting, setIsStarting] = useState(false)
  const { state, actions } = useStore()

  const startDaemon = async (options: {
    network: 'main' | 'test' | 'regtest' | 'dev'
    datadir: string
  }) => {
    setIsStarting(true)
    actions.daemon.configure(options)
    await actions.daemon.start()
    // TODO: improve transition
    await actions.app.transition()
  }

  return (
    <>
      <div className="my-auto">
        <header>
          <h2 className="text-2xl font-bold">Start wallet</h2>
          <p className="mt-1 text-lg text-gray-300">
            Optionally, edit Veil connection settings before starting the
            wallet.
          </p>
        </header>

        <div className="mt-8">
          <div className="bg-gray-700 rounded-lg relative overflow-hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: isStarting ? 0 : '100%' }}
              transition={{ ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <DaemonWarmup />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ x: isStarting ? '-100%' : 0 }}
              transition={{ ease: 'easeInOut' }}
            >
              <StartForm onSubmit={startDaemon} />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="text-sm text-gray-400"
        animate={{ opacity: isStarting ? 0 : 1 }}
      >
        <div>
          Using managed veild.{' '}
          <button
            onClick={() => setMode('install')}
            className="underline hover:text-white hover:no-underline"
          >
            Change
          </button>
        </div>
      </motion.div>
    </>
  )
}

export default Start
