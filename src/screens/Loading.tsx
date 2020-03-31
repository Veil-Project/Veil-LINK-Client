import React from 'react'
import Spinner from '../components/UI/Spinner'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingProps {
  message?: string
  progress?: number | null
}

const Loading = ({ message, progress }: LoadingProps) => (
  <div className="m-auto relative w-64">
    <Spinner percentage={progress} />
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 w-full text-center mt-4"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

export default Loading
