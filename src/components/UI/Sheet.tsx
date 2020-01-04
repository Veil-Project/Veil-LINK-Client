import React, { MouseEvent } from 'react'
import { FiX } from 'react-icons/fi';

interface SheetProps {
  children: any,
  onClose(event: MouseEvent<HTMLButtonElement>): void,
}

const Sheet = ({ children, onClose }: SheetProps) => (
  <div className="h-screen p-4 pb-0 flex flex-col">
    <div className="flex-1 flex flex-col p-10 rounded-t bg-gray-600 shadow-lg border border-gray-800 relative">
      <button onClick={onClose} className="rounded-full p-4 absolute top-0 right-0 text-gray-300 hover:text-white">
        <FiX size="20" /> 
      </button>
      {children}
    </div>
  </div>
)

export default Sheet