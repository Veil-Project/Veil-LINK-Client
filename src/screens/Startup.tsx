import React, { useEffect, useState } from 'react'
import { useStore } from 'store'
import { motion } from 'framer-motion'
import DaemonWarmup from 'components/DaemonWarmup'
import VeilLogo from 'components/Icon/VeilLogo'

const Startup = () => {
  const [isStarted, setIsStarted] = useState(false)
  const { actions } = useStore()

  useEffect(() => {
    ;(async () => {
      await actions.daemon.start()
      setIsStarted(true)
    })()
  }, [actions.daemon])

  const doTransition = async () => {
    await actions.app.transition()
  }

  const noop = () => {}

  return (
    <>
      <motion.div
        animate={{
          y: isStarted ? -300 : 0,
          opacity: isStarted ? 0 : 1,
          scale: isStarted ? 50 : 1.5,
          rotateY: isStarted ? 360 : 360,
        }}
        onAnimationComplete={isStarted ? doTransition : noop}
        transition={{
          duration: isStarted ? 0.33 : 0.75,
          delay: isStarted ? 0.75 : 0,
        }}
        initial={{ scale: 0, rotateY: 0, opacity: 0 }}
        className="m-auto"
      >
        <VeilLogo className="mx-auto" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isStarted ? 0 : 1 }}
        transition={{ delay: isStarted ? 0 : 0.5 }}
        className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-20"
      >
        <DaemonWarmup />
      </motion.div>
    </>
  )
}

export default Startup
