import React, { MouseEvent } from 'react'
import { FiX } from 'react-icons/fi'

interface ModalProps {
  children: any
  canClose?: boolean
  hideClose?: boolean
  onClose?(event: MouseEvent<HTMLButtonElement>): void
}

const Modal = ({ children, onClose, canClose, hideClose }: ModalProps) => (
  <div
    className="w-full max-w-2xl flex rounded-lg shadow-lg overflow-hidden relative"
    style={{ backgroundColor: '#23282cee', backdropFilter: 'blur(8px)' }}
  >
    {!hideClose && (
      <button
        onClick={onClose}
        disabled={!canClose}
        className={
          'rounded-full p-4 absolute top-0 right-0 z-50 ' +
          (canClose
            ? 'text-gray-300 hover:text-white'
            : 'text-gray-400 cursor-not-allowed')
        }
      >
        <FiX size="20" />
      </button>
    )}
    {children}
  </div>
)

export default Modal
