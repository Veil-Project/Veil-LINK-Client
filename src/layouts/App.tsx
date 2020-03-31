import React, { ReactElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  children: any
  width: string | number // started ? (ready ? '360px' : '50%') : '100%'
  delay?: number
}

export const Sidebar = ({ children, width, delay }: SidebarProps) => {
  return (
    <motion.div
      className="flex-none bg-gray-700 relative"
      animate={{ width }}
      transition={{ delay }}
      initial={false}
    >
      <AnimatePresence>
        <motion.div
          key={children.key}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

interface Props {
  sidebar?: ReturnType<typeof Sidebar> | null
  children?: any
}

const AppLayout = ({ sidebar, children }: Props) => {
  return (
    <div className="flex-1 w-full flex">
      {sidebar}
      <div
        className="flex-1 flex flex-col bg-gray-800 relative"
        style={{ minWidth: 0 }}
      >
        {children}
      </div>
    </div>
  )
}

export default AppLayout
