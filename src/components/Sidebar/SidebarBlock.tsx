import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import useStickyState from 'hooks/useStickyState'

interface SidebarBlockProps {
  title?: string
  titleAccessory?: any
  children: any
}

const SidebarBlock = ({
  title,
  titleAccessory,
  children,
}: SidebarBlockProps) => {
  const [isOpen, setIsOpen] = useStickyState(`sidebar-block-${title}`, true)
  return (
    <div className="mb-px">
      <div
        className="h-8 flex justify-between items-center font-semibold text-xs leading-none bg-gray-600 cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <motion.div
            className="w-4 flex items-center justify-center"
            animate={{ rotate: isOpen ? 90 : 0 }}
          >
            <FaChevronRight size={8} />
          </motion.div>
          {title}
        </div>
        <motion.div
          transition={{ duration: 0.1 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          onClick={e => e.stopPropagation()}
        >
          {titleAccessory}
        </motion.div>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  )
}

export default SidebarBlock
