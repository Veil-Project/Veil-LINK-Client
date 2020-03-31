import React, { MouseEvent } from 'react'
import { FiX } from 'react-icons/fi'

interface SheetProps {
  children: any
  onClose(event: MouseEvent<HTMLButtonElement>): void
}

const Sheet = ({ children, onClose }: SheetProps) => (
  <div className="h-screen pb-0 flex flex-col">
    <div
      className="flex-1 flex flex-col border-l border-gray-800 relative overflow-auto"
      style={{
        backgroundColor: 'rgba(26,30,33,.9)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={onClose}
        className="rounded-full p-6 absolute top-0 right-0 text-gray-300 hover:text-white"
      >
        <FiX size="20" />
      </button>
      {children}
    </div>
  </div>
)

export default Sheet
